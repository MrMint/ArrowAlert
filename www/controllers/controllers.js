var AlertApp = angular.module('AlertApp', ['ngRoute', 'AlertModel', 'ngAnimate'], function ($routeProvider, $locationProvider) {
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
    $routeProvider.when('/EditKey', {
        templateUrl: 'views/editKey.html',
        controller: EditKeyCtrl
    });

    $routeProvider.otherwise({
        redirectTo: '/Home'
    });
});

function MainCtrl($scope, $location) {
    //User specific UI elements and page title
    $scope.userPicture = "https://image.eveonline.com/Character/1_64.jpg";
    $scope.userName = "Not Authenticated";
    $scope.pageTitle = "ArrowAlert";
    $scope.newAlerts = 0;
    $scope.authenticated = false;

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

    //Set page title
    $scope.setPageTitle = function (title) {
        $scope.pageTitle = title;
    }

    //Set users name
    $scope.setUserName = function (name) {
        $scope.userName = name;
    }

    //Set users picture
    $scope.setUserPicture = function (pictureURL) {
        $scope.userPicture = pictureURL;
    }

    //Set authentication
    $scope.setAuthenticated = function (auth) {
        $scope.authenticated = auth;
    }

    //Set authentication
    $scope.getAuthenticated = function () {
        return $scope.authenticated;
    }

    //Set new alerts count
    $scope.setNewAlerts = function (count) {
        $scope.newAlerts = count;
    }
}

// Index: http://localhost/views/Alert/index.html

function AlertCtrl($scope, AlertRestangular) {
    $scope.authenticateUser();
    $scope.setPageTitle('Alerts');
    // This will be populated with Restangular
    $scope.Alerts = [];

    // Helper function for loading Alert data with spinner
    $scope.loadAlerts = function () {
        $scope.loading = true;

        Alerts.getList().then(function (data) {
            $scope.loading = false;
            $scope.Alerts = data;
        });
    };

    // Fetch all objects from the backend (see models/Alert.js)
    var Alerts = AlertRestangular.all('Alerts');
    $scope.loadAlerts();

};

function LoginCtrl($scope, $http, $location) {
    $scope.loading = true;
    $scope.setPageTitle('Authenticating...');
    //Retrieve current Authorization Key from local storage
    var authKey = localStorage.getItem("authKey");

    if (authKey != 'undefined' && authKey != null) {
        $scope.setAuthenticated(false);
        //user has key, authenticate with server
        $http({
            method: "GET", url: "https://arrowmanager.net/api/arrowalertapp/",
            headers: { "authorization": authKey, "content-type": "application/json" }
        }).
            success(function (data, status, headers, config) {
                //authorization was successful! update user info and store it.
                $scope.setUserName(data.displayName);
                if (data.characterId != null) {
                    $scope.setUserPicture("https://image.eveonline.com/character/" + data.characterId + "_64.jpg");
                }
                $scope.setAuthenticated(true);
                ////send to home page
                $scope.sendGCMToServer();
                $location.path('/Home');
            }).
            error(function (data, status, headers, config) {
                if (status == '401') {
                    //user failed to authorize
                    showAlert("authorization error", "invalid key");
                    $location.path('/EditKey');
                }
                else {
                    //was some type of network error
                    showalert("network error", "status: " + status);
                }
            });
    }
    else {
        //user does not have a key
        //redirect user to enter a authorization key
        $location.path('/EditKey');
    }



    $scope.sendGCMToServer = function () {
        //showAlert('test', 'function called');
        var authKey = localStorage.getItem("authKey");
        var regId = localStorage.getItem("regId")
        if (authKey != null && authKey != 'undefined' && regId != null && regId != 'undefined') {
            $http({
                method: "POST",
                url: "https://arrowmanager.net/api/ArrowAlertApp/",
                headers: { "Authorization": authKey, "Content-type": "application/json" },
                data: { "regId": regId }
            }).
               success(function (data, status, headers, config) {
                   //RegId was successfully updated on the server
                   localStorage.removeItem("regId");
               }).
               error(function (data, status, headers, config) {
                   if (status == '401') {
                       //User failed to authorize
                       showAlert("Authorization Error", "Invalid Key");
                       $location.path('/EditKey');
                   }
                   else {
                       //Was some type of network error
                       showAlert("Network Error", "Status: " + status);
                   }
               });
        }
    }
};

function EditKeyCtrl($scope, $http, $location) {
    $scope.setPageTitle('Edit Key');

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
        cordova.plugins.barcodeScanner.scan(
         function (result) {

             if (result.cancelled == true) {
                 //Scan was canceled
                 showAlert('QR Scan Error', 'Scan Canceled!');
             }
             else if (result.format != 'QR_CODE') {
                 //A QR code was not scanned
                 showAlert('QR Scan Error', 'Not a QR code!');
             }
             else if (result.text.length != 64) {
                 //Captured string is not valid
                 showAlert('QR Scan Error', 'Not a valid auth key!');
             }
             else {
                 //Store captured Auth Key
                 localStorage.setItem("authKey", result.text);
                 //Redirect to login page
                 $scope.$apply(function () {
                     $location.path('/Login');
                 });
             }
         },
         function (error) {
             showAlert('QR Scan Error', 'Scan failed: ' + error);
         }
      )
    };
};

function HomeCtrl($scope, AlertRestangular, $location) {
    $scope.authenticateUser();
    $scope.setPageTitle('ArrowAlert');

    //// Fetch all objects from the backend (see models/Alert.js)
    $scope.recentAlert = AlertRestangular.one('Alerts', '?count=1').get();
    $scope.loading = false;
}

function ExitAppCtrl($scope) {

}


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
