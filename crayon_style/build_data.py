"""voice/lines.json + voice/env.json -> web/data.js (window.VO, VOENV)"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(f"{H}/voice/lines.json")); d["env"] = json.load(open(f"{H}/voice/env.json"))
open(f"{H}/web/data.js", "w").write("window.VO=" + json.dumps(d, separators=(",", ":")) + ";\nconst VOENV=t=>{const n=VO.env.length-1,x=Math.max(0,Math.min(n,t*30)),i=Math.floor(x),f=x-i;return (VO.env[i]||0)*(1-f)+(VO.env[Math.min(n,i+1)]||0)*f;}; // interpolated: mouths move every frame at 60 fps\n")
print("ok", d["duration"])
