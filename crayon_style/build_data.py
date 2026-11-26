"""voice/lines.json + voice/env.json -> web/data.js (window.VO, VOENV)"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(f"{H}/voice/lines.json")); d["env"] = json.load(open(f"{H}/voice/env.json"))
open(f"{H}/web/data.js", "w").write("window.VO=" + json.dumps(d, separators=(",", ":")) + ";\nconst VOENV=t=>VO.env[Math.max(0,Math.min(VO.env.length-1,Math.floor(t*30)))]||0;\n")
print("ok", d["duration"])
