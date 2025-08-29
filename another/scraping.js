const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Carpeta principal donde están los PDFs
const mainFolder ='C:/Users/eliah/OneDrive/Desktop/pdf_rebe';

// Función para buscar archivos recursivamente
const getAllPdfFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            // Si es una carpeta, buscar dentro de ella
            results = results.concat(getAllPdfFiles(filePath));
        } else if (filePath.toLowerCase().endsWith('.pdf')) {
            // Si es un PDF, agregarlo a la lista
            results.push(filePath);
        }
    });

    return results;
};

// Obtener todos los PDFs
const pdfFiles = getAllPdfFiles(mainFolder);

pdfFiles.forEach(filePath => {
    const dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(data => {
        console.log(`\n=== Contenido de ${filePath} ===`);
        console.log(data.text);
    }).catch(err => {
        console.error(`Error al procesar ${filePath}:`, err);
    });
});
