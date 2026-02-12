# GitHub Actions CI/CD Pipeline

This repository includes a GitHub Actions workflow that automatically builds the application, creates a Docker image, and pushes it to DockerHub.

## Workflow Overview

The workflow is triggered on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

### Jobs

1. **Build Application**
   - Sets up Node.js and pnpm
   - Installs dependencies
   - Generates Prisma Client
   - Runs linting
   - Builds the Next.js application
   - Uploads build artifacts

2. **Build and Push Docker Image**
   - Builds a multi-architecture Docker image (linux/amd64, linux/arm64)
   - Pushes the image to DockerHub
   - Tags images with branch name, commit SHA, and 'latest' for main branch

## Required Secrets

To enable Docker image publishing to DockerHub, you need to configure the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

### `DOCKERHUB_USERNAME`
Your DockerHub username

### `DOCKERHUB_TOKEN`
A DockerHub access token (recommended) or password
- To create an access token: Log in to DockerHub → Account Settings → Security → New Access Token

## Docker Image

The Docker image is built using a multi-stage build:
- **Build stage**: Installs dependencies and builds the Next.js application
- **Production stage**: Creates a minimal production image with only necessary files

### Running the Docker Image Locally

```bash
# Pull the latest image
docker pull <your-dockerhub-username>/adulting-exe:latest

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  <your-dockerhub-username>/adulting-exe:latest
```

### Building the Docker Image Locally

```bash
# Build the image
docker build -t adulting-exe .

# Run the container
docker run -p 3000:3000 adulting-exe
```

## Workflow File

The workflow is defined in `.github/workflows/build-and-deploy.yml`
