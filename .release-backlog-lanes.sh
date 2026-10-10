#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export GIT_AUTHOR_NAME='Ricardo Sánchez'
export GIT_AUTHOR_EMAIL='me@ricardosanchez.dev'
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

release_lane() {
  local branch=$1 ver=$2
  echo "========== $branch -> $ver =========="
  git checkout -B "$branch" "origin/$branch"
  git cherry-pick bb95d37
  git checkout origin/main -- skills/ngx-stripe projects/ngx-stripe/README.md
  node -e "
    const fs=require('fs');
    const p='package.json';
    const j=JSON.parse(fs.readFileSync(p,'utf8'));
    j.scripts['copy:skill']='mkdir -p dist/ngx-stripe/skills && cp -R skills/ngx-stripe dist/ngx-stripe/skills/';
    j.scripts.package='npm run build:lib && npm run copy:docs && npm run copy:skill && npm run pack:lib';
    fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
  "
  node -e "
    const fs=require('fs');
    const p='projects/ngx-stripe/package.json';
    const j=JSON.parse(fs.readFileSync(p,'utf8'));
    j.version='$ver';
    fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
  "
  sed -i '' "s/const currentVersion = '[^']*'/const currentVersion = '$ver'/" projects/ngx-stripe/src/lib/ngx-stripe.module.ts
  python3 - <<PY
from pathlib import Path
ver='$ver'
text = Path('CHANGELOG.md').read_text()
if f'## {ver} ' in text:
    raise SystemExit(f'CHANGELOG already has {ver}')
entry = f"""## {ver} - 2026-10-10

- Honor Payment Element \`doNotCreateUntilClientSecretIsSet\` so implicit create waits for a client secret ([#321](https://github.com/richnologies/ngx-stripe/pull/321))
- Ship the consumer Agent Skill (\`skills/ngx-stripe\`) in the npm package

"""
lines = text.splitlines(True)
if lines and lines[0].startswith('# Changelog'):
    rest = ''.join(lines[1:])
    if rest.startswith('\n'):
        out = lines[0] + '\n' + entry + rest.lstrip('\n')
    else:
        out = lines[0] + '\n\n' + entry + rest
else:
    out = entry + text
Path('CHANGELOG.md').write_text(out)
PY
  git add -A
  git commit -m "$(cat <<EOF
🔖 v$ver

- Honor Payment Element doNotCreateUntilClientSecretIsSet ([#321])
- Ship consumer Agent Skill in npm tarball
EOF
)"
  git push origin "$branch"
}

for spec in "v21:21.10.2" "v20:20.10.2" "v19:19.10.2" "v18:18.10.2" "v17:17.10.2"; do
  b=${spec%%:*}
  v=${spec##*:}
  release_lane "$b" "$v"
done

git checkout main
