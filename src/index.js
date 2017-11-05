// Load library
const LogText = require("./scripts/logText");
const MoveLocalText = require("./scripts/moveLocalText");
const Reports = require("./scripts/reporting");
const SettingsScript = require("./scripts/settings_script");
const GetLogLocations = require("./scripts/getLogLocations");
const FileDialog = require("./scripts/getFileDialog");
const Pikaday = require("./scripts/pikaday");
const WindowsNotifications = require("./scripts/windowsNotifications");
const NetworkStrategy = require('./scripts/networkStrategy');
const GoogleStrategy = require('./scripts/googleStrategy');
const OfficeStrategy = require('./scripts/officeStrategy');

const {
    globalShortcut,
    dialog
} = require('electron').remote;

const {
    ipcRenderer,
    remote
} = require('electron');
var main = remote.require("./main.js");
const path = require('path');
const iconpath = path.join(__dirname, '/images/owl_ico_16.png');
const warnIconPath = path.join(__dirname, '/images/exclamation_mark_64.png');

// Function to add HotKey. Will be called after data loaded

function setHotKey(hotKey) {
    globalShortcut.register(hotKey, () => {
        LogText.logText();
    });
}

// hide all but home tab

document.querySelectorAll(".tabControl").forEach(function (tabCtrl) {
    tabCtrl.addEventListener("click", function () {
        document.querySelectorAll(".tabControl").forEach(function (ctrls) {
            ctrls.classList.remove("active");
        });
        this.classList.add("active");
        let tabName = this.value;
        document.querySelectorAll(".tabContent").forEach(function (tabCnt) {
            if (tabCnt.id === tabName) {
                tabCnt.style.display = "block";
            } else {
                tabCnt.style.display = "none";
            }
        });
    });
});

// load data and change settings tab to match current settings

SettingsScript.getSetting().then(function (returnedSettings) {
    const hotKey = returnedSettings.hotKey;
    const deskName = returnedSettings.deskName;
    const reminders = returnedSettings.reminders;
    const logStrategy = returnedSettings.logStrategy;
    setHotKey(hotKey);
    document.getElementById("deskPicker").value = deskName;
    document.querySelectorAll('input[name="hotKey"]').forEach(function (radioBtn) {
        if (radioBtn.value === hotKey) {
            radioBtn.checked = true;;
        }
    });
    document.querySelectorAll('input[name="reminders"]').forEach(function (radioBtn) {
        if (radioBtn.value === reminders) {
            radioBtn.checked = true;;
        }
    });
    document.getElementById("currentHotKey").value = hotKey;
    const logPath = returnedSettings.logPath.display;
    const logPathValue = returnedSettings.logPath.primary
    document.getElementById("logPath").value = logPathValue;
    document.getElementById("logStrategy").value = logStrategy;
    document.getElementById('logFolderName').textContent = logPath;
    MoveLocalText.moveText().then(function (logsMoved) {
        if (logsMoved !== false) {
            if (logsMoved > 0) {
                let notifyMessage = "Moved " + logsMoved + " logs from local storage to shared file";
                WindowsNotifications.notify("Update!", notifyMessage, "owl_ico_64.png", 3500);
            }
        } else {
            WindowsNotifications.notify("Cannot connect!", "Logs will save locally until connected to network drive", "exclamation_mark_64.png", 3500);
        }
    });
});


document.getElementById("logBtn").addEventListener("click", function () {
    LogText.logText();
});
document.getElementById("checkTotalsBtn").addEventListener("click", function () {
    ipcRenderer.send('getCurrentCount');
});

document.getElementById("moveLocalBtn").addEventListener("click", function () {
    MoveLocalText.moveText().then(function (logsMoved) {
        if (logsMoved !== false) {
            if (logsMoved > 0) {
                let notifyMessage = "Moved " + logsMoved + " logs from local storage to shared file";
                WindowsNotifications.notify("Update!", notifyMessage, "owl_ico_64.png", 3500);
            } else {
                let notifyMessage = "No local logs to move";
                WindowsNotifications.notify("Update!", notifyMessage, "owl_ico_64.png", 3500);
            }
        } else {
            WindowsNotifications.notify("Cannot connect!", "Logs will save locally until connected to network drive", "exclamation_mark_64.png", 3500);
        }
    });
});
document.getElementById("generateReportBtn").addEventListener("click", function () {
    let showDetailByDesk = document.getElementById("deskCheck").checked;
    let showDetailByHour = document.getElementById("hourCheck").checked;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let savePath = document.getElementById("savePath").value;
    if (startDate != "" && endDate != "" && savePath != "") {
        Reports.generateReport(startDate, endDate, showDetailByDesk, showDetailByHour, savePath).then(function (reportingComplete) {
            if (reportingComplete) {
                dialog.showMessageBox({
                    message: "Report saved!",
                    buttons: ["OK"],
                    type: "info",
                    icon: iconpath,
                    title: "Saved"
                });
            } else {
                dialog.showMessageBox({
                    message: "There was an error generating your report",
                    buttons: ["OK"],
                    type: "info",
                    icon: warnIconPath,
                    title: "Error"
                });
            }
        });
    } else {
        dialog.showMessageBox({
            message: "Please choose report parameters",
            buttons: ["OK"],
            type: "info",
            icon: warnIconPath,
            title: "Alert"
        });
    }
});

