# Deployment Guide

This document outlines the comprehensive deployment process for the KMCINEW project, including CI/CD setup, environment configuration, and security best practices.

## 1. Overview
The project uses a modern GitOps workflow:
-   **Version Control**: Git & GitHub.
-   **CI/CD**: GitHub Actions (Validation) + Vercel (Deployment).
-   **Quality Control**: Husky pre-push hooks + Automated CI checks.
-   **Infrastructure**: Vercel (Frontend + Serverless Functions + Blob Storage).

## 2. Prerequisites
-   Node.js v18+
-   GitHub Account
-   Vercel Account
-   Vercel CLI (optional, for local dev)

## 3. Environment Configuration
The application requires specific environment variables to function. These must be configured in **Vercel Project Settings** and locally in `.env`.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `BLOB_READ_WRITE_TOKEN` | Server | Vercel Blob token (Auto-added by Vercel Integration). |
| `ADMIN_PASSKEY` | Server | Secret key for verifying upload requests server-side. |
| `JWT_SECRET` | Server | (Optional) Secret for signing/verifying JWTs. Defaults to `ADMIN_PASSKEY`. |
| `VITE_ADMIN_PASSKEY` | Build | **Publicly Exposed**. Client-side validation key. Must match `ADMIN_PASSKEY`. |

**Security Note**: `VITE_ADMIN_PASSKEY` is embedded in the frontend bundle. Ensure `ADMIN_PASSKEY` is strong and unique.

## 4. Local Setup & Git Configuration

### Initialization
If you haven't already, initialize the repository and install dependencies:
```bash
# Install dependencies (legacy-peer-deps required due to React 19 beta/rc versions)
npm install --legacy-peer-deps

# Prepare Husky hooks
npx husky init
```

### Branching Strategy
-   `main`: Production-ready code. Auto-deploys to Production environment.
-   `development`: Integration branch. Auto-deploys to Preview environment.
-   `feature/*`: Feature branches. PRs to `development` trigger CI checks.

## 5. Deployment Pipeline

### Automated CI (GitHub Actions)
A workflow is configured in `.github/workflows/ci.yml` that runs on every push and PR. It performs:
1.  **Linting**: Checks for code style and errors (`npm run lint`).
2.  **Testing**: Runs unit tests (`npm test`).
3.  **Build Verification**: Ensures the project builds successfully (`npm run build`).

### Pre-Push Hooks (Husky)
To prevent bad code from reaching the remote repo, Husky runs local checks before you push:
-   Runs `npm run lint`
-   Runs `npm test`
If either fails, the push is aborted.

### Vercel Deployment
1.  **Connect GitHub**: Go to Vercel Dashboard > New Project > Import from GitHub.
2.  **Configure Build Settings**:
    -   Framework: Vite
    -   Build Command: `npm install --legacy-peer-deps && npm run build` (Note: Vercel may default to `npm install`, override this if needed in "Install Command" or use the `.npmrc` provided).
3.  **Environment Variables**: Add the variables listed in Section 3.
4.  **Deploy**: Pushing to `main` will trigger a production deployment.

## 6. Secure Push Procedures
To maintain repository security:
1.  **Authentication**: Use SSH keys or Personal Access Tokens (PAT) for Git operations.
2.  **No Secrets in Code**: Never commit `.env` files. The `.gitignore` is configured to prevent this.
3.  **Code Review**: All changes to `main` should go through a Pull Request (PR) review process.

## 7. Troubleshooting

### Build Failures
-   **Dependency Errors**: Ensure `.npmrc` contains `legacy-peer-deps=true` or use the flag explicitly.
-   **Lint Errors**: Run `npm run lint -- --fix` locally to resolve issues.

### Deployment Issues
-   **401 Unauthorized**: Check if `ADMIN_PASSKEY` matches between client (`VITE_ADMIN_PASSKEY`) and server.
-   **404 on Refresh**: Ensure `vercel.json` rewrites are correctly configured for SPA (Single Page App) routing.

## 8. Rollback Procedures
If a bad deployment occurs:
1.  **Vercel Dashboard**: Go to "Deployments", find the last working deployment, and click "Redeploy" or "Promote to Production".
2.  **Git Revert**:
    ```bash
    git revert HEAD
    git push origin main
    ```
    This creates a new commit that undoes the changes, preserving history.
