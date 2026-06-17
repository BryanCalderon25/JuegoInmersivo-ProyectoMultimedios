import os
from gtts import gTTS

questions = {
    "quetzal-question.mp3": "What is the national bird of Costa Rica?",
    "capital-question.mp3": "What is the capital city of Costa Rica?",
    "sloth-question.mp3": "Where do sloths live?",
    "volcan-question.mp3": "Which volcano is one of the most famous in Costa Rica?",
    "comida-question.mp3": "Which traditional Costa Rican dish is made with rice and beans?"
}

# Crear la carpeta si no existe
os.makedirs("public/audio/ingles", exist_ok=True)

print("Generando audios con gTTS...")
for file, text in questions.items():
    print(f"Generando {file}...")
    tts = gTTS(text, lang="en")
    tts.save(f"public/audio/ingles/{file}")

print("¡Audios generados exitosamente!")
