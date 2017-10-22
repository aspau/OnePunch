module.exports = {

    notify: function (notificationTitle, notificationText, icon, hangTime) {
        const iconPath = '../images/' + icon;
        console.log(iconPath);
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
