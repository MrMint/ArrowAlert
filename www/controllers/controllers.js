angular.module('AlertApp', ['ngRoute', 'AlertModel', 'ngAnimate'], function ($routeProvider, $locationProvider) {
    //configure custom routing
    $routeProvider.when('/Login', {
        templateUrl: 'views/Login/index.html',
        controller: LoginCtrl
    });
    $routeProvider.when('/Alerts', {
        templateUrl: 'views/Alert/index.html',
        controller: AlertCtrl
    });
    $routeProvider.when('/EditKey', {
        templateUrl: 'views/Login/addAuthKey.html',
        controller: AddAuthKeyCtrl
    });
    $routeProvider.when('/LogOut', {
        templateUrl: 'views/Test/chapter.html',
        controller: ExitAppCtrl
    });

    $routeProvider.otherwise({
        redirectTo: '/Login'
    });
});

// Index: http://localhost/views/Alert/index.html

function AlertCtrl($scope, AlertRestangular) {

    // This will be populated with Restangular
    $scope.Alerts = [];

    // Helper function for loading Alert data with spinner
    $scope.loadAlerts = function () {
        $scope.loading = true;

        Alerts.getList().then(function (data) {
            //$scope.loading = false;
            $scope.Alerts = data;
        });

    };

    // Fetch all objects from the backend (see app/models/Alert.js)
    var Alerts = AlertRestangular.all('Alerts');
    $scope.loadAlerts();


    // Get notified when another webview modifies the data and reload
    window.addEventListener("message", function (event) {
        // reload data on message with reload status
        if (event.data.status === "reload") {
            $scope.loadAlerts();
        };
    });
};

function LoginCtrl($scope, $http, $location) {
    $scope.loading = true;
    // Save current Alert id to localStorage (edit.html gets it from there)
    localStorage.setItem("authKey", "key4");

    var authKey = localStorage.getItem("authKey");
    if (authKey != null) {
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
       success(function (data, status, headers, config) {
           if (data === "false") {
               $location.path('/EditKey');
           }
       }).
       error(function (data, status, headers, config) {
           showAlert("Network Error", "Status: " + status +", Data: " + data);
       });
    }


};

function AddAuthKeyCtrl($scope, $http) {
    $scope.loading = true;
    var authKey = localStorage.getItem("authKey");
    if (authKey != null) {
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
       success(function (data, status, headers, config) {
           localStorage.setItem("authKey", "key");
       }).
       error(function (data, status, headers, config) {
           showAlert("Network Error", "Status: " + status + ", Data: " + data);
       });
    }


};

function ExitAppCtrl($scope) {

}

// alert dialog dismissed
function alertDismissed() {
    // do something
}

// Show a custom alert
function showAlert(title, message) {
    navigator.notification.alert(
        message,  // message
        function(){},         // callback
        title,            // title
        'ok'                  // buttonName
    );
    navigator.notification.vibrate(2000);
}