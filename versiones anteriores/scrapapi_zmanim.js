// Importa las librerías necesarias:
// - axios: para realizar las peticiones HTTP.
// - fs: para interactuar con el sistema de archivos (crear carpetas, guardar archivos).
// - path: para construir rutas de archivos de forma segura.
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL base a la que se añadirán los números de página. Apunta a una sección de lecciones diarias.
const baseUrl = 'https://www.chabad.org.il/Lessons/Yom.asp?CategoryID=175&DateParam=';
// Directorio donde se guardarán los resultados.
const outputDir = 'articulos';

// Crea el directorio de salida si no existe.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Descarga y guarda el HTML de un rango de páginas de lecciones.
 * @param {number} start - El número de página inicial.
 * @param {number} end - El número de página final.
 */
async function scrapeAndSaveArticles(start, end) {
    // Itera sobre cada número en el rango especificado.
    for (let i = start; i <= end; i++) {
        const url = `${baseUrl}${i}`;
        try {
            // Realiza la petición GET a la URL.
            // Se incluye un `User-Agent` en las cabeceras para simular una petición desde un navegador,
            // lo que puede ayudar a evitar bloqueos por parte del servidor.
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // Crea una carpeta específica para la página actual, usando su número como nombre.
            const folderPath = path.join(outputDir, i.toString());
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // Guarda el contenido HTML completo en un archivo `index.html` dentro de la carpeta.
            const filePath = path.join(folderPath, 'index.html');
            fs.writeFileSync(filePath, response.data, 'utf8');
            console.log(`✅ Guardado: ${filePath}`);

        } catch (error) {
            // Si la descarga falla, muestra un mensaje de error.
            console.error(`❌ Error descargando ${url}:`, error.message);
        }

        // Espera 2 segundos antes de la siguiente petición para ser respetuoso con el servidor.
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Inicia el proceso de scraping para el rango de páginas de 0 a 201.
scrapeAndSaveArticles(0, 201);
