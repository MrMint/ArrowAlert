//Initializes the ArrowAlert application
var AlertApp = angular.module('AlertApp', ['ngRoute', 'AlertModel'], function ($routeProvider, $locationProvider) {

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
    $routeProvider.when('/Settings', {
        templateUrl: 'views/settings.html',
        controller: SettingsCtrl
    });
    $routeProvider.otherwise({
        redirectTo: '/Home'
    });
});

//A directive that binds dom elements to hammer events
AlertApp.directive('bindHammerAlert', function () {
    return {
        link: function (scope, element, attrs, ctrl) {
            //Bind alert to hammer
            bindHammerAlert(element[0]);
        }
    };
});




// Show a custom native alert
function showAlert(title, message) {
    navigator.notification.alert(
        message,          // message
        function () { },  // callback
        title,            // title
        'ok'              // buttonName
    );
    navigator.notification.vibrate(500);
}