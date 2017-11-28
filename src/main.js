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
const url = require('url');
const path = require('path');
const {
    autoUpdater
} = require("electron-updater");
const SettingsScript = require('./scripts/settings_script');
const Reminders = require('./scripts/reminders');
const os = require('os');
app.preventExit = true;

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
let remindersWindow = null;

let shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
            mainWindow.focus();
        } else {
            mainWindow.focus();
        }
    }
});

if (shouldQuit) {
    app.quit();
    return;
}


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

function createUpdateSummaryWindow() {
    let updateSummary;
    // Create the browser window.
    updateSummary = new BrowserWindow({
        width: 350,
        useContentSize: true,
        resizable: false,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath,
        show: false
    });

    // and load the html of the app.
    updateSummary.loadURL(url.format({
        pathname: path.join(__dirname, '/views/updateSummary.html'),
        protocol: 'file:',
        slashes: true
    }));

    updateSummary.once('ready-to-show', () => {
        updateSummary.show();
        SettingsScript.saveSetting('showUpdateSummary', false);
    });

    // Emitted when the window is closed.
    updateSummary.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        updateSummary = null
    });

    updateSummary.setMenu(null);
}

function createAboutWindow() {
    let aboutWindow;
    // Create the browser window.
    aboutWindow = new BrowserWindow({
        width: 350,
        useContentSize: true,
        resizable: false,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath,
        show: false
    });

    // and load the html of the app.
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/views/about.html'),
        protocol: 'file:',
        slashes: true
    }));

    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });

    // Emitted when the window is closed.
    aboutWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        aboutWindow = null
    });

    aboutWindow.setMenu(null);
}

function createOwlChoiceWindow() {
    // Create the browser window.
    owlChoice = new BrowserWindow({
        useContentSize: true,
        resizable: false,
        center: true,
        maximizable: false,
        fullscreenable: false,
        title: "OnePunch",
        icon: iconpath,
        width: 580,
        height: 750,
        show: false
    });

    // and load the html of the app.
    owlChoice.loadURL(url.format({
        pathname: path.join(__dirname, '/views/owlChoice.html'),
        protocol: 'file:',
        slashes: true
    }));

    owlChoice.once('ready-to-show', () => {
        owlChoice.show();
    });

    // Emitted when the window is closed.
    owlChoice.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        updateSummary = null
    });

    owlChoice.setMenu(null);
}

function createRemindersWindow() {

    if (remindersWindow !== null) {
        remindersWindow.webContents.send('updateCount');
    } else {
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
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 350,
        height: 925,
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
        height: 875,
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
            label: 'How are we doing today?',
            click: function () {
                let osRelease = os.release();
                let osReleaseArray = osRelease.split(".");
                let osReleaseNum = osReleaseArray[2];
                let slimNotifications = false;
                if (osReleaseNum >= 16000 && slimNotifications === true) {
                    createRemindersWindow();
                } else {
                    createNotificationReminder();
                }
            }
                },
        {
            label: 'Open OnePunch',
            click: function () {
                mainWindow.show();
            }
                },
        {
            label: 'Quit',
            click: function () {
                app.isQuiting = true;
                app.preventExit = false;
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

    mainWindow.on('close', (event) => {
        if (app.preventExit) {
            event.preventDefault() // Prevents the window from closing
            event.preventDefault();
            mainWindow.hide();
        }
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
                loopReminders(returnedSettings);
            }
            createSplashScreen();
            createMainWindow()
            autoUpdater.checkForUpdates();
            if (returnedSettings.showUpdateSummary) {
                createUpdateSummaryWindow();
            }
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

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'OnePunch Updates',
        message: 'Updates downloaded, OnePunch will install updates and restart'
    }, () => {
        SettingsScript.saveSetting('showUpdateSummary', true).then(function (returnedSettings) {
            app.preventExit = false;
            setImmediate(() => autoUpdater.quitAndInstall(true, true));
        });

    });
});


function genReminders(returnedSettings) {
    let reminderType = returnedSettings.reminders
    if (reminderType == "popups") {
        createRemindersWindow();
    } else {
        createNotificationReminder();
    }
}

