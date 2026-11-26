#!/usr/bin/env bash
# Re-download the Mixkit effects and music used in the mix (free Mixkit licence).
set -euo pipefail; cd "$(dirname "$0")"; mkdir -p sfx music
while IFS='=' read -r k id; do [ -s "sfx/$k.mp3" ] || curl -sfL -o "sfx/$k.mp3" "https://assets.mixkit.co/active_storage/sfx/$id/$id-preview.mp3"; done < SOURCES_ids.txt
for id in 188 404; do [ -s "music/$id.mp3" ] || curl -sfL -o "music/$id.mp3" "https://assets.mixkit.co/music/$id/$id.mp3"; done
echo ok
