var AlertApp = angular.module('AlertApp', ['ngRoute', 'AlertModel', 'ngAnimate'], function ($routeProvider, $locationProvider) {
    //configure custom routing
    $routeProvider.when('/Home', {
        templateUrl: 'views/home.html',
        controller: LoginCtrl
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
    $routeProvider.when('/LogOut', {
        templateUrl: 'views/Test/chapter.html',
        controller: ExitAppCtrl
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
}

// Index: http://localhost/views/Alert/index.html

function AlertCtrl($scope, AlertRestangular) {
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

    var that = this;
    if (authKey != 'undefined' || authKey != null) {
        //User has key, authenticate with server
        $http({
            method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/",
            headers: { "Authorization": authKey, "Content-type": "application/json" }
        }).
            success(function (data, status, headers, config) {
                //Authorization was successful! Update user info and store it.
                $scope.setuserName(data.displayName);
                if (data.characterId != null) {
                    $scope.setuserPicture("https://image.eveonline.com/Character/" + data.characterId + "_64.jpg");
                }
                //TODO: Implement home view
                //$location.path('/Home');
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
    else {
        //User does not have a key
        //Redirect user to enter a authorization key
        $location.path('/EditKey');
    }
};

function EditKeyCtrl($scope, $http, $location) {
    $scope.setPageTitle('Edit Key');

    //Check if they have a key in storage, UI changes based on it
    $scope.placeHolder = "Copy your key here";
    var authKey = localStorage.getItem("authKey");
    if (authKey != 'undefined' || authKey != null) {
        $scope.placeHolder = authKey;
    }
    //Saves the key to localstorage, and navigates to login for authetication
    $scope.changeAuthKey = function () {
        localStorage.setItem("authKey", $scope.authKey);
        $location.path('/Login');
    }

    //Opens the native browser and directs the user to the url to obtain authkey
    $scope.openBrowserForKey = function () {
        navigator.app.loadUrl('https://arrowmanager.net/Account/Manage', { openExternal: true });
    }
};

function ExitAppCtrl($scope) {

}

// Show a custom alert
function showAlert(title, message) {
    navigator.notification.alert(
        message,          // message
        function () { },     // callback
        title,            // title
        'ok'              // buttonName
    );
    navigator.notification.vibrate(500);
}

//Helper function for authenticating with arrowmanager REST api
function authenticate(scope, http) {

}