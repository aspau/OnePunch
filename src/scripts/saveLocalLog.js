const SettingsScript = require('./settings_script');

module.exports = {
    saveLocalLog: function (settingsLogObject) {
        return new Promise(function (resolve, reject) {
            if (settingsLogObject.localLogs) {
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
