#!/usr/bin/env bash
# Falsifiable proof that functions/_middleware.js injects the correct per-route canonical/SEO
# tags into the RAW HTML served by Cloudflare Pages, and that it never regresses the /api/*
# proxy or static asset serving. Run from the satuundangan-frontend/ directory.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Building production bundle..."
npm run build

PORT=8788
BASE="http://127.0.0.1:${PORT}"

echo "Starting wrangler pages dev on port ${PORT}..."
npx wrangler pages dev dist --port "${PORT}" --compatibility-date=2024-11-01 \
  > /tmp/verify-seo-middleware-wrangler.log 2>&1 &
WRANGLER_PID=$!

cleanup() {
  kill "${WRANGLER_PID}" >/dev/null 2>&1 || true
  wait "${WRANGLER_PID}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for wrangler to answer..."
READY=0
for _ in $(seq 1 40); do
  if curl -s -o /dev/null "${BASE}/"; then
    READY=1
    break
  fi
  sleep 1
done
if [ "${READY}" -ne 1 ]; then
  echo "FAIL: wrangler pages dev never became ready. Log:"
  cat /tmp/verify-seo-middleware-wrangler.log
  exit 1
fi

fail() {
  echo "FAIL: $1"
  echo "--- offending output ---"
  echo "$2"
  exit 1
}

assert_canonical() {
  local path="$1"
  local expected="$2"
  local body
  body=$(curl -s --compressed "${BASE}${path}")
  local count
  count=$(grep -o 'rel="canonical"' <<<"${body}" | wc -l | tr -d ' ')
  if [ "${count}" != "1" ]; then
    fail "expected exactly one rel=\"canonical\" on ${path}, found ${count}" "${body}"
  fi
  if ! grep -q "rel=\"canonical\" href=\"${expected}\"" <<<"${body}"; then
    fail "expected canonical ${expected} on ${path}" "$(grep -o '<link rel="canonical"[^>]*>' <<<"${body}")"
  fi
}

echo "1. / -> homepage canonical"
assert_canonical "/" "https://www.satuundangan.id/"

echo "2. /templates -> own canonical, non-homepage title"
assert_canonical "/templates" "https://www.satuundangan.id/templates"
TEMPLATES_BODY=$(curl -s --compressed "${BASE}/templates")
if grep -q "<title>Satu Undangan - Buat Undangan Digital Pernikahan</title>" <<<"${TEMPLATES_BODY}"; then
  fail "/templates still carries the homepage <title>" "$(grep -o '<title>[^<]*</title>' <<<"${TEMPLATES_BODY}")"
fi

echo "3. /syarat-ketentuan -> canonical /terms"
assert_canonical "/syarat-ketentuan" "https://www.satuundangan.id/terms"

echo "4. /kebijakan-privasi -> canonical /privacy"
assert_canonical "/kebijakan-privasi" "https://www.satuundangan.id/privacy"

echo "5. blog detail (live slug, best-effort)"
SLUG=$(curl -s --max-time 5 https://api.satuundangan.id/articles 2>/dev/null \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const items=j.items||[];if(items[0]&&items[0].slug)process.stdout.write(items[0].slug)}catch(e){}})" \
  || true)
if [ -n "${SLUG}" ]; then
  BLOG_BODY=$(curl -s --compressed "${BASE}/blog/${SLUG}")
  assert_canonical "/blog/${SLUG}" "https://www.satuundangan.id/blog/${SLUG}"
  if ! grep -q 'property="og:type" content="article"' <<<"${BLOG_BODY}"; then
    fail "/blog/${SLUG} og:type is not article" "$(grep -o '<meta property=\"og:type\"[^>]*>' <<<"${BLOG_BODY}")"
  fi
else
  echo "SKIP: no published articles returned by the live API — skipping blog detail assertion"
fi

echo "6. unknown blog slug -> 200 with self-canonical (fail-soft proof)"
UNKNOWN_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "${BASE}/blog/definitely-not-a-real-slug-xyz")
if [ "${UNKNOWN_STATUS}" != "200" ]; then
  fail "unknown blog slug did not return 200" "status=${UNKNOWN_STATUS}"
fi
assert_canonical "/blog/definitely-not-a-real-slug-xyz" \
  "https://www.satuundangan.id/blog/definitely-not-a-real-slug-xyz"

echo "7. /api/health not regressed"
API_HEADERS=$(curl -s --compressed -D - -o /tmp/verify-seo-middleware-api-body.json "${BASE}/api/health")
API_STATUS=$(head -1 <<<"${API_HEADERS}" | grep -o '[0-9][0-9][0-9]')
if [ "${API_STATUS}" != "200" ]; then
  fail "/api/health did not return 200" "${API_HEADERS}"
fi
if ! grep -qi 'content-type:.*application/json' <<<"${API_HEADERS}"; then
  fail "/api/health content-type is not application/json" "${API_HEADERS}"
fi
if ! grep -q '"status":"ok"' /tmp/verify-seo-middleware-api-body.json; then
  fail '/api/health body does not contain "status":"ok"' "$(cat /tmp/verify-seo-middleware-api-body.json)"
fi

echo "8. /logo.svg not rewritten"
ASSET_HEADERS=$(curl -s -D - -o /dev/null "${BASE}/logo.svg")
ASSET_STATUS=$(head -1 <<<"${ASSET_HEADERS}" | grep -o '[0-9][0-9][0-9]')
if [ "${ASSET_STATUS}" != "200" ]; then
  fail "/logo.svg did not return 200" "${ASSET_HEADERS}"
fi
if grep -qi 'content-type:.*text/html' <<<"${ASSET_HEADERS}"; then
  fail "/logo.svg was served as text/html" "${ASSET_HEADERS}"
fi

echo "SEO middleware verification: PASS"
