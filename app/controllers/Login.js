var AlertApp = angular.module('AlertApp', ['hmTouchevents']);


// Index: http://localhost/views/Login/index.html

AlertApp.controller('IndexCtrl', function ($scope, $http) {
    $scope.loading = true;
    // Save current Alert id to localStorage (edit.html gets it from there)
    localStorage.setItem("authKey", "key4");

    var authKey = localStorage.getItem("authKey");
    if (authKey != null) {
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
       success(function (data, status, headers, config) {
           if (data === "false") {
               window.location = "/views/Login/addAuthKey.html"
           }
       }).
       error(function (data, status, headers, config) {
           alert("Error connecting to arrowmanager")
       });
    }


});

AlertApp.controller('AddAuthKeyCtrl', function ($scope, $http) {


    var authKey = localStorage.getItem("authKey");
    if (authKey != null) {
        $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
       success(function (data, status, headers, config) {
           localStorage.setItem("authKey", "key");
       }).
       error(function (data, status, headers, config) {
           alert("Invalid Key");
       });
    }


});
