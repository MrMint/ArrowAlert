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
        broadcastAngularEvent('DEVICE_READY');
    },
    //TODO: Remove?
    //// Update DOM on a Received Event
    receivedEvent: function (id) {
    },
};


function registerForPushNotifications() {

    //Catch back button and do nothing until use case is determined
    //TODO: Figure out use case
    document.addEventListener("backbutton", function (e) {
       // debugNote('backbutton event received');
        e.preventDefault();
        //if (document.getElementById("app-status-ul").length > 0) {
        //    // call this to get a new token each time. don't call it to reuse existing token.
        //    //pushNotification.unregister(successHandler, errorHandler);
        //    e.preventDefault();
        //    navigator.app.exitApp();
        //}
        //else {
        //navigator.app.backHistory();
        //}
    }, false);

    try {
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            debugNote('PUSHNOTIF: Registering android');
            pushNotification.register(successHandler, errorHandler, { "senderID": "643146338989", "ecb": "onNotificationGCM" });		// required!
        } else {
            debugNote('PUSHNOTIF: Registering iOS');
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
        debugNote('PUSHNOTIF: push-notification: ' + e.alert);
        broadcastAngularEvent('ALERT_RECEIVED', 1);
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
    debugNote('PUSHNOTIF: EVENT -> RECEIVED:' + e.event);

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                debugNote('PUSHNOTIF: REGISTERED -> REGID:' + e.regid);
                
                localStorage.setItem("regId", e.regid);
                broadcastAngularEvent('REGISTRATION_SUCCESS');

            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            if (e.foreground) {
                debugNote('PUSHNOTIF: Notification received while in focus');

                broadcastAngularEvent('ALERT_RECEIVED', 1);
                navigator.notification.vibrate(500);
                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/" + e.soundname);
                //my_media.play();
            }
            else {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    debugNote('PUSHNOTIF: Notification received while closed');
                    broadcastAngularEvent('ALERT_RECEIVED', 1);
                }
                else {
                    debugNote('PUSHNOTIF: Notification received while in background');
                    broadcastAngularEvent('ALERT_RECEIVED', 1);
                }
            }

            debugNote('PUSHNOTIF: MESSAGE -> MSG: ' + e.payload.message);
            //debugNote('PUSHNOTIF: MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
            break;

        case 'error':
            debugNote('PUSHNOTIF: ERROR -> MSG:' + e.msg);
            break;

        default:
            debugNote('PUSHNOTIF: EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

function tokenHandler(result) {
    debugNote('PUSHNOTIF: token: ' + result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler(result) {
    debugNote('PUSHNOTIF: success:' + result);
}

function errorHandler(error) {
    debugNote('PUSHNOTIF:error:' + error);
}
//Set debugEnable at start for improved runtime performance when disabled
var debugEnable = localStorage.getItem('debug') === 'true';
function debugNote(text) {
    if (debugEnable) {
        debugEnable = true;
        var li = document.createElement("li");
        li.innerHTML = text;
        document.getElementById("debug").appendChild(li);
    }
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

function broadcastAngularEvent(eventType, value) {
    var element = document.getElementById('main');
    var scope = angular.element(element).scope();
    scope.broadcastEventSafe(eventType, value);
}

