module.exports = {

    addLogLocations: function (folderLocation) {
        return new Promise(function (resolve, reject) {
            const logPath = {};
            logPath.display = folderLocation;
            logPath.primary = folderLocation.toLowerCase();
            if (logPath.primary.indexOf("i:\\library\\") > -1) {
                logPath.secondary = logPath.primary.slice(0, 3) + logPath.primary.slice(11);
                logPath.tertiary = logPath.primary.replace("i:", "\\\\fs9.american.edu\\shared");
            } else if (logPath.primary.indexOf("\\\\fs") > -1) { //there's fs9 in it
                logPath.secondary = logPath.primary.replace("\\\\fs9.american.edu\\shared", "i:");
                logPath.secondary = logPath.primary.replace("\\\\fs9.american.edu\\shared\\library", "i:");
            } else {
                logPath.secondary = logPath.primary.slice(0, 2) + "\\library" + logPath.primary.slice(2);
                logPath.tertiary = logPath.secondary.replace("i:", "\\\\fs9.american.edu\\shared");
            }
            resolve(logPath);
        });
    }

}


/*

Settings Example

{
    "logPath": {
        "display": "I:\\Access Services\\OnePunch\\OnePunchAppData",
        "primary": "i:\\access services\\onepunch\\onepunchappdata",
        "secondary": "i:\\library\\access services\\onepunch\\onepunchappdata",
        "tertiary": "\\\\fs9.american.edu\\shared\\library\\access services\\onepunch\\onepunchappdata"
    },
    "deskName": "upperlevel",
    "hotKey": "Ctrl+F9",
    "reminders": "false",
    "initialized": true
}

*/
