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

// settings file example
/*{
    "logPath": {
        "primary": "I:\\Access Services\\OnePunch\\OnePunchTesting",
        "secondary": "I:\\Library\\Access Services\\OnePunch\\OnePunchTesting",
        "local": "C:\\Users\\circdesk\\Desktop\\One Punch Local"
    },
    "deskName": "liam",
    "hotKey": "Ctrl+Alt+F9",
    "initialized": true,
    "localLogs": ["Sun,10/22/2017,10:56,liam\r\n", "Sun,10/22/2017,10:57,liam\r\n", "Sun,10/22/2017,10:57,liam\r\n", "Sun,10/22/2017,10:58,liam\r\n", "Sun,10/22/2017,10:58,liam\r\n", "Sun,10/22/2017,10:59,liam\r\n", "Sun,10/22/2017,11:03,liam\r\n", "Sun,10/22/2017,11:04,liam\r\n", "Sun,10/22/2017,11:05,liam\r\n", "Sun,10/22/2017,11:05,liam\r\n", "Sun,10/22/2017,11:07,liam\r\n", "Sun,10/22/2017,11:07,liam\r\n", "Sun,10/22/2017,11:08,liam\r\n"]
}*/
