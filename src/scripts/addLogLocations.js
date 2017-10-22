module.exports = {

    addLogLocations: function (folderLocation) {
        return new Promise(function (resolve, reject) {
            const logPath = {};
            logPath.primary = folderLocation;
            if (logPath.primary.indexOf("I:\\Library\\") > -1 || logPath.primary.indexOf("I:\\library\\") > -1) {
                logPath.secondary = logPath.primary.slice(0, 3) + logPath.primary.slice(11);
            } else {
                logPath.secondary = logPath.primary.slice(0, 2) + "\\Library" + logPath.primary.slice(2);
            }
            resolve(logPath);
        });
    }

}
