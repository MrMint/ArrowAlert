
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

		    //Set the new alert viewed
			if (data.length > 0) {

			    //Save the old variable so that the new alerts still show as new
				localStorage.setItem("oldViewedAlert", alertsViewed);
				localStorage.setItem("viewedAlert", data[0].ID);
			}
			debugNote('API: Alerts Received, count: ' + data.length);
		});
	};

	// Fetch all objects from the backend (see models/Alert.js)
	var Alerts = AlertRestangular.all('AlertInUser');
	$scope.loadAlerts();

	//Handle dismiss alert event while on alert screen
	$scope.$on("DISMISS_ALERT", function (event, index) {

	    //Get alerts
		var alert = $scope.Alerts[index];
		if (!alert.dismissed) {

		    //Set as dismissed
			alert.Dismissed = true;
			mintNotify.success("Alert dismissed");

		    //Make a copy to send to server so ui doesnt get null'd out
			var dismissedAlert = AlertRestangular.copy(alert);
			dismissedAlert.Alert = null;

		    //Send to ArrowManager
			dismissedAlert.put();
		}
	});

    //Handle alert received event while on homescreen
	$scope.$on("PULL_REFRESH", function (event) {
	    // Fetch all objects from the backend (see models/Alert.js)
	    $scope.loadAlerts();
	});
};