//angular.module('AlertApp', ['ngRoute'], function ($routeProvider, $locationProvider, $compileProvider, $httpProvider) {
//    $routeProvider.when('/Book/:bookId', {
//        templateUrl: '../views/test/book.html',
//        controller: BookCntl,
//        controllerAs: 'book'
//    });
//    $routeProvider.when('/Book/:bookId/ch/:chapterId', {
//        templateUrl: '../views/test/chapter.html',
//        controller: ChapterCntl,
//        controllerAs: 'chapter'
//    });

//    // configure html5 to get links working on jsfiddle
//    //$locationProvider.html5Mode(true);
//   // $httpProvider.defaults.useXDomain = true;
//    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    //configure to whitelist file URIs
//    //$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//});

//function MainCntl($route, $routeParams, $location) {
//    this.$route = $route;
//    this.$location = $location;
//    this.$routeParams = $routeParams;
//}

//function BookCntl($routeParams) {
//    this.name = "BookCntl";
//    this.params = $routeParams;
//}

//function ChapterCntl($routeParams) {
//    this.name = "ChapterCntl";
//    this.params = $routeParams;
//}

angular.module('AlertApp', ['ngRoute'], function ($routeProvider) {
    $routeProvider.when('/Book/:bookId', {
        templateUrl: '../test/book.html',
        controller: BookCntl,
        controllerAs: 'book'
    });
    $routeProvider.when('/Book/:bookId/ch/:chapterId', {
        templateUrl: '../test/chapter.html',
        controller: ChapterCntl,
        controllerAs: 'chapter'
    });

    // configure html5 to get links working on jsfiddle
    //$locationProvider.html5Mode(true);
    // $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