var startPicker = new Pikaday({
    field: document.getElementById('startDate'),
    format: 'M/D/YYYY',
    toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${month}/${day}/${year}`;
    },
    parse(dateString, format) {
        // dateString is the result of `toString` method
        let parts = dateString.split('/');
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1] - 1, 10);
        let year = parseInt(parts[1], 10);
        return new Date(year, month, day);
    }
});

var endPicker = new Pikaday({
    field: document.getElementById('endDate'),
    format: 'M/D/YYYY',
    toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${month}/${day}/${year}`;
    },
    parse(dateString, format) {
        // dateString is the result of `toString` method
        let parts = dateString.split('/');
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1] - 1, 10);
        let year = parseInt(parts[1], 10);
        return new Date(year, month, day);
    }
});

// add listeners to page elements


// -- change auth flow stuff starts here with the functionality of new buttons

document.getElementById("networkPicker").addEventListener("click", function () {
    FileDialog.getFolder().then(function (chosenDir) {
        document.getElementById('logFolderName').textContent = chosenDir;
        document.getElementById("logPath").value = chosenDir;
        document.getElementById("logStrategy").value = "network";
    });
});

document.getElementById("googlePicker").addEventListener("click", function () {
    //do whatever is needed to switch to using google
});

document.getElementById("officePicker").addEventListener("click", function () {
    //do whatever is needed to switch to using office
});

document.getElementById("savePicker").addEventListener("click", function () {
    FileDialog.getFolder().then(function (chosenDir) {
        document.getElementById('saveFolderName').textContent = chosenDir;
        document.getElementById("savePath").value = chosenDir;
    });
});

document.getElementById("saveBtn").addEventListener("click", function () {
    let deskNameEntry = document.getElementById("deskPicker").value;
    let currentHotKey = document.getElementById("currentHotKey").value;
    let hotKeyChoice = document.querySelector('input[name="hotKey"]:checked').value;
    let remindersChoice = document.querySelector('input[name="reminders"]:checked').value;
    document.getElementById("currentHotKey").value = hotKeyChoice;
    let chosenDir = document.getElementById("logPath").value;
    let logStrategy = document.getElementById("logStrategy").value;
    let settingsObj = {};
    if (deskNameEntry != "" && chosenDir != "") {
        GetLogLocations.getLogLocations(chosenDir, logStrategy).then(function (logPath) {
            SettingsScript.saveSetting('logPath', logPath)
                .then(function (settingSaved) {
                    return SettingsScript.saveSetting('deskName', deskNameEntry);
                }).then(function (settingSaved) {
                    return SettingsScript.saveSetting('hotKey', hotKeyChoice);
                }).then(function (settingSaved) {
                    return SettingsScript.saveSetting('logStrategy', logStrategy);
                }).then(function (settingSaved) {
                    // ipcRenderer.send('remindersChanged', remindersChoice);
                    // return SettingsScript.saveSetting('reminders', remindersChoice);
                    return SettingsScript.saveSetting('reminders', remindersChoice);
                }).then(function (settingSaved) {
                    ipcRenderer.send('remindersChanged');
                }).then(function (settingSaved) {
                    globalShortcut.unregister(currentHotKey);
                    setHotKey(hotKeyChoice);
                }).then(function (settingSaved) {
                    dialog.showMessageBox({
                        message: "Settings saved!",
                        buttons: ["OK"],
                        type: "info",
                        icon: iconpath,
                        title: "Saved"
                    });
                }).catch(function (error) {
                    console.log("Failed!", error);
                });
        });
    } else {
        dialog.showMessageBox({
            message: "Please choose your settings",
            buttons: ["OK"],
            type: "info",
            icon: warnIconPath,
            title: "Alert"
        });
    }
});


ipcRenderer.on('reminderNotify', (event, arg) => {
    if (arg !== false) {
        let notificationTitle = "You've helped " + arg + " people today!";
        WindowsNotifications.notify(notificationTitle, "Keep on punching!", "owl_ico_64.png", 2000)
    } else {
        WindowsNotifications.notify("Cannot connect!", "Please connect to network drive", "exclamation_mark_64.png", 3500);
    }

});
