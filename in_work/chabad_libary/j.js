const { chromium } = require('playwright');
const { scrapePage, scrapeRange } = require('./chabad_libary');

(async () => {
  // 🟢 Ejemplo 1: scrapear SOLO UNA página
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await scrapePage(page, 3701350179);
  await browser.close();

  // 🟢 Ejemplo 2: scrapear VARIAS páginas
  //await scrapeRange(1500370002, 1500370005, { headless: true, delayMs: 1500 });
})();