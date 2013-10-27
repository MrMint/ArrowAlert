
function AlertCtrl($scope, AlertRestangular) {
	$scope.authenticateUser();
	$scope.$emit("PAGE_TITLE_CHANGE", "Alerts");
	pullToRefreshEnabled = true;

	// This will be populated with Restangular
	$scope.Alerts = [];
	var alertsViewed = localStorage.getItem("viewedAlert");

    // Helper function for loading Alert data with spinner
	$scope.loadAlerts = function () {
		$scope.loading = true;
		debugNote('API: Requesting alerts from ArrowManager');
		Alerts.getList({ count: '20' }).then(function (data) {
			$scope.loading = false;
			$scope.Alerts = data;

			debugNote('API: Alerts Received, count: ' + data.length);
		});
	};

	// Fetch all objects from the backend (see models/Alert.js)
	var Alerts = AlertRestangular.all('AlertInUser');
	$scope.loadAlerts();



    //Handle alert received event while on homescreen
	$scope.$on("PULL_REFRESH", function (event) {
	    // Fetch all objects from the backend (see models/Alert.js)
	    $scope.loadAlerts();
	});

    //Handle alert received event
	$scope.$on("ALERT_RECEIVED", function (event, count) {
	    debugNote('EVENT: Alert_received event received on alert history page, refreshing');
	    //Refresh Alerts
	    $scope.loadAlerts();
	});
};