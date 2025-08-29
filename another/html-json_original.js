const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function extraerTextoHTML(html) {
    const $ = cheerio.load(html);
    
    // Extraer el título desde la etiqueta <title>
    let titulo = $('title').first().text().trim() || "Sin título";
    
    // Extraer todo el texto del cuerpo, eliminando etiquetas
    let contenido = $('body').text().replace(/\s+/g, ' ').trim();

    return { titulo, contenido };
}

function obtenerArchivosHTML(directorio) {
    let archivosHTML = [];

    const archivos = fs.readdirSync(directorio);

    archivos.forEach((archivo) => {
        const rutaCompleta = path.join(directorio, archivo);
        const stats = fs.statSync(rutaCompleta);

        if (stats.isDirectory()) {
            archivosHTML = archivosHTML.concat(obtenerArchivosHTML(rutaCompleta));
        } else if (stats.isFile() && path.extname(archivo) === '.html') {
            const contenido = fs.readFileSync(rutaCompleta, 'utf8');
            const { titulo, contenido: textoLimpio } = extraerTextoHTML(contenido);

            archivosHTML.push({
                ruta: rutaCompleta,
                titulo: titulo, // Ahora resalta el título del <title>
                contenido: textoLimpio
            });
        }
    });

    return archivosHTML;
}

const directorioRaiz = 'C:\\Users\\eliah\\OneDrive\\Desktop\\api ia\\my proyect\\src';
const resultado = obtenerArchivosHTML(directorioRaiz);

const rutaSalida = path.join(__dirname, 'archivos_html.json');
fs.writeFileSync(rutaSalida, JSON.stringify(resultado, null, 2), 'utf8');

console.log(`El archivo JSON ha sido guardado en: ${rutaSalida}`);
