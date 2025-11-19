# Products Route — Search, Filter, Pagination (Clear Flow & Examples)

This document explains the folder structure, the request flow for the /api/v2/products/productNew endpoint, and concrete examples for search, filter, sort, field limiting and pagination. Use this as a reference for implementing or debugging the full request → controller → ApiFeature → MongoDB pipeline.

---

## 1. Project (relevant) folder structure
- src/
  - routes/
    - product.route.js          // defines routes and middleware
    - ...existing code...
  - controllers/
    - product.controller.js     // getProduct controller (uses ApiFeature)
    - ...existing code...
  - utils/
    - apiFeature.js             // ProductsApiFeature class (search/filter/paginate)
    - cacheMiddleware.js        // checkCache() middleware (Redis)
    - ...existing code...
  - models/
    - product.model.js          // Mongoose Product schema
    - ...existing code...

---

## 2. Route level — entry point
Example route:
router.get("/productNew", checkCache("products"), getProduct);

Flow:
1. Client requests /api/v2/products/productNew?...queryParams
2. checkCache("products") checks Redis for cached response for the exact query
   - If cached: return it immediately
   - If not: call next() to continue
3. getProduct controller executes

---

## 3. Controller level — getProduct (overview)
Pseudo-flow inside controller:
- Build a base query: Product.find()
- Create feature helper: new ProductsApiFeature(baseQuery, req.query)
- Chain helpers: .search().filter().limitFields().paginate()
- Execute final query and send response
- Optionally cache the response in Redis

Minimal example:
const feature = new ProductsApiFeature(Product.find(), req.query)
  .search()
  .filter()
  .limitFields()
  .paginate();

const products = await feature.query;
// return response and set cache

---

## 4. Core: ProductsApiFeature (what each step does)

search()
- Triggered when ?search=keyword present.
- Uses case-insensitive regex on name (or other searchable fields).
Example query param:
?search=iphone
Converted Mongo condition:
{ name: { $regex: "iphone", $options: "i" } }

filter()
- Handles exact-match filters and comparison operators.
Example:
?brand=Apple&category=Smartphone&price[gte]=50000
Converted:
{
  brand: "Apple",
  category: "Smartphone",
  price: { $gte: 50000 }
}

limitFields()
- Controls returned fields using select().
Example:
?fields=name,price,brand → .select("name price brand")

sort()
- Sort results by one or more fields.
Example:
?sort=price,-rating → .sort("price -rating")

paginate()
- Applies skip & limit.
Query params: ?page=2&limit=10
skip = (page - 1) * limit → skip(10).limit(10)

---

## 5. Full example request and resulting query

Request:
GET /api/v2/products/productNew?search=iphone&brand=Apple&page=1&limit=5&fields=name,price,brand

Resulting Mongo call (conceptual):
Product.find({
  name: { $regex: "iphone", $options: "i" },
  brand: "Apple"
})
.skip(0)
.limit(5)
.select("name price brand")

---

## 6. Caching with Redis (checkCache middleware)
- Middleware signature: checkCache("products")
- It should compute a cache key from the route + serialized req.query
- If cache hit → parse cached JSON and return response
- If miss → continue and after successful DB response, store it with an expiry (e.g., 60s)

Cache key example:
`products:/productNew?search=iphone&brand=Apple&page=1&limit=5`

---

## 7. Final flow summary (step-by-step)
1. Client → /api/v2/products/productNew?...
2. checkCache runs → return from Redis if available
3. Controller (getProduct) runs
4. ProductsApiFeature initialized with Product.find() and req.query
5. .search() → regex conditions
6. .filter() → brand/category/price/rating filters
7. .limitFields() → .select() fields
8. .paginate() → skip() & limit()
9. Execute query → get results
10. Store response in Redis (optional) and return to client

---

## 8. Example responses (simplified)
Success response:
{
  "status": "success",
  "results": 5,
  "data": {
    "products": [
      { "name": "iPhone X", "price": 70000, "brand": "Apple" },
      ...
    ]
  }
}

Cache response returns the same JSON payload.

---

## 9. Tips & best practices
- Index searchable fields (e.g., name) to speed regex queries.
- For large datasets, limit default page size and enforce max limit.
- Normalize query param names (e.g., `fields` vs `limitFields`) in one convention.
- Serialize query keys consistently when generating cache keys.
- Avoid expensive regex on non-indexed fields in production—consider text indexes or dedicated search services for complex queries.

---

If you want, I can:
- Produce a visual flow diagram (Route → Cache → Controller → ApiFeature → DB → Response)
- Generate a ready-made ProductsApiFeature implementation example
- Provide a sample checkCache middleware with Redis usage
