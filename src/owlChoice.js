const {
    ipcRenderer
} = require('electron');
const SettingsScript = require("./scripts/settings_script");

SettingsScript.getSetting("selectedIcon").then(function(selectedIconId){
    var owlIcons = document.querySelectorAll(".owlIcon");
        for (var i = 0; i < owlIcons.length; i++) {
            if (owlIcons[i].id == selectedIconId) {
                owlIcons[i].classList.add("selectedOwl");
                document.getElementById('selectedOwl').value = selectedIconId;
            }
        }
})

document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("owlIcon")) {
        var selectedIconId = event.target.id;
        var owlIcons = document.querySelectorAll(".owlIcon");
        for (var i = 0; i < owlIcons.length; i++) {
            owlIcons[i].classList.remove("selectedOwl")
        }
        event.target.classList.add("selectedOwl")
        document.getElementById('selectedOwl').value = selectedIconId;
    }
});


document.getElementById("saveBtn").addEventListener("click", function () {
    let selectedIcon = document.getElementById('selectedOwl').value
    SettingsScript.saveSetting('selectedIcon', selectedIcon).then(function (settingSaved) {
        ipcRenderer.send('owlSelected', selectedIcon);
    });
});
