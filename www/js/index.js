var pushNotification;

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //angular.element(document).ready(function () {
        //    angular.bootstrap(document);
        //});
        document.addEventListener("menubutton", onMenuKeyDown, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
        registerForPushNotifications();
    },
    //// Update DOM on a Received Event
    receivedEvent: function (id) {
        alert('recieved event');




        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    },
};

// Handle the Menu button being pressed
function onMenuKeyDown() {
    var site = document.getElementById('site');
    var cl = site.classList;
    if (cl.contains('open')) {
        cl.remove('open');
    } else {
        cl.add('open');
    }
}


function registerForPushNotifications() {

    debugNote('deviceready event received');
    //document.addEventListener("backbutton", function (e) {
    //    debugNote('backbutton event received');

    //    if (document.getElementById("app-status-ul").length > 0) {
    //        // call this to get a new token each time. don't call it to reuse existing token.
    //        pushNotification.unregister(successHandler, errorHandler);
    //        e.preventDefault();
    //        navigator.app.exitApp();
    //    }
    //    else {
    //        navigator.app.backHistory();
    //    }
    //}, false);

    try {
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            debugNote('registering android');
            pushNotification.register(successHandler, errorHandler, { "senderID": "643146338989", "ecb": "onNotificationGCM" });		// required!
        } else {
            debugNote('registering iOS');
            pushNotification.register(tokenHandler, errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN" });	// required!
        }
    }
    catch (err) {
        txt = "There was an error on this page.\n\n";
        txt += "Error description: " + err.message + "\n\n";
        alert(txt);
    }
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        debugNote('push-notification: ' + e.alert);
        navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    debugNote('EVENT -> RECEIVED:' + e.event);

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                debugNote('REGISTERED -> REGID:' + e.regid);

                localStorage.setItem("regId", e.regid);

                //TODO: This is bad, fix later with an angular service or something
                var scp = angular.element('[ng-controller="LoginCtrl"]').scope();
                scp.sendGCMToServer();
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            if (e.foreground) {
                debugNote('--INLINE NOTIFICATION--');

                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/" + e.soundname);
                //my_media.play();
            }
            else {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    debugNote('--COLDSTART NOTIFICATION--');
                }
                else {
                    debugNote('--BACKGROUND NOTIFICATION--');
                }
            }

            debugNote('MESSAGE -> MSG: ' + e.payload.message);
            debugNote('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
            break;

        case 'error':
            debugNote('ERROR -> MSG:' + e.msg);
            break;

        default:
            debugNote('EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

function tokenHandler(result) {
    debugNote('token: ' + result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler(result) {
    debugNote('success:' + result);
}

function errorHandler(error) {
    debugNote('error:' + error);
}

function debugNote(text) {
    var li = document.createElement("li");
    li.innerHTML = text;
    document.getElementById("app-status-ul").appendChild(li);
}

function onBackKeyDown(e) {
    debugNote('backbutton event received');
    e.preventDefault();
    cordova.require('cordova/plugin/home').goHome(function () {
        debugNote("Successfully launched home intent");
    }, function () {
        debugNote("Error launching home intent");
    });
}
cordova.define("cordova/plugin/home", function (require, exports, module) {
    var exec = require('cordova/exec');
    var Home = function () { };
    Home.prototype.goHome = function (successCallback, errorCallback) {
        return cordova.exec(successCallback, errorCallback, 'Home', 'goHome', []);
    };
    var home = new Home();
    module.exports = home;
});