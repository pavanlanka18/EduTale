import sys
import os
import subprocess

# Ensure repository root directory is in sys.path so top-level modules (rag, pipeline, models) are importable
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

try:
    import uvicorn
except ImportError:
    print("⚠️  'uvicorn' package is not installed. Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--prefer-binary", "-r", "requirements.txt"])
        import uvicorn
        print("✅ Dependencies installed successfully!")
    except Exception as e:
        print(f"❌ Failed to auto-install dependencies: {e}")
        print("Please run manually: python3 -m pip install --prefer-binary -r requirements.txt")
        sys.exit(1)

from app.main import app

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

