const SettingsScript = require('./settings_script');
const NetworkStrategy = require('./networkStrategy');
const GoogleStrategy = require('./googleStrategy');
const OfficeStrategy = require('./officeStrategy');


module.exports = {

    getLogLocations: function () {
        return new Promise(function (resolve, reject) {
            if (returnedSettings.logStrategy === "network") {
                NetworkStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            } else if (returnedSettings.logStrategy === "google") {
                GoogleStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            } else if (returnedSettings.logStrategy === "office") {
                OfficeStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            }

        });
    }
}
