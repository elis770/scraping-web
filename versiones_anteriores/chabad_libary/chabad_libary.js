// scraper-chabadlibrary.js
// ---------------------------------------------
// Script para scrapear contenido de Chabad Library
// Requisitos: instalar playwright con "npm i playwright"
// ---------------------------------------------

const { chromium } = require('playwright'); // Librería para automatizar navegador
const fs = require('fs');                   // Sistema de archivos (guardar resultados)
const path = require('path');               // Manejo de rutas

// URL base del sitio a scrapear
const baseUrl = 'https://chabadlibrary.org/books/';
// Carpeta donde se guardarán los resultados
const outputDir = 'articulos';

// Si la carpeta de salida no existe, la crea
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Scrapea UNA sola página identificada por un ID de Chabad Library.
 * - Descarga el HTML completo.
 * - Extrae el texto plano.
 * - Guarda metadatos (URL, título, tamaño).
 *
 * @param {import('playwright').Page} page - Página Playwright reutilizable
 * @param {number|string} id - ID numérico del libro/artículo (ej: 1500370002)
 */
async function scrapePage(page, id) {
  const url = `${baseUrl}${id}`;                      // Construye URL
  const fileBase = path.join(outputDir, `${id}`);     // Prefijo de archivo

  // Abre la página
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // Obtiene contenido y título
  const html = await page.content();                  // HTML completo
  const title = await page.title().catch(() => '');   // Título de la página
  const text = await page.evaluate(() => document.body?.innerText || ''); // Texto plano

  // Guarda HTML en disco
  const filePathHtml = `${fileBase}.html`;
  fs.writeFileSync(filePathHtml, html, 'utf8');

  // Guarda TXT en disco
  const filePathTxt = `${fileBase}.txt`;
  fs.writeFileSync(filePathTxt, text, 'utf8');

  // Guarda JSON con metadatos
  const meta = {
    id: String(id),
    url,
    title,
    savedAt: new Date().toISOString(),
    sizes: {
      htmlBytes: Buffer.byteLength(html),
      textBytes: Buffer.byteLength(text)
    }
  };
  const filePathJson = `${fileBase}.json`;
  fs.writeFileSync(filePathJson, JSON.stringify(meta, null, 2), 'utf8');

  // Log en consola
  console.log(`✅ Guardado: ${filePathHtml}, ${filePathTxt}, ${filePathJson}`);
}

/**
 * Scrapea un rango de IDs consecutivos.
 * - Reutiliza el mismo navegador para eficiencia.
 * - Incluye un delay entre requests para no sobrecargar el servidor.
 *
 * @param {number} start - ID inicial (inclusive)
 * @param {number} end - ID final (inclusive)
 * @param {{headless?: boolean, delayMs?: number}} [opts] - Opciones
 */
async function scrapeRange(start, end, opts = {}) {
  const { headless = true, delayMs = 1000 } = opts;   // Valores por defecto

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  try {
    for (let id = start; id <= end; id++) {
      try {
        await scrapePage(page, id);                   // Scrapea cada ID
      } catch (err) {
        console.error(`❌ Error en ${baseUrl}${id}:`, err?.message || err);
      }
      // Respeta al servidor con una pausa entre requests
      if (delayMs > 0) {
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
  } finally {
    await browser.close();                            // Cierra navegador
  }
}

// ---------------------------------------------
// Ejecución directa desde terminal
// Uso: node scraper-chabadlibrary.js <startId> <endId>
// Ejemplo: node scraper-chabadlibrary.js 1500370002 1500370058
// ---------------------------------------------
if (require.main === module) {
  const [startArg, endArg] = process.argv.slice(2);
  if (!startArg || !endArg) {
    console.log('Uso: node scraper-chabadlibrary.js <startId> <endId>');
    process.exit(1);
  }

  const start = Number(startArg);
  const end = Number(endArg);

  (async () => {
    console.log(`Iniciando scraping: ${start} → ${end}`);
    await scrapeRange(start, end, { headless: true, delayMs: 1000 });
    console.log('Finalizado.');
  })();
}

// Exporta funciones para poder usarlas desde otros archivos
module.exports = { scrapePage, scrapeRange };