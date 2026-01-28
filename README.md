# English to Kannada Translator with Text-to-Speech

A Python application that translates English text to Kannada and provides text-to-speech functionality with multiple interfaces.

## Features

- ✅ **Translation**: Convert English text to Kannada using Google Translate API
- 🔊 **Text-to-Speech**: Hear the Kannada translation spoken aloud
- 🌐 **Three Interfaces**: 
  - Web-based UI (Flask) - Recommended
  - Command-line interface for quick translations
  - GUI interface (Tkinter) for desktop use
- 🎨 **Beautiful UI**: Modern, responsive web design
- ⬇️ **Audio Download**: Download translated audio as WAV file
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup

1. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

### Web Interface (Recommended) 🌐

Run the Flask web server:
```bash
python app.py
```

Then open your browser and go to:
```
http://localhost:5000
```

**Features:**
- Beautiful modern interface
- Real-time translation
- Audio playback directly in browser
- Download audio files
- Character count indicator
- Status messages

### Command-Line Interface

Run the CLI translator:
```bash
python translator.py
```

**Interactive Mode:**
- Enter English text when prompted
- The translator will display and speak the Kannada translation
- Type 'quit' to exit

**Direct Translation:**
```bash
python translator.py "Hello, how are you?"
```

### Graphical User Interface (Desktop)

Run the GUI translator:
```bash
python translator_gui.py
```

**Features:**
1. Enter English text in the top text area
2. Click "Translate" to convert to Kannada
3. Click "Speak" to hear the Kannada pronunciation
4. Use "Clear" to reset the fields

## Dependencies

- **Flask**: Web framework for the web interface
- **googletrans**: Google Translate API wrapper for Python
- **pyttsx3**: Text-to-speech library with offline support
- **python-dotenv**: Environment variable management

## Files

- `app.py` - Flask web application (Backend)
- `templates/index.html` - Web interface (Frontend)
- `static/style.css` - Web interface styling
- `static/script.js` - Web interface JavaScript
- `translator.py` - Command-line translator
- `translator_gui.py` - GUI-based translator
- `requirements.txt` - Python dependencies

## API Endpoints

### POST /translate
Translates English text to Kannada.

**Request:**
```json
{
  "text": "Hello"
}
```

**Response:**
```json
{
  "english": "Hello",
  "kannada": "ಹಲೋ"
}
```

### POST /speak-stream
Generates audio stream for Kannada text.

**Request:**
```json
{
  "text": "ಹಲೋ"
}
```

**Response:** WAV audio file

## Examples

```
English: "Good morning"
Kannada: "ಶುಭೋದಯ"

English: "Thank you"
Kannada: "ಧನ್ಯವಾದ"

English: "How are you?"
Kannada: "ನೀವು ಹೇಗಿದ್ದೀರಿ?"
```

## Notes

- The application requires an internet connection for translation (Google Translate)
- Text-to-speech uses the system's default voice
- Speech rate: 150 words per minute (adjustable in code)
- Web version stores audio temporarily during playback
- Audio files are cleaned up automatically

## Troubleshooting

**Issue: "No module named Flask"**
```bash
pip install Flask
```

**Issue: Translation not working**
- Check internet connection
- Try again - Google Translate API may have rate limits

**Issue: Audio not playing in web browser**
- Ensure your browser supports HTML5 audio (most modern browsers do)
- Check speaker/volume settings

## Future Enhancements

- Add more language pairs
- Implement custom voice selection
- Add offline translation support
- Multi-language support
- User preferences and history