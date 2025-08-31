# SilentAid — Real‑time Speech-to-Text with Emotion for Accessibility (Hackathon)

SilentAid helps people with hearing impairments understand not just what is being said, but how it’s being said. It transcribes speech in real time and adds clear emotion context to each line (Happy, Sad, Angry, Excited, Neutral).

## Why it matters

- Communication tools often miss tone/emotion.
- Hearing-impaired users need quick, visual context to follow conversations.
- SilentAid bridges this gap with a simple, accessible interface and emotion-aware transcripts.

## What it does

- Real‑time transcription from the microphone (Web Speech API)
- Emotion tagging per line with emoji, color, and confidence
- Big, adjustable text for readability (A+/A-)
- Recent history visible (20) and stored locally (50)
- Clear status (Idle / Listening / Processing / Stopped) and error feedback

## Demo flow (judges/attendees)

1. Start backend: `./start_backend.sh` (downloads model first time)
2. Open frontend: `frontend/index.html` in Chrome
3. Click “Start Listening” → speak a few short sentences
4. Watch transcript lines appear with emotion tags and colors
5. Click “Stop” → status switches to “Stopped"

## Tech (fast overview)

- Frontend: HTML/CSS/JS, Web Speech API, LocalStorage
- Backend: Python, Flask, HuggingFace Transformers (DistilRoBERTa), PyTorch
- Model: j-hartmann/emotion-english-distilroberta-base

## How emotion works (text-based)

- The backend classifies text into emotions and maps to 5 core categories.
- “Excited” is detected from surprise/joy mix and excitement cues (e.g., wow!, amazing!, can’t wait!).
- Note: It detects emotion from words, not voice tone.

## Setup (quick)

1. Backend
   - macOS/Linux:
     - `./start_backend.sh`
   - Windows (PowerShell):
     - `python -m venv backend\venv`
     - `backend\venv\Scripts\activate`
     - `pip install -r backend\requirements.txt`
     - `python backend\app.py`
2. Frontend
   - Open `frontend/index.html` in Chrome

## Usage tips

- Speak short, clear phrases. Example cues:
  - Excited: “Wow! This is amazing! I can’t wait!”
  - Happy: “I’m really pleased with the result.”
  - Sad: “I’m disappointed about what happened.”
  - Angry: “This is unacceptable and frustrating.”
- Use A+/A- for readability during demos.

## Constraints & notes

- Best in Chrome (Web Speech API support)
- English text only for now
- First run downloads the model (needs Internet)

## Team/Contribution (optional)

- Add names/roles here if required by the hackathon.

— Built for accessibility and inclusion.
