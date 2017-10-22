//"use strict";
const electron = require("electron");
// Module to control application life.
const app = electron.app;
const {
    dialog,
    Tray,
    Menu,
    globalShortcut,
    fs
} = require('electron');
const AutoLaunch = require('auto-launch');
const url = require('url');
const path = require('path');
const SettingsScript = require('./scripts/settings_script')

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

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 380,
        height: 700,
        //resizable: false,
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
    const settingsIcon = new Tray(iconpath);
    settingsWindow.on('show', function () {
        settingsIcon.setHighlightMode('always')
    });
    settingsWindow.on('closed', function () {
        settingsWindow = null
    });
    //settingsWindow.setMenu(null);
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 380,
        height: 700,
        //resizable: false,
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
    //mainWindow.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    SettingsScript.getSetting("initialized").then(function (appInitialized) {
        if (appInitialized) {
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



/*const onePunchAutoLauncher = new AutoLaunch({
    name: 'OnePunch',
    path: '/Applications/OnePunch.app',
});

onePunchAutoLauncher.isEnabled()
    .then(function (isEnabled) {
        if (isEnabled) {
            return;
        }
        onePunchAutoLauncher.enable();
    })
    .catch(function (err) {
        // handle error
    })


app.on('ready', () => {

    settings.set('name', {
        first: 'Cosmo',
        last: 'Kramer'
    });

    settings.get('name.first');
    // => "Cosmo"

    settings.has('name.middle');
    // => false
});*/
