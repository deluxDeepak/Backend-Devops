## Cloudinary 

## Azure 
npm install @azure/storage-blob
### Account creation and getting blob storage 
Ok mujhe azure ke bare me hi batao kaise account pe jake ye connection string bana hai aur storage create karna hai 
Step 1 — Azure Account Create Karo

Go to: https://portal.azure.com

Sign in with your Microsoft account

Agar pehli baar ho, to Free Tier activate karo:

₹0 cost

12 months free storage

$200 credits for 30 days

✅ Step 2 — Storage Account Create Karna

Azure Portal home page → search bar me type karo:
Storage accounts

Click → Create

Ab setup screen khulega:

Project Details

Subscription: Free Trial / Default

Resource Group:

New → my-app-resources

Instance Details

Storage account name:

Lowercase only

Example:

deepakstorage001


Region:

India Central (fast for India)

Performance: Standard

Redundancy: LRS (Local Redundant Storage)

Click Review + Create

Then Create

⏳ Create hone me 10–20 seconds lagte hain.

✅ Step 3 — Blob Storage Service Open Karna

Storage account open karo

Left side menu me jao → Blob service

Click → Containers

✅ Step 4 — Container Create Karna

Top pe + Container

Container name:

uploads


Public access level:

Private (recommended)

Click Create

✅ Step 5 — Azure Connection String Kaise Milega?

Yaha se tum apna backend connect karoge.

Storage account page open karo

Left side → Access keys

There you will see:

key1
key2
connection string


Tumhe key1 wala connection string copy karna hai.

Example connection string:

DefaultEndpointsProtocol=https;
AccountName=deepakstorage001;
AccountKey=9sfSjKLSADJ3sajkS...;
EndpointSuffix=core.windows.net

✅ Step 6 — Environment Variable Me Add Karo

.env file me:

AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=...EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME="uploads"

✅ Step 7 — Node.js Code for Upload
const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

async function uploadToAzure(fileBuffer, fileName) {
    const blobService = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);

    const containerClient = blobService.getContainerClient("uploads");

    await containerClient.createIfNotExists({ access: "private" });

    const blobClient = containerClient.getBlockBlobClient(fileName);

    await blobClient.uploadData(fileBuffer);

    return blobClient.url;
}

🎉 Now You Are Done!

Tumne:

✔ Azure account banaya
✔ Storage account create kiya
✔ Blob container banaya
✔ Connection string generate ki
✔ Backend se connect kar d

## Aws 
## Multer 