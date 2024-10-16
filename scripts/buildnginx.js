// script.js
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Путь к вашему config.json
const configPath = path.join(__dirname, '../config.json');

// Путь к выходному файлу конфигурации Nginx
const outputPath = path.join(__dirname, 'nginx.conf');

// Чтение и парсинг config.json
fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла config.json:', err);
        return;
    }

    const config = JSON.parse(data);
    let nginxConfig = `events {}

http {
    include /etc/nginx/mime.types;
    `;

    // Генерация конфигурации Nginx
    for (const domain in config.domains) {
        nginxConfig += `
    server {
        listen 80;
        listen [::]:80;
        root /var/www/html;
        server_name ${domain};

        location / {
            index ${domain}.html ${domain}.htm;
            try_files $uri $uri/ /${domain}.html;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root html;
        }
    }
`;
    }
    
    nginxConfig += `
}    
    `

    // Запись сгенерированной конфигурации в файл
    fs.writeFile(outputPath, nginxConfig, (err) => {
        if (err) {
            console.error('Ошибка записи файла nginx.conf:', err);
            return;
        }
        console.log('nginx.conf успешно создан!');
    });
});
