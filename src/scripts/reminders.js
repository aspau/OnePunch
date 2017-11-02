const NetworkStrategy = require('./networkStrategy');
const GoogleStrategy = require('./googleStrategy');
const OfficeStrategy = require('./officeStrategy');


module.exports = {

    getDailyPunches: function (returnedSettings) {
        return new Promise(function (resolve, reject) {
            if (returnedSettings.logStrategy === "network") {
                NetworkStrategy.getDailyTotal(returnedSettings).then(function (dailyPunchCount) {
                    resolve(dailyPunchCount);
                });
            } else if (returnedSettings.logStrategy === "google") {
                GoogleStrategy.getDailyTotal(returnedSettings).then(function (dailyPunchCount) {
                    resolve(dailyPunchCount);
                });
            } else if (returnedSettings.logStrategy === "office") {
                OfficeStrategy.getDailyTotal(returnedSettings).then(function (dailyPunchCount) {
                    resolve(logPath);
                });
            }

        });
    }
}
