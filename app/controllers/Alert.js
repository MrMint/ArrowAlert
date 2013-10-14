var AlertApp = angular.module('AlertApp', ['AlertModel', 'hmTouchevents']);


// Index: http://localhost/views/Alert/index.html

AlertApp.controller('IndexCtrl', function ($scope, AlertRestangular) {

  // This will be populated with Restangular
  $scope.Alerts = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/Alert/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading Alert data with spinner
  $scope.loadAlerts = function() {
    $scope.loading = true;

    Alerts.getList().then(function (data) {
      $scope.Alerts = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/Alert.js)
  var Alerts = AlertRestangular.all('Alerts');
  $scope.loadAlerts();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadAlerts();
    };
  });


  //// -- Native navigation

  //// Set navigation bar..
  //steroids.view.navigationBar.show("Alert index");

  //// ..and add a button to it
  //var addButton = new steroids.buttons.NavigationBarButton();
  //addButton.title = "Add";

  //// ..set callback for tap action
  //addButton.onTap = function() {
  //  var addView = new steroids.views.WebView("/views/Alert/new.html");
  //  steroids.modal.show(addView);
  //};

  //// and finally put it to navigation bar
  //steroids.view.navigationBar.setButtons({
  //  right: [addButton]
  //});


});


// Show: http://localhost/views/Alert/show.html?id=<id>

AlertApp.controller('ShowCtrl', function ($scope, AlertRestangular) {

  // Helper function for loading Alert data with spinner
  $scope.loadAlert = function() {
    $scope.loading = true;

     Alert.get().then(function(data) {
       $scope.Alert = data;
       $scope.loading = false;
    });

  };

  // Save current Alert id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentAlertId", steroids.view.params.id);

  var Alert = AlertRestangular.one("Alerts", steroids.view.params.id);
  $scope.loadAlert()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadAlert()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Alert: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/Alert/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/Alert/new.html

AlertApp.controller('NewCtrl', function ($scope, AlertRestangular) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(Alert) {
    $scope.loading = true;

    AlertRestangular.all('Alerts').post(Alert).then(function() {

      // Notify the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;

    }, function() {
      $scope.loading = false;

      alert("Error when creating the object, is Restangular configured correctly, are the permissions set correctly?");

    });

  }

  $scope.Alert = {};

});


// Edit: http://localhost/views/Alert/edit.html

AlertApp.controller('EditCtrl', function ($scope, AlertRestangular) {

  var id  = localStorage.getItem("currentAlertId"),
      Alert = AlertRestangular.one("Alert", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(Alert) {
    $scope.loading = true;

    Alert.put().then(function() {

      // Notify the show.html to reload data
      var msg = { status: "reload" };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;
    }, function() {
      $scope.loading = false;

      alert("Error when editing the object, is Restangular configured correctly, are the permissions set correctly?");
    });

  };

  // Helper function for loading Alert data with spinner
  $scope.loadAlert = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/Alert.js)
    Alert.get().then(function(data) {
      $scope.Alert = data;
      $scope.loading = false;
    });
  };

  $scope.loadAlert();

});