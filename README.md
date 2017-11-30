# OnePunch 
![OnePunch](https://raw.githubusercontent.com/aspau/OnePunch/master/src/images/owl_ico_128.png?raw=true)An electron app to log patron/customer interactions. Set a hot-key and then press it everytime you help someone. Easier for employees to remember  -- and easier for managers to report from -- than browser based trackers so you get more reliable data with less work. OnePunch takes care of:

### Encouraging consistent use

OnePunch has a reminder feature that periodically (~hourly) alerts the user to how many people their desk has helped that day. It also displays a native notification every time an interaction is logged. Users can customize (somewhat) the image used for notifications and reminders.

![Notification](https://raw.githubusercontent.com/aspau/OnePunch/master/src/build/notification.png?raw=true)

### Logging every punch

If you lose your network connection logging fails-over to a local log which is then moved to the shared file.

### Generating reports

Will total by day or hour, and breakdown by desk.

![Reports](https://raw.githubusercontent.com/aspau/OnePunch/master/src/build/reports.png?raw=true)

## Getting Started Using the App

Just download the most recent release from this repo. And then ignore many warnings about dangerous software since I haven't paid to get this code-signed. You'll be asked about a few settings the first time you launch it. Just make sure that you use the same desk name for all the work stations you want tracked as a single entity -- and the same save location for all desks.

## Built With

* [Electron](https://electronjs.org/)
* [electron-builder](https://github.com/electron-userland/electron-builder)
* [electron-settings](https://github.com/nathanbuchar/electron-settings)
* [electron-toaster](https://github.com/s-a/electron-toaster)

## Icons By

[Becris](https://www.flaticon.com/authors/becris), [Dimitry Miroliubov](https://www.flaticon.com/authors/dimitry-miroliubov), [Freepik](http://www.freepik.com), [Gregor Cresnar](https://www.flaticon.com/authors/gregor-cresnar), [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha), [Roundicons](https://www.flaticon.com/authors/roundicons), and [Vectors Market](https://www.flaticon.com/authors/vectors-market) from [www.flaticon.com](hhttps://www.flaticon.com/) and licensed by [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/).

## License

This project is licensed under the MIT License.
