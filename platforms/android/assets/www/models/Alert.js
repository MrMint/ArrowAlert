(function () {

    // Protects views where angular is not loaded from errors
    if (typeof angular == 'undefined') {
        return;
    };

    var module = angular.module('AlertModel', ['restangular']);

    module.factory('AlertRestangular', function (Restangular) {

        return Restangular.withConfig(function (RestangularConfigurer) {

            // -- ArrowManager REST API configuration
            RestangularConfigurer.setBaseUrl('https://arrowmanager.net/api');
            RestangularConfigurer.setRestangularFields({
                id: "ID"
            });

            RestangularConfigurer.setDefaultHeaders({
                'authorization': localStorage.getItem('authKey')
            });
        });
    });
})();
