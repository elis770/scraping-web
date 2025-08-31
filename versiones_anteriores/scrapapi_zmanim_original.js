// Importa las librerías necesarias:
// - axios: para realizar peticiones HTTP.
// - cheerio: para analizar el HTML y extraer el contenido de texto.
// - fs: para interactuar con el sistema de archivos.
// - path: para construir rutas de archivos de forma segura.
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// URL base del sitio de lecciones, a la que se le sumará un número de página.
const baseUrl = 'https://www.chabad.org.il/Lessons/Yom.asp?CategoryID=175&DateParam=';
// Directorio donde se guardarán los archivos de texto extraídos.
const outputDir = 'articulos';

// Crea el directorio de salida si no existe.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Descarga, extrae el texto y guarda el contenido de un rango de páginas.
 * @param {number} start - El número de la página de inicio.
 * @param {number} end - El número de la página de fin.
 */
async function scrapeAndSaveArticles(start, end) {
    // Itera sobre cada página en el rango especificado.
    for (let i = start; i <= end; i++) {
        const url = `${baseUrl}${i}`;
        try {
            // Realiza la petición GET, incluyendo un `User-Agent` para simular un navegador.
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            // Carga el HTML de la respuesta en Cheerio.
            const $ = cheerio.load(response.data);

            // Intenta extraer el texto del contenedor principal del artículo.
            // El selector `.content` es una suposición; debería ser ajustado al selector real de la página.
            let textContent = $('.content').text().trim();

            // Si no se encuentra texto con el primer selector, prueba con un selector de fallback (alternativo).
            if (!textContent) {
                textContent = $('article').text().trim(); // Intenta con la etiqueta <article>.
            }

            // Si se encontró contenido de texto, lo guarda.
            if (textContent) {
                // Crea una carpeta para la página actual.
                const folderPath = path.join(outputDir, i.toString());
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }

                // Guarda el texto extraído en un archivo `texto.txt`.
                const filePath = path.join(folderPath, 'texto.txt');
                fs.writeFileSync(filePath, textContent, 'utf8');
                console.log(`✅ Texto guardado: ${filePath}`);
            } else {
                // Si no se pudo extraer texto, lo informa en la consola.
                console.log(`⚪ Sin contenido de texto extraído: ${url}`);
            }

        } catch (error) {
            // Captura y muestra cualquier error durante la descarga.
            console.error(`❌ Error descargando ${url}:`, error.message);
        }

        // Pausa de 2 segundos entre cada petición.
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Inicia el scraping para el rango de páginas de 0 a 201.
scrapeAndSaveArticles(0, 201);
