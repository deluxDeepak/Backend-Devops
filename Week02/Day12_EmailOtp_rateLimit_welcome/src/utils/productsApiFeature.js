// Here making the ====utility class==== for products use case 

class ProductsApiFeature {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
        this.page = 1;  //Defualt pagination
        this.limit = 10;    //default limit

    }

    // ==========================================
    // Search functionality 
    // ==========================================

    search() {
        if (this.queryParams.search) {
            //Sanitize the data we getting from the search bar Regex

            const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

            const keyword = escapeRegex(this.queryParams.search);

            // Search in name and description filed 
            this.query = this.query.find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },

                ]
            });

        }
        return this;
    }

    // ==========================================
    // 2) FILTER (brand, category, price etc.)
    // ==========================================
    filter() {
        const queryObj = { ...this.queryParams };

        // remove fields not part of filters
        const removeFields = ["search", "sort", "page", "limit", "fields", "order"];
        removeFields.forEach((field) => delete queryObj[field]);

        // Convert operators gte -> $gte | lte -> $lte
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        // Handle comma separated filters like brand=apple,samsung
        const parsedQuery = JSON.parse(queryStr);
        for (let key in parsedQuery) {
            if (typeof parsedQuery[key] === "string" && parsedQuery[key].includes(",")) {
                parsedQuery[key] = { $in: parsedQuery[key].split(",") };
            }
        }

        // find mainly yehan pe hai 
        this.query = this.query.find(parsedQuery);
        return this;
    }


    // ==========================================
    // 3) SORT (price, rating, createdAt)
    // ==========================================
    sort() {
        if (this.queryParams.sort) {
            const order = this.queryParams.order === "asc" ? 1 : -1;
            this.query = this.query.sort({ [this.queryParams.sort]: order });
        } else {
            this.query = this.query.sort({ createdAt: -1 }); // default
        }
        return this;
    }

    // ==========================================
    // 4) FIELD LIMITING (select only needed fields)
    // ==========================================
    limitFields() {
        if (this.queryParams.fields) {
            const fields = this.queryParams.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }



    // ==========================================
    // 5) PAGINATION (page/limit)
    // ==========================================
    paginate() {
        /**
         * Pagination Formula Explanation:
         *
         * page = which page user wants (1, 2, 3...)
         * limit = how many items per page
         *
         * skip = (page - 1) * limit
         *
         * Example:
         * page = 3
         * limit = 10
         * skip = (3 - 1) * 10 = 20
         *
         * Means: skip first 20 items, start from 21st
         */

        const page = Math.max(Number(this.queryParams.page) || 1, 1);
        const limit = Math.min(Number(this.queryParams.limit) || 10, 100);
        const skip = (page - 1) * limit;

        this.page = page;
        this.limit = limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ProductsApiFeature