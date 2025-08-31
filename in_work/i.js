const chromium = require('playwright').chromium;
const a = 'https://www.chabad.fm/155/';

async function run() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(a, { waitUntil: 'domcontentloaded' });

    const j = await page.$$eval(
        'main ',
        (results) => results.map((el) => {
            //const img = el.querySelector('img')?.getAttribute('src') || null;
            const title = el.querySelector('p')?.innerText || null;
            // const link = el.querySelector('a.poly-component__title')?.href || null;
            const text = el.querySelector('div.PageView')?.innerText || null;
            return { title, text };
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