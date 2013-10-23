var AlertApp = angular.module('AlertApp', ['ngRoute', 'AlertModel', 'hmTouchevents'], function ($routeProvider, $locationProvider) {
    //configure custom routing
    $routeProvider.when('/Home', {
        templateUrl: 'views/home.html',
        controller: HomeCtrl
    });
    $routeProvider.when('/Login', {
        templateUrl: 'views/login.html',
        controller: LoginCtrl
    });
    $routeProvider.when('/Alerts', {
        templateUrl: 'views/alerts.html',
        controller: AlertCtrl
    });
    $routeProvider.when('/Settings', {
        templateUrl: 'views/settings.html',
        controller: SettingsCtrl
    });

    $routeProvider.otherwise({
        redirectTo: '/Home'
    });
});

//A directive that binds dom elements to hammer events
AlertApp.directive('bindHammerAlert', function () {
    return {
        link: function (scope, element, attrs, ctrl) {
            //Bind alert to hammer
            bindHammerAlert(element);
        }
    };
});

function MainCtrl($scope, $location, $rootScope, $http) {
    //User specific UI elements and page title
    $scope.userPicture = "https://image.eveonline.com/Character/1_64.jpg";
    $scope.userName = "Not Authenticated";
    $scope.pageTitle = "Loading...";
    $scope.newAlerts = 0;
    $scope.authenticated = false;
    $scope.deviceReady = false;

    //Retrieve debug setting from localstorage
    var debugSetting = localStorage.getItem('debug');
    if (debugSetting != null) {
        //Previous setting found! set it to scope variable
        $scope.debug = debugSetting === 'true';
    }
    else {
        //Nothing found, set to default
        $scope.debug = false;
    }

    //Set a watch on the debug variable and store on change
    $scope.$watch('debug', function () {
        debugEnable = $scope.debug;
        localStorage.setItem('debug', $scope.debug);
        debugNote('WATCH: Debug has changed');
    }, true);

    //Handle page title change event
    $scope.$on("PAGE_TITLE_CHANGE", function (event, title) {
        $scope.pageTitle = title;
        debugNote('EVENT: Page_title_change event received: ' + title);
    });

    //Handle alert received event globally
    $scope.$on("ALERT_RECEIVED", function (event, count) {
        $scope.newAlerts += count;
        debugNote('EVENT: Alert_received event received: ' + count);
    });

    //Handle alert received event
    $scope.$on("DEVICE_READY", function (event) {
        $scope.deviceReady = true;
        debugNote('EVENT: Device_ready event received');
    });

    //Handle registration event
    $scope.$on("REGISTRATION_SUCCESS", function (event) {
        debugNote('EVENT: Registration_success event received');
        $scope.sendGCMToServer();
    });

    //Handle authenticated event
    $scope.$on("AUTHENTICATED", function (event, value, name, characterId, expectedRegId) {
        $scope.authenticated = value;
        debugNote('EVENT: Authenticated event Received: ' + value);
        if (value) {
            //User is authenticated, update UI
            if (name != null) {
                $scope.userName = name;
            }
            if (characterId != null) {
                $scope.userPicture = "https://image.eveonline.com/character/" + characterId + "_64.jpg";
            }
            //Register with GCM for push notifications
            $scope.registerForPushNotifications(0);
            //Save expectedRegId to storage
            localStorage.setItem('expectedRegId', expectedRegId);
            mintNotify.success("Successfully Authenticated");
        }
        else {
            //User is no longer authenticated, reset user specific UI
            $scope.userPicture = "https://image.eveonline.com/Character/1_64.jpg";
            $scope.userName = "Not Authenticated";
        }
    });

    //Helper function for safely broadcasting events from outside js
    $scope.broadcastEventSafe = function (eventType, value) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            $scope.$broadcast(eventType, value);
        } else {
            this.$apply(function () {
                $scope.$broadcast(eventType, value);
            });
        }
    }
    setTimeout(function () { $scope.broadcastEventSafe('TEST_EVENT') }, 100);
    //Helper function that checks if the user has authenticated, 
    //and redirects to login if not
    $scope.authenticateUser = function () {
        if (!$scope.authenticated) {
            $location.path('/Login');
        }
    }

    //Send app to background so alerts are still displayed in notification bar
    $scope.exitApplication = function () {
        cordova.require('cordova/plugin/home').goHome();
    }

    //Helper function that attempts to register with Push Notification service after authenticating
    $scope.registerForPushNotifications = function (attempts) {
        //Check if device is ready
        if ($scope.deviceReady) {
            //Register
            registerForPushNotifications();
        }
        else if (attempts < 20) {
            //Device is not ready, retry 20 times at 200ms intervals
            debugNote('WARNING: Device not ready, Retrying...');
            setTimeout(function () { $scope.registerForPushNotifications(attempts + 1) }, 200);
        }
        else if (attempts = 20) {
            debugNote('ERROR: Device not ready, unable to register with push notif.');
        }
    }

    //Sends registration ID to ArrowManager so messages can be sent to this device
    $scope.sendGCMToServer = function () {
        debugNote('API: Checking if regId has changed');
        var authKey = localStorage.getItem("authKey");
        var regId = localStorage.getItem("regId")
        var expectedRegId = localStorage.getItem('expectedRegId');
        //Check if regId is new
        if (regId != expectedRegId) {
            debugNote('API: Sending registrationID to ArrowManager');
            $http({
                method: "POST",
                url: "https://arrowmanager.net/api/ArrowAlertApp/",
                headers: { "Authorization": authKey, "Content-type": "application/json" },
                data: { "regId": regId }
            }).
                success(function (data, status, headers, config) {
                    //RegId was successfully updated on the server

                    debugNote('API: Successfully sent regId to ArrowManager');
                }).
                error(function (data, status, headers, config) {
                    if (status == '401') {
                        //User failed to authorize
                        mintNotify.error("Authorization Error: Invalid Key");
                        $location.path('/Settings');
                    }
                    else {
                        //Was some type of network error
                        mintNotify.error('Network Error, Status: ' + status);
                    }
                });
        }
        else {
            debugNote('API: RegId has not changed, not sending to ArrowManager');
        }

    }
    //Helper function for displaying the alerts priority level
    $scope.displayAlertLevel = function (alertLevel) {
        switch (alertLevel) {
            case 0:
                return 'low';
            case 1:
                return 'medium';
            case 2:
                return 'high';
            case 3:
                return 'extreme';
        }
    }

    $scope.viewedAlert = function (dismissed) {
        if (dismissed) {
            return "viewed";
        }
    }
}

