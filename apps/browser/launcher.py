import json
import subprocess
import sys
import os

CONFIG_FILE = r"d:\ai\canvas\apps\browser\fingerprint_config.json"
CHROME_BIN = r"d:\ai\canvas\apps\browser\chromium142\src\out\Default\chrome.exe"

def main():
    if not os.path.exists(CHROME_BIN):
        print(f"Error: Chrome binary not found at {CHROME_BIN}")
        return

    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        config = json.load(f)

    print("=== 浆果浏览器 指纹测试启动器 ===")
    profiles = config.get("profiles", [])
    
    for i, profile in enumerate(profiles):
        print(f"[{i + 1}] {profile['name']} - {profile['description']}")

    print("[q] Quit")
    print("=" * 40)
    
    choice = input("Select a profile to launch (1-3, or q to quit): ").strip()
    
    if choice.lower() == 'q':
        return
        
    try:
        idx = int(choice) - 1
        if idx < 0 or idx >= len(profiles):
            print("Invalid selection.")
            return
    except ValueError:
        print("Invalid selection.")
        return

    selected_profile = profiles[idx]
    args = selected_profile["cli_args"]
    
    cmd = [CHROME_BIN]
    for k, v in args.items():
        if v == "":
            cmd.append(f"{k}")
        else:
            cmd.append(f"{k}={v}")

    print(f"\n🚀 正在启动: {selected_profile['name']}")
    print(f"执行命令: {' '.join(cmd)}\n")
    
    subprocess.Popen(cmd)

if __name__ == "__main__":
    main()
