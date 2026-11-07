"""
Multi-Viewport Visual & Responsive Layout Audit Tool
Captures and audits the EcoVision AI Streamlit Dashboard across key device resolutions.
"""

import os
import subprocess
import sys
from PIL import Image

RESOLUTIONS = [
    ("Desktop_FHD", 1920, 1080),
    ("Standard_Laptop", 1366, 768),
    ("Compact_Display", 1200, 800),
    ("Split_Screen", 1024, 768)
]

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = "http://localhost:8501"
OUTPUT_DIR = "outputs"


def run_audit():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    results = []

    for name, width, height in RESOLUTIONS:
        out_file = os.path.abspath(os.path.join(OUTPUT_DIR, f"audit_{name}_{width}x{height}.png"))
        if os.path.exists(out_file):
            try:
                os.remove(out_file)
            except Exception:
                pass

        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            f"--window-size={width},{height}",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=6000",
            f"--screenshot={out_file}",
            URL
        ]

        print(f"Auditing viewport {name} ({width}x{height})...")
        proc = subprocess.run(cmd, capture_output=True, text=True)

        if os.path.exists(out_file):
            im = Image.open(out_file)
            results.append({
                "name": name,
                "target_res": f"{width}x{height}",
                "captured_res": f"{im.size[0]}x{im.size[1]}",
                "file_size_kb": round(os.path.getsize(out_file) / 1024, 1),
                "path": out_file,
                "status": "PASS"
            })
            print(f"  [OK] Captured {out_file} (Size: {im.size}, {round(os.path.getsize(out_file)/1024, 1)} KB)")
        else:
            results.append({
                "name": name,
                "target_res": f"{width}x{height}",
                "status": "FAIL",
                "error": proc.stderr or proc.stdout
            })
            print(f"  [FAIL] Failed for {name}")

    return results


if __name__ == "__main__":
    res = run_audit()
    print("\nAudit Summary:")
    for r in res:
        print(r)

