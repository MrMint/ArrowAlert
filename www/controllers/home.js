function HomeCtrl($scope, AlertRestangular, $location) {
    pullToRefreshEnabled = true;
    $scope.authenticateUser();
    $scope.$emit("PAGE_TITLE_CHANGE", "ArrowAlert");

    $scope.newAlerts = [];
    $scope.recentAlerts = [];


    //Handle alert received event while on homescreen
    $scope.$on("ALERT_RECEIVED", function (event, count) {
        $scope.loadNewAlerts();
        $scope.loadRecentAlerts();
        debugNote('EVENT: Alert_received event received on homepage');
    });

    //Handle alert received event while on homescreen
    $scope.$on("PULL_REFRESH", function (event) {
        $scope.loadNewAlerts();
        $scope.loadRecentAlerts();
        debugNote('EVENT: Pull_refresh event received on homepage');
    });

    // Helper function for loading Alert data with spinner
    $scope.loadNewAlerts = function () {
        $scope.loadingNew = true;
        debugNote('API: Requesting new alerts from ArrowManager');

        // Fetch all objects from the backend (see models/Alert.js)
        //Parameter dismissed requests all non dismissed alerts
        AlertRestangular.all('AlertInUser').getList({ dismissed: 'false' }).then(function (data) {
            $scope.loadingNew = false;
            $scope.newAlerts = data;
            debugNote('API: Alerts Received, count: ' + data.length);
        });
    };

    // Helper function for loading Alert data with spinner
    $scope.loadRecentAlerts = function () {
        $scope.loadingRecent = true;
        debugNote('API: Requesting recent alerts from ArrowManager');

        // Fetch all objects from the backend (see models/Alert.js)
        //Parameter age requests all alerts within the last 24 hours
        AlertRestangular.all('AlertInUser').getList({ age: '24' }).then(function (data) {
            $scope.loadingRecent = false;
            $scope.recentAlerts = data;
            debugNote('API: Alerts Received, count: ' + data.length);
        });
    };

    //Load alerts
    $scope.loadNewAlerts();
    $scope.loadRecentAlerts();

    //Handle dismiss alert event while on alert screen
    $scope.$on("DISMISS_ALERT", function (event, index) {

        //Get alerts
        var alert = $scope.newAlerts[index];
        if (!alert.Dismissed) {

            //Dismiss alert
            alert.Dismissed = true;
            setTimeout(function () 
            { 
                $scope.$apply(function () {
                    $scope.newAlerts.splice(index, 1);
                    mintNotify.success("Alert dismissed");
                })
            }, 650);
            

            //Make a copy to send to server so ui doesnt get null'd out
            var dismissedAlert = AlertRestangular.copy(alert);
            dismissedAlert.Alert = null;

            //Send to ArrowManager
            dismissedAlert.put();
        }
    });
}
