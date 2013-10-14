angular.module('AlertApp', ['ngRoute', 'AlertModel', 'ngAnimate'], function ($routeProvider, $locationProvider, $compileProvider) {
    //configure custom routing
    $routeProvider.when('/Book/:bookId', {
        templateUrl: '../views/Test/book.html',
        controller: BookCntl
    });
    $routeProvider.when('/Book/:bookId/ch/:chapterId', {
        templateUrl: '../views/Test/chapter.html',
        controller: ChapterCntl
    });

    $routeProvider.when('/Login', {
        templateUrl: '../views/Login/index.html',
        controller: LoginCtrl
    });
    $routeProvider.when('/Alerts', {
        templateUrl: '../views/Alert/index.html',
        controller: AlertCtrl
    });
    $routeProvider.when('/EditKey', {
        templateUrl: '../views/Login/addAuthKey.html',
        controller: AddAuthKeyCtrl
    });
    $routeProvider.when('/LogOut', {
        templateUrl: '../views/Test/chapter.html',
        controller: ChapterCntl
    });

    $routeProvider.otherwise({
        redirectTo: '/Login'
    });

     //configure html5 to get links working on jsfiddle
    //$locationProvider.html5Mode(true);

    //configure to whitelist file URIs
    //$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

function MainCntl($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
}

function BookCntl($routeParams) {
    this.name = "BookCntl";
    this.params = $routeParams;
}

function ChapterCntl($routeParams) {
    this.name = "ChapterCntl";
    this.params = $routeParams;
}

// Index: http://localhost/views/Alert/index.html

function AlertCtrl($scope, AlertRestangular) {

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

    // Fetch all objects from the backend (see app/models/Alert.js)
    var Alerts = AlertRestangular.all('Alerts');
    $scope.loadAlerts();


    // Get notified when an another webview modifies the data and reload
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
               //window.location.href = "/EditKey"
               $location.path('/EditKey');
           }
       }).
       error(function (data, status, headers, config) {
           showAlert("Error connecting to arrowmanager")
       });
    }


};

function AddAuthKeyCtrl($scope, $http) {

    var authKey = localStorage.getItem("authKey");
    if (authKey != null) {
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
       success(function (data, status, headers, config) {
           localStorage.setItem("authKey", "key");
       }).
       error(function (data, status, headers, config) {
           showAlert();
       });
    }


};

// alert dialog dismissed
function alertDismissed() {
    // do something
}

// Show a custom alert
//
function showAlert() {
    navigator.notification.alert(
        'You are the winner!',  // message
        alertDismissed,         // callback
        'Game Over',            // title
        'Done'                  // buttonName
    );
}