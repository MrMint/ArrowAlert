(function () {

    // Protects views where angular is not loaded from errors
    if (typeof angular == 'undefined') {
        return;
    };


    var module = angular.module('AlertModel', ['restangular']);

    module.factory('AlertRestangular', function (Restangular) {

        //window.setTimeout(function() {
        //  alert("Good! Now configure app/models/Alert.js");
        //}, 2000);

        return Restangular.withConfig(function (RestangularConfigurer) {

            // -- Stackmob REST API configuration
            RestangularConfigurer.setBaseUrl('https://arrowmanager.net/api');
            //RestangularConfigurer.setBaseUrl('http://localhost:59318/api');
            RestangularConfigurer.setRestangularFields({
                id: "ID"
            });

            RestangularConfigurer.setDefaultHeaders({
                'authorization': localStorage.getItem('authKey')
            });

        });

    });


})();
