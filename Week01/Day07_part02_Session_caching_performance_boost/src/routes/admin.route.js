const express = require('express');
const { getUser } = require('../controller/admin.controller');
const { authenticate } = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Protect admin routes: require authentication and admin role
// api ---> api/v2/admin/getUser
router.get('/getUser', authenticate, authorizeRole('admin'), getUser);

module.exports = router;
