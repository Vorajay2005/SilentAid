// SilentAid Frontend JavaScript
class SilentAid {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.fontSize = 18;
    this.maxHistory = 50;
    this.maxVisible = 20;
    this.history = [];
    this.apiUrl = "http://localhost:5000";

    this.initializeElements();
    this.initializeSpeechRecognition();
    this.loadHistory();
    this.bindEvents();
    this.checkBackendHealth();

    console.log("🎤 SilentAid initialized successfully");
  }

  initializeElements() {
    // Buttons
    this.startBtn = document.getElementById("startBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.fontIncreaseBtn = document.getElementById("fontIncrease");
    this.fontDecreaseBtn = document.getElementById("fontDecrease");
    this.clearHistoryBtn = document.getElementById("clearHistory");

    // Display elements
    this.status = document.getElementById("status");
    this.statusText = this.status.querySelector(".status-text");
    this.transcriptArea = document.getElementById("transcriptArea");
    this.fontSizeDisplay = document.getElementById("fontSizeDisplay");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.errorToast = document.getElementById("errorToast");

    // Update font size display
    this.updateFontSizeDisplay();
  }

  initializeSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      this.showError(
        "Speech recognition not supported in this browser. Please use Chrome."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onstart = () => {
      console.log("🎙️ Speech recognition started");
      this.updateStatus("listening", "Listening...");
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.handleSpeechError(event.error);
    };

    this.recognition.onend = () => {
      console.log("🛑 Speech recognition ended");
      if (this.isListening) {
        // Restart if we're supposed to be listening
        setTimeout(() => {
          if (this.isListening) {
            this.recognition.start();
          }
        }, 100);
      } else {
        this.updateStatus("idle", "Stopped");
      }
    };
  }

  bindEvents() {
    // Button events
    this.startBtn.addEventListener("click", () => this.startListening());
    this.stopBtn.addEventListener("click", () => this.stopListening());
    this.fontIncreaseBtn.addEventListener("click", () =>
      this.increaseFontSize()
    );
    this.fontDecreaseBtn.addEventListener("click", () =>
      this.decreaseFontSize()
    );
    this.clearHistoryBtn.addEventListener("click", () => this.clearHistory());

    // Error toast close
    const errorClose = this.errorToast.querySelector(".error-close");
    errorClose.addEventListener("click", () => this.hideError());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            if (this.isListening) {
              this.stopListening();
            } else {
              this.startListening();
            }
            break;
          case "=":
          case "+":
            e.preventDefault();
            this.increaseFontSize();
            break;
          case "-":
            e.preventDefault();
            this.decreaseFontSize();
            break;
        }
      }
    });
  }

  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/api/health`);
      const data = await response.json();

      if (data.status === "healthy" && data.model_loaded) {
        console.log("✅ Backend is healthy and ready");
      } else {
        console.warn("⚠️ Backend health check failed:", data);
        this.showError(
          "Backend is not fully ready. Emotion detection may not work."
        );
      }
    } catch (error) {
      console.error("❌ Backend health check failed:", error);
      this.showError(
        "Cannot connect to backend. Please ensure the Flask server is running on port 5000."
      );
    }
  }

  startListening() {
    if (!this.recognition) {
      this.showError("Speech recognition not available");
      return;
    }

    if (this.isListening) return;

    this.isListening = true;
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;

    // Clear welcome message if present
    const welcomeMessage =
      this.transcriptArea.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    try {
      this.recognition.start();
      this.updateStatus("listening", "Listening...");
      console.log("🎙️ Started listening");
    } catch (error) {
      console.error("Error starting recognition:", error);
      this.showError("Failed to start speech recognition");
      this.stopListening();
    }
  }

  stopListening() {
    if (!this.isListening) return;

    this.isListening = false;
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;

    if (this.recognition) {
      this.recognition.stop();
    }

    this.updateStatus("idle", "Stopped");
    console.log("🛑 Stopped listening");
  }

  handleSpeechResult(event) {
    let finalTranscript = "";
    let interimTranscript = "";

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Update status with interim results
    if (interimTranscript) {
      if (this.isListening) {
        this.updateStatus(
          "listening",
          `Listening... "${interimTranscript.trim()}"`
        );
      }
    }

    // Process final transcript
    if (finalTranscript.trim()) {
      this.processFinalTranscript(finalTranscript.trim());
    }
  }

  async processFinalTranscript(text) {
    if (!text || text.length < 2) return;

    console.log("📝 Processing transcript:", text);
    this.updateStatus("processing", "Analyzing emotion...");
    this.showLoading(true);

    try {
      const emotionData = await this.analyzeEmotion(text);
      this.addTranscriptLine(emotionData);
      if (this.isListening) {
        this.updateStatus("listening", "Listening...");
      } else {
        this.updateStatus("idle", "Stopped");
      }
    } catch (error) {
      console.error("Error processing transcript:", error);
      // Add line without emotion analysis
      this.addTranscriptLine({
        text: text,
        emotion: "Neutral",
        emoji: "😐",
        color: "#6b7280",
        confidence: 0.5,
      });
      if (this.isListening) {
        this.updateStatus("listening", "Listening...");
      } else {
        this.updateStatus("idle", "Stopped");
      }
    } finally {
      this.showLoading(false);
    }
  }

  async analyzeEmotion(text) {
    const response = await fetch(`${this.apiUrl}/api/emotion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  addTranscriptLine(data) {
    const timestamp = new Date().toLocaleTimeString();
    const lineData = {
      ...data,
      timestamp: timestamp,
      id: Date.now(),
    };

    // Add to history
    this.history.unshift(lineData);

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }

    // Save to localStorage
    this.saveHistory();

    // Update display
    this.renderTranscriptLines();

    console.log("✅ Added transcript line:", lineData);
  }

  renderTranscriptLines() {
    // Clear current content
    this.transcriptArea.innerHTML = "";

    // Show only the most recent lines
    const visibleHistory = this.history.slice(0, this.maxVisible);

    if (visibleHistory.length === 0) {
      this.transcriptArea.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">🎯</div>
                    <h3>Welcome to SilentAid</h3>
                    <p>Click "Start Listening" to begin real-time speech transcription with emotion detection.</p>
                    <div class="feature-list">
                        <div class="feature">
                            <span class="feature-icon">📝</span>
                            <span>Real-time transcription</span>
                        </div>
                        <div class="feature">
                            <span class="feature-icon">😊</span>
                            <span>Emotion detection</span>
                        </div>
                        <div class="feature">
                            <span class="feature-icon">🎨</span>
                            <span>Color-coded display</span>
                        </div>
                        <div class="feature">
                            <span class="feature-icon">💾</span>
                            <span>History preservation</span>
                        </div>
                    </div>
                </div>
            `;
      return;
    }

    visibleHistory.forEach((line) => {
      const lineElement = this.createTranscriptLineElement(line);
      this.transcriptArea.appendChild(lineElement);
    });

    // Scroll to top to show newest
    this.transcriptArea.scrollTop = 0;
  }

  createTranscriptLineElement(data) {
    const line = document.createElement("div");
    line.className = `transcript-line ${data.emotion.toLowerCase()}`;
    line.style.fontSize = `${this.fontSize}px`;

    line.innerHTML = `
            <div class="emotion-tag">
                <span class="emotion-emoji">${data.emoji}</span>
                <span>[${data.emotion}]</span>
            </div>
            <div class="transcript-content">
                <div class="transcript-text">${this.escapeHtml(data.text)}</div>
                <div class="transcript-meta">
                    ${data.timestamp} • Confidence: ${Math.round(
      data.confidence * 100
    )}%
                </div>
            </div>
        `;

    return line;
  }

  handleSpeechError(error) {
    console.error("Speech recognition error:", error);

    let errorMessage = "Speech recognition error occurred";

    switch (error) {
      case "no-speech":
        errorMessage = "No speech detected. Please try speaking again.";
        break;
      case "audio-capture":
        errorMessage = "Microphone access denied or not available.";
        break;
      case "not-allowed":
        errorMessage =
          "Microphone permission denied. Please allow microphone access.";
        break;
      case "network":
        errorMessage = "Network error occurred during speech recognition.";
        break;
      case "aborted":
        // Don't show error for intentional stops
        return;
      default:
        errorMessage = `Speech recognition error: ${error}`;
    }

    this.showError(errorMessage);

    // Stop listening on critical errors
    if (["not-allowed", "audio-capture"].includes(error)) {
      this.stopListening();
    }
  }

  increaseFontSize() {
    if (this.fontSize < 32) {
      this.fontSize += 2;
      this.updateFontSize();
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      this.updateFontSize();
    }
  }

  updateFontSize() {
    // Update all transcript lines
    const lines = this.transcriptArea.querySelectorAll(".transcript-line");
    lines.forEach((line) => {
      line.style.fontSize = `${this.fontSize}px`;
    });

    this.updateFontSizeDisplay();
    this.saveFontSize();
  }

  updateFontSizeDisplay() {
    this.fontSizeDisplay.textContent = `${this.fontSize}px`;
  }

  clearHistory() {
    if (confirm("Are you sure you want to clear all transcript history?")) {
      this.history = [];
      this.saveHistory();
      this.renderTranscriptLines();
      console.log("🗑️ History cleared");
    }
  }

  updateStatus(type, text) {
    this.status.className = `status ${type}`;
    this.statusText.textContent = text;
  }

  showLoading(show) {
    this.loadingOverlay.classList.toggle("hidden", !show);
  }

  showError(message) {
    const errorMessage = this.errorToast.querySelector(".error-message");
    errorMessage.textContent = message;
    this.errorToast.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);

    console.error("❌ Error:", message);
  }

  hideError() {
    this.errorToast.classList.add("hidden");
  }

  saveHistory() {
    try {
      localStorage.setItem("silentaid_history", JSON.stringify(this.history));
    } catch (error) {
      console.warn("Failed to save history to localStorage:", error);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem("silentaid_history");
      if (saved) {
        this.history = JSON.parse(saved);
        this.renderTranscriptLines();
        console.log(`📚 Loaded ${this.history.length} items from history`);
      }
    } catch (error) {
      console.warn("Failed to load history from localStorage:", error);
      this.history = [];
    }

    // Load font size
    try {
      const savedFontSize = localStorage.getItem("silentaid_fontsize");
      if (savedFontSize) {
        this.fontSize = parseInt(savedFontSize, 10);
        this.updateFontSizeDisplay();
      }
    } catch (error) {
      console.warn("Failed to load font size from localStorage:", error);
    }
  }

  saveFontSize() {
    try {
      localStorage.setItem("silentaid_fontsize", this.fontSize.toString());
    } catch (error) {
      console.warn("Failed to save font size to localStorage:", error);
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing SilentAid...");
  window.silentAid = new SilentAid();
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.silentAid && window.silentAid.isListening) {
    console.log("📱 Page hidden, continuing to listen...");
  }
});

// Handle beforeunload
window.addEventListener("beforeunload", () => {
  if (window.silentAid && window.silentAid.isListening) {
    window.silentAid.stopListening();
  }
});