function LoginCtrl($scope, $http, $location) {
    $scope.loading = true;
    $scope.$emit("PAGE_TITLE_CHANGE", "Authenticating...");
    //Retrieve current Authorization Key from local storage
    var authKey = localStorage.getItem("authKey");

    if (authKey != 'undefined' && authKey != null) {
        debugNote('API: Sending API authorization key to ArrowManager');
        $scope.$emit("AUTHENTICATED", false);
        //user has key, authenticate with server
        $http({
            method: "GET", url: "https://arrowmanager.net/api/arrowalertapp/",
            headers: { "authorization": authKey, "content-type": "application/json" }
        }).
            success(function (data, status, headers, config) {
                debugNote('API: Successfully authenticated!');
                //Emit authenticated event 
                $scope.$emit("AUTHENTICATED", true, data.displayName, data.characterId, data.expectedRegId);
                //Redirect to home page
                $location.path('/Home');
            }).
            error(function (data, status, headers, config) {
                if (status == '401') {
                    //user failed to authorize
                    //showAlert("authorization error", "invalid key");
                    $location.path('/Settings');
                }
                else {
                    //was some type of network error
                    mintNotify.error('Network error: ' + status);
                }
            });
    }
    else {
        //user does not have a key
        //redirect user to enter a authorization key
        $location.path('/Settings');
    }
};

