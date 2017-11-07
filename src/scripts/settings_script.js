const settings = require('electron-settings');

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


