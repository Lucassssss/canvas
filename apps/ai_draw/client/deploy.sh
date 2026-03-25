#!/bin/bash
set -e

REMOTE_HOST="root@8.134.238.148"
REMOTE_PATH="/project/gke-design-new/dist"
BUILD_CMD="npm run build"

echo "==> Building..."
npm run build

echo "==> Deploying to ${REMOTE_HOST}:${REMOTE_PATH}..."
rsync -avz --delete \
  -e ssh \
  --exclude 'node_modules' \
  --exclude '.git' \
  dist/ \
  "${REMOTE_HOST}:${REMOTE_PATH}/"

echo "==> Done."
