﻿function HomeCtrl($scope, AlertRestangular, $location) {
    pullToRefreshEnabled = true;
    $scope.authenticateUser();
    $scope.$emit("PAGE_TITLE_CHANGE", "ArrowAlert");
    $scope.loading = true;

    //Fetch recent objects from the backend (see models/Alert.js)
    //Parameter age requests all alerts within the last 24 hours
    $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
    $scope.newAlerts = [];
    $scope.loading = false;


    //Handle alert received event while on homescreen
    $scope.$on("ALERT_RECEIVED", function (event, count) {
        $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
        debugNote('EVENT: Alert_received event received on homepage');
    });
    
    //Handle alert received event while on homescreen
    $scope.$on("PULL_REFRESH", function (event) {
        $scope.loading = true;
        $scope.recentAlerts = AlertRestangular.all('AlertInUser').getList({ age: '24' });
        $scope.loading = false;
        debugNote('EVENT: Pull_refresh event received on homepage');
    });
}
