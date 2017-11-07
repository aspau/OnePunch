const os = require('os');
const osRelease = os.release();
const osReleaseArray = osRelease.split(".");
const osReleaseNum = osReleaseArray[2];
if (osReleaseNum >= 16000) {
    slimNotifications = true;
} else {
    slimNotifications = false;
}

module.exports = {

    notify: function (notificationTitle, notificationText, icon, hangTime) {
        if (slimNotifications) {
            console.log("fallUpdate")
            var ipc = require("electron").ipcRenderer;
            var msg = {
                title: notificationTitle,
                message: notificationText,
                width: 440,
                // height : 160, window will be autosized
                timeout: hangTime,
                focus: false // set focus back to main window
            };
            ipc.send('electron-toaster-message', msg);
        } else {
            const iconPath = '../images/' + icon;
            const options = {
                icon: iconPath,
                body: notificationText
            };
            const notification = new Notification(notificationTitle, options);
            console.log(notification);
            notification.onshow = function () {
                setTimeout(function () {
                    notification.close();
                }, hangTime);
            }
        }
    }
}
