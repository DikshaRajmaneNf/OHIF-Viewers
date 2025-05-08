#!/bin/bash

set -e

# Load environment variables
echo "🔄 Loading environment variables..."
if [ -f .env/.env.development ]; then
    export $(grep -v '^#' .env/.env.development | xargs)
fi

# Check if gh CLI is installed, if not install it
echo "🔍 Checking if GitHub CLI (gh) is installed..."
if ! command -v gh &> /dev/null; then
    echo "⚠️  gh CLI could not be found, installing..."
    brew install gh
fi

# Authenticate gh CLI
echo "🔑 Authenticating GitHub CLI..."
if ! gh auth status &> /dev/null; then
    echo "🔐 Logging into GitHub CLI..."
    echo $GIT_TOKEN | gh auth login --with-token
fi

MAIN_BRANCH=$(git remote show lumenbiomics-origin | grep "HEAD branch" | awk '{print $NF}')
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Current branch: $CURRENT_BRANCH"
echo "🎯 Main branch: $MAIN_BRANCH"

# Validate mandatory environment variables
echo "✅ Validating environment variables..."
if [[ -z "$APP_ENV" || -z "$APP_DEPLOY_METHOD" ]]; then
    echo "❌ Error: APP_ENV and APP_DEPLOY_METHOD are mandatory."
    exit 1
fi

# Validate APP_DEPLOY_METHOD
if [[ "$APP_DEPLOY_METHOD" != "build-deploy" && "$APP_DEPLOY_METHOD" != "build" && "$APP_DEPLOY_METHOD" != "deploy" ]]; then
    echo "❌ Error: APP_DEPLOY_METHOD must be one of build-deploy, build, or deploy."
    exit 1
fi

# Validate APP_ENV
if [[ "$APP_ENV" != "preview" && "$APP_ENV" != "staging-nferworkspaces" && "$APP_ENV" != "nferworkspaces" ]]; then
    echo "❌ Error: APP_ENV must be one of preview, staging-nferworkspaces, or nferworkspaces."
    exit 1
fi

# Special case for nferworkspaces
echo "🔍 Checking for special case: nferworkspaces"
if [[ "$APP_ENV" == "nferworkspaces" ]]; then
    if [[ "$APP_DEPLOY_METHOD" != "deploy" ]]; then
        echo "❌ Error: When APP_ENV is nferworkspaces, APP_DEPLOY_METHOD must be deploy."
        exit 1
    fi
    if [[ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]]; then
        echo "❌ Error: When APP_ENV is nferworkspaces, deployment must be on the main branch."
        exit 1
    fi
    VERSION=$(jq -r .version package.json)-build-deploy
    if ! git rev-parse "$VERSION" >/dev/null 2>&1; then
        echo "❌ Error: Tag $VERSION does not exist. Ensure the package version tag is created before releasing."
        exit 1
    fi
    echo "🚀 Creating release for tag: $VERSION"
    gh release create "$VERSION" --title "$VERSION" --notes "environment=nferworkspaces"
    echo "✅ Release created successfully: $VERSION"
    exit 0
fi

# Determine version tag
if [[ "$CURRENT_BRANCH" == "$MAIN_BRANCH" ]]; then
    VERSION=$(jq -r .version package.json)-$APP_DEPLOY_METHOD
else
    VERSION=$(date +%s)-$APP_DEPLOY_METHOD
fi

echo "🏷️  Generated version tag: $VERSION"

# Generic commands related to apps
# if [[ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]]; then
#     echo "🔄 Running dataset switch command..."
#     npm run switch-endpoint $APP_NAME

#     if [[ -n $(git status --porcelain) ]]; then
#         echo "📝 Committing dataset switch changes..."
#         git add .
#         git commit -m "Apply dataset switch for $APP_DATASET and $APP_NAME"
#     fi
# fi

# Push the tag
echo "🏷️  Tagging version: $VERSION"
# git pull origin "$MAIN_BRANCH"
git tag -a "$VERSION" -m "dockerfile_json=dockerfiles.json,environment=$APP_ENV"
git push lumenbiomics-origin "$VERSION"

echo "✅ Successfully pushed tag: $VERSION"

# Run cleanup command and commit again if changes exist
# echo "🧹 Running cleanup command..."
# npm run switch-endpoint

# if [[ -n $(git status --porcelain) ]]; then
#     echo "📝 Committing cleanup changes..."
#     git add .
#     git commit -m "Cleanup after tagging $VERSION"
#     git push origin "$CURRENT_BRANCH"
# fi

echo "🎉 Deployment complete! Final version: $VERSION"
