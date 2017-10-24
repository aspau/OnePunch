//"use strict";
const electron = require("electron");
// Module to control application life.
const app = electron.app;
const {
    dialog,
    Tray,
    Menu,
    globalShortcut,
    fs,
    ipcMain
} = require('electron');
const AutoLaunch = require('auto-launch');
const url = require('url');
const path = require('path');
const SettingsScript = require('./scripts/settings_script');
const Reminders = require('./scripts/reminders');


const appFolder = path.dirname(process.execPath)
const exeName = path.basename(process.execPath)

app.setLoginItemSettings({
  openAtLogin: true,
  args: [
    '--processStart', `"${exeName}"`,
    '--process-start-args', `"--hidden"`
  ]
})

// Module to create native browser window.

const iconpath = path.join(__dirname, '/images/owl_ico_16.png');
const BrowserWindow = electron.BrowserWindow;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createSplashScreen() {
    let splashScreen;
    // Create the browser window.
    splashScreen = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        resizable: false,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath,
        show: false
    });

    // and load the html of the app.
    splashScreen.loadURL(url.format({
        pathname: path.join(__dirname, '/views/splash.html'),
        protocol: 'file:',
        slashes: true
    }));

    splashScreen.once('ready-to-show', () => {
        splashScreen.show()
        setTimeout(function () {
            splashScreen.close();
        }, 1500);
    });

    // Emitted when the window is closed.
    splashScreen.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        splashScreen = null
    });
}

function createRemindersWindow() {
    remindersWindow = new BrowserWindow({
        width: 350,
        height: 475,
        resizable: false,
        show: true,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath
    });
    remindersWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/views/reminder.html'),
        protocol: 'file:',
        slashes: true
    }));
    remindersWindow.once('ready-to-show', () => {
        remindersWindow.show();
    })
    remindersWindow.on('closed', function () {
        remindersWindow = null
    });
    remindersWindow.setMenu(null);
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 350,
        height: 850,
        resizable: false,
        show: true,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath
    });
    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/views/settings.html'),
        protocol: 'file:',
        slashes: true
    }));
    settingsWindow.on('closed', function () {
        settingsWindow = null
    });
    settingsWindow.setMenu(null);
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 800,
        resizable: false,
        show: false,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath
    });
    mainWindow.hide();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/views/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    const appIcon = new Tray(iconpath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Go to OnePunch',
            click: function () {
                mainWindow.show();
            }
                },
        {
            label: 'Quit',
            click: function () {
                app.isQuiting = true;
                app.quit();

            }
                }
            ]);
    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.hide();
    });
    mainWindow.on('show', function () {
        appIcon.setHighlightMode('always')
    });
    appIcon.on('click', function () {
        mainWindow.show();
    });
    appIcon.setContextMenu(contextMenu);
    mainWindow.on('close', function () {
        mainWindow = null
    });
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindow.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    SettingsScript.getSetting().then(function (returnedSettings) {
        if (returnedSettings.initialized) {
            if (returnedSettings.reminders == "notifications" || returnedSettings.reminders == "popups") {
                loopReminders(returnedSettings.reminders);
            }
            createSplashScreen();
            createMainWindow()
        } else {
            createSettingsWindow();
        }
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow();
    }
});


function genReminders(reminderType) {
    if (reminderType == "popups") {
        createRemindersWindow();
    } else if (reminderType == "notifications") {
        Reminders.getDailyPunches().then(function (dailyPunchCount) {
            mainWindow.webContents.send('reminderNotify', dailyPunchCount);
        });
    }
}

function loopReminders(reminderType) {
    let reminderLagMinutes = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    let reminderLagMs = 1000 * reminderLagMinutes;
    remindersTimeout = setTimeout(function () {
        genReminders(reminderType)
        loopReminders(reminderType);
    }, reminderLagMs);
};

ipcMain.on('settingsComplete', (event, arg) => {
    SettingsScript.getSetting().then(function (returnedSettings) {
        if (returnedSettings.initialized) {
            if (returnedSettings.reminders == "notifications" || returnedSettings.reminders == "popups") {
                loopReminders(returnedSettings.reminders);
            }
            createSplashScreen();
            createMainWindow();
            settingsWindow.close();
        } else {
            createSettingsWindow();
        }
    });
});

ipcMain.on('remindersChanged', (event, remindersType) => {
    if (typeof remindersTimeout !== 'undefined') {
        clearTimeout(remindersTimeout);
    }
    if (remindersType == "notifications" || remindersType == "popups") {
        loopReminders(remindersType);
    }
});
