// Importa las librerías necesarias:
// - node-fetch: para hacer peticiones HTTP a través de la API de ScraperAPI.
// - fs: para interactuar con el sistema de archivos (crear carpetas, guardar archivos).
// - path: para construir rutas de archivos de manera segura.
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Clave de la API de ScraperAPI. Es recomendable guardarla en una variable de entorno por seguridad.
const apiKey = '134d635069d5f5fd125de34d2e37ef39';
// URL base del sitio que se va a scrapear.
const baseUrl = 'https://chabadlibrary.org/books/';
// Directorio donde se guardarán los resultados.
const outputDir = 'articulos';

// Crea el directorio de salida si no existe.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Descarga y guarda artículos de un rango de páginas si contienen palabras clave específicas.
 * @param {number} start - El número de página inicial.
 * @param {number} end - El número de página final.
 */
async function scrapeAndSaveArticles(start, end) {
    // Itera sobre cada número de página en el rango.
    for (let i = start; i <= end; i++) {
        const url = `${baseUrl}${i}`;
        // Construye la URL de la API de ScraperAPI para la página actual.
        // `render=true` ejecuta el JavaScript de la página, útil para sitios dinámicos.
        const apiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${url}&render=true`;

        try {
            // Realiza la petición a través de ScraperAPI.
            const response = await fetch(apiUrl);
            const html = await response.text();

            // Comprueba si el HTML contiene alguna de las palabras clave para determinar si es relevante.
            if (html.includes('מאמר') || html.includes('Basi Legani') || html.includes('Maamar')) {
                // Crea una carpeta específica para este artículo, usando su número como nombre.
                const folderPath = path.join(outputDir, i.toString());
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }

                // Guarda el HTML completo en un archivo `index.html` dentro de la carpeta del artículo.
                const filePath = path.join(folderPath, 'index.html');
                fs.writeFileSync(filePath, html, 'utf8');
                console.log(`✅ Guardado: ${filePath}`);
            } else {
                // Si no contiene las palabras clave, lo marca como no relevante.
                console.log(`⚪ No relevante: ${url}`);
            }
        } catch (error) {
            // Muestra un error si la petición falla.
            console.error(`❌ Error en ${url}:`, error.message);
        }

        // Espera 2 segundos antes de la siguiente petición para no saturar el servidor.
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Inicia el scraping para un rango de páginas (en este caso, de 1 a 100).
// Podés cambiar estos valores para explorar otras páginas.
scrapeAndSaveArticles(1, 100);
