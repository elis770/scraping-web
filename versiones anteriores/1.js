// Importa las librerías necesarias:
// - node-fetch: para hacer peticiones HTTP a las páginas web.
// - fs: para interactuar con el sistema de archivos (guardar los resultados).
// - path: para manejar las rutas de los archivos de forma segura.
// - cheerio: para analizar el HTML y extraer contenido, como si fuera jQuery en el servidor.
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// URL base del sitio que se va a scrapear.
const baseUrl = 'https://chabadlibrary.org/books/';
// Nombre del directorio donde se guardarán los archivos resultantes.
const outputDir = 'articulos';

// Crea el directorio de salida si no existe.
// La opción { recursive: true } asegura que se creen las carpetas anidadas si es necesario.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Descarga y procesa un rango de páginas web.
 * @param {number} start - El número de página inicial.
 * @param {number} end - El número de página final.
 */
async function scrapePages(start, end) {
    // Itera sobre cada número de página en el rango especificado.
    for (let i = start; i <= end; i++) {
        // Construye la URL completa para la página actual.
        const url = `${baseUrl}${i}`;

        try {
            // Realiza la petición HTTP para obtener el contenido de la página.
            const response = await fetch(url);
            // Convierte la respuesta a texto (el HTML de la página).
            const html = await response.text();

            // Guarda el contenido HTML completo en un archivo.
            const filePathHtml = path.join(outputDir, `${i}.html`);
            fs.writeFileSync(filePathHtml, html, 'utf8');

            // Carga el HTML en Cheerio para poder analizarlo.
            const $ = cheerio.load(html);
            // Extrae todo el texto del `<body>`, elimina espacios en blanco extra y lo limpia.
            const textContent = $('body').text().replace(/\s+/g, ' ').trim();

            // Guarda el texto extraído en un archivo .txt.
            const filePathTxt = path.join(outputDir, `${i}.txt`);
            fs.writeFileSync(filePathTxt, textContent, 'utf8');

            // Muestra un mensaje de éxito en la consola.
            console.log(`✅ Guardado: ${filePathHtml} y ${filePathTxt}`);
        } catch (error) {
            // Si ocurre un error durante el proceso, lo muestra en la consola.
            console.error(`❌ Error en ${url}:`, error.message);
        }

        // Espera 1 segundo (1000 milisegundos) antes de la siguiente petición.
        // Esto es importante para no sobrecargar el servidor del sitio web.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Inicia el proceso de scraping para un rango de páginas específico.
scrapePages(1500370002, 1500370058);
