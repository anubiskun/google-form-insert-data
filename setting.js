document.addEventListener("DOMContentLoaded", async function () {
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
    var btnClose = document.getElementById("btnClose");
    var btnSave = document.getElementById('btnSave');

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
                    if (result) {
                        alert('berhasil update database ngab!');
                    }
                });

                window.close();
            };

            reader.readAsText(file);
        } else {
            alert("Upload dulu file csv nya ngab!");
        }
    });

    function xD(data) {
        const rows = data.trim().split('\n');
        const headers = rows[0].split(',');
        return rows.slice(1).map(row => {
            const values = row.split(',');
            let jsonObject = {};
            headers.forEach((header, index) => {
                jsonObject[header.trim()] = values[index].trim();
            });
            return jsonObject;
        });
    }
});
