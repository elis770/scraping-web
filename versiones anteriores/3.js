// Importa las librerías necesarias:
// - node-fetch: para hacer peticiones HTTP y obtener el contenido de las páginas.
// - fs: para interactuar con el sistema de archivos (guardar los archivos HTML).
// - path: para construir rutas de archivos de forma segura.
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// URL base del sitio a scrapear.
const baseUrl = 'https://chabadlibrary.org/books/';
// Directorio donde se guardarán los archivos HTML descargados.
const outputDir = 'articulos';

// Crea el directorio de salida si aún no existe.
// La opción { recursive: true } permite crear carpetas anidadas si es necesario.
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Descarga y guarda el contenido HTML de un rango de páginas.
 * @param {number} start - El número de la página inicial del rango.
 * @param {number} end - El número de la página final del rango.
 */
async function scrapePages(start, end) {
    // Itera sobre cada número de página en el rango especificado.
    for (let i = start; i <= end; i++) {
        // Construye la URL completa para la página actual.
        const url = `${baseUrl}${i}`;

        try {
            // Realiza la petición HTTP para obtener la página.
            const response = await fetch(url);
            // Convierte la respuesta a texto (el HTML).
            const html = await response.text();

            // Guarda el contenido HTML en un archivo, sin importar su contenido.
            // El nombre del archivo será el número de la página.
            const filePath = path.join(outputDir, `${i}.html`);
            fs.writeFileSync(filePath, html, 'utf8');
            console.log(`✅ Guardado: ${filePath}`);
        } catch (error) {
            // Si ocurre un error durante la descarga, lo muestra en la consola.
            console.error(`❌ Error en ${url}:`, error.message);
        }

        // Espera 1 segundo (1000 ms) antes de la siguiente petición para no sobrecargar el servidor.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Ejemplo de cómo ejecutar la función de scraping (actualmente comentado).
// Para usarlo, descomenta la línea y ajusta el rango de páginas que te interese.
// scrapePages(1400090033, 1400090043);
