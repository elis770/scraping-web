import { extract } from '@extractus/article-extractor';
//const a = 'https://www.infobae.com/politica/2025/08/29/a-nueve-dias-de-la-eleccion-kicillof-se-enfoca-en-la-tercera-seccion-y-liderara-una-cumbre-con-intendentes-peronistas/?app=true'
const a = 'https://tn.com.ar'
const run = async () => {
  const article = await extract(a);
  console.log(article);
};

run();

//hay que cambiar en package.json "type": "module" por "type": "commonjs"