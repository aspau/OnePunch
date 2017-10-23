const SettingsScript = require('./scripts/settings_script');
const Reminders = require('./scripts/reminders')

Reminders.getDailyPunches().then(function (dailyPunchCount) {
    document.getElementById('dailyPunchCount').textContent = dailyPunchCount;
});
