#!/bin/bash

# Define paths
WORKSPACE_DIR="/home/dev/cccoding/global-ID"
VENV_DIR="$WORKSPACE_DIR/.env-ai"
SCRIPT_PATH="$WORKSPACE_DIR/scripts/categorize_images.py"

echo "================================================="
echo "   🚀 Starting AI Image Categorizer Setup   "
echo "================================================="

cd "$WORKSPACE_DIR" || exit

# 1. Ensure virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo "[*] Creating a dedicated hidden Python Virtual Environment (.env-ai)..."
    python3 -m venv "$VENV_DIR"
fi

# 2. Activate virtual environment
echo "[*] Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# 3. Ensure dependencies are installed quietly (so it doesn't spam every time)
echo "[*] Ensuring required free AI packages are installed... (this may take a minute on first run)"
pip install --upgrade pip
pip install transformers torch pillow torchvision

# 4. Run the Python AI Script
echo ""
echo "================================================="
echo "    🧠 Running Local Image AI Pipeline...    "
echo "================================================="
python3 "$SCRIPT_PATH"

echo "================================================="
echo "           ✅ Pipeline Finished!             "
echo "================================================="

# Deactivate safety
deactivate
