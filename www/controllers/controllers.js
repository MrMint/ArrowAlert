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
        $scope.pageTitle = title;
    }

    //Set users picture
    $scope.setuserPicture = function (title) {
        $scope.pageTitle = title;
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


    if (authKey != null) {
        //User has key, authenticate with server
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
            success(function (data, status, headers, config) {
                //Authorization was successful! Update user info and store it.
                $scope.setuserName = data.displayName;
                if (data.characterId != null) {
                    $scope.setuserPicture = "https://image.eveonline.com/Character/" + data.characterId + "_64.jpg";
                }
            }).
            error(function (data, status, headers, config) {
                if (states == '401') {
                    showAlert("Authorization Error", "Invalid Key");
                }
                showAlert("Network Error", "Status: " + status);
            });
    }
    else {
        //User does not have a key
        //Redirect user to enter a authorization key
        $location.path('/EditKey');
    }
};

function EditKeyCtrl($scope, $http) {
    var authKey = $scope.key;
    $scope.setPageTitle('Edit Key');
    function AddAppKey() {
        if (authKey != null) {
            $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
           success(function (data, status, headers, config) {
               localStorage.setItem("authKey", "key");
           }).
           error(function (data, status, headers, config) {
               showAlert("Network Error", "Status: " + status + ", Data: " + data);
           });
        }
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