require("dotenv").config();
const express = require("express");
const multer = require("multer");
const {
    BlobServiceClient,
    StorageSharedKeyCredential
} = require("@azure/storage-blob");

const app = express();
const upload = multer(); // stores file in memory (buffer)

// ----------------------
// Azure Blob Setup
// ----------------------
// Expect these environment variables to be set:
// AZURE_STORAGE_NAME, AZURE_STORAGE_KEY, AZURE_CONTAINER_NAME
const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

console.log('Azure config:', { accountName: accountName ? 'SET' : 'MISSING', containerName: containerName ? 'SET' : 'MISSING' });

if (!accountName || !accountKey || !containerName) {
    console.error('Missing Azure storage configuration. Ensure AZURE_STORAGE_NAME, AZURE_STORAGE_KEY, AZURE_CONTAINER_NAME are set.');
    throw new Error('Missing Azure storage configuration');
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
);

// ----------------------
// Upload Route
// ----------------------
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const fileBuffer = req.file.buffer;
        const fileName = Date.now() + "-" + req.file.originalname;

        // Get the container first 
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create if not Exists 
        await containerClient.createIfNotExists();

        // Get the blob client name Filename 
        const blobClient = containerClient.getBlockBlobClient(fileName);

        // Upload the buffer file here 
        await blobClient.uploadData(fileBuffer);

        return res.json({
            message: "Uploaded Successfully!",
            url: blobClient.url //file url milega wo de 
        });

    } catch (error) {
        console.error("Azure Error:", error.message);
        return res.status(500).json({ error: "Upload failed", details: error.message });
    }
});

// ----------------------
// Start Server
// ----------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
