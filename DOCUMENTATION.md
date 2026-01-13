# Sermon Video Management System Documentation

## Overview
This document outlines the implementation of the Sermon Video Management System for the KMCINEW project. The system allows administrators to upload sermon videos directly to Vercel Blob storage, manages authentication via JWT, and ensures seamless playback on the frontend.

## Technical Implementation

### 1. Video Upload Architecture
The upload process uses a client-direct-to-storage pattern to handle large files efficiently without overloading the Vercel serverless function execution limits.

**Workflow:**
1.  **Client Request**: The admin frontend (`SermonForm.tsx`) requests a secure upload URL from the server API.
2.  **Server Validation**: The API (`/api/videos/upload`) validates the request (auth, file type, size).
3.  **Token Generation**: The server generates a limited-time Signed Upload URL using `@vercel/blob`.
4.  **Direct Upload**: The frontend uploads the file directly to the Vercel Blob storage using the signed URL.
5.  **Completion**: The frontend receives the final public URL of the video and saves the sermon metadata.

### 2. Backend API
**File:** `api/videos/upload.ts`

-   **Endpoint**: `POST /api/videos/upload`
-   **Authentication**: Bearer Token (JWT or Admin Passkey)
-   **Validation**:
    -   **File Types**: MP4 (`video/mp4`), QuickTime (`video/quicktime`), AVI (`video/x-msvideo`)
    -   **Max Size**: 2GB
-   **Response**:
    ```json
    {
      "uploadUrl": "https://blob.vercel-storage.com/...",
      "constraints": {
        "maxSizeBytes": 2147483648,
        "allowedContentTypes": [...]
      }
    }
    ```

### 3. Frontend Integration
**File:** `src/components/admin/SermonForm.tsx`

-   **Drag & Drop**: Implemented using `MediaDropzone` component.
-   **Progress Tracking**: Real-time upload progress bar.
-   **Error Handling**: Validates file size and type client-side before attempting upload.
-   **State Management**: Handles uploading state to prevent duplicate submissions.

### 4. Authentication
**File:** `src/pages/Login.tsx` & `api/videos/upload.ts`

-   **JWT Support**: The system generates and stores a JWT (`kmci_admin_token`) upon login.
-   **Verification**: The upload endpoint verifies the signature of the JWT to ensure only authorized admins can upload.
-   **Fallback**: Supports `ADMIN_PASSKEY` for server-to-server or legacy auth.

### 5. Configuration & Routing
**File:** `vercel.json`

-   **SPA Routing**: Configured to serve `index.html` for all routes *except* API routes.
-   **API Route Preservation**:
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/$1" },
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```

## Testing & Verification

### Unit Tests
**File:** `api/videos/upload.test.ts`
Tests cover:
-   Method validation (POST only).
-   Authentication (Missing/Invalid tokens).
-   File validation (Unsupported types, Oversized files).
-   Successful URL generation.

**Run Tests:**
```bash
npm test api/videos/upload.test.ts
```

### Linting
The project adheres to strict TypeScript linting rules.
**Run Lint:**
```bash
npm run lint
```

## Deployment
1.  **Environment Variables**: Ensure the following are set in Vercel:
    -   `BLOB_READ_WRITE_TOKEN`: Automatically set when Vercel Blob is added.
    -   `ADMIN_PASSKEY`: For admin authentication.
    -   `JWT_SECRET`: For signing tokens.
2.  **Build Command**: `npm install --legacy-peer-deps && npm run build` (Handled via `.npmrc`).

## Future Improvements
-   **Video Processing**: Implement transcoding hooks to generate multiple resolutions (720p, 1080p).
-   **Metadata Extraction**: Auto-extract duration and thumbnail from uploaded videos.
-   **Resume Capability**: Implement chunked uploads for better reliability on poor connections.
