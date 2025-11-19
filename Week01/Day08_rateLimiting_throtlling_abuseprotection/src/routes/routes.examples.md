## 1.Auth 
POST /api/v2/auth/register
POST /api/v2/auth/login
POST /api/v2/auth/logout


## 2.Logged in User only 
GET    /api/v2/user/me
PUT    /api/v2/user/update
DELETE /api/v2/user/delete

## 3.Admin Routes.js
GET    /api/v2/admin/users
GET    /api/v2/admin/users/:id
POST   /api/v2/admin/create-user
PUT    /api/v2/admin/users/:id
DELETE /api/v2/admin/users/:id
