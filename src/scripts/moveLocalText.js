const fs = require('fs');
const path = require('path');
const SettingsScript = require('./settings_script')
const WindowsNotifications = require("./windowsNotifications");

const self = module.exports = {
    moveText: function (logPath, secondaryLogPath) {
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
                                            WindowsNotifications.notify("Cannot connect!", "Logs will save locally until connected to network drive", "exclamation_mark_64.png", 3500);
                                            return;
                                        } else {
                                            if (i = len - 1) {
                                                const notifyMessage = "Moved " + len + " logs from local storage to shared file";
                                                WindowsNotifications.notify("Update!", notifyMessage, "owl_ico_64.png", 3500);
                                                SettingsScript.deleteSetting('localLogs').then(function (remainingSettings) {
                                                    return logText;
                                                });
                                            }
                                        }
                                    });
                            } else {
                                if (i = len - 1) {
                                    const notifyMessage = "Moved " + len + " logs from local storage to shared file";
                                    WindowsNotifications.notify("Update!", notifyMessage, "owl_ico_64.png", 3500);
                                    SettingsScript.deleteSetting('localLogs').then(function (remainingSettings) {
                                        return logText;
                                    });
                                }
                            }
                        });
                }
            } else {
                return;
            }
        });
    }
}
