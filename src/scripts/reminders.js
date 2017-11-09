const NetworkStrategy = require('./networkStrategy');
const GoogleStrategy = require('./googleStrategy');
const OfficeStrategy = require('./officeStrategy');
const SettingsScript = require('./settings_script');


module.exports = {

    getDailyPunches: function (returnedSettings) {
        return new Promise(function (resolve, reject) {
            let returnPunchCountObj = {};
            getSharedPunchCount(returnedSettings).then(function (sharedPunchCount) {
                if (!sharedPunchCount) {
                    returnPunchCountObj.sharedPunches = false;
                    if (returnedSettings.localLogs) {
                        let localPunches = returnedSettings.localLogs.length;
                        returnPunchCountObj.punchCount = localPunches;
                        resolve(returnPunchCountObj);
                    } else {
                        let localPunches = 0
                        returnPunchCountObj.punchCount = localPunches;
                        resolve(returnPunchCountObj);
                    }
                } else {
                    returnPunchCountObj.sharedPunches = true;
                    if (returnedSettings.localLogs) {
                        let localPunches = returnedSettings.localLogs.length;
                        returnPunchCountObj.punchCount = localPunches + sharedPunchCount;
                        resolve(returnPunchCountObj);
                    } else {
                        let localPunches = 0
                        returnPunchCountObj.punchCount = localPunches + sharedPunchCount;
                        resolve(returnPunchCountObj);
                    }
                }
            });

        });
    }
}

function getSharedPunchCount(returnedSettings) {
    return new Promise(function (resolve, reject) {
        if (returnedSettings.logStrategy === "network") {
            NetworkStrategy.getDailyTotal(returnedSettings).then(function (sharedPunchCount) {
                resolve(sharedPunchCount);
            });
        } else if (returnedSettings.logStrategy === "google") {
            GoogleStrategy.getDailyTotal(returnedSettings).then(function (sharedPunchCount) {
                resolve(sharedPunchCount);
            });
        } else if (returnedSettings.logStrategy === "office") {
            OfficeStrategy.getDailyTotal(returnedSettings).then(function (sharedPunchCount) {
                resolve(sharedPunchCount);
            });
        }

    });
}