function loopReminders(returnedSettings) {
    let reminderLagMinutes = Math.floor(Math.random() * (80 - 40 + 1) + 40);
    let reminderLagMs = 1000 * 60 * reminderLagMinutes;
    //let reminderLagMinutes = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    //let reminderLagMs = 1000 * reminderLagMinutes;
    remindersTimeout = setTimeout(function () {
        genReminders(returnedSettings);
        loopReminders(returnedSettings);
    }, reminderLagMs);
};

function createNotificationReminder() {
    SettingsScript.getSetting()
        .then(function (returnedSettings) {
            Reminders.getDailyPunches(returnedSettings).then(function (dailyPunchCountObj) {
                dailyPunchCountObj.assumeDisconnected = returnedSettings.assumeDisconnected;
                dailyPunchCountObj.selectedIcon = returnedSettings.selectedIcon;
                mainWindow.webContents.send('reminderNotify', dailyPunchCountObj);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
}

ipcMain.on('settingsComplete', (event, arg) => {
    SettingsScript.getSetting().then(function (returnedSettings) {
        if (returnedSettings.initialized) {
            if (returnedSettings.reminders == "notifications" || returnedSettings.reminders == "popups") {
                loopReminders(returnedSettings);
            }
            createSplashScreen();
            createMainWindow();
            settingsWindow.close();
            autoUpdater.checkForUpdates();
            if (returnedSettings.showUpdateSummary) {
                createUpdateSummaryWindow();
            }
        } else {
            createSettingsWindow();
        }
    });
});

ipcMain.on('remindersChanged', () => {
    SettingsScript.getSetting().then(function (returnedSettings) {
        if (typeof remindersTimeout !== 'undefined') {
            clearTimeout(remindersTimeout);
        }
        let remindersType = returnedSettings.reminders;
        if (remindersType == "notifications" || remindersType == "popups") {
            loopReminders(returnedSettings);
        }
    });
});

ipcMain.on('getCurrentCount', (event) => {
    createRemindersWindow();
});


var showToaster = function (msg) {
    var self = this;
    this.window = new BrowserWindow({
        width: msg.width,
        transparent: false,
        frame: false,
        show: false,
        "skip-taskbar": true,
        "always-on-top": true,
        title: "OnePunch",
        icon: iconpath,
        alwaysOnTop: true
    });
    var timer, height, width;
    var screen = electron.screen;
    var pos = mainWindow.getPosition();
    var display = screen.getDisplayNearestPoint({
        x: pos[0],
        y: pos[1]
    });
    this.window.on('closed', function () {
        try {
            clearTimeout(timer);
            self.window = null;
        } catch (e) {}
    });
    var moveWindow = function (pos, done) {
        try {
            self.window.setPosition(display.workAreaSize.width - width - 4, pos);
        } catch (e) {} finally {
            done();
        }
    };
    var i = 0;
    var slideUp = function (cb) {
        if (i < height) {
            i += Math.round(height / 10);
            timer = setTimeout(function () {
                moveWindow(display.workAreaSize.height - i, function () {
                    if (i === Math.round(height / 10)) { // show after first pos set to avoid flicker.
                        self.window.show();
                    }
                    slideUp(cb);
                });
            }, 1);
        } else {
            cb();
        }
    };
    var htmlFile = 'file:\\\\' + __dirname + '\\views\\toastNotifications.html?';
    htmlFile += htmlFile + 'foo=bar&title=' + encodeURIComponent(msg.title) + '&message=' + encodeURIComponent(msg.message) + "&timeout=" + (msg.timeout) + "&icon=" + (msg.icon);
    this.window.loadURL(htmlFile);
    this.window.webContents.on('did-finish-load', function () {
        if (self.window) {
            width = self.window.getSize()[0];
            height = self.window.getSize()[1];
            slideUp(function () {});
        }
    });
};

ipcMain.on('electron-toaster-message', function (event, msg) {
    showToaster(msg);
});

ipcMain.on('showOwlWindow', function (event) {
    createOwlChoiceWindow();
});

ipcMain.on('showAboutWindow', function (event) {
    createAboutWindow();
});

ipcMain.on('owlSelected', function (event, selectedOwl) {
    owlChoice.close();
    mainWindow.webContents.send('newOwl', selectedOwl);
});

app.setAppUserModelId("com.app.onepunch")
