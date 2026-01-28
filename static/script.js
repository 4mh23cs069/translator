// English to Kannada Translator - JavaScript

let currentAudioBlob = null;
let isPlaying = false;

// DOM Elements
const englishText = document.getElementById('english-text');
const kannadaText = document.getElementById('kannada-text');
const translateBtn = document.getElementById('translate-btn');
const clearBtn = document.getElementById('clear-btn');
const playBtn = document.getElementById('play-btn');
const downloadBtn = document.getElementById('download-btn');
const stopBtn = document.getElementById('stop-btn');
const statusMsg = document.getElementById('status');
const charCount = document.getElementById('char-count');
const audioPlayer = document.getElementById('audio-player');

// Character count update
englishText.addEventListener('input', () => {
    charCount.textContent = englishText.value.length;
});

// Translate button
translateBtn.addEventListener('click', translateText);

// Clear button
clearBtn.addEventListener('click', clearAll);

// Play button
playBtn.addEventListener('click', playAudio);

// Download button
downloadBtn.addEventListener('click', downloadAudio);

// Stop button
stopBtn.addEventListener('click', stopAudio);

// Translate function
async function translateText() {
    const text = englishText.value.trim();

    if (!text) {
        showStatus('Please enter English text', 'error');
        return;
    }

    // Disable button and show loading
    translateBtn.disabled = true;
    showStatus('Translating...', 'loading');

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Translation failed');
        }

        kannadaText.value = data.kannada;
        showStatus('Translation successful! ✓', 'success');

        // Enable audio buttons
        playBtn.disabled = false;
        downloadBtn.disabled = false;

        // Auto-generate audio
        generateAudio(data.kannada);

    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        playBtn.disabled = true;
        downloadBtn.disabled = true;
    } finally {
        translateBtn.disabled = false;
    }
}

// Generate audio
async function generateAudio(text) {
    if (!text) return;

    try {
        showStatus('Generating audio...', 'loading');

        const response = await fetch('/speak-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error('Audio generation failed');
        }

        const audioBlob = await response.blob();
        currentAudioBlob = audioBlob;

        // Create object URL and set to audio player
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;

        showStatus('Audio generated successfully! ✓', 'success');

    } catch (error) {
        showStatus('Error generating audio: ' + error.message, 'error');
    }
}

// Play audio
function playAudio() {
    if (audioPlayer.src) {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
            isPlaying = false;
        } else {
            audioPlayer.play();
            playBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            isPlaying = true;
        }
    }
}

// Stop audio
function stopAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    isPlaying = false;
}

// Download audio
function downloadAudio() {
    if (currentAudioBlob) {
        const url = URL.createObjectURL(currentAudioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kannada_translation.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Clear all
function clearAll() {
    englishText.value = '';
    kannadaText.value = '';
    charCount.textContent = '0';
    audioPlayer.src = '';
    currentAudioBlob = null;
    playBtn.disabled = true;
    downloadBtn.disabled = true;
    statusMsg.innerHTML = '';
    stopAudio();
    showStatus('Cleared! ✓', 'success');
}

// Show status message
function showStatus(message, type) {
    statusMsg.innerHTML = message;
    statusMsg.className = `status-message show ${type}`;

    if (type !== 'loading') {
        setTimeout(() => {
            statusMsg.classList.remove('show');
        }, 4000);
    }
}

// Audio player events
audioPlayer.addEventListener('ended', () => {
    playBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    isPlaying = false;
});

audioPlayer.addEventListener('play', () => {
    playBtn.style.display = 'none';
    stopBtn.style.display = 'inline-flex';
    isPlaying = true;
});

audioPlayer.addEventListener('pause', () => {
    playBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    isPlaying = false;
});

// Enter key to translate
englishText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        translateText();
    }
});
