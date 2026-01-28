"""
Flask Web App for English to Kannada Translator with Text-to-Speech
"""

from flask import Flask, render_template, request, jsonify, send_file
import requests
import pyttsx3
import io
import os
import tempfile

app = Flask(__name__)

# Initialize text-to-speech engine
def get_tts_engine():
    """Get a fresh pyttsx3 engine instance"""
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    # Try to set Kannada if available
    try:
        voices = engine.getProperty('voices')
        for voice in voices:
            if 'kannada' in voice.name.lower() or 'kn' in voice.name.lower():
                engine.setProperty('voice', voice.id)
                break
    except:
        pass
    return engine

def translate_to_kannada(text):
    """Translate text to Kannada using MyMemory Translation API"""
    try:
        # Using MyMemory API which is free and doesn't require authentication
        url = "https://api.mymemory.translated.net/get"
        params = {
            'q': text,
            'langpair': 'en|kn'
        }
        response = requests.get(url, params=params, timeout=10)
        result = response.json()
        
        if result.get('responseStatus') == 200:
            return result.get('responseData', {}).get('translatedText', text)
        else:
            return text
    except Exception as e:
        print(f"Translation error: {e}")
        return text

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    """Translate English text to Kannada"""
    try:
        data = request.json
        english_text = data.get('text', '').strip()
        
        if not english_text:
            return jsonify({'error': 'Please enter text'}), 400
        
        # Translate text to Kannada
        kannada_text = translate_to_kannada(english_text)
        
        if not kannada_text or kannada_text == english_text:
            return jsonify({'error': 'Translation service temporarily unavailable. Please try again.'}), 503
        
        return jsonify({
            'english': english_text,
            'kannada': kannada_text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/speak', methods=['POST'])
def speak():
    """Generate audio for Kannada text"""
    try:
        data = request.json
        kannada_text = data.get('text', '').strip()
        
        if not kannada_text:
            return jsonify({'error': 'Please provide text'}), 400
        
        # Initialize text-to-speech engine
        engine = get_tts_engine()
        
        # Create temporary audio file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            tmp_path = tmp_file.name
        
        try:
            # Save audio to file
            engine.save_to_file(kannada_text, tmp_path)
            engine.runAndWait()
            
            # Read and send audio file
            with open(tmp_path, 'rb') as audio_file:
                audio_data = audio_file.read()
            
            return send_file(
                io.BytesIO(audio_data),
                mimetype='audio/wav',
                as_attachment=True,
                download_name='kannada_audio.wav'
            )
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except:
                    pass
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/speak-stream', methods=['POST'])
def speak_stream():
    """Generate audio stream for Kannada text"""
    try:
        data = request.json
        kannada_text = data.get('text', '').strip()
        
        if not kannada_text:
            return jsonify({'error': 'Please provide text'}), 400
        
        # Initialize text-to-speech engine
        engine = get_tts_engine()
        
        # Create temporary audio file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            tmp_path = tmp_file.name
        
        try:
            # Save audio to file
            engine.save_to_file(kannada_text, tmp_path)
            engine.runAndWait()
            
            # Read and send audio file
            with open(tmp_path, 'rb') as audio_file:
                audio_data = io.BytesIO(audio_file.read())
            
            return send_file(
                audio_data,
                mimetype='audio/wav'
            )
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except:
                    pass
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
