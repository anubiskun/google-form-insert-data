(async () => {
    let api;

    if (isChrome()) api = chrome;
    else if (isFirefox()) api = browser;

    function isChrome() {
        return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
    }

    function isFirefox() {
        return (
            typeof browser !== "undefined" && typeof browser.runtime !== "undefined"
        );
    }

    async function setStorage(key, value) {
        return new Promise((resolve, reject) => {
            api.storage.local.set({ [key]: value }, function() {
                if (api.runtime.lastError) {
                    reject(api.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
    async function getStorage(key) {
        return new Promise((resolve, reject) => {
            api.storage.local.get(key, function(result) {
                if (api.runtime.lastError) {
                    reject(api.runtime.lastError);
                } else {
                    resolve(result[key]);
                }
            });
        });
    }
    api.runtime.onInstalled.addListener(async (details) => {
        if (
            details.reason === "browser_update" ||
            details.reason === "chrome_update" ||
            details.reason === "update"
        ) {
            return;
        } else if (details.reason == "install") {
            if (await getStorage('extAnubis') === undefined) {
                await setStorage('extAnubis', '[]');
            }
            if (await getStorage('extAnubisCount') === undefined) {
                await setStorage('extAnubisCount', 0);
            }
            if (await getStorage('extAnubisIsReload') === undefined) {
                await setStorage('extAnubisIsReload', false);
            }
            if (await getStorage('extAnubisUrl') === undefined) {
                await setStorage('extAnubisUrl', 'https://docs.google.com/forms/d/e/1FAIpQLSeheL7PVrhrZFIDD98Z1Z7gYojrsllyz4qDNW19zVlBVSIwzw/viewform');
            }
            if (await getStorage('extAnubisStatusBtn') === undefined) {
                await setStorage('extAnubisStatusBtn', {
                    btnStart: true,
                    btnStop: false,
                    btnSetting: true,
                });
            }
        }
    });

})()