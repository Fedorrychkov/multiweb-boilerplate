import ReactDOMServer from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';
import { TemplatePage } from './TemplatePage';
import React from 'react';

const config: {
  domains: Record<string, {
    title: string;
    description: string;
    keywords: string;
    body: string;
  }>
} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf-8'));

const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

/**
 * Тут или переделать на .env, можно указать свою метрику (ЯМ)
 */
const KEY = '000000000'

Object.keys(config.domains).forEach((key) => {
    const { title, description, keywords, body } = config.domains[key];
    const html = ReactDOMServer.renderToString(React.createElement(TemplatePage, { title, body }));

    const cssFiles = fs.readdirSync(path.join(process.cwd(), 'dist', 'assets')).filter(file => file.endsWith('.css'));
    const metaCss = cssFiles.map(file => `assets/${file}`);
    
    const outputPath = path.join(distDir, `${key}.html`);

    const outputHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metaCss.map(file => `<link rel="stylesheet" crossorigin href="${file}">`).join('\n')}
    <title>${title}</title>
    <meta name="keywords" content="${keywords}">
    <meta name="description" content="${description}">
</head>
<body>
    <div id="root">${html}</div>

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${KEY}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
      });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${KEY}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
</body>
</html>
    `;
    
    fs.writeFileSync(outputPath, outputHtml);
    console.log(`Сгенерирован файл: ${outputPath}`);
});
