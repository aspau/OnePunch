const fs = require('fs');
const path = require('path');
const SettingsScript = require('./settings_script')
const localLogPath = SettingsScript.getSetting('logPath.local');
const local = localLogPath + "\\op_log.txt";

const self = module.exports = {
    moveText: function (logPath, secondaryLogPath) {
        const primary = logPath + "\\op_log.txt";
        const secondary = secondaryLogPath + "\\op_log.txt";
        fs.readFile(local, "utf8", function (err, data) {
            if (err) console.log(err);
            if (data) {
                const localLogLen = data.length;
                if (localLogLen > 0) {
                    fs.writeFile(
                        primary,
                        data, {
                            encoding: "UTF-8",
                            flag: "a"
                        },
                        function (err) {
                            if (err) {
                                fs.writeFile(
                                    secondary,
                                    data, {
                                        encoding: "UTF-8",
                                        flag: "a"
                                    },
                                    function (err) {
                                        if (err) {
                                            return;
                                        } else {
                                            self.deleteLocalLog();
                                            return;
                                        }
                                    });
                            } else {
                                self.deleteLocalLog();
                                return;
                            }
                        });
                }
            }
        });
    },
    deleteLocalLog: function () {
        fs.writeFile(
            local,
            "", {
                encoding: "UTF-8"
            },
            function (err) {
                if (err) console.log(err);
                return;
            });
    }
}
