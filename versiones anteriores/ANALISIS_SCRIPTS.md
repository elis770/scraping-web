# Análisis y Diferencias de los Scripts de Scraping

En este documento se detallan las funcionalidades y diferencias clave de cada uno de los scripts de scraping que quedaron después de la unificación.

---

### 1. `1.js`
- **Propósito**: Descarga el contenido de un rango de páginas de `chabadlibrary.org`.
- **Implementación**:
    - Realiza peticiones directas al sitio web sin usar un proxy o API externa.
    - Utiliza `node-fetch` para las descargas.
    - Utiliza `cheerio` para analizar el HTML.
- **Resultado**: Guarda **dos archivos** por cada página:
    1.  Un archivo `.html` con el contenido completo.
    2.  Un archivo `.txt` con el texto plano extraído del `<body>`.
- **Diferencia Clave**: Es el único script que guarda tanto el HTML como el texto plano extraído en archivos separados.

---

### 2. `2.js`
- **Propósito**: Descarga artículos "relevantes" de un rango de páginas de `chabadlibrary.org`.
- **Implementación**:
    - Utiliza la API de **ScraperAPI** para realizar las peticiones. Esto ayuda a evitar bloqueos y permite renderizar JavaScript (`render=true`).
    - Utiliza `node-fetch` para conectarse a la API.
    - **Filtra el contenido**: Solo guarda la página si el HTML contiene las palabras clave "מאמר", "Basi Legani" o "Maamar".
- **Resultado**: Guarda un archivo `index.html` en una carpeta con el número de la página, pero solo si el contenido es relevante.
- **Diferencia Clave**: Usa una API externa (ScraperAPI) y filtra el contenido por palabras clave antes de guardarlo.

---

### 3. `3.js`
- **Propósito**: Descarga todo el HTML de un rango de páginas de `chabadlibrary.org` sin ningún tipo de filtro.
- **Implementación**:
    - Realiza peticiones directas al sitio con `node-fetch`.
    - No analiza ni filtra el contenido. Simplemente descarga y guarda.
- **Resultado**: Guarda un archivo `.html` por cada página del rango, sin importar lo que contenga.
- **Diferencia Clave**: Es la versión más simple para "archivar" páginas, ya que guarda todo el HTML sin condiciones.

---

### 4. `4.js`
- **Propósito**: Descargar el HTML de **una única y específica página** de `chabadlibrary.org`.
- **Implementación**:
    - La URL está "hardcodeada" (fija en el código).
    - Usa **ScraperAPI** para la descarga.
- **Resultado**: Guarda el contenido en un único archivo llamado `resultado.html`.
- **Diferencia Clave**: Está diseñado para una sola página, no para un rango, y guarda el resultado en un archivo con nombre fijo.

---

### 5. `5.js`
- **Propósito**: Es funcionalmente idéntico a `2.js`, pero con más ejemplos de uso.
- **Implementación**:
    - Usa **ScraperAPI** con `render=true`.
    - Filtra por las mismas palabras clave que `2.js`.
- **Resultado**: Guarda un `index.html` en una carpeta específica si el contenido es relevante.
- **Diferencia Clave**: La única diferencia real con `2.js` es que contiene múltiples rangos de ejemplo comentados, lo que sugiere que fue usado para diferentes lotes de scraping.

---

### 6. `scrapapi.js`
- **Propósito**: Descargar artículos relevantes de `chabadlibrary.org` de forma directa.
- **Implementación**:
    - Usa `axios` para las peticiones HTTP directas (sin ScraperAPI).
    - Usa `cheerio` para cargar el HTML y **analizar el texto del `<body>`** en busca de las palabras clave.
- **Resultado**: Guarda el `index.html` en una carpeta si el contenido es relevante.
- **Diferencia Clave**: A diferencia de `2.js` y `5.js`, no usa ScraperAPI. A diferencia de `1.js`, no extrae el texto a un archivo `.txt`, sino que lo usa para decidir si guarda o no el HTML.

---

### 7. `scrapapi_zmanim.js`
- **Propósito**: Descargar lecciones diarias de un sitio diferente: `chabad.org.il`.
- **Implementación**:
    - Apunta a una URL base completamente distinta.
    - Usa `axios` para las peticiones.
    - Incluye una cabecera `User-Agent` para simular ser un navegador.
    - No filtra contenido, guarda todo el HTML.
- **Resultado**: Guarda el `index.html` de cada lección en su propia carpeta.
- **Diferencia Clave**: Scrapea un **sitio web totalmente diferente** (`chabad.org.il`).

---

### 8. `scrapapi_zmanim_original.js`
- **Propósito**: Extraer solo el texto de las lecciones diarias de `chabad.org.il`.
- **Implementación**:
    - Apunta a la misma URL que `scrapapi_zmanim.js`.
    - Usa `axios` y `cheerio`.
    - Intenta extraer el texto usando selectores específicos (`.content` y `article` como fallback).
- **Resultado**: Guarda únicamente un archivo `texto.txt` con el contenido extraído.
- **Diferencia Clave**: Es la versión de "extracción de texto" para el sitio `chabad.org.il`, mientras que `scrapapi_zmanim.js` es la versión de "archivo de HTML".

---

## Resumen de Diferencias Principales

| Script                        | Sitio Web Scrapeado        | Librería HTTP | API Externa | Filtrado de Contenido | Salida Principal                               |
| ----------------------------- | -------------------------- | ------------- | ----------- | --------------------- | ---------------------------------------------- |
| `1.js`                        | `chabadlibrary.org`        | `node-fetch`  | No          | No                    | `.html` y `.txt`                               |
| `2.js`                        | `chabadlibrary.org`        | `node-fetch`  | ScraperAPI  | Sí (por keywords)     | `.html` (si es relevante)                      |
| `3.js`                        | `chabadlibrary.org`        | `node-fetch`  | No          | No                    | `.html`                                        |
| `4.js`                        | `chabadlibrary.org`        | `node-fetch`  | ScraperAPI  | No (es una sola URL)  | `resultado.html` (archivo único)             |
| `5.js`                        | `chabadlibrary.org`        | `node-fetch`  | ScraperAPI  | Sí (por keywords)     | `.html` (si es relevante, con muchos ejemplos) |
| `scrapapi.js`                 | `chabadlibrary.org`        | `axios`       | No          | Sí (por keywords)     | `.html` (si es relevante)                      |
| `scrapapi_zmanim.js`          | `chabad.org.il`            | `axios`       | No          | No                    | `.html`                                        |
| `scrapapi_zmanim_original.js` | `chabad.org.il`            | `axios`       | No          | Sí (extrae texto)     | `.txt`                                         |
