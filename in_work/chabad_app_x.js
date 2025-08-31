const { chromium } = require('playwright');

const START_URL = 'https://www.chabad.fm/155/';

/**
 * Extrae datos de la página actual.
 * Ajusta los selectores internos si querés traer otros campos.
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{title:string|null, text:string|null}>>}
 */
async function scrapeCurrentPage(page) {
  return page.$$eval('main', (results) =>
    results.map((el) => {
      const title = el.querySelector('p')?.innerText ?? null;
      const text = el.querySelector('div.PageView')?.innerText ?? null;
      return { title, text };
    })
  );
}

/**
 * Hace click en el "siguiente" y espera que la página cambie/cargue.
 * Busca específicamente: a.go que tenga como hijo directo a span.icon.last
 * @param {import('playwright').Page} page
 * @returns {Promise<boolean>} true si clickeó y navegó, false si no encontró el botón
 */
async function clickNextAndWait(page) {
  // Locator que exige hijo directo span.icon.last
  const nextLocator = page.locator('a.go:has(> span.icon.last)');

  // Si preferís una alternativa más amplia (no directo), podrías usar:
  // const nextLocator = page.locator('a.go:has(span.icon.last)');

  // 🔽 Alternativa (comentada) si el hijo es un SVG:
  // const nextLocator = page.locator('a.go:has(> svg.MuiSvgIcon-root)');

  const count = await nextLocator.count();
  if (count === 0) return false;

  const prevURL = page.url();
  await Promise.all([
    nextLocator.first().click(),
    // Espera a que la URL cambie o que termine de cargar el DOM
    page.waitForLoadState('domcontentloaded'),
  ]);

  // Si no cambia la URL, igual damos un respiro al render (algunas páginas usan PJAX/AJAX)
  if (page.url() === prevURL) {
    await page.waitForTimeout(500);
  }

  return true;
}

/**
 * Corre el flujo completo: abre el navegador, scrapea la página inicial y luego
 * repite el patrón "click siguiente → cargar → scrapear" N veces.
 * @param {number} times Cantidad de veces que querés que haga el procedimiento
 * @returns {Promise<Array<{page:number, url:string, data:Array}>>}
 */
async function run(times = 0) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const results = [];

  try {
    await page.goto(START_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    // Página inicial
    let data = await scrapeCurrentPage(page);
    results.push({ page: 0, url: page.url(), data });

    // Repite N veces: click → cargar → scrapear
    for (let i = 1; i <= times; i++) {
      const clicked = await clickNextAndWait(page);
      if (!clicked) {
        console.warn(`No se encontró el botón "siguiente" en la iteración ${i}. Corto acá.`);
        break;
      }
      data = await scrapeCurrentPage(page);
      results.push({ page: i, url: page.url(), data });
    }
  } finally {
    await browser.close();
  }

  return results;
}

// ======================
// Uso "desde afuera":
// Pedí cuántas veces querés repetir el procedimiento (click→cargar→scrapear)
(async () => {
  console.log('Iniciando scraping...');
  const timesToRepeat = 3; // <— cambiá este número desde afuera
  const data = await run(timesToRepeat);
  console.log('Datos extraídos:', JSON.stringify(data, null, 2));
})();