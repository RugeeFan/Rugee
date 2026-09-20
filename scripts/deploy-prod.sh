#!/usr/bin/env bash
# Ship the current working tree to the VPS and rebuild the rugee-web container there.
# Usage: scripts/deploy-prod.sh            (deploy)
#        scripts/deploy-prod.sh rollback   (restore the source snapshot taken by the last deploy)
# The server keeps its own .env.production and the rugee_data volume (saved briefs) untouched.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-projects-server}"
DIR="${DEPLOY_DIR:-/srv/projects/rugee}"
COMPOSE="docker compose -f docker-compose.production.yml"
LIVE_URL="${LIVE_URL:-https://rugee.vercel.app}"

if [[ "${1:-}" == "rollback" ]]; then
  ssh "$HOST" "set -e; cd $DIR; test -f ../rugee-prev.tar.gz; \
    find . -mindepth 1 -maxdepth 1 ! -name .env.production -exec rm -rf {} +; \
    tar -xzf ../rugee-prev.tar.gz -C .; $COMPOSE up -d --build"
  echo "Rolled back."; exit 0
fi

echo "==> local checks"
npm run typecheck
npm run build >/dev/null

echo "==> snapshot current server source (for rollback) and upload"
ssh "$HOST" "cd $DIR && tar --exclude=.env.production -czf ../rugee-prev.tar.gz ."
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=.dev-data --exclude=.vercel \
    --exclude='.env*' --exclude=dist --exclude=src --exclude=.claude --exclude=.DS_Store \
    -czf - . | ssh "$HOST" "set -e; cd $DIR; \
    find . -mindepth 1 -maxdepth 1 ! -name .env.production -exec rm -rf {} +; tar -xzf - -C ."
# .env.example is excluded by the pattern above; the server never needed it.

echo "==> rebuild + restart on server"
ssh "$HOST" "cd $DIR && $COMPOSE up -d --build"

echo "==> verify"
sleep 8
for path in / /zh /studio /project-brief; do
  curl -fsS -o /dev/null -w "%{http_code}  $path\n" "$LIVE_URL$path"
done
echo "Done. If anything looks wrong: scripts/deploy-prod.sh rollback"
