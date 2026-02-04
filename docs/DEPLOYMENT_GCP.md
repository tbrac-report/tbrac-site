# Deploying TBRAC Frontend to Google Cloud Platform (GCP)

This guide covers deploying your Next.js application to Google Cloud Platform using Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI (`gcloud`)** installed
   ```bash
   # Install gcloud CLI
   # Visit: https://cloud.google.com/sdk/docs/install
   
   # Initialize and authenticate
   gcloud init
   gcloud auth login
   ```

3. **Docker** installed (for building containers)

4. **Environment Variables** ready:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_BASE_URL`

## Deployment Options

### Option 1: Cloud Run (Recommended)

Cloud Run is serverless, scales automatically, and only charges for actual usage.

#### Step 1: Create a Dockerfile

Create `Dockerfile` in your project root:

```dockerfile
# Multi-stage build for smaller image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Update next.config.ts

Add standalone output for Docker:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  // ... rest of your config
};

export default nextConfig;
```

#### Step 3: Create .dockerignore

```
node_modules
.next
.git
.gitignore
README.md
.env*.local
.vercel
*.log
```

#### Step 4: Set up GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

#### Step 5: Create Artifact Registry Repository

```bash
# Create repository for Docker images
gcloud artifacts repositories create tbrac-frontend \
    --repository-format=docker \
    --location=us-central1 \
    --description="TBRAC Frontend Docker images"

# Configure Docker to authenticate with Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev
```

#### Step 6: Build and Push Docker Image

```bash
# Set image name
export IMAGE_NAME="us-central1-docker.pkg.dev/$PROJECT_ID/tbrac-frontend/app"

# Build the image
docker build -t $IMAGE_NAME:latest .

# Push to Artifact Registry
docker push $IMAGE_NAME:latest
```

#### Step 7: Deploy to Cloud Run

```bash
# Deploy with environment variables
gcloud run deploy tbrac-frontend \
    --image=$IMAGE_NAME:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key,NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.run.app" \
    --memory=512Mi \
    --cpu=1 \
    --max-instances=10 \
    --min-instances=0 \
    --port=3000
```

#### Step 8: Get the Deployment URL

```bash
# Get the service URL
gcloud run services describe tbrac-frontend \
    --region=us-central1 \
    --format="value(status.url)"
```

Your app is now live at the returned URL!

### Option 2: App Engine

If you prefer App Engine over Cloud Run:

#### Step 1: Create app.yaml

```yaml
runtime: nodejs20
service: tbrac-frontend

env_variables:
  NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key"
  NEXT_PUBLIC_API_BASE_URL: "https://your-backend-url"

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.65
```

#### Step 2: Deploy

```bash
gcloud app deploy
```

## Environment Variables Management

### Using Secret Manager (Recommended)

```bash
# Create secrets
echo -n "your-supabase-url" | gcloud secrets create supabase-url --data-file=-
echo -n "your-supabase-key" | gcloud secrets create supabase-anon-key --data-file=-
echo -n "your-api-url" | gcloud secrets create api-base-url --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding supabase-url \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Deploy with secrets
gcloud run deploy tbrac-frontend \
    --image=$IMAGE_NAME:latest \
    --platform=managed \
    --region=us-central1 \
    --set-secrets="NEXT_PUBLIC_SUPABASE_URL=supabase-url:latest,NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase-anon-key:latest,NEXT_PUBLIC_API_BASE_URL=api-base-url:latest"
```

## Custom Domain Setup

```bash
# Map custom domain
gcloud run domain-mappings create \
    --service=tbrac-frontend \
    --domain=tbrac.yourdomain.com \
    --region=us-central1

# Follow the instructions to add DNS records
```

## CI/CD with Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/tbrac-frontend/app:$COMMIT_SHA', '.']
  
  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/tbrac-frontend/app:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'tbrac-frontend'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/tbrac-frontend/app:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/tbrac-frontend/app:$COMMIT_SHA'
```

Set up trigger:

```bash
# Connect your repository
gcloud builds triggers create github \
    --repo-name=tbrac-site \
    --repo-owner=your-github-username \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml
```

## Monitoring and Logging

```bash
# View logs
gcloud run services logs read tbrac-frontend \
    --region=us-central1 \
    --limit=50

# Stream logs
gcloud run services logs tail tbrac-frontend \
    --region=us-central1
```

## Cost Optimization

1. **Set min instances to 0** for development/staging
2. **Use appropriate memory/CPU** (start with 512Mi/1 CPU)
3. **Set max instances** to control costs
4. **Use Cloud CDN** for static assets (if using Load Balancer)
5. **Enable request timeout** to prevent long-running requests

## Updating the Deployment

```bash
# Rebuild and push new image
docker build -t $IMAGE_NAME:latest .
docker push $IMAGE_NAME:latest

# Update Cloud Run service
gcloud run services update tbrac-frontend \
    --image=$IMAGE_NAME:latest \
    --region=us-central1
```

## Rollback

```bash
# List revisions
gcloud run revisions list --service=tbrac-frontend --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic tbrac-frontend \
    --to-revisions=REVISION_NAME=100 \
    --region=us-central1
```

## Troubleshooting

### Container fails to start
```bash
# Check logs
gcloud run services logs read tbrac-frontend --region=us-central1

# Common issues:
# - Missing PORT environment variable (should be 3000)
# - Incorrect HOSTNAME (should be "0.0.0.0")
# - Missing standalone output in next.config.ts
```

### Build failures
```bash
# Test build locally
docker build -t test-image .
docker run -p 3000:3000 test-image
```

### Environment variables not working
```bash
# Check current env vars
gcloud run services describe tbrac-frontend \
    --region=us-central1 \
    --format="value(spec.template.spec.containers[0].env)"
```

## Security Best Practices

1. **Use Secret Manager** for sensitive data
2. **Enable VPC connector** if accessing private resources
3. **Set up IAM roles** properly
4. **Enable Cloud Armor** for DDoS protection
5. **Use HTTPS** (automatic with Cloud Run)
6. **Set CORS** policies on backend

## Next Steps

- Set up monitoring dashboards in Cloud Console
- Configure alerts for errors/high latency
- Set up Cloud CDN for better performance
- Implement health checks
- Set up staging environment
