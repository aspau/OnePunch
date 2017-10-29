const fs = require('fs');
const SettingsScript = require('./settings_script')
const self = module.exports = {
    parseFileToObjects: function (startDate, endDate, showDetailByDesk, showDetailByHour) {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting().then(function (returnedSettings) {
                const jsStartDate = new Date(startDate);
                const jsEndDate = new Date(endDate);
                const offsetMs = jsEndDate.getTime() + (1000 * 60 * 60 * 24);
                jsEndDate.setTime(offsetMs);
                const logPath = returnedSettings.logPath.primary;
                const secondaryLogPath = returnedSettings.logPath.secondary;
                const tertiaryLogPath = returnedSettings.logPath.tertiary;
                const primary = logPath + "\\op_log.txt";
                const secondary = secondaryLogPath + "\\op_log.txt";
                const tertiary = tertiaryLogPath + "\\op_log.txt";
                let objectArray = [];
                let logObj = {};
                fs.readFile(primary, "utf8", (err, data) => {
                    if (err) {
                        fs.readFile(secondary, "utf8", (err, data) => {
                            if (err) {
                                fs.readFile(tertiary, "utf8", (err, data) => {
                                    if (err) {
                                        console.log(err)
                                        resolve(false);
                                    } else {
                                        const logArray = data.split("\n");
                                        for (i = 0; i < logArray.length - 1; i++) {
                                            logEntryArray = logArray[i].split(",");
                                            logObj = {};
                                            logObj.day = logEntryArray[0];
                                            logObj.date = logEntryArray[1];
                                            logObj.time = logEntryArray[2];
                                            logObj.desk = logEntryArray[3];
                                            logDateTimeString = logEntryArray[1] + " " + logEntryArray[2];
                                            logObj.jsDate = new Date(logDateTimeString);
                                            logObj.hour = logObj.jsDate.getHours();
                                            logObj.count = 1;
                                            sortString = self.sortObj(logObj.jsDate, logObj.desk, showDetailByDesk, showDetailByHour);
                                            logObj.sortString = sortString;
                                            if (logObj.jsDate > jsStartDate && logObj.jsDate < jsEndDate) {
                                                objectArray.push(logObj);
                                            }
                                            if (i == logArray.length - 2) {
                                                objectArray.sort(function (a, b) {
                                                    return a.sortString - b.sortString;
                                                });
                                                resolve(objectArray);
                                            }
                                        }
                                    }
                                });
                            } else {
                                const logArray = data.split("\n");
                                for (i = 0; i < logArray.length - 1; i++) {
                                    logEntryArray = logArray[i].split(",");
                                    logObj = {};
                                    logObj.day = logEntryArray[0];
                                    logObj.date = logEntryArray[1];
                                    logObj.time = logEntryArray[2];
                                    logObj.desk = logEntryArray[3];
                                    logDateTimeString = logEntryArray[1] + " " + logEntryArray[2];
                                    logObj.jsDate = new Date(logDateTimeString);
                                    logObj.hour = logObj.jsDate.getHours();
                                    logObj.count = 1;
                                    sortString = self.sortObj(logObj.jsDate, logObj.desk, showDetailByDesk, showDetailByHour);
                                    logObj.sortString = sortString;
                                    if (logObj.jsDate > jsStartDate && logObj.jsDate < jsEndDate) {
                                        objectArray.push(logObj);
                                    }
                                    if (i == logArray.length - 2) {
                                        objectArray.sort(function (a, b) {
                                            return a.sortString - b.sortString;
                                        });
                                        resolve(objectArray);
                                    }
                                }
                            }
                        });
                    } else {
                        const logArray = data.split("\n");
                        for (i = 0; i < logArray.length - 1; i++) {
                            logEntryArray = logArray[i].split(",");
                            logObj = {};
                            logObj.day = logEntryArray[0];
                            logObj.date = logEntryArray[1];
                            logObj.time = logEntryArray[2];
                            logObj.desk = logEntryArray[3];
                            logDateTimeString = logEntryArray[1] + " " + logEntryArray[2];
                            logObj.jsDate = new Date(logDateTimeString);
                            logObj.hour = logObj.jsDate.getHours();
                            logObj.count = 1;
                            sortString = self.sortObj(logObj.jsDate, logObj.desk, showDetailByDesk, showDetailByHour);
                            logObj.sortString = sortString;
                            if (logObj.jsDate > jsStartDate && logObj.jsDate < jsEndDate) {
                                objectArray.push(logObj);
                            }
                            if (i == logArray.length - 2) {
                                objectArray.sort(function (a, b) {
                                    if (a.sortString > b.sortString) {
                                        return 1;
                                    } else if (a.sortString < b.sortString) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                });

                                resolve(objectArray);
                            }
                        }
                    }
                });
            });
        });
    },
    processObjectsToTotals: function (objectArray, showDetailByDesk, showDetailByHour) {
        return new Promise(function (resolve, reject) {
            let totalsArray = [];
            totalsArray.push(objectArray[0]);
            let totalsArrayIndex = 0;
            for (i = 1; i < objectArray.length; i++) {
                if (showDetailByDesk) {
                    if (showDetailByHour) {
                        if (objectArray[i].date == objectArray[i - 1].date && objectArray[i].hour == objectArray[i - 1].hour && objectArray[i].desk == objectArray[i - 1].desk) {
                            totalsArray[totalsArrayIndex].count += 1;
                        } else {
                            totalsArray.push(objectArray[i]);
                            totalsArrayIndex += 1;
                        }
                        if (i == objectArray.length - 1) {
                            resolve(totalsArray);
                        }
                    } else {
                        if (objectArray[i].date == objectArray[i - 1].date && objectArray[i].desk == objectArray[i - 1].desk) {
                            totalsArray[totalsArrayIndex].count += 1;
                        } else {
                            totalsArray.push(objectArray[i]);
                            totalsArrayIndex += 1;
                        }
                        if (i == objectArray.length - 1) {
                            resolve(totalsArray);
                        }
                    }
                } else {
                    if (showDetailByHour) {
                        if (objectArray[i].date == objectArray[i - 1].date && objectArray[i].hour == objectArray[i - 1].hour) {
                            totalsArray[totalsArrayIndex].count += 1;
                        } else {
                            totalsArray.push(objectArray[i]);
                            totalsArrayIndex += 1;
                        }
                        if (i == objectArray.length - 1) {
                            resolve(totalsArray);
                        }
                    } else {
                        if (objectArray[i].date == objectArray[i - 1].date) {
                            totalsArray[totalsArrayIndex].count += 1;
                        } else {
                            totalsArray.push(objectArray[i]);
                            totalsArrayIndex += 1;
                        }
                        if (i == objectArray.length - 1) {
                            resolve(totalsArray);
                        }
                    }
                }
            }
        });
    },

    writeTotalsToCsv: function (totalsArray, savePath, showDetailByDesk, showDetailByHour, startDate, endDate) {
        return new Promise(function (resolve, reject) {
            const jsStartDate = new Date(startDate);
            const jsEndDate = new Date(endDate);
            if (showDetailByDesk) {
                if (showDetailByHour) {
                    outputString = "Date,Hour,Desk,Count";
                } else {
                    outputString = "Date,Desk,Count";
                }
            } else {
                if (showDetailByHour) {
                    outputString = "Date,Hour,Count";
                } else {
                    outputString = "Date,Count";
                }
            }
            let fullSavePath = savePath + "\\op_report.csv";
            for (i = 0; i < totalsArray.length; i++) {
                if (showDetailByDesk) {
                    if (showDetailByHour) {
                        outputString = outputString + '\r\n' + totalsArray[i].date + ',' + totalsArray[i].hour + ',"' + totalsArray[i].desk + '",' + totalsArray[i].count;
                        if (i == totalsArray.length - 1) {
                            fs.writeFile(
                                fullSavePath,
                                outputString, {
                                    encoding: "UTF-8",
                                    flag: "a"
                                },
                                function (err) {
                                    if (err) {
                                        resolve(false);
                                    } else {
                                        resolve(true);
                                    }
                                });
                        }
                    } else {
                        outputString = outputString + '\r\n' + totalsArray[i].date + ',"' + totalsArray[i].desk + '",' + totalsArray[i].count;
                        if (i == totalsArray.length - 1) {
                            fs.writeFile(
                                fullSavePath,
                                outputString, {
                                    encoding: "UTF-8",
                                    flag: "a"
                                },
                                function (err) {
                                    if (err) {
                                        resolve(false);
                                    } else {
                                        resolve(true);
                                    }
                                });
                        }
                    }
                } else {
                    if (showDetailByHour) {
                        outputString = outputString + "\r\n" + totalsArray[i].date + "," + totalsArray[i].hour + "," + totalsArray[i].count;
                        if (i == totalsArray.length - 1) {
                            fs.writeFile(
                                fullSavePath,
                                outputString, {
                                    encoding: "UTF-8",
                                    flag: "a"
                                },
                                function (err) {
                                    if (err) {
                                        resolve(false);
                                    } else {
                                        resolve(true);
                                    }
                                });
                        }
                    } else {
                        outputString = outputString + "\r\n" + totalsArray[i].date + "," + totalsArray[i].count;
                        if (i == totalsArray.length - 1) {
                            fs.writeFile(
                                fullSavePath,
                                outputString, {
                                    encoding: "UTF-8",
                                    flag: "a"
                                },
                                function (err) {
                                    if (err) {
                                        resolve(false);
                                    } else {
                                        resolve(true);
                                    }
                                });
                        }
                    }
                }
            }
        });
    },

    generateReport: function (startDate, endDate, showDetailByDesk, showDetailByHour, savePath) {
        return new Promise(function (resolve, reject) {
            self.parseFileToObjects(startDate, endDate, showDetailByDesk, showDetailByHour)
                .then(function (objectArray) {
                    return self.processObjectsToTotals(objectArray, showDetailByDesk, showDetailByHour)
                        .then(function (totalsArray) {
                            return self.writeTotalsToCsv(totalsArray, savePath, showDetailByDesk, showDetailByHour, startDate, endDate);
                        }).then(function (reportingComplete) {
                            resolve(reportingComplete);
                        }).catch(function (error) {
                            console.log("Failed!", error);
                        });
                });
        });
    },

    sortObj: function (jsDate, deskName, showDetailByDesk, showDetailByHour) {
        let objHour = jsDate.getHours();
        let objDate = jsDate.getDate();
        let objMonth = jsDate.getMonth() + 1;
        let objYear = jsDate.getFullYear();
        let stringHour = ('0' + objHour).slice(-2);
        let stringMonth = ('0' + objMonth).slice(-2);
        let stringDate = ('0' + objDate).slice(-2);
        let sortString;
        zeroString = "000000000000000";
        if (showDetailByDesk) {
            sortString = objYear + stringMonth + stringDate;
            deskDiff = 15 - deskName.length;
            deskString = zeroString.substr(0, deskDiff) + deskName
            if (showDetailByHour) {
                sortString = sortString + stringHour + deskString;
                return sortString;
            } else {
                sortString = sortString + deskString;
                return sortString;
            }
        } else {
            sortString = jsDate;
            return sortString;
        }
    },

}
