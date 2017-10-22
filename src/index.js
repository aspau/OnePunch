// Load library
const LogText = require("./scripts/logText");
const MoveLocalText = require("./scripts/moveLocalText");
const Reports = require("./scripts/reporting");
const SettingsScript = require("./scripts/settings_script");
const AddLogLocations = require("./scripts/addLogLocations");
const FileDialog = require("./scripts/getFileDialog");

const {
    globalShortcut
} = require('electron').remote;

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
    const logPath = returnedSettings.logPath.primary;
    const hotKey = returnedSettings.hotKey;
    const deskName = returnedSettings.deskName;
    setHotKey(hotKey);
    document.getElementById("deskPicker").value = deskName;
    document.getElementById("logPath").value = logPath;
    document.getElementById('logFolderName').textContent = logPath;
    document.querySelectorAll('input[name="hotKey"]').forEach(function (radioBtn) {
        if (radioBtn.value === hotKey) {
            radioBtn.checked = true;;
        }
    });
    document.getElementById("currentHotKey").value = hotKey;
    document.getElementById("logBtn").addEventListener("click", function () {
        LogText.logText();
    });
    document.getElementById("moveLocalBtn").addEventListener("click", function () {
        MoveLocalText.moveText();
    });
    document.getElementById("generateReportBtn").addEventListener("click", function () {
        //Reports.generateReport(startDate, endDate, showDetailByDesk, showDetailbyHour, savePath);
        Reports.generateTestReport(false, false);
    });

    // check for local logs and try moving them to network file
    MoveLocalText.moveText();
});

// add listeners to page elements

document.getElementById("logPicker").addEventListener("click", function () {
    FileDialog.getFolder().then(function (chosenDir) {
        document.getElementById('logFolderName').textContent = chosenDir;
        document.getElementById("logPath").value = chosenDir;
    });
});

document.getElementById("saveBtn").addEventListener("click", function () {
    let deskNameEntry = document.getElementById("deskPicker").value;
    let currentHotKey = document.getElementById("currentHotKey").value;
    let hotKeyChoice = document.querySelector('input[name="hotKey"]:checked').value;
    document.getElementById("currentHotKey").value = hotKeyChoice;
    let chosenDir = document.getElementById("logPath").value;
    let settingsObj = {};
    AddLogLocations.addLogLocations(chosenDir).then(function (logPath) {
        SettingsScript.saveSetting('logPath', logPath)
            .then(function (settingSaved) {
                return SettingsScript.saveSetting('deskName', deskNameEntry);
            }).then(function (settingSaved) {
                return SettingsScript.saveSetting('hotKey', hotKeyChoice);
            }).then(function (settingSaved) {
                globalShortcut.unregister(currentHotKey);
                setHotKey(hotKeyChoice);
            }).catch(function (error) {
                console.log("Failed!", error);
            });
    });
});
