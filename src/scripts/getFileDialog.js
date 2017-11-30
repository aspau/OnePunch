const {
    dialog
} = require('electron').remote

// opens a folder picker. Returns the chosen folder
// note that this is for picking folders and not files

module.exports = {
    getFolder: function () {
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
