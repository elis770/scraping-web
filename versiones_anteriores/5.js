// Importa las librerías necesarias:
// - node-fetch: para hacer peticiones HTTP a través de ScraperAPI.
// - fs: para interactuar con el sistema de archivos (crear carpetas, guardar archivos).
// - path: para construir rutas de archivos de forma segura.
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Tu clave de API para ScraperAPI.
const apiKey = '134d635069d5f5fd125de34d2e37ef39';
// La URL base del sitio del que se extraerán los libros o artículos.
const baseUrl = 'https://chabadlibrary.org/books/';
// El nombre del directorio donde se almacenarán los resultados.
const outputDir = 'articulos';

// Comprueba si el directorio de salida no existe y, en ese caso, lo crea.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Descarga y guarda artículos de un rango de páginas si contienen palabras clave.
 * @param {number} start - El número de la página de inicio.
 * @param {number} end - El número de la página de fin.
 */
async function scrapeAndSaveArticles(start, end) {
    // Bucle que recorre cada número de página desde el inicio hasta el fin.
    for (let i = start; i <= end; i++) {
        const url = `${baseUrl}${i}`;
        // Construye la URL de ScraperAPI, pasando la URL a scrapear y la clave de API.
        // `render=true` es importante para que la página se cargue completamente (incluyendo JavaScript) antes de obtener el HTML.
        const apiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${url}&render=true`;

        try {
            // Realiza la petición a la API.
            const response = await fetch(apiUrl);
            // Obtiene el cuerpo de la respuesta como texto (HTML).
            const html = await response.text();

            // Condición para verificar si el contenido es relevante buscando palabras clave.
            if (html.includes('מאמר') || html.includes('Basi Legani') || html.includes('Maamar')) {
                // Si es relevante, crea una carpeta con el número de la página como nombre.
                const folderPath = path.join(outputDir, i.toString());
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                // Guarda el HTML en un archivo `index.html` dentro de la carpeta recién creada.
                const filePath = path.join(folderPath, 'index.html');
                fs.writeFileSync(filePath, html, 'utf8');
                console.log(`✅ Guardado: ${filePath}`);
            } else {
                // Si no es relevante, simplemente lo informa en la consola.
                console.log(`⚪ No relevante: ${url}`);
            }
        } catch (error) {
            // Captura y muestra cualquier error que ocurra durante la petición.
            console.error(`❌ Error en ${url}:`, error.message);
        }

        // Pausa de 2 segundos entre cada petición para no sobrecargar el servidor de la API o del sitio.
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// A continuación, hay varios ejemplos de cómo se podría llamar a la función.
// Están comentados para que no se ejecuten automáticamente.
// Para usarlos, quita el `//` de la línea que te interese y ajusta los números de página.

// scrapeAndSaveArticles(1400090246, 1402880140); // Ejemplo 1: Torat Menachem
// scrapeAndSaveArticles(11200009792, 11200019207); // Ejemplo 2
// scrapeAndSaveArticles(1301410122, 1301540333); // Ejemplo 3: Likutei Sichos
// scrapeAndSaveArticles(1500360002, 1500360053); // Ejemplo 4: Maamorim Meluket 1
// scrapeAndSaveArticles(1500370002, 1500370058); // Ejemplo 5: Maamorim Meluket 2
