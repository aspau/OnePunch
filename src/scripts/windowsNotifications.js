
module.exports = {

    notify: function (notificationTitle, notificationText, icon, hangTime) {
        const iconPath = '../images/' + icon;
        const options = {
            icon: iconPath,
            body: notificationText
        };
        const notification = new Notification(notificationTitle, options);
        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, hangTime);
        }


    }
}


/*

module.exports = {

    notify: function (notificationTitle, notificationText, icon, hangTime) {
        const appId = 'OnePunch'
        const {
            ToastNotification
        } = require('electron-windows-notifications')

        let notification = new ToastNotification({
            appId: appId,
            template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
            strings: ['Hi!']
        })

        notification.on('activated', () => console.log('Activated!'))
        notification.show()


    }
}

*/
