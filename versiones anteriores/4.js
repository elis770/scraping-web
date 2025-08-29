// Importa las librerías necesarias:
// - node-fetch: para realizar la petición HTTP a través de ScraperAPI.
// - cheerio: aunque está importado, no se utiliza en este script. Podría ser para un uso futuro.
// - fs: para guardar el resultado en un archivo.
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

// URL específica de la página que se quiere scrapear.
const url = 'https://chabadlibrary.org/books/1';
// Tu clave de API de ScraperAPI.
const apiKey = '134d635069d5f5fd125de34d2e37ef39';
// Construye la URL completa para la petición a ScraperAPI.
// - `api_key`: tu clave de acceso.
// - `url`: la página que quieres obtener.
// - `render=true`: indica a ScraperAPI que procese el JavaScript de la página antes de devolver el HTML.
const fullUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${url}&render=true`;

/**
 * Realiza una única petición de scraping a una URL y guarda el HTML resultante.
 */
async function scrapeAndSave() {
    try {
        // Realiza la petición a la URL de ScraperAPI.
        const response = await fetch(fullUrl);
        // Obtiene el contenido HTML como texto.
        const html = await response.text();

        // Guarda el HTML en un archivo llamado `resultado.html`.
        // `utf8` es la codificación de caracteres.
        fs.writeFileSync('resultado.html', html, 'utf8');
        console.log('✅ Datos guardados en resultado.html');

    } catch (error) {
        // Si algo sale mal, muestra un mensaje de error en la consola.
        console.error('❌ Error en el scraping:', error);
    }
}

// Llama a la función para iniciar el proceso.
scrapeAndSave();
