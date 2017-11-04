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

/*

Settings Example

{
    "logPath": {
        "display": "I:\\Access Services\\OnePunch\\OnePunchAppData",
        "primary": "i:\\access services\\onepunch\\onepunchappdata",
        "secondary": "i:\\library\\access services\\onepunch\\onepunchappdata",
        "tertiary": "\\\\fs9.american.edu\\shared\\library\\access services\\onepunch\\onepunchappdata"
    },
    "deskName": "lowerlevel",
    "hotKey": "Ctrl+F9",
    "logStrategy": "network",
    "reminders": "false",
    "initialized": true
}

*/
