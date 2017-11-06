const SettingsScript = require('./settings_script');
const NetworkStrategy = require('./networkStrategy');
const GoogleStrategy = require('./googleStrategy');
const OfficeStrategy = require('./officeStrategy');



function generateLogObject(returnedSettings) {
    return new Promise(function (resolve, reject) {
        const deskName = returnedSettings.deskName;
        const weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        const current = new Date();
        const currentMonth = current.getMonth() + 1;
        const currentDate = current.getDate();
        const currentDay = current.getDay();
        const currentYear = current.getFullYear();
        const currentHour = current.getHours();
        const currentMinute = current.getMinutes();
        let currentMinuteString = "" + currentMinute;
        if (currentMinuteString.length < 2) {
            currentMinuteString = "0" + currentMinuteString;
        }
        let currentDateString = "" + currentDate;
        if (currentDateString.length < 2) {
            currentDateString = "0" + currentDateString;
        }
        const currentWeekday = weekday[currentDay];
        const logObject = {};
        logObject.currentWeekday = currentWeekday;
        logObject.currentMonth = currentMonth;
        logObject.currentDateString = currentDateString;
        logObject.currentYear = currentYear;
        logObject.currentHour = currentHour;
        logObject.currentMinuteString = currentMinuteString;
        logObject.deskName = deskName;
        returnedSettings.logObject = logObject
        resolve(returnedSettings);
    });
}

module.exports = {

    logText: function () {
        return new Promise(function (resolve, reject) {
            SettingsScript.getSetting()
                .then(function (returnedSettings) {
                    return generateLogObject(returnedSettings);
                }).then(function (settingsLogObject) {
                    if (settingsLogObject.logStrategy === "network") {
                        return NetworkStrategy.enterLog(settingsLogObject);
                    } else if (settingsLogObject.logStrategy === "google") {
                        return GoogleStrategy.enterLog(settingsLogObject);
                    } else if (settingsLogObject.logStrategy === "office") {
                        return OfficeStrategy.enterLog(settingsLogObject);
                    }
                }).then(function (logObject) {
                    resolve(logObject);
                }).catch(function (error) {
                    console.log("Failed!", error);
                });
        });
    }
}
