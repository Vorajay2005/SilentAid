from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import logging
import re

app = Flask(__name__)
CORS(app)

# Initialize emotion classifier
try:
    emotion_classifier = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True
    )
    print("✅ Emotion model loaded successfully")
except Exception as e:
    print(f"❌ Error loading emotion model: {e}")
    emotion_classifier = None

# Emotion mapping to our 5 core emotions with emojis
EMOTION_MAPPING = {
    'joy': {'label': 'Happy', 'emoji': '😊', 'color': '#22c55e'},
    'happiness': {'label': 'Happy', 'emoji': '😊', 'color': '#22c55e'},
    'sadness': {'label': 'Sad', 'emoji': '😢', 'color': '#3b82f6'},
    'anger': {'label': 'Angry', 'emoji': '😠', 'color': '#ef4444'},
    'fear': {'label': 'Neutral', 'emoji': '😐', 'color': '#6b7280'},
    'surprise': {'label': 'Excited', 'emoji': '🤩', 'color': '#f97316'},
    'disgust': {'label': 'Neutral', 'emoji': '😐', 'color': '#6b7280'},
    'neutral': {'label': 'Neutral', 'emoji': '😐', 'color': '#6b7280'}
}

def clean_text(text):
    """Clean and prepare text for emotion analysis"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove common speech artifacts
    text = re.sub(r'\b(um|uh|er|ah)\b', '', text, flags=re.IGNORECASE)
    
    return text.strip()

def get_emotion(text):
    """Analyze emotion from text"""
    if not emotion_classifier or not text:
        return {
            'emotion': 'Neutral',
            'emoji': '😐',
            'color': '#6b7280',
            'confidence': 0.5
        }
    
    try:
        # Get emotion predictions
        results = emotion_classifier(text)
        
        # Handle return_all_scores=True shape: [[{label, score}, ...]]
        if isinstance(results, list) and len(results) > 0 and isinstance(results[0], list):
            scores = results[0]
        else:
            # Fallback when return_all_scores=False or unexpected shape
            scores = results
        
        # Find the highest confidence emotion
        best_emotion = max(scores, key=lambda x: x['score'])
        emotion_label = best_emotion['label'].lower()
        confidence = best_emotion['score']
        
        # Map to our emotion system
        emotion_info = EMOTION_MAPPING.get(emotion_label, EMOTION_MAPPING['neutral'])
        
        return {
            'emotion': emotion_info['label'],
            'emoji': emotion_info['emoji'],
            'color': emotion_info['color'],
            'confidence': round(confidence, 3)
        }
        
    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        return {
            'emotion': 'Neutral',
            'emoji': '😐',
            'color': '#6b7280',
            'confidence': 0.5
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': emotion_classifier is not None
    })

@app.route('/api/emotion', methods=['POST'])
def analyze_emotion():
    """Analyze emotion from transcript text"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = clean_text(data['text'])
        
        if not text:
            return jsonify({'error': 'Empty text after cleaning'}), 400
        
        # Get emotion analysis
        emotion_result = get_emotion(text)
        
        response = {
            'text': text,
            'emotion': emotion_result['emotion'],
            'emoji': emotion_result['emoji'],
            'color': emotion_result['color'],
            'confidence': emotion_result['confidence'],
            'timestamp': data.get('timestamp')
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'SilentAid Backend API',
        'version': '1.0.0',
        'endpoints': ['/api/health', '/api/emotion']
    })

if __name__ == '__main__':
    print("🚀 Starting SilentAid Backend...")
    print("📡 Emotion analysis ready!")
    app.run(debug=True, host='0.0.0.0', port=5000)