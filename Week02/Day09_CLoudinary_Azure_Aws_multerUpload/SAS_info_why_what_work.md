

# SAS Token — What, Why, and How (cleaned & expanded)

This document explains Shared Access Signatures (SAS) for Azure Blob Storage in a clear, formatted way. The original content is preserved at the end of this file.

## PART 1 — SAS Token: Kya Hota Hai?

SAS = Shared Access Signature

A SAS is a temporary, secure URL that allows a client to perform specific actions on Azure Storage without exposing the storage account keys.

Possible actions (depending on granted permissions):
- Upload
- Download
- Read / Write / Update
- Delete (if permission granted)

- Valid only for a limited time
- Permissions are controlled and granular
- Scoped to a specific blob or container

## PART 2 — SAS Token Kyon Chahiye?

Azure blobs are private by default. A SAS token acts like a temporary permission slip:
- Without SAS, clients cannot upload or download directly.
- With SAS, the backend can grant narrowly scoped, time-limited access.

## PART 3 — SAS Token Kaise Kaam Karta Hai (Internals)

1. Your backend (Node.js) holds:
    - `accountName`
    - `accountKey` (very secret)

2. The server calls `generateBlobSASQueryParameters()` from the Azure SDK.

3. The SDK packages the following into the SAS:
    - Which blob/container is accessible
    - Allowed actions (`r`, `w`, `d`, etc.)
    - Expiry time (e.g., 5 minutes)
    - Optional IP restrictions
    - Optional protocol restrictions (https only)

4. The information is cryptographically signed using HMAC-SHA256 and your account key.

5. The output is a signed URL (SAS) — example:

```
https://deepak.blob.core.windows.net/videos/movie.mp4?sv=2023-11-03&sr=b&sig=KsajdhsHJdh...&se=2025-01-01T10:00Z
```

The signed URL embeds permissions and expiry. The signature prevents tampering.

## PART 4 — SAS Token Types

1) Upload SAS
    - Permission: `w` (or `cw`) — for file upload

2) Read SAS
    - Permission: `r` — for playback / download

3) Delete SAS
    - Permission: `d` — for delete operations

4) Combined SAS
    - Permissions: `rw` — read + write

5) Container SAS
    - Grants access at container level (multiple blobs)

6) Service SAS
    - Grants access to specific service-level operations

## PART 5 — SAS Generate Karne ke Liye Kya Chahiye?

1. Azure Storage Account Name (e.g., `deepakstorage001`)
2. Azure Storage Account Key (from Access Keys)
3. Permissions (`r`, `w`, `d`, `c`)
4. Expiry time (recommended: short; e.g., 5 minutes for upload)
5. Resource type: Blob / Container / Account
6. File name + container name (decide on unique naming to avoid overwrites)

## PART 6 — SAS Token Generate Code (Upload Example)

Below is a Node.js example using `@azure/storage-blob` to generate an upload SAS. It grants create + write (`cw`) and sets a short expiry.

```js
const {
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential
} = require('@azure/storage-blob');

function generateUploadSas(containerName, fileName) {
    const sharedKey = new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_NAME,
        process.env.AZURE_STORAGE_KEY
    );

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName,
            blobName: fileName,
            permissions: BlobSASPermissions.parse('cw'), // create + write
            expiresOn: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        },
        sharedKey
    ).toString();

    return `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
}
```

## PART 7 — SAS Token Kaise Secure Hota Hai?

- Time-limited: tokens expire automatically.
- Permission-limited: only allowed actions are possible.
- Resource-limited: scoped to a specific blob or container.
- Cryptographically signed: `sig` parameter prevents tampering.

## PART 8 — Normal Streaming + SAS

When a user wants to play a file:
- Backend generates a read SAS.
- The client uses the SAS URL to stream video directly from Azure (no server streaming).

## PART 9 — HLS Streaming + SAS

- HLS playlists (`.m3u8`) and segments (`.ts`) are stored as blobs.
- Each request can be secured using SAS tokens for the playlist and segments.
- Azure serves the HLS segments directly using those SAS-protected URLs.

---