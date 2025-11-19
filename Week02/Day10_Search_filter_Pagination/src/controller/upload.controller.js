// controllers/uploadController.js
const {
    BadRequestError,
    NotFoundError,
    ApiError
} = require("../error");
const { uploadFileToAzure } = require("../services/upload.services");

/**
 * Handles the single file upload request to Azure Blob Storage.
 * @param {object} req - Express request object (includes req.file from Multer)
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const uploadSingleFile = async (req, res, next) => {
    try {
        // 1. Validation 
        if (!req.file) {
            return next(new NotFoundError("No file provided. Please ensure a file is attached to the request."));
        }

        const uploadedFile = req.file;

        // 2. Input Sanitation and Metadata
        // Sanitize the file name to prevent potential issues (e.g., with special characters)
        const originalName = uploadedFile.originalname.replace(/[^a-zA-Z0-9-.]/g, '_');

        // Create a unique, URL-safe file name
        // Example: 1678886400000-image_name.jpg
        const fileName = `${Date.now()}-${originalName}`;

        const fileBuffer = uploadedFile.buffer;

        // 3. Azure Upload Service Call
        // upload to azure; it should return the public URL for the uploaded file
        const fileUrl = await uploadFileToAzure(fileBuffer, fileName, uploadedFile.mimetype);

        // 4. Success Response
        // Use 201 Created for a resource creation action
        res.status(201).json({
            success: true,
            message: "File successfully uploaded to Azure Blob Storage.",
            url: fileUrl,
            fileName: fileName,
            fileSize: uploadedFile.size
        });

    } catch (error) {
        // TODO:Add logging later 
        console.log("Error:", error);
        console.error("Upload Error:", error.message);

        // Handle errors that might come from Multer (e.g., File too large)
        if (error.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError(`File size limit exceeded. Max size: 5MB.`));
        }

        // Catch any service-level errors (e.g., Azure SDK failure)
        return next(new ApiError(`Failed to upload file to Azure: ${error.message}`));
    }
}

module.exports = uploadSingleFile;