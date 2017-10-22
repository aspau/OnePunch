module.exports = {

    notify: function (notificationTitle, notificationText) {

        const options = {
            icon: '../images/owl_ico_64.png',
            body: notificationText
        };
        const notification = new Notification(notificationTitle, options);
        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, 2000);
        }


    }
}
