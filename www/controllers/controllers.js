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
        redirectTo: '/Login'
    });
});

function MainCtrl($scope) {
    //User specific UI elements and page title
    $scope.userPicture = "https://image.eveonline.com/Character/1_64.jpg";
    $scope.userName = "Not Authenticated";
    $scope.pageTitle = "ArrowAlert";
    $scope.newAlerts = false;
    $scope.newAlertsCount = 0;

    $scope.exitApplication = function () {
        window.plugins.pushNotification.unregister(successHandler, errorHandler);
        navigator.app.exitApp();
    }
    //Set page title
    $scope.setPageTitle = function (title) {
        $scope.pageTitle = title;
    }

    //Set users name
    $scope.setuserName = function (title) {
        $scope.userName = title;
    }

    //Set users picture
    $scope.setuserPicture = function (title) {
        $scope.userPicture = title;
    }

    //Set new alerts count
    $scope.setNewAlertsCount = function (count) {
        $scope.newAlertsCount = count;
        if (count == 0) {
            $scope.newAlerts = false;
        }
    }
}

// Index: http://localhost/views/Alert/index.html

function AlertCtrl($scope, AlertRestangular) {
    showAlert('login controller called', 'it dids');
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
    showAlert('login controller called', 'it dids');
    //Retrieve current Authorization Key from local storage
    var authKey = localStorage.getItem("authKey");

    if (authkey != 'undefined' && authkey != null) {
        //user has key, authenticate with server
        $http({
            method: "get", url: "https://arrowmanager.net/api/arrowalertapp/",
            headers: { "authorization": authkey, "content-type": "application/json" }
        }).
            success(function (data, status, headers, config) {
                //authorization was successful! update user info and store it.
                $scope.setusername(data.displayname);
                if (data.characterid != null) {
                    $scope.setuserpicture("https://image.eveonline.com/character/" + data.characterid + "_64.jpg");
                }
                ////send to home page
                showalert('login called gcm', 'it dids');
                $scope.sendgcmtoserver();
                $location.path('/home');
            }).
            error(function (data, status, headers, config) {
                if (status == '401') {
                    //user failed to authorize
                    showalert("authorization error", "invalid key");
                    $location.path('/editkey');
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
        $location.path('/editkey');
    }



    $scope.sendGCMToServer = function () {
        //showAlert('test', 'function called');
        var authKey = localStorage.getItem("authKey");
        var regId = localStorage.getItem("regId")
        //showAlert('authkey', authKey);
        //showAlert('regId', regId);
        if (authKey != null && authKey != 'undefined' && regId != null && regId != 'undefined') {
            $http({
                method: "POST",
                url: "https://arrowmanager.net/api/ArrowAlertApp/",
                headers: { "Authorization": authKey, "Content-type": "application/json" },
                data: { "regId": regId }
            }).
               success(function (data, status, headers, config) {
                   //RegId was successfully updated on the server
                   showAlert('test', 'success!');
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
};

function HomeCtrl($scope, AlertRestangular) {
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
