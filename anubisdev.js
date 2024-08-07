(async function () {
    var extAnubis;
    var extAnubisCount;
    let api;
    var url;

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
                    resolve(value);
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
    async function deleteStorage(key) {
        return new Promise((resolve, reject) => {
            api.storage.local.remove(key, function() {
                if (api.runtime.lastError) {
                    reject(api.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }

    api.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        switch (request.action) {
            case "runApp":
                runApp();
                break;
            case "stopApp":
                console.log(extAnubis);
                console.log(extAnubisCount);
                break;
            default:
                break;
        }
    });

    async function getData() {
        await getStorage('extAnubis').then((result) => {
            const data = result || [];
            extAnubis = data;
        })
        await getStorage('extAnubisCount').then((result) => {
            const data = result || 0;
            extAnubisCount = data;
        })
    }

    async function uC() {
        await getStorage('extAnubisCount').then(async (result) => {
            console.log(result);
            const n = result + 1;
            await setStorage('extAnubisCount', n);
            extAnubisCount = n;
        })
    }

    function cS(s) {
        return s.toLowerCase().replace(/['" \.:?\s]/g, '');
    }

    function watchChange(targetNode) {
        let isChanged = false;

        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    isChanged = true;
                }
            });
        });

        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(targetNode, config);

        return new Promise(resolve => {
            setTimeout(() => {
                observer.disconnect();
                resolve(isChanged);
            }, 1000);
        });
    }
    
    function fabq(i, q) {
        if (i >= 0 && i < extAnubis.length) {
            let o = extAnubis[i];
            let cQ = cS(q);
    
            for (let k in o) {
                if (o.hasOwnProperty(k)) {
                    let cK = cS(k);
                    if (cK === cQ) {
                        return o[k];
                    }
                }
            }
            return null;
        } else {
            return null;
        }
    }

    async function runApp() {
        console.log('start app');
        const $root = document.querySelectorAll('form>div:nth-child(2)>div>div[role="list"]>div');
        $root.forEach(async function(el,i) {
            // console.log(el);
            
            // return
            const param = JSON.parse('['+ el.querySelector('div').dataset.params.replace('%.@.', ''))[0];
            switch(param[3]) {
                case 0:
                case 1: {
                    const a = fabq(extAnubisCount, param[1]);
                    var event = new Event('input', { bubbles: true });
                    el.querySelector('input').value = a;
                    el.querySelector('input').dispatchEvent(event);
                }
                break;
                case 2: {
                    const a = fabq(extAnubisCount, param[1]);
                    el.querySelectorAll('[role="presentation"]>div>div').forEach(function (el2) {
                        if (cS(el2.textContent.trim()) === cS(a)) {
                            el2.querySelector('label').click();
                        }
                    })
                }
                break;
                case 3: {
                    const a = fabq(extAnubisCount, param[1]);
                    el.querySelector('[role="listbox"]>div:nth-child(1)').click();
                    await watchChange(el.querySelector('[role="listbox"]>div:nth-child(2)')).then(() => {
                        el.querySelectorAll('[role="listbox"]>div:nth-child(2)>div[data-value]').forEach(async function (el2) {
                            if (cS(el2.dataset.value) === cS(a)) {
                                el2.click();
                                await watchChange(el);
                            }
                        })
                    })
                }
                break;
                case 4: {
                    const a = fabq(extAnubisCount, param[1]);
                    el.querySelectorAll('[role="list"]>div').forEach(function (el2) {
                        if (cS(el2.textContent.trim()) === cS(a)) {
                            el2.querySelector('label').click();
                        }
                    })
                }
                break;
                case 5: {
                    const a = fabq(extAnubisCount, param[1]);
                    el.querySelectorAll('[role="radiogroup"] [role="radiogroup"]>label').forEach(function (el2) {
                        if (cS(el2.textContent) === cS(a)) {
                            el2.click();
                        }
                    })
                }
                break;
            }            

            if ($root.length - 1 === i) {
                if (extAnubis.length !== extAnubisCount) {
                    await uC();
                } else {
                    await setStorage('extAnubisStatusBtn', {
                        btnStart: true,
                        btnStop: false,
                        btnSetting: true,
                    })
                    await setStorage('extAnubisCount', 0);
                }
                var intrv = setInterval(async function () {
                    if (document.querySelector('[role="status"]').textContent.includes('saved')) {
                        clearInterval(intrv);
                        document.querySelector('[role="button"][aria-label="Submit"]').click();
                        return;
                    }
                }, 400);
            }
        })
    }

    console.log('Content script loaded!');
    await getData();
    if (window.location.pathname.includes('formResponse')) {
        window.location.reload();
    } else {
        await getStorage('extAnubisStatusBtn').then(async (result) => {
            if (!result.btnStart) {
                await runApp();
            }
        });
    }
})();
