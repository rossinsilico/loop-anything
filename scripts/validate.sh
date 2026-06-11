#!/usr/bin/env sh
set -eu

tmp_root="${TMPDIR:-/tmp}/loop-anything-validate-$$"
target="$tmp_root/project"
export npm_config_cache="$tmp_root/npm-cache"
cleanup() {
  rm -rf "$tmp_root"
}
trap cleanup EXIT INT TERM

required_files='
README.md
LICENSE
.gitignore
package.json
bin/loop-anything.js
src/cli.js
src/detect.js
src/dogfood.js
src/prompts.js
src/render.js
src/check.js
docs/agent-loop-skill-pack-standard.md
docs/orchestration-model.md
docs/product-brief.md
templates/loop-pack/manifest.json
templates/loop-pack/shared/loop-state.md
templates/loop-pack/shared/loop-decisions.md
templates/loop-pack/shared/loop-contract.md
templates/loop-pack/shared/loop-prompts.md
templates/loop-pack/skills/loop-dog-food/SKILL.md
templates/loop-pack/skills/loop-triage/SKILL.md
templates/loop-pack/skills/loop-review/SKILL.md
templates/loop-pack/skills/loop-prove/SKILL.md
templates/loop-pack/skills/loop-record/SKILL.md
templates/loop-pack/reviewers/loop-reviewer.md
test/cli.test.js
scripts/validate.sh
'

missing=0
for file in $required_files; do
  if [ ! -f "$file" ]; then
    printf 'missing required file: %s\n' "$file" >&2
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

npm test

node bin/loop-anything.js init --agent both --dir "$target"
node bin/loop-anything.js check --agent both --dir "$target"
node bin/loop-anything.js prompt --agent both --stage triage > "$tmp_root/prompt.txt"
node bin/loop-anything.js dog-food spec --turn single > "$tmp_root/dog-food.txt"
node bin/loop-anything.js dog-food create plan --from docs/product-brief.md --dir "$tmp_root/create" --turn multi > "$tmp_root/dog-food-create.txt"
node bin/loop-anything.js init --agent both --dir "$target" > "$tmp_root/second-init.txt"

if ! grep -q 'skipped existing:' "$tmp_root/second-init.txt"; then
  printf 'expected second init to skip existing files\n' >&2
  exit 1
fi

if ! grep -q '\$loop-triage' "$tmp_root/prompt.txt" || ! grep -q '/loop-triage' "$tmp_root/prompt.txt"; then
  printf 'expected prompt command to print Codex and Claude triage prompts\n' >&2
  exit 1
fi

if ! grep -q '\$loop-anything.dog-food spec' "$tmp_root/dog-food.txt" || ! grep -q '/loop-anything.dog-food spec' "$tmp_root/dog-food.txt"; then
  printf 'expected dog-food command to print Codex and Claude dogfood prompts\n' >&2
  exit 1
fi

if ! grep -q 'wrote: loop-state.md' "$tmp_root/dog-food-create.txt" || ! grep -q 'Dog-food plan' "$tmp_root/create/loop-state.md"; then
  printf 'expected dog-food create to write loop state from a source plan\n' >&2
  exit 1
fi

if grep -RInE 'TBD|TODO|FIXME|INSERT_|YOUR_|PLACEHOLDER|gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|sb_(publishable|secret)_[A-Za-z0-9_-]{20,}' "$target"; then
  printf 'generated scaffold contains marker or secret-like text\n' >&2
  exit 1
fi

npm pack --dry-run >/tmp/loop-anything-pack.txt
cat /tmp/loop-anything-pack.txt
rm -f /tmp/loop-anything-pack.txt

printf 'loop-anything package smoke passed\n'
