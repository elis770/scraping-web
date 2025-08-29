const chromium = require('playwright').chromium;

async function run() {

    const browser = await chromium.launch(
        { headless: true }
    );

    const page = await browser.newPage();

    //await page.goto('https://www.amazon.com/s?k=playstation&__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2IX6EEDK7NZYP&sprefix=playstation%2Caps%2C224&ref=nb_sb_noss_2');
    await page.goto('https://www.amazon.com/s?k=relojes+para+hombres&crid=15UQQEP7BLMRX&sprefix=relojes%2Caps%2C228&ref=nb_sb_ss_p13n-pd-dpltr-ranker_1_7');

    // Corrección: El selector para múltiples clases debe unirlas con un punto.
    const j = await page.$$eval(
        '.s-card-container',
        (results) => (results.map((el) => {
            const title = el.querySelector('a')?.innerText || null;

            const content = el.querySelector('div')?.innerText || null;

            return { title, content };

        }))
    )
    await browser.close();
    return j;
}

// Corrección: Se debe llamar a la función asíncrona y esperar su resultado.
(async () => {
    console.log("Iniciando scraping...");
    const data = await run();
    console.log("Datos extraídos:", data);
})().catch(err => console.error("Ocurrió un error:", err));