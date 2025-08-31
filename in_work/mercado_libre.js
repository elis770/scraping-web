const chromium = require('playwright').chromium;
const a = 'https://listado.mercadolibre.com.ar/power-bank';

async function run() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(a, { waitUntil: 'domcontentloaded' });

    const j = await page.$$eval(
        'li.ui-search-layout__item',
        (results) => results.map((el) => {
            const img = el.querySelector('img')?.getAttribute('src') || null;
            const title = el.querySelector('h3.poly-component__title-wrapper')?.innerText || null;
            const link = el.querySelector('a.poly-component__title')?.href || null;
            const price = el.querySelector('.andes-money-amount__fraction')?.innerText || null;
            return { img, title, price, link };
        })
    );

    await browser.close();
    return j;
}

(async () => {
    console.log("Iniciando scraping...");
    const data = await run();
    console.log("Datos extraídos:", data);
})();