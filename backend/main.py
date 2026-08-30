import sys
import os
import subprocess

# Ensure repository root directory is in sys.path so top-level modules (rag, pipeline, models) are importable
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

try:
    import uvicorn
    import email_validator
except ImportError:
    print("⚠️  Required dependencies are missing. Installing backend dependencies...")
    try:
        req_file = os.path.join(os.path.dirname(__file__), "requirements.txt")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--prefer-binary", "-r", req_file])
        import uvicorn
        import email_validator
        print("✅ Dependencies installed successfully!")
    except Exception as e:
        print(f"❌ Failed to auto-install dependencies: {e}")
        print("Please run manually: python -m pip install -r backend/requirements.txt")
        sys.exit(1)


from app.main import app

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

