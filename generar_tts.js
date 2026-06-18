import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'audio', 'ingles');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const audios = [
  { file: 'quetzal-question.mp3', text: 'Hello! I am a birdwatcher looking for the Resplendent Quetzal. Do you know what this beautiful bird mainly eats?' },
  { file: 'playa-question.mp3', text: 'Hi! I love the beaches in Guanacaste. I heard leatherback turtles nest here. When do they usually come?' },
  { file: 'perezoso-question.mp3', text: 'Oh my goodness! Look at that sloth! I know they are very slow, but do they have any hidden skills?' },
  { file: 'volcan-question.mp3', text: 'Greetings! I am studying the Arenal Volcano. Can you tell me what kind of energy Costa Rica produces using volcanoes?' },
  { file: 'comida-question.mp3', text: 'I love this market! What is the most famous traditional breakfast dish of Costa Rica?' }
];

async function generarAudios() {
  console.log('🎙️ Iniciando generación de audios (Text-to-Speech)...');
  for (const item of audios) {
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(item.text)}&tl=en&client=tw-ob`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(path.join(outDir, item.file), Buffer.from(arrayBuffer));
      console.log(`✅ Creado: ${item.file}`);
      
    } catch (e) {
      console.error(`❌ Error en ${item.file}:`, e.message);
    }
    // Pequeña pausa para no saturar el servicio
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('✨ ¡Todos los audios generados con éxito!');
}

generarAudios();
