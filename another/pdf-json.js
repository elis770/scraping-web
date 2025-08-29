const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');

// Función para leer y extraer texto de un PDF
async function extractTextFromPDF(pdfPath) {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdfDocument = await pdfjsLib.getDocument(data).promise;
    
    let textContent = '';
    
    // Recorremos cada página del documento
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const text = await page.getTextContent();
        
        // Concatenamos el texto extraído
        textContent += text.items.map(item => item.str).join(' ') + '\n';
    }
    
    return textContent;
}

// Función para recorrer los archivos en una carpeta y extraer el texto
async function extractTextFromAllPDFs(directory) {
    const files = fs.readdirSync(directory);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    const result = [];

    for (const pdfFile of pdfFiles) {
        const pdfPath = path.join(directory, pdfFile);
        try {
            const text = await extractTextFromPDF(pdfPath);
            result.push({
                title: pdfFile,
                text: text
            });
        } catch (err) {
            console.error(`Error al leer el archivo ${pdfFile}:`, err);
        }
    }

    return result;
}

// Guardar el resultado en un archivo JSON
async function saveTextToJson(directory) {
    const pdfTextData = await extractTextFromAllPDFs(directory);
    const outputPath = path.join(directory, 'output.json');
    
    fs.writeFileSync(outputPath, JSON.stringify(pdfTextData, null, 2), 'utf-8');
    console.log('Texto extraído y guardado en output.json');
}

// Ruta a tu carpeta con los archivos PDF
const pdfDirectory = "C:/Users/eliah/OneDrive/Desktop/api ia/my proyect/src/pdf_rebe"; // Cambia esto a la ruta correcta
saveTextToJson(pdfDirectory);