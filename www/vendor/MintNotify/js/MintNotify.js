var mintNotify = {
	//Amount of time in ms to display notification
	displayTime: 1000,

	//Enqueue success notification
	success: function (message) {
		mintNotifyQue.push(function () {
			mintNotifyBar.innerHTML = message;
			showBar('success');
		});
		mintNotifyrun();
	},

	//Enqueue info notification
	info: function (message) {
		mintNotifyQue.push(function () {
			mintNotifyBar.innerHTML = message;
			showBar('info');
		});
		mintNotifyrun();
	},

	//Enqueue warning notification
	warning: function (message) {
		mintNotifyQue.push(function () {
			mintNotifyBar.innerHTML = message;
			showBar('warning');
		});
		mintNotifyrun();
	},

	//Enqueue error notification
	error: function (message) {
		mintNotifyQue.push(function () {
			mintNotifyBar.innerHTML = message;
			showBar('error');
		});
		mintNotifyrun();
	}
}

var mintNotifyBar = document.getElementById('mintNotifyBar');

var mintNotifyQue = [];

//Helper function that displays the notification bar
function showBar(notificationType) {
	//Get classlist
	var cl = mintNotifyBar.classList;
	if (!cl.contains('showMintBar')) {
		//Add type class
		cl.add(notificationType);
		//Add show class
		cl.add('showMintBar');
		//Call hide after timeout
		setTimeout(function () { hideBar(notificationType) }, mintNotify.displayTime);
	}
}

function hideBar(notificationType) {
	var cl = mintNotifyBar.classList;
	//Remove show css to hide bar
	if (cl.contains('showMintBar')) {
		cl.remove('showMintBar');
	}
	//After timeout, remove the type class, call next notification in que
	setTimeout(function () {
		var cl = mintNotifyBar.classList;
		if (cl.contains(notificationType)) {
			cl.remove(notificationType);
		}
		mintNotifyrun()
	}, 200);
}

//Function that runs the que of functions
function mintNotifyrun() {
	//Call the initial function if not running
	if (!mintNotifyShowing()) {
		(mintNotifyQue.shift())();
	}
}

//Helper function that checks if the notification bar is showing
function mintNotifyShowing() {
	var cl = mintNotifyBar.classList;
	if (cl.contains('showMintBar')) {
		return true;
	}
	return false;
}