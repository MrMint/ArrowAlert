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

            //Intercept outbound requests and attach the auth key to it (ensures up to date authkey)
            RestangularConfigurer.setFullRequestInterceptor(function (element, operation, route, url, headers, params) {
                return {
                    element: element,
                    params: params,
                    headers: _.extend(headers, { Authorization: localStorage.getItem('authKey') })
                };
            });

        });
    });
})();
