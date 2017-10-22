// Load library
const SettingsScript = require("./scripts/settings_script");
const AddLogLocations = require("./scripts/addLogLocations");
const FileDialog = require("./scripts/getFileDialog");

// add listeners to page elements

document.getElementById("logPicker").addEventListener("click", function () {
    FileDialog.getFolder().then(function (chosenDir) {
        document.getElementById('logFolderName').textContent = chosenDir;
        document.getElementById("logPath").value = chosenDir;
    });
});

document.getElementById("saveBtn").addEventListener("click", function () {
    let deskNameEntry = document.getElementById("deskPicker").value;
    let hotKeyChoice = document.querySelector('input[name="hotKey"]:checked').value;
    let chosenDir = document.getElementById("logPath").value;
    let settingsObj = {};
    AddLogLocations.addLogLocations(chosenDir).then(function (logPath) {
        SettingsScript.saveSetting('logPath', logPath)
            .then(function (settingSaved) {
                return SettingsScript.saveSetting('deskName', deskNameEntry);
            }).then(function (settingSaved) {
                return SettingsScript.saveSetting('hotKey', hotKeyChoice);
            }).then(function (settingSaved) {
                return SettingsScript.saveSetting('initialized', true);
            }).catch(function (error) {
                console.log("Failed!", error);
            });
    });
});
