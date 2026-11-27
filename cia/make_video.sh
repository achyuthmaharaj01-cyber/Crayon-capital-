#!/usr/bin/env bash
# One click: export frames (resumable) -> sound mix -> finish (glow + mix + H.264).
# Refuses to encode if any frame is missing. Never overwrites an older video.
set -euo pipefail
cd "$(dirname "$0")"
if [ "${SKIP_RENDER:-0}" = "1" ]; then echo "== 1/4 frames (skipped)"; else echo "== 1/4 frames"; node render.js 4; fi
echo "== 2/4 sound events + mix"; node sfx_export.js; python3 mix.py
echo "== 3/4 frame check"
EXPECTED=$(python3 -c "import json,math;print(math.ceil(json.load(open('voice/lines.json'))['duration']*60))")
FOUND=$(find build/frames -maxdepth 1 -name 'f*.jpg' | wc -l)
MISSING=$(python3 -c "
import os;n=$EXPECTED;print(sum(1 for i in range(n) if not os.path.exists(f'build/frames/f{i:05d}.jpg') or os.path.getsize(f'build/frames/f{i:05d}.jpg')<2000))")
echo "expected $EXPECTED frames, found $FOUND, missing/empty $MISSING"
if [ "$MISSING" != "0" ] || [ "$FOUND" -lt "$EXPECTED" ]; then echo "REFUSING TO ENCODE: render is incomplete. Run this script again to resume."; exit 1; fi
echo "== 4/4 finish"
mkdir -p out; n=1; while [ -e "out/lunik_heist_v${n}.mp4" ]; do n=$((n+1)); done
OUT="out/lunik_heist_v${n}.mp4"
# soft glow: a blurred highlight pass screen-blended at 0.4 opacity
ffmpeg -hide_banner -loglevel warning -stats -n -framerate 60 -i build/frames/f%05d.jpg -i build/mix.wav \
  -filter_complex "[0:v]format=gbrp,split[base][hi];[hi]colorlevels=rimin=0.55:gimin=0.55:bimin=0.55,gblur=sigma=16[glow];[base][glow]blend=all_mode=screen:all_opacity=0.4,format=yuv420p[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 18 -profile:v high -r 60 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT"
echo "DONE -> $OUT"
