function SettingsCtrl($scope, $http, $location) {
    $scope.$emit("PAGE_TITLE_CHANGE", "Settings");
    pullToRefreshEnabled = false;
    bindHammerSettings();
    //Check if they have a key in storage, UI changes based on it
    $scope.placeHolder = "Copy your key here";
    var authKey = localStorage.getItem("authKey");
    if (authKey != 'undefined' && authKey != null) {
        $scope.placeHolder = authKey;
    }

    //Saves the key to localstorage, and navigates to login for authentication
    $scope.changeAuthKey = function () {
        localStorage.setItem("authKey", $scope.authKey);
        $location.path('/Login');
    }

    //Opens the native browser and directs the user to the url to obtain authkey
    $scope.openBrowserForKey = function () {
        navigator.app.loadUrl('https://arrowmanager.net/Account/Manage', { openExternal: true });
    }


    //Scan qr code
    $scope.scanQRCode = function () {
        debugNote('QRSCANNER: Launching QR Scanner');
        cordova.plugins.barcodeScanner.scan(
         function (result) {

             if (result.cancelled == true) {
                 //Scan was canceled
                 mintNotify.error('QR scan error, Scan Canceled!');
             }
             else if (result.format != 'QR_CODE') {
                 //A QR code was not scanned
                 mintNotify.error('QR scan error, Not a QR code!');
             }
             else if (result.text.length != 64) {
                 //Captured string is not valid
                 mintNotify.error('QR scan error, Not a valid auth key!');
             }
             else {
                 debugNote('QRSCANNER: Successfully scanned QR auth key');
                 //Store captured Auth Key
                 localStorage.setItem("authKey", result.text);
                 //Redirect to login page
                 $scope.$apply(function () {
                     $location.path('/Login');
                 });
             }
         },
         function (error) {
             mintNotify.error("QR Scan failed: " + error);
         }
      )
    };
    //Handle alert received event
    $scope.$on("DEBUG_SETTING_CHANGE", function (event, value) {
        $scope.$parent.debug = value;
        debugNote('EVENT: Debug_setting_change event received: ' + value);
    });

};

