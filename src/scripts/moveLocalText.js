const fs = require('fs');
const path = require('path');
const SettingsScript = require('./settings_script')
const WindowsNotifications = require("./windowsNotifications");

module.exports = {
    moveText: function () {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting().then(function (returnedSettings) {
                const logPath = returnedSettings.logPath.primary;
                const secondaryLogPath = returnedSettings.logPath.secondary;
                const primary = logPath + "\\op_log.txt";
                const secondary = secondaryLogPath + "\\op_log.txt";
                SettingsScript.getSetting('localLogs').then(function (localLogs) {
                    if (localLogs) {
                        for (var i = 0, len = localLogs.length; i < len; i++) {
                            let logText = localLogs[i];
                            fs.writeFile(
                                primary,
                                logText, {
                                    encoding: "UTF-8",
                                    flag: "a"
                                },
                                function (err) {
                                    if (err) {
                                        fs.writeFile(
                                            secondary,
                                            logText, {
                                                encoding: "UTF-8",
                                                flag: "a"
                                            },
                                            function (err) {
                                                if (err) {
                                                    resolve(false);
                                                } else {
                                                    if (i = len - 1) {
                                                        SettingsScript.deleteSetting('localLogs').then(function (remainingSettings) {
                                                            resolve(len);
                                                        });
                                                    }
                                                }
                                            });
                                    } else {
                                        if (i = len - 1) {
                                            SettingsScript.deleteSetting('localLogs').then(function (remainingSettings) {
                                                resolve(len);
                                            });
                                        }
                                    }
                                });
                        }
                    } else {
                        resolve(0);
                    }
                });
            });
        });
    }
}
