#!/bin/bash

# SilentAid Backend Startup Script
echo "🚀 Starting SilentAid Backend..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Activate virtual environment
source venv/bin/activate

# Start Flask server
echo "📡 Starting Flask server on http://localhost:5000"
python app.py