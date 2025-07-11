import {
    openFacebookAsMobileCDP,
    startVisionConnect
} from './vision-connect';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    await startVisionConnect();
    await sleep(3000); // подождать старта
    await openFacebookAsMobileCDP();
})();
