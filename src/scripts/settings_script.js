const settings = require('electron-settings');

module.exports = {
    getSetting: function (settingsKey) {
        return new Promise(function (resolve, reject) {
            const settingsPath = settings.file();
            console.log(settingsPath);
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
    }

}

// settings file example
/*{
    "logPath": {
        "primary": "C:\\Users\\Liam\\Desktop\\For OnePunch Test Original",
        "secondary": "C:\\Library\\Users\\Liam\\Desktop\\For OnePunch Test Original",
        "local": "C:\\Users\\Liam\\Desktop\\For One Punch Test Local"
    },
    "deskName": "firstfloor",
    "hotKey": "F9",
    "initialized": true
}*/
