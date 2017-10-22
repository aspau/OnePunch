const fs = require('fs');
const SettingsScript = require('./settings_script')

//"Sun,10/22/2017,12:52,liam

const self = module.exports = {
    parseFileToObjects: function (startDate, endDate) {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting().then(function (returnedSettings) {
                const jsStartDate = new Date(startDate);
                const jsEndDate = new Date(endDate);
                const offsetMs = jsEndDate.getTime() + (1000 * 60 * 60 * 24);
                jsEndDate.setTime(offsetMs);
                const logPath = returnedSettings.logPath.primary;
                const secondaryLogPath = returnedSettings.logPath.secondary;
                const primary = logPath + "\\op_log.txt";
                const secondary = secondaryLogPath + "\\op_log.txt";
                let objectArray = [];
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
                                    logObj.day = logEntryArray[0];
                                    logObj.date = logEntryArray[1];
                                    logObj.time = logEntryArray[2];
                                    logObj.desk = logEntryArray[3];
                                    logDateTimeString = logEntryArray[1] + " " + logEntryArray[2];
                                    logObj.jsDate = new Date(logDateTimeString);
                                    logObj.hour = logObj.jsDate.getHours();
                                    if (logObj.jsDate > jsStartDate && logObj.jsDate < jsEndDate) {
                                        objectArray.push(logObj);
                                    }
                                    if (i == logArray.length - 2) {
                                        objectArray.sort(function (a, b) {
                                            return a.jsDate - b.jsDate;
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
                            if (logObj.jsDate > jsStartDate && logObj.jsDate < jsEndDate) {
                                objectArray.push(logObj);
                            }
                            if (i == logArray.length - 2) {
                                objectArray.sort(function (a, b) {
                                    return a.jsDate - b.jsDate;
                                });
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
            let totalsArray = [];
            totalsArray.push(objectArray[0]);
            let totalsArrayIndex = 0;
            for (i = 1; i < objectArray.length; i++) {
                if (showDetailByDesk) {
                    if (showDetailbyHour) {
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
                    if (showDetailbyHour) {
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
    writeTotalsToCsv: function (totalsArray, savePath, showDetailByDesk, showDetailByHour) {
        return new Promise(function (resolve, reject) {
            console.log(totalsArray);
            if (showDetailByDesk) {
                if (showDetailByHour) {
                    headerRow = "Date, Hour, Desk, Count\r\n";
                } else {
                    headerRow = "Date, Desk, Count\r\n";
                }
            } else {
                if (showDetailByHour) {
                    headerRow = "Date, Hour, Count\r\n";
                } else {
                    headerRow = "Date, Count\r\n";
                }
            }
            const fullSavePath = savePath + "\\op_report.csv";
            console.log(fullSavePath);
            console.log(headerRow);
            fs.writeFile(
                fullSavePath,
                headerRow, {
                    encoding: "UTF-8",
                    flag: "a"
                },
                function (err) {
                    if (err) {
                        resolve(false);
                    } else {
                        for (i = 0; i < totalsArray.length; i++) {
                            self.getCsvLine(totalsArray[i], showDetailByDesk, showDetailByHour)
                                .then(function (csvLine) {
                                    return self.writeCsvLine(csvLine, fullSavePath)
                                        .then(function (lineWritten) {
                                            if (i == totalsArray.length - 1) {
                                                resolve(true);
                                            }
                                        });
                                });
                        }
                    }
                });
        });
    },
    generateReport: function (startDate, endDate, showDetailByDesk, showDetailByHour, savePath) {
        return new Promise(function (resolve, reject) {
            self.parseFileToObjects(startDate, endDate)
                .then(function (objectArray) {
                    return self.processObjectsToTotals(objectArray, showDetailByDesk, showDetailByHour)
                        .then(function (totalsArray) {
                            return self.writeTotalsToCsv(totalsArray, savePath, showDetailByDesk, showDetailByHour);
                        }).then(function (reportingComplete) {
                            resolve(reportingComplete);
                        }).catch(function (error) {
                            console.log("Failed!", error);
                        });
                });
        });
    },
    writeCsvLine: function (logText, fullSavePath) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(
                fullSavePath,
                logText, {
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
        });
    },
    getCsvLine: function (totalsArrayI, showDetailByDesk, showDetailByHour) {
        return new Promise(function (resolve, reject) {
            if (showDetailByDesk) {
                if (showDetailByHour) {
                    logText = totalsArrayI.date + "," + totalsArrayI.hour + "," + totalsArrayI.desk + "," + totalsArrayI.count + "\r\n";
                    resolve(logText);
                } else {
                    logText = totalsArrayI.date + "," + totalsArrayI.desk + "," + totalsArrayI.count + "\r\n";
                    resolve(logText);
                }
            } else {
                if (showDetailByHour) {
                    logText = totalsArrayI.date + "," + totalsArrayI.hour + "," + totalsArrayI.count + "\r\n";
                    resolve(logText);
                } else {
                    logText = totalsArrayI.date + "," + totalsArrayI.count + "\r\n";
                    resolve(logText);
                }
            }
        });
    }
}
