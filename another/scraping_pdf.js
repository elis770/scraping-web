const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const mainFolder ='C:/Users/eliah/OneDrive/Desktop/pdf_rebe';

const getAllPdfFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllPdfFiles(filePath));
        } else if (filePath.toLowerCase().endsWith('.pdf')) {
            results.push(filePath);
        }
    });

    return results;
};

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
