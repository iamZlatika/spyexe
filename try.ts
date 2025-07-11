import { chromium, Cookie } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const PROFILES_DIR = path.resolve(__dirname, 'profiles');

(async () => {
    const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const profilePath = path.join(PROFILES_DIR, file);
        const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

        console.log(`🚀 Запускаем профиль: ${profileData.name}`);

        const browser = await chromium.launch({headless: false});
        const context = await browser.newContext({
            viewport: {width: 390, height: 844}, // iPhone 14 Pro Max
            userAgent:
                'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        });

        if (profileData.cookies?.length) {
            const cookies: Cookie[] = profileData.cookies.map((c: any) => ({
                ...c,
                sameSite: c.sameSite || 'Lax', // fallback
                expires: -1 // не обязательно, но можно
            }));
            await context.addCookies(cookies);
        }

        const page = await context.newPage();

        // Перейдём сначала на корень сайта — чтобы куки применились корректно
        await page.goto('https://facebook.com', {waitUntil: 'load'});

        // Потом сразу на мобильную версию
        await page.goto(profileData.facebookUrl || 'https://m.facebook.com', {
            waitUntil: 'load'
        });

        console.log(`🌐 Открыт Facebook для профиля ${profileData.name}`);

        await page.screenshot({path: `output/${profileData.name}-screenshot.png`});

        await browser.close();
    }
})();