function SettingsCtrl($scope, $http, $location) {
    $scope.$emit("PAGE_TITLE_CHANGE", "Settings");
    bindHammerSettings();
    //Check if they have a key in storage, UI changes based on it
    $scope.placeHolder = "Copy your key here";
    var authKey = localStorage.getItem("authKey");
    if (authKey != 'undefined' && authKey != null) {
        $scope.placeHolder = authKey;
    }

    //Saves the key to localstorage, and navigates to login for authentication
    $scope.changeAuthKey = function () {
        localStorage.setItem("authKey", $scope.authKey);
        $location.path('/Login');
    }

    //Opens the native browser and directs the user to the url to obtain authkey
    $scope.openBrowserForKey = function () {
        navigator.app.loadUrl('https://arrowmanager.net/Account/Manage', { openExternal: true });
    }


    //Scan qr code
    $scope.scanQRCode = function () {
        debugNote('QRSCANNER: Launching QR Scanner');
        cordova.plugins.barcodeScanner.scan(
         function (result) {

             if (result.cancelled == true) {
                 //Scan was canceled
                 mintNotify.error('QR scan error, Scan Canceled!');
             }
             else if (result.format != 'QR_CODE') {
                 //A QR code was not scanned
                 mintNotify.error('QR scan error, Not a QR code!');
             }
             else if (result.text.length != 64) {
                 //Captured string is not valid
                 mintNotify.error('QR scan error, Not a valid auth key!');
             }
             else {
                 debugNote('QRSCANNER: Successfully scanned QR auth key');
                 //Store captured Auth Key
                 localStorage.setItem("authKey", result.text);
                 //Redirect to login page
                 $scope.$apply(function () {
                     $location.path('/Login');
                 });
             }
         },
         function (error) {
             mintNotify.error("QR Scan failed: " + error);
         }
      )
    };
    //Handle alert received event
    $scope.$on("DEBUG_SETTING_CHANGE", function (event, value) {
        $scope.$parent.debug = value;
        debugNote('EVENT: Debug_setting_change event received: ' + value);
    });

};

function HomeCtrl($scope, AlertRestangular, $location) {
    $scope.authenticateUser();
    $scope.$emit("PAGE_TITLE_CHANGE", "ArrowAlert");
    $scope.loading = true;
    
    //Fetch recent objects from the backend (see models/Alert.js)
    //Parameter age requests all alerts within the last 24 hours
    $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
    $scope.loading = false;


    //Handle alert received event while on homescreen
    $scope.$on("ALERT_RECEIVED", function (event, count) {
        $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
        debugNote('EVENT: Alert_received event received on homepage');
    });

}

function AlertCtrl($scope, AlertRestangular) {
    $scope.authenticateUser();
    $scope.$emit("PAGE_TITLE_CHANGE", "Alerts");
   

    // This will be populated with Restangular
    $scope.Alerts = [];
    var alertsViewed = localStorage.getItem("viewedAlert");
    // Helper function for loading Alert data with spinner
    $scope.loadAlerts = function () {
        $scope.loading = true;
        debugNote('API: Requesting alerts from ArrowManager');
        Alerts.getList({ count: '20' }).then(function (data) {
            $scope.loading = false;
            $scope.Alerts = data;
            //Set the new alert viewed
            if (data.length > 0) {
                //Save the old variable so that the new alerts still show as new
                localStorage.setItem("oldViewedAlert", alertsViewed);
                localStorage.setItem("viewedAlert", data[0].ID);
            }
            debugNote('API: Alerts Received, count: ' + data.length);
        });
    };

    // Fetch all objects from the backend (see models/Alert.js)
    var Alerts = AlertRestangular.all('AlertInUser');
    $scope.loadAlerts();

    //Handle dismiss alert event while on alert screen
    $scope.$on("DISMISS_ALERT", function (event, index) {
        //Get alerts
        var alert = $scope.Alerts[index];
        if (!alert.dismissed) {
            //Set as dismissed
            alert.Dismissed = true;
            mintNotify.success("Alert dismissed");
            //Make a copy to send to server so ui doesnt get null'd out
            var dismissedAlert = AlertRestangular.copy(alert); s
            dismissedAlert.Alert = null;
            //Send to ArrowManager
            dismissedAlert.put();
        }
    });

};
// Show a custom alert
function showAlert(title, message) {
    navigator.notification.alert(
        message,          // message
        function () { },  // callback
        title,            // title
        'ok'              // buttonName
    );
    navigator.notification.vibrate(500);
}