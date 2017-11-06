const WindowsNotifications = require("./windowsNotifications");
const SaveLocalLog = require("./saveLocalLog");
const SettingsScript = require('./settings_script');

module.exports = {

    getLogLocation: function (folderLocation) {
        return new Promise(function (resolve, reject) {
            resolve(logPath);
        });
    },

    enterLog: function (settingsLogObject) {
        return new Promise(function (resolve, reject) {
            resolve(logObject);
        });
    },

    getDailyTotal: function (returnedSettings) {
        return new Promise(function (resolve, reject) {
            resolve(punchesCounter);
        });
    },

    getReportData: function (startDate, endDate, showDetailByDesk, showDetailByHour, returnedSettings) {
        return new Promise(function (resolve, reject) {
            resolve(objectArray);
        });
    },

    moveLocalText: function (returnedSettings) {
        return new Promise(function (resolve, reject) {
            resolve(len);
        });
    }

}

