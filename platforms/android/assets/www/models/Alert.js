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
                'authorization': '59fe150fec09ebade500321536b6b32582d3e2c6336bcdcbbad87e7500446a50d8926c309f098d8b0f963d67ba32112bb58d6a47ae87a1ead2e78d732bc8e1c7'
            });

        });

    });


})();
