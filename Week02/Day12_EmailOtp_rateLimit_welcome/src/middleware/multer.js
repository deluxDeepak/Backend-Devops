// middleware/multer.js-->connect with upload 
const multer = require('multer');

// Configure Multer to store the file in memory
// This is necessary because Azure SDK accepts a Buffer/Stream
// and avoids writing to the local disk, which is faster and cleaner
const storage = multer.memoryStorage();

// Filter the file first to accept the specific file type 
const fileFilter = (req, file, cb) => {
    // Example: Only allow JPEG, PNG, or GIF
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        // Reject the file and provide a helpful error message
        cb(new Error('Unsupported file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

const uploadMiddleware = multer({
    storage: storage,
    limits: {
        // Set a limit on file size ( 10MB)
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: fileFilter
});

module.exports = uploadMiddleware;