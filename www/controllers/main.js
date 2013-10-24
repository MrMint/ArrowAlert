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
        var platform;
        //Get platform
        if(device.platform == 'android' || device.platform == 'Android'){
            platform = "Android";
        }
        else{
            platform = "Ios";
        }
        //Check if regId is new
        if (regId != expectedRegId) {
            debugNote('API: Sending registrationID to ArrowManager');
            $http({
                method: "POST",
                url: "https://arrowmanager.net/api/ArrowAlertApp/",
                headers: { "Authorization": authKey, "Content-type": "application/json" },
                data: { "regId": regId, "platform": platform }
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

    //Handles pull to refresh
    $scope.pullRefresh = function () {
        $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
        return;
    }
}