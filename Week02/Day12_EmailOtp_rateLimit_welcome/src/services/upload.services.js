// CLient---->Server(upload hoga yehan)---->Azura blob store
const {
    BlobServiceClient,
    StorageSharedKeyCredential
} = require("@azure/storage-blob");
const ValidationError = require("../error/ValidationError");
const ApiError = require("../error/ApiError");

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

// TODO :Add logging later for better connection 
console.log("Azura config", {
    accountName: accountName ? "AccountName SET" : "AccountName MISSIING",
    containerName: containerName ? "ContainerName SET" : "ContainerName MISSING",
});

// Check if the configuration is persent or not 
if (!accountKey || !accountName || !containerName) {
    console.error('Missing Azure storage configuration. Ensure AZURE_STORAGE_NAME, AZURE_STORAGE_KEY, AZURE_CONTAINER_NAME are set.');

    throw new ValidationError("Missing Azure storage configuration");

}




// Create service client using shared key
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
);

// Upload function =========
async function uploadFileToAzure(fileBuffer, fileName) {
    try {
        // Step 1: Get container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create if not exists
        await containerClient.createIfNotExists({
            access: "private"
        });

        // Step 2: Get blob client
        const blobClient = containerClient.getBlockBlobClient(fileName);

        // Step 3: Upload buffer
        await blobClient.uploadData(fileBuffer);

        // Step 4: Return file URL
        return blobClient.url;

    } catch (err) {
        console.error("Azure Upload Error:", err.message);
        throw new ApiError("Auzura upload Error", "AzuraError")
    }
}

module.exports = { uploadFileToAzure };
