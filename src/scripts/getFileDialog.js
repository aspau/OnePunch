const {
    dialog
} = require('electron').remote

module.exports = {
    getFolder: function (settingsKey) {
        return new Promise(function (resolve, reject) {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, function (filePaths) {
                const chosenDir = filePaths[0];
                resolve(chosenDir);
            });
        });
    }
}
