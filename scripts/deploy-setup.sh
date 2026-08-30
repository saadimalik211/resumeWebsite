#!/usr/bin/env bash
set -euo pipefail

# One-time setup: authenticate, create repo, push, enable GitHub Pages.
# Requires: gh CLI (brew install gh)

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

REPO="resumeWebsite"
OWNER="$(gh api user -q .login)"

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin \
    --description "Astro resume website with GitHub Pages CI/CD"
fi

git push -u origin main

echo ""
echo "Enable GitHub Pages (if not already):"
echo "  https://github.com/${OWNER}/${REPO}/settings/pages"
echo "  Source → GitHub Actions"
echo ""
echo "After the workflow completes, your site will be at:"
echo "  https://${OWNER}.github.io/${REPO}/"
