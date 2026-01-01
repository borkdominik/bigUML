#!/bin/sh
set -e

echo "Bootstrapping shared workspaces (outline, property-palette, model-management-common)..."
yarn install
yarn workspace @borkdominik/model-management-common build
yarn workspace @borkdominik/outline build
yarn workspace @borkdominik/property-palette build

# install and build model service
cd packages/model-service
echo "Installing model service..."
yarn install
yarn build

# install and build generator-langium-model-management
cd ../../packages/generator-langium-model-management
echo "Installing generator-langium-model-management..."
yarn install
yarn build

# install biguml example (skip nested lerna prepare)
cd ../../examples-dj/biguml-example
echo "Installing biguml example..."
yarn install --ignore-scripts

# back to repo root
cd ../..

echo "Building BigUML example packages (clean + build)..."

# 1) protocol first
yarn workspace @biguml/uml-protocol clean
yarn workspace @biguml/uml-protocol build

# 2) libs that depend on protocol
yarn workspace @biguml/biguml-glsp clean
yarn workspace @biguml/biguml-glsp build

yarn workspace @biguml/biguml-components clean
yarn workspace @biguml/biguml-components build

# 3) webview (depends on components/glsp/protocol)
yarn workspace @biguml/biguml-vscode-integration-webview clean
yarn workspace @biguml/biguml-vscode-integration-webview build

# 4) server (needed by the extension)
echo "Building & generating bigUML server..."
yarn workspace @biguml/biguml-server clean
yarn workspace @biguml/biguml-server build
yarn workspace @biguml/biguml-server generate

# 5) VS Code extension (the 'extension' folder, workspace name: umldiagram)
yarn workspace umldiagram clean
yarn workspace umldiagram build

echo "All done"
