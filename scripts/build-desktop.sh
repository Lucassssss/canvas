#!/bin/bash
set -e

echo "=== Packaging Joii Berry Desktop ==="

# 1. Clean up old resources
echo "[1/4] Cleaning old resources..."
rm -rf apps/desktop-base/resources/web
rm -rf apps/desktop-base/resources/resources
mkdir -p apps/desktop-base/resources/resources

# 2. Build browser-web
echo "[2/4] Building browser-web..."
cd apps/browser-web
npm run build
cd ../..
cp -r apps/browser-web/out apps/desktop-base/resources/web

# 3. Build local-daemon
echo "[3/4] Building local-daemon..."
cd apps/local-daemon
bun run build
cd ../..
# Handle cross-platform names
if [ -f "apps/local-daemon/api.exe" ]; then
    cp apps/local-daemon/api.exe apps/desktop-base/resources/resources/
elif [ -f "apps/local-daemon/api" ]; then
    cp apps/local-daemon/api apps/desktop-base/resources/resources/
else
    echo "Warning: local-daemon binary not found!"
fi

# Also copy agent-browser native binary from local-daemon
echo "[3.5/4] Extracting agent-browser native binary..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    if [ -f "apps/local-daemon/node_modules/agent-browser/bin/agent-browser-win32-x64.exe" ]; then
        cp apps/local-daemon/node_modules/agent-browser/bin/agent-browser-win32-x64.exe apps/desktop-base/resources/resources/agent-browser.exe
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    if [ "$(uname -m)" == "arm64" ]; then
        cp apps/local-daemon/node_modules/agent-browser/bin/agent-browser-darwin-arm64 apps/desktop-base/resources/resources/agent-browser
    else
        cp apps/local-daemon/node_modules/agent-browser/bin/agent-browser-darwin-x64 apps/desktop-base/resources/resources/agent-browser
    fi
else
    if [ "$(uname -m)" == "aarch64" ]; then
        cp apps/local-daemon/node_modules/agent-browser/bin/agent-browser-linux-arm64 apps/desktop-base/resources/resources/agent-browser
    else
        cp apps/local-daemon/node_modules/agent-browser/bin/agent-browser-linux-x64 apps/desktop-base/resources/resources/agent-browser
    fi
fi

# 4. Build desktop-base
echo "[4/4] Packaging desktop-base..."
cd apps/desktop-base
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    bun run dist:win
elif [[ "$OSTYPE" == "darwin"* ]]; then
    bun run dist:mac
else
    bun run dist:linux
fi

echo "=== Build Complete ==="
