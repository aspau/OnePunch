const settings = require('electron-settings');

// Originally there was a different save method but now these are essentially just using the electron-settings functions
// I've left them here in case there's a future change -- although the inneficiency of calling a function that
// essentially just calls another function might suggest a change

module.exports = {
    getSetting: function (settingsKey) {
        return new Promise(function (resolve, reject) {
            if (settingsKey) {
                const returnedSetting = settings.get(settingsKey);
                resolve(returnedSetting);
            } else {
                const returnedSetting = settings.getAll();
                resolve(returnedSetting);
            }
        });
    },
    saveSetting: function (settingKey, settingsObj) {
        return new Promise(function (resolve, reject) {
            settings.set(settingKey, settingsObj);
            resolve(true);
        });
    },
    deleteSetting: function (settingsKey) {
        return new Promise(function (resolve, reject) {
            if (settingsKey) {
                settings.delete(settingsKey);
                resolve(true);
            } else {
                settings.deleteAll();
                resolve(true);
            }
        });
    }

}


