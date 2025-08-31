# 🎤 SilentAid - AI Accessibility Tool

**SilentAid** is an AI-powered accessibility tool that transcribes speech into text and adds emotional context, helping the hearing-impaired understand not just what is said but also how it is said. Built with Web Speech API, HuggingFace emotion models, and Flask, SilentAid makes conversations more inclusive in everyday life.

![SilentAid Demo](https://img.shields.io/badge/Status-Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🎯 Problem & Solution

### The Problem

- **Communication barriers** for hearing-impaired individuals
- **Missing emotional context** in traditional transcription tools
- **Lack of real-time accessibility** solutions for everyday conversations
- **Limited understanding** of tone and sentiment in spoken communication

### Our Solution

SilentAid bridges this gap by providing:

- **Real-time speech transcription** with high accuracy
- **Emotion detection** that identifies the speaker's emotional state
- **Visual accessibility** with color-coded emotional indicators
- **Persistent history** for reviewing past conversations
- **Customizable display** for different accessibility needs

## ✨ Key Features

### 🎙️ Live Transcription

- **Continuous speech recognition** using Web Speech API
- **Real-time processing** with minimal delay
- **High accuracy** for English language
- **Automatic punctuation** and formatting

### 😊 Emotion Detection

- **AI-powered emotion analysis** using HuggingFace models
- **5 core emotions**: Happy, Sad, Angry, Excited, Neutral
- **Visual indicators** with emojis and color coding
- **Confidence scores** for transparency

### 🎨 Accessible Design

- **Large, clear fonts** with adjustable sizing
- **High contrast colors** for better visibility
- **Color-coded emotions** for quick recognition
- **Responsive design** for all devices
- **Keyboard shortcuts** for easy control

### 💾 Smart History

- **Last 20 lines visible** on screen for context
- **50 lines saved locally** for review
- **Persistent storage** across browser sessions
- **Easy history management** with clear options

## 🛠️ Tech Stack

### Frontend

- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality and API integration
- **Web Speech API** - Real-time speech recognition
- **Local Storage** - Client-side data persistence

### Backend

- **Python 3.8+** - Core backend language
- **Flask** - Lightweight web framework
- **HuggingFace Transformers** - AI emotion detection
- **Flask-CORS** - Cross-origin resource sharing
- **PyTorch** - Machine learning framework

### AI Model

- **j-hartmann/emotion-english-distilroberta-base** - Pre-trained emotion classification model
- **DistilRoBERTa** - Efficient transformer architecture
- **Multi-class classification** - 7 emotion categories mapped to 5 core emotions

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **Modern web browser** (Chrome recommended for best Web Speech API support)
- **Microphone access** enabled
- **Internet connection** for initial model download

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SilentAid
   ```

2. **Set up the backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the Flask server**

   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

4. **Open the frontend**

   ```bash
   cd ../frontend
   # Open index.html in your browser or serve with a local server
   python -m http.server 8000  # Optional: serve with Python
   ```

5. **Access the application**
   - Open `frontend/index.html` in your browser
   - Or visit `http://localhost:8000` if using the Python server
   - Allow microphone permissions when prompted

### First Use

1. Click **"Start Listening"** to begin transcription
2. Speak clearly into your microphone
3. Watch as your speech appears with emotion indicators
4. Use **A+/A-** buttons to adjust font size
5. View your conversation history in real-time

## 📱 Usage Guide

### Controls

- **🎙️ Start Listening** - Begin speech recognition
- **⏹️ Stop** - End speech recognition
- **A+** - Increase font size (12px - 32px)
- **A-** - Decrease font size
- **Clear History** - Remove all saved transcripts

### Keyboard Shortcuts

- **Ctrl/Cmd + Enter** - Toggle listening on/off
- **Ctrl/Cmd + Plus** - Increase font size
- **Ctrl/Cmd + Minus** - Decrease font size

### Emotion Indicators

| Emotion | Emoji | Color  | Description                          |
| ------- | ----- | ------ | ------------------------------------ |
| Happy   | 😊    | Green  | Joy, contentment, positive sentiment |
| Sad     | 😢    | Blue   | Sadness, disappointment, melancholy  |
| Angry   | 😠    | Red    | Anger, frustration, irritation       |
| Excited | 🤩    | Orange | Excitement, surprise, enthusiasm     |
| Neutral | 😐    | Gray   | Calm, neutral, no strong emotion     |

## 🏗️ Project Structure

```
SilentAid/
├── frontend/
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Comprehensive styling
│   └── script.js           # Frontend logic and API integration
├── backend/
│   ├── app.py              # Flask server and emotion analysis
│   └── requirements.txt    # Python dependencies
└── README.md               # This documentation
```

## 🔧 Configuration

### Backend Configuration

The Flask server can be configured by modifying `backend/app.py`:

```python
# Server settings
app.run(debug=True, host='0.0.0.0', port=5000)

# Emotion model settings
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)
```

### Frontend Configuration

Modify `frontend/script.js` for frontend settings:

```javascript
// API endpoint
this.apiUrl = "http://localhost:5000";

// History settings
this.maxHistory = 50; // Total items saved
this.maxVisible = 20; // Items shown on screen

// Font settings
this.fontSize = 18; // Default font size
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
python -c "
import requests
response = requests.get('http://localhost:5000/api/health')
print(response.json())
"
```

### Frontend Testing

1. Open browser developer tools
2. Check console for initialization messages
3. Test microphone permissions
4. Verify API connectivity

### Manual Testing Checklist

- [ ] Microphone access granted
- [ ] Speech recognition starts/stops
- [ ] Transcripts appear with emotions
- [ ] Font size adjustment works
- [ ] History persists after refresh
- [ ] Error handling displays properly

## 🚨 Known Limitations

### Technical Limitations

- **English only** - Currently supports English language only
- **Chrome recommended** - Best Web Speech API support in Chrome
- **Internet required** - Initial model download needs internet
- **Text-based emotion** - Emotion inferred from text, not audio tone

### Accuracy Considerations

- **Background noise** may affect transcription accuracy
- **Accent variations** may impact recognition quality
- **Emotion detection** is based on text analysis, not vocal tone
- **Context dependency** - Some emotions may be misclassified without context

### Browser Compatibility

- **Chrome/Chromium** - Full support ✅
- **Firefox** - Limited Web Speech API support ⚠️
- **Safari** - Partial support ⚠️
- **Edge** - Good support ✅

## 🔒 Privacy & Security

### Data Handling

- **Local processing** - Transcripts stored locally in browser
- **No cloud storage** - No data sent to external services (except HuggingFace model)
- **Temporary processing** - Audio not stored, only processed in real-time
- **User control** - Complete control over data with clear history option

### Permissions

- **Microphone access** - Required for speech recognition
- **Local storage** - Used for saving preferences and history
- **Network access** - Required for emotion analysis API calls

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution

- **Multi-language support** - Add support for other languages
- **Voice tone analysis** - Integrate audio-based emotion detection
- **Mobile optimization** - Improve mobile experience
- **Accessibility features** - Add more accessibility options
- **Performance optimization** - Improve speed and efficiency

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HuggingFace** - For providing the emotion classification model
- **Google** - For the Web Speech API
- **Flask Team** - For the excellent web framework
- **Accessibility Community** - For inspiration and feedback

## 📞 Support

### Getting Help

- **Issues** - Report bugs or request features via GitHub Issues
- **Documentation** - Check this README for detailed information
- **Community** - Join discussions in GitHub Discussions

### Common Issues

**Microphone not working?**

- Check browser permissions
- Ensure microphone is connected
- Try refreshing the page

**Backend connection failed?**

- Verify Flask server is running on port 5000
- Check firewall settings
- Ensure all dependencies are installed

**Emotion detection not working?**

- Check internet connection for model download
- Verify backend health endpoint
- Check browser console for errors

---

**Made with ❤️ for accessibility and inclusion**

_SilentAid - Breaking down communication barriers, one conversation at a time._
