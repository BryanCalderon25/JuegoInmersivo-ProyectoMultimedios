import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const archivosAborrar = [
  'copy_images.py',
  'fix_folders.py',
  'generar_audios_ingles.py',
  'rename_assets.py',
  'restore_json.py',
  'recursos-descargar.json',
  'CREDITS.md',
  'src/pages/Home.jsx',
  'src/pages/Results.jsx',
  'src/pages/CategorySelect.jsx',
  'src/pages/GameMode.jsx',
  'src/components/common/BarraProgreso.jsx',
  'src/components/common/Temporizador.jsx',
  'src/components/common/Header.jsx'
];

console.log('🧹 Iniciando limpieza de archivos obsoletos...');

archivosAborrar.forEach(archivo => {
  const ruta = path.join(__dirname, archivo);
  if (fs.existsSync(ruta)) {
    try {
      fs.unlinkSync(ruta);
      console.log(`✅ Eliminado: ${archivo}`);
    } catch (e) {
      console.error(`❌ Error eliminando ${archivo}:`, e.message);
    }
  } else {
    console.log(`⚠️ No encontrado (ya estaba borrado): ${archivo}`);
  }
});

console.log('✨ ¡Limpieza completada con éxito!');
