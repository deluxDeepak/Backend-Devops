# Azure Blob Storage — SAS (Shared Access Signature) Guide

A concise guide to creating and using SAS URLs for secure, serverless uploads and reads to Azure Blob Storage.

## Overview
SAS tokens allow clients (browsers or mobile apps) to interact directly with Azure Storage without exposing account keys or routing file data through your server. This minimizes server memory/CPU usage, avoids file buffering, and reduces bandwidth on your backend.

## Benefits (summary)
| Feature                    | Benefit                                      |
| -------------------------- | -------------------------------------------- |
| No public access           | Prevents unauthorized direct access          |
| SAS expires                | Tokens automatically expire (time-limited)   |
| Write-only permission      | Clients can upload but cannot read/delete    |
| Unique filename per upload | Prevents accidental overwrites               |

## Key concepts
- SAS types: account-level vs service-level (we use service-level blob SAS).
- Permissions: read (r), write (w), create (c), delete (d), list (l).
- ExpiresOn: keep tokens short-lived (e.g., 5–10 minutes for uploads).
- Blob type: use BlockBlob for typical file uploads.
- Security: never expose account keys to clients. Only sign SAS server-side.

## Server-side: generate write (upload) SAS URL (Node.js)
Notes:
- Set AZURE_STORAGE_NAME and AZURE_STORAGE_KEY in environment variables.
- Use a unique filename (timestamp, UUID) to avoid overwrites.
- Grant only required permissions (c = create, w = write for uploads).

```javascript
const { 
  BlobSASPermissions, 
  generateBlobSASQueryParameters, 
  StorageSharedKeyCredential 
} = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid"); // optional for unique names

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_KEY;

/**
 * Generate a write (upload) SAS URL for a single blob.
 * - permissions: create + write (cw)
 * - short expiry (e.g., 5 minutes)
 */
async function getUploadSasUrl(containerName, originalFilename) {
  // generate a unique filename to avoid overwrites
  const fileName = `${Date.now()}-${uuidv4()}-${originalFilename}`;

  const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: fileName,
      permissions: BlobSASPermissions.parse("cw"), // create + write
      expiresOn: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    },
    sharedKey
  ).toString();

  const url = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
  return { url, fileName };
}
```

## Server-side: generate read SAS URL
Notes:
- Grant only read permission and set appropriate expiry.

```javascript
function generateReadSas(containerName, fileName) {
  const sharedKey = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_NAME,
    process.env.AZURE_STORAGE_KEY
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: fileName,
      permissions: BlobSASPermissions.parse("r"), // read only
      expiresOn: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
    sharedKey
  ).toString();

  return `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
}
```

## Why ?
- It will create a pipline to direct azure account we do not give any public or server acess directly 

- Server Does NOT Crash
- Node.js uploads nothing
- No RAM usage
- No file buffer
- Just a simple signed URL response

## Front end with react (write)

```java
async function uploadFile(file, sasUrl) {
  const res = await fetch(sasUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      // Optionally set content-type if desired:
      "Content-Type": file.type || "application/octet-stream"
    },
    body: file
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res;
}
```

## Front end with react (Read)

```html
<video
  src={sasUrl}   // server se mila hua read SAS
  controls
  style={{ width: "100%", height: "auto" }}
/>
```

## CORS
- Configure container-level CORS to allow your frontend origin to PUT/GET if requests come directly from browser.
- Example: allow methods PUT, GET, OPTIONS and the required headers.


## Security & best practices
- Keep SAS lifetimes short and permissions minimal.
- Rotate storage account keys and consider using Azure AD + RBAC for long-lived server operations.
- Log SAS generation and usage events for auditing.
- Use unique filenames and virus scanning (server-side) if needed.

## Alternatives & further reading
- Azure AD with OAuth (for delegated access without account keys).
- Client-side libraries: @azure/storage-blob for advanced scenarios.
- Official docs: https://docs.microsoft.com/azure/storage/blobs/storage-blob-sas-overview

