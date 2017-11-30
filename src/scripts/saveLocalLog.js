const SettingsScript = require('./settings_script');

// when there's no connection logs are saved as an array of objects in the app settings

module.exports = {
    saveLocalLog: function (settingsLogObject) {
        return new Promise(function (resolve, reject) {
            if (settingsLogObject.localLogs) {
                let localLogs = settingsLogObject.localLogs;
                localLogs.push(settingsLogObject.logObject);
                SettingsScript.saveSetting('localLogs', localLogs);
                resolve(settingsLogObject.logObject);
            } else {
                localLogs = [];
                localLogs.push(settingsLogObject.logObject);
                SettingsScript.saveSetting('localLogs', localLogs);
                resolve(settingsLogObject.logObject);
            }
        });
    }

}
