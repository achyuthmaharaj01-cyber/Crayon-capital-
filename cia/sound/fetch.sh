#!/usr/bin/env bash
# Mixkit (free licence) effects + music bed used by mix.py
set -euo pipefail; cd "$(dirname "$0")"; mkdir -p sfx music
for kv in flash=432 tick=1125 bell=587 paper=1530 page=1104 slide=1530 horn=530 rain=2393 rocks=400 bag=1989 ret=1368 whoosh1=166 whoosh2=1464 whoosh3=174 pop=2358 crowdtalk=364 sparkle=2350 hit=2655 coins=1993 coin=1999 stamp=2182 cheer=975 pencil=2369 ding=2000 clock=1046 whistle=615 deflate=2924 sadhorn=527 page=1104 paper=1530 tick=1125 flash=432; do
  k=${kv%%=*}; id=${kv##*=}; [ -s "sfx/$k.mp3" ] || curl -sfL -o "sfx/$k.mp3" "https://assets.mixkit.co/active_storage/sfx/$id/$id-preview.mp3"; done
for id in 188; do [ -s "music/$id.mp3" ] || curl -sfL -o "music/$id.mp3" "https://assets.mixkit.co/music/$id/$id.mp3"; done; echo ok
