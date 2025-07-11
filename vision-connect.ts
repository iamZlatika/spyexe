import * as dotenv from 'dotenv';
import { TVisionFolder, TVisionProfile } from "./types";
import { chromium } from "playwright";
// import { chromium } from "playwright";

dotenv.config();
const VISION_API_URL = process.env.VISION_API_URL || 'https://v1.empr.cloud/api/v1';

function getToken(): string {
    const token = process.env.VISION_X_TOKEN;
    if (!token) {
        throw new Error('VISION_X_TOKEN not found in environment variables');
    }
    return token;
}

export async function getVisionFolders(): Promise<TVisionFolder[]> {
    const url = `${VISION_API_URL}/folders`;
    const res = await fetch(url, {
        headers: {'X-Token': getToken()},
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.log('❌ Error getting folders:', errorText);
        throw new Error(`Failed to get folders: ${res.status} - ${errorText}`);
    }

    const data = await res.json() as { data: TVisionFolder[] };
    return data.data;
}


export async function getVisionProfiles(folderId: string): Promise<TVisionProfile[]> {

    const url = `${VISION_API_URL}/folders/${folderId}/profiles`;
    const options = {
        method: "GET",
        headers: {
            "X-Token": getToken(),
        },
    };
    const res = await fetch(url, options);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to get profiles: ${res.status} - ${errorText}`);
    }

    const response = await res.json();

    let profiles: TVisionProfile[] = [];

    if (response.data && response.data.items && Array.isArray(response.data.items)) {
        profiles = response.data.items.map((item: any) => ({
            id: item.id,
            name: item.profile_name || item.name,
            running: item.running || false,
            is_received: item.is_received || false,
            port: item.port || undefined,
            profile_name: item.profile_name || item.name
        }));
    }

    return profiles;
}

// async function getProfileInfo(profileId: string, folderId: string) {
//      const url = `https://v1.empr.cloud/api/v1/folders/${folderId}/profiles/${profileId}`;
//     const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'X-Token': getToken(),
//         },
//     });
//
//     if (!res.ok) {
//         const text = await res.text()
//         throw new Error(`Не найдено инфо  ${res.status} ${res.statusText} — ${text}`);
//     }
//    return  await res.json();
//   }

async function startVisionProfile(profileId: string, folderId: string): Promise<boolean> {

    const startUrl =
        `http://127.0.0.1:3030/start/${folderId}/${profileId}`;
    const body = {
        "args": [
            "--remote-debugging-port=34159"
        ]
    };
    console.log(`🛫 Запрос на старт профиля: ${startUrl}`);

    const res = await fetch(startUrl, {
        method: 'POST',
        headers: {
            'X-Token': getToken(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`❌ Не удалось запустить профиль: ${res.status} - ${errorText}`);
    }

    return await res.json();
}

export async function startVisionConnect() {
    try {
        const folders = await getVisionFolders();
        if (!folders.length) {
            console.log('Нет доступных папок');
        }
        const folderId = folders[0].id;
        console.log('📁 Используется folderId:', folderId);

        const profiles = await getVisionProfiles(folderId);
        if (!profiles.length) {
            console.log('Нет доступных профилей');
        }
        const profileId = profiles[0].id;
        console.log('📁 Используется profileId:', profileId);

        const data = await startVisionProfile(profileId, folderId);
        console.log("data", data)

        console.log('✅ Готово!');
    } catch (error) {
        console.error('❌ Ошибка в main():', error);
    }
}

export async function openFacebookAsMobileCDP() {
    const cdpUrl = 'http://127.0.0.1:34159';
    const browser = await chromium.connectOverCDP(cdpUrl);
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();

    const client = await context.newCDPSession(page);

    // 📱 Устанавливаем mobile user-agent
    await client.send('Network.setUserAgentOverride', {
        userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
    });

    // 📐 Устанавливаем размеры и touch
    await client.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        mobile: true,
    });

    await client.send('Emulation.setTouchEmulationEnabled', {
        enabled: true
    });

    // 🌐 Открываем мобильный Facebook
    await page.goto('https://m.facebook.com', { waitUntil: 'load' });
    await page.screenshot({ path: 'fb-mobile-cdp.png' });

    console.log('✅ Facebook открыт в мобильной версии и сделан скриншот');
}