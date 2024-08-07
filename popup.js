document.addEventListener("DOMContentLoaded", async function () {
    let api;
    var statusBtn = {};

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

    await getStorage('extAnubisStatusBtn').then((result) => {
        if (result) {
            statusBtn = result
        }
    })
    
    var btnStart = document.getElementById("btnStart");
    var btnStop = document.getElementById("btnStop");
    var btnSetting = document.getElementById("btnSetting");
    var btnReset = document.getElementById("btnReset");
    btnStart.addEventListener("click", async function () {
        api.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            api.tabs.sendMessage(tabs[0].id, { action: "runApp" });
            statusBtn.btnStart = false;
            statusBtn.btnStop = true;
            updateBtn();
            await setStorage('extAnubisStatusBtn', statusBtn);
        });
    });
    btnStop.addEventListener("click", function () {
        api.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            api.tabs.sendMessage(tabs[0].id, { action: "stopApp" });
            statusBtn.btnStart = true;
            statusBtn.btnStop = false;
            updateBtn();
            await setStorage('extAnubisStatusBtn', statusBtn);
        });
    });
    btnSetting.addEventListener("click", function () {
        api.tabs.create({ url: "setting.html" }, function (tabs) {});
    });
    btnReset.addEventListener("click", async function () {
        await setStorage('extAnubisCount', 0);
    });
    setInterval(async function () {
        await getStorage('extAnubis').then((result) => {
            document.getElementById('totalCount').textContent = (result) ? result.length : 0;
        })
        await getStorage('extAnubisCount').then((result) => {
            document.getElementById('countNow').textContent = (result) ? result : 0;
        })
    }, 100);
    function updateBtn() {        
        Object.keys(statusBtn).forEach((v) => {            
            document.getElementById(v).style.display = (statusBtn[v]) ? 'block' : 'none';
        })
    }
    updateBtn()
});
