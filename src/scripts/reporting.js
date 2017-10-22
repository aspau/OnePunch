const fs = require('fs');
const SettingsScript = require('./settings_script')

//"Sun,10/22/2017,12:52,liam

const self = module.exports = {
    //parseFileToObjects: function (startDate, endDate) {
    parseFileToObjects: function () {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting().then(function (returnedSettings) {
                const logPath = returnedSettings.logPath.primary;
                const secondaryLogPath = returnedSettings.logPath.secondary;
                const primary = logPath + "\\op_log.txt";
                const secondary = secondaryLogPath + "\\op_log.txt";
                let objectArray = [];
                let logObj = {};
                let logEntry;
                let logEntryArray;
                fs.readFile(primary, "utf8", (err, data) => {
                    if (err) {
                        fs.readFile(secondary, "utf8", (err, data) => {
                            if (err) {
                                console.log(err)
                                resolve(false);
                            } else {
                                const logArray = data.split("\n");
                                for (i = 0; i < logArray.length; i++) {
                                    logEntry = logArray[i];
                                    console.log(logEntry);
                                    logEntryArray = logEntry.split(",");
                                    logObj.day = logEntryArray[0];
                                    logObj.date = logEntryArray[1];
                                    logObj.time = logEntryArray[2];
                                    logObj.desk = logEntryArray[3];
                                    objectArray.push(logObj);
                                    if (i === logArray.length - 1) {
                                        console.log(objectArray);
                                        resolve(objectArray);
                                    }
                                }
                            }
                        });
                    } else {
                        const logArray = data.split("\n");
                        for (i = 0; i < logArray.length; i++) {
                            logEntry = logArray[i];
                            console.log(logEntry);
                            logEntryArray = logEntry.split(",");
                            logObj.day = logEntryArray[0];
                            logObj.date = logEntryArray[1];
                            logObj.time = logEntryArray[2];
                            logObj.desk = logEntryArray[3];
                            objectArray.push(logObj);
                            if (i === logArray.length - 1) {
                                console.log(objectArray);
                                resolve(objectArray);
                            }
                        }
                    }
                });
            });
        });
    },
    processObjectsToTotals: function (objectArray, showDetailByDesk, showDetailbyHour) {
        return new Promise(function (resolve, reject) {
            resolve(totalsArray);
        });
    },
    writeTotalsToCsv: function (totalsArray, savePath) {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    },
    generateReport(startDate, endDate, showDetailByDesk, showDetailbyHour, savePath) {
        return new Promise(function (resolve, reject) {
            self.parseFileToObjects(startDate, endDate)
                .then(function (objectArray) {
                    return self.processObjectsToTotals(objectArray, showDetailByDesk, showDetailbyHour)
                        .then(function (totalsArray) {
                            return self.writeTotalsToCsv(totalsArray, savePath);
                        }).then(function (reportingComplete) {
                            resolve(reportingComplete);
                        }).catch(function (error) {
                            console.log("Failed!", error);
                        });
                });
        });
    }
}
