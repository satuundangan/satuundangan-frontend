#!/usr/bin/env bash
# Deploy frontend ke Cloudflare Pages
# Usage:
#   ./scripts/deploy-cf.sh            → deploy production (branch: main)
#   ./scripts/deploy-cf.sh dev        → deploy dev preview
set -e

export CLOUDFLARE_ACCOUNT_ID=7a2d2ad60fe21279f176a8aadfd1aa52
PROJECT_NAME="satuundangan"
BRANCH=${1:-main}

if [ "$BRANCH" = "dev" ]; then
  echo "==> Building for dev environment (proxy → VPS dev backend)..."
  npm run build -- --mode dev
else
  echo "==> Building for production..."
  npm run build
fi

echo "==> Deploying to Cloudflare Pages (project: $PROJECT_NAME, branch: $BRANCH)..."
wrangler pages deploy dist \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH" \
  --commit-dirty=true

echo "==> Done!"
echo "==> URL: https://$PROJECT_NAME.pages.dev"
