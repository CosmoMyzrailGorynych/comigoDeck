import {WebExtensionBlocker} from '@cliqz/adblocker-webextension';
import {browser} from 'webextension-polyfill-ts';

let adblockEngine: WebExtensionBlocker;

export const enableAdFilter = () => {
    localStorage.enableAdFilter = 'true';
    adblockEngine.enableBlockingInBrowser(browser);
};
export const disableAdFilter = () => {
    localStorage.enableAdFilter = 'false';
    adblockEngine.disableBlockingInBrowser(browser);
};
export const isAdFilterEnabled = () => adblockEngine.isBlockingEnabled(browser);;

WebExtensionBlocker.fromPrebuiltAdsAndTracking().then(engine => {
    adblockEngine = engine;
    if (localStorage.enableAdFilter !== 'false') {
        console.log('Enabling adblock', browser)
        engine.enableBlockingInBrowser(browser);
    }
});
