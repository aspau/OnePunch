const fs = require('fs');
const SettingsScript = require('./settings_script')

const self = module.exports = {

    getDailyPunches: function () {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting().then(function (returnedSettings) {
                const deskName = returnedSettings.deskName;
                const logPath = returnedSettings.logPath.primary;
                const secondaryLogPath = returnedSettings.logPath.secondary;
                const primary = logPath + "\\op_log.txt";
                const secondary = secondaryLogPath + "\\op_log.txt";
                const current = new Date();
                const currentMonth = current.getMonth() + 1;
                const currentDate = current.getDate();
                const currentYear = current.getFullYear();
                let currentDateString = "" + currentDate;
                if (currentDateString.length < 2) {
                    currentDateString = "0" + currentDateString;
                }
                const matchDateString = currentMonth + "/" + currentDateString + "/" + currentYear;
                let punchesCounter = 0;
                let logObj = {};
                fs.readFile(primary, "utf8", (err, data) => {
                    if (err) {
                        fs.readFile(secondary, "utf8", (err, data) => {
                            if (err) {
                                console.log(err)
                                resolve(false);
                            } else {
                                const logArray = data.split("\n");
                                for (i = 0; i < logArray.length - 1; i++) {
                                    logEntryArray = logArray[i].split(",");
                                    logObj = {};
                                    logObj.date = logEntryArray[1];
                                    logObj.desk = logEntryArray[3];
                                    if (logObj.date == matchDateString && logObj.desk == deskName) {
                                        punchesCounter += 1;
                                    }
                                    if (i == logArray.length - 2) {
                                        resolve(punchesCounter);
                                    }
                                }
                            }
                        });
                    } else {
                        const logArray = data.split("\n");
                        for (i = 0; i < logArray.length - 1; i++) {
                            logEntryArray = logArray[i].split(",");
                            logObj = {};
                            logObj.date = logEntryArray[1];
                            logObj.desk = logEntryArray[3];
                            if (logObj.date == matchDateString && logObj.desk == deskName) {
                                punchesCounter += 1;
                            }
                            if (i == logArray.length - 2) {
                                resolve(punchesCounter);
                            }
                        }
                    }
                });
            });
        });
    }
}
