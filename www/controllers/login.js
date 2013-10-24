
function LoginCtrl($scope, $http, $location) {
    $scope.loading = true;
    $scope.$emit("PAGE_TITLE_CHANGE", "Authenticating...");
    pullToRefreshEnabled = false;
    //Retrieve current Authorization Key from local storage
    var authKey = localStorage.getItem("authKey");

    if (authKey != 'undefined' && authKey != null) {
        debugNote('API: Sending API authorization key to ArrowManager');
        $scope.$emit("AUTHENTICATED", false);
        //user has key, authenticate with server
        $http({
            method: "GET", url: "https://arrowmanager.net/api/arrowalertapp/",
            headers: { "authorization": authKey, "content-type": "application/json" }
        }).
            success(function (data, status, headers, config) {
                debugNote('API: Successfully authenticated!');
                //Emit authenticated event 
                $scope.$emit("AUTHENTICATED", true, data.displayName, data.characterId, data.expectedRegId);
                //Redirect to home page
                $location.path('/Home');
            }).
            error(function (data, status, headers, config) {
                if (status == '401') {
                    //user failed to authorize
                    //showAlert("authorization error", "invalid key");
                    $location.path('/Settings');
                }
                else {
                    //was some type of network error
                    mintNotify.error('Network error: ' + status);
                }
            });
    }
    else {
        //user does not have a key
        //redirect user to enter a authorization key
        $location.path('/Settings');
    }
};
