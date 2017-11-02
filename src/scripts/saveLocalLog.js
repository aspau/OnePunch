const SettingsScript = require('./settings_script');

module.exports = {
    saveLocalLog: function (settingsLogObject) {
        return new Promise(function (resolve, reject) {
            if (settingsObject.localLogs) {
                localLogs.push(logText);
                SettingsScript.saveSetting('localLogs', localLogs);
                resolve(logObject);
            } else {
                localLogs = [];
                localLogs.push(logText);
                SettingsScript.saveSetting('localLogs', localLogs);
                resolve(logObject);
            }
        });
    }

}
