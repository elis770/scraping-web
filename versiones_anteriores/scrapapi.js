// Importa las librerías necesarias:
// - axios: para realizar peticiones HTTP (una alternativa a node-fetch).
// - cheerio: para analizar el HTML y extraer contenido de forma sencilla.
// - fs: para interactuar con el sistema de archivos (crear carpetas, guardar archivos).
// - path: para construir rutas de archivos de manera segura y compatible entre sistemas operativos.
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// URL base del sitio web del que se extraerá la información.
const baseUrl = 'https://chabadlibrary.org/books/';
// Nombre del directorio donde se guardarán los archivos descargados.
const outputDir = 'articulos';

// Verifica si el directorio de salida no existe y, en caso afirmativo, lo crea.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Descarga, analiza y guarda artículos de un rango de páginas si cumplen ciertos criterios.
 * @param {number} start - El número de la página por la que empezar.
 * @param {number} end - El número de la página en la que terminar.
 */
async function scrapeAndSaveArticles(start, end) {
    // Itera sobre cada número de página en el rango definido.
    for (let i = start; i <= end; i++) {
        const url = `${baseUrl}${i}`;

        try {
            // Realiza una petición GET a la URL para obtener el HTML.
            const response = await axios.get(url);
            const html = response.data;
            // Carga el HTML en Cheerio para poder manipularlo como si fuera jQuery.
            const $ = cheerio.load(html);

            // Comprueba si el texto del `<body>` contiene alguna de las palabras clave.
            if ($('body').text().includes('מאמר') || $('body').text().includes('Basi Legani') || $('body').text().includes('Maamar')) {
                // Si el contenido es relevante, crea una carpeta con el número de página.
                const folderPath = path.join(outputDir, i.toString());
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                // Guarda el HTML completo en un archivo `index.html` dentro de la carpeta creada.
                const filePath = path.join(folderPath, 'index.html');
                fs.writeFileSync(filePath, html, 'utf8');
                console.log(`✅ Guardado: ${filePath}`);
            } else {
                // Si no se encuentran las palabras clave, se considera no relevante.
                console.log(`⚪ No relevante: ${url}`);
            }
        } catch (error) {
            // Captura y muestra cualquier error que ocurra durante la petición.
            console.error(`❌ Error en ${url}:`, error.message);
        }

        // Pausa de 2 segundos entre cada petición para evitar sobrecargar el servidor.
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Inicia el proceso de scraping para un rango específico de páginas.
scrapeAndSaveArticles(1500370002, 1500370058);