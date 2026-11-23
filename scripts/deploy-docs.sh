#!/usr/bin/env bash
# Build the docs site and publish it to the docs host. Maintainer only.
#
#   DOCS_DEPLOY_HOST=<ssh host> npm run deploy:docs               # build + deploy
#   DOCS_DEPLOY_HOST=<ssh host> SKIP_BUILD=1 npm run deploy:docs  # deploy the existing build
#
# DOCS_DEPLOY_HOST  SSH host to deploy to (required)
# DOCS_DEPLOY_DIR   directory on that host, relative to the SSH user's home (default: ngx-stripe-docs)
#
# The host needs Docker Compose and the nginx-proxy + acme-companion stack on a `proxy`
# network (see deploy/docs/docker-compose.yml).
set -euo pipefail

if [ -z "${DOCS_DEPLOY_HOST:-}" ]; then
  echo "error: set DOCS_DEPLOY_HOST to the SSH host that serves the docs" >&2
  exit 1
fi

HOST="$DOCS_DEPLOY_HOST"
DIR="${DOCS_DEPLOY_DIR:-ngx-stripe-docs}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/dist/ngx-stripe-docs/browser"

cd "$ROOT"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "warning: deploying a working tree with uncommitted changes" >&2
fi

if [ -z "${SKIP_BUILD:-}" ]; then
  npm run build:app
fi

# A prerendered build has one HTML file per route. Refuse to ship the bare client shell.
if [ ! -f "$SITE/index.csr.html" ] || [ ! -f "$SITE/docs/payment-element/index.html" ]; then
  echo "error: $SITE is not a prerendered build" >&2
  exit 1
fi

echo "→ $HOST:$DIR"
ssh "$HOST" "mkdir -p '$DIR/runtime/docs' '$DIR/nginx'"
rsync -az deploy/docs/docker-compose.yml "$HOST:$DIR/docker-compose.yml"
# --inplace: the container mounts this one file. rsync normally writes a new file and renames it
# over the old one, which leaves the running container reading the old copy until it restarts.
rsync -az --inplace deploy/docs/nginx.conf "$HOST:$DIR/nginx/docs.conf"
# --delay-updates puts every changed file in place at the end of the transfer, and
# --delete-after drops old files only after that, so readers never see a half-synced site.
rsync -az --delete-after --delay-updates "$SITE/" "$HOST:$DIR/runtime/docs/"

# `up -d` recreates the container only when the compose file changed; reload picks up nginx.conf.
ssh "$HOST" "cd '$DIR' && docker compose up -d && docker compose exec -T docs nginx -s reload"

echo "✓ deployed $(git rev-parse --short HEAD) to $HOST"
