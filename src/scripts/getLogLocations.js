const SettingsScript = require('./settings_script');
const NetworkStrategy = require('./networkStrategy');
const GoogleStrategy = require('./googleStrategy');
const OfficeStrategy = require('./officeStrategy');


module.exports = {

    getLogLocations: function(chosenDir, logStrategy) {
        return new Promise(function (resolve, reject) {
            if (logStrategy === "network") {
                NetworkStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            } else if (logStrategy === "google") {
                GoogleStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            } else if (logStrategy === "office") {
                OfficeStrategy.getLogLocation(chosenDir).then(function (logPath) {
                    resolve(logPath);
                });
            }

        });
    }
}
