const fs = require('fs');
const path = require('path');
const WindowsNotifications = require("./windowsNotifications");
const SettingsScript = require('./settings_script')
const localLogPath = SettingsScript.getSetting('logPath.local');
const local = localLogPath + "\\op_log.txt";

const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

module.exports = {
    logText: function (deskName, logPath, secondaryLogPath) {
        const current = new Date();
        const currentMonth = current.getMonth() + 1;
        const currentDay = current.getDay();
        const currentYear = current.getFullYear();
        const currentHour = current.getHours();
        const currentMinute = current.getMinutes();
        let currentMinuteString = "" + currentMinute;
        if (currentMinuteString.length < 2) {
            currentMinuteString = "0" + currentMinuteString;
        }
        const currentWeekday = weekday[currentDay];
        const logText = currentWeekday + "," + currentMonth + "/" + currentDay + "/" + currentYear + "," + currentHour + ":" + currentMinuteString + "," + deskName + '\r\n';
        const primary = logPath + "\\op_log.txt";
        const secondary = secondaryLogPath + "\\op_log.txt";
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
                                fs.writeFile(
                                    local,
                                    logText, {
                                        encoding: "UTF-8",
                                        flag: "a"
                                    },
                                    function (err) {
                                        if (err) {
                                            WindowsNotifications.notify("Error!", "OnePunch not logged!")
                                            ret
                                        } else {
                                            WindowsNotifications.notify("Logged!", "Logged to local file!")
                                            return logText;
                                        }
                                    });
                            } else {
                                WindowsNotifications.notify("Logged!", "Logged to shared drive!")
                                return logText;
                            }
                        });
                } else {
                    WindowsNotifications.notify("Logged!", "Logged to shared file")
                    return logText;
                }
            });
    }
}
