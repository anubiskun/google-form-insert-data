document.addEventListener("DOMContentLoaded", async function () {
    let api;
    let extAnubisUrl;

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

    var btnClose = document.getElementById("btnClose");
    var btnSave = document.getElementById('btnSave');
    var inptUrl = document.getElementById('url');

    btnClose.addEventListener("click", window.close);

    btnSave.addEventListener("click", async function () {
        var fileCsv = document.getElementById("fileCsv");
        if (fileCsv.files.length > 0) {
            const file = fileCsv.files[0];
            const reader = new FileReader();

            reader.onload = async function (event) {
                const dT = event.target.result;
                const jD = xD(dT);
                
                await setStorage('extAnubis', jD).then((result) => {
                    alert('berhasil update database ngab!');
                });

            };
            
            reader.readAsText(file);
        } else if (inptUrl.value !== extAnubisUrl) {
            await setStorage('extAnubisUrl', inptUrl.value);
        }

        window.close();

    });

    await getStorage('extAnubisUrl').then((result) => {
        inptUrl.value = (result) ? result : '';
        extAnubisUrl = result;
    })

    function xD(data) {
        const rows = data.trim().split('\n');
        const headers = rows[0].split(';');
        return rows.slice(1).map(row => {
            const values = row.split(';');
            let jsonObject = {};
            headers.forEach((header, index) => {
                jsonObject[header.trim()] = values[index].trim();
            });
            return jsonObject;
        });
    }
});
