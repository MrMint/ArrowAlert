angular.module('AlertApp', ['ngRoute', 'ngAnimate'], function ($routeProvider, $locationProvider) {
    $routeProvider.when('/Book/:bookId', {
        templateUrl: '../views/test/book.html',
        controller: BookCntl,
        controllerAs: 'book'
    });
    $routeProvider.when('Book/:bookId/ch/:chapterId', {
        templateUrl: '../../../views/test/chapter.html',
        controller: ChapterCntl,
        controllerAs: 'chapter'
    });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
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
//AlertApp.controller("HomeController", function ($scope) {
//    $scope.message = "AngularJS!";
//});
//AlertApp.controller('IndexCtrl', function ($scope, $http) {
//    //$scope.loading = true;
//    //// Save current Alert id to localStorage (edit.html gets it from there)
//    //localStorage.setItem("authKey", "key4");

//    //var authKey = localStorage.getItem("authKey");
//    //if (authKey != null) {
//    //    $http({ method: "GET", url: "https://arrowmanager.net/api/ArrowAlertApp/", headers: { "authKey": authKey } }).
//    //   success(function (data, status, headers, config) {
//    //       if (data === "false") {
//    //           window.location = "/views/Login/addAuthKey.html"
//    //       }
//    //   }).
//    //   error(function (data, status, headers, config) {
//    //       alert("Error connecting to arrowmanager")
//    //   });
//    //}


//});