//TODO: Organize/clean this up
var pullingToRefreshSuccess = false;
var showingTooltip = false;
var mintPullInfoTooltip = document.getElementById('mintPullInfo');

var pullToRefreshEnabled = false;

//Gives user visual feedback on percent needed to pull
function displayPullingQue(percent) {
    var element = document.getElementById('mintPullRefreshQue');
    var windowWidth = window.innerWidth;
    element.style.left = 50 - (50 * percent) + '%';
    element.style.right = 50 - (50 * percent) + '%';
}

Hammer(document.getElementById('content')).on("drag", function (event) {
    //Check if enabled
    if (pullToRefreshEnabled) {
        //Check if refresh already achieved during this drag
        if (!pullingToRefreshSuccess) {
            if (event.gesture != null && event.gesture != 'undefined' && event.gesture.deltaY != 'undefined')
                if (event.gesture.direction == "down" && document.getElementById('content').scrollTop == 0) {

                    prevention(event);
                    if (!showingTooltip) {
                        showTooltip();
                    }

                    displayPullingQue(event.gesture.deltaY / 200);
                    //If user pulls 200px down, send refresh command
                    if (event.gesture.deltaY >= 200) {
                        pullingToRefreshSuccess = true;
                        mintNotify.success("Refreshing!");
                        displayPullingQue(0);
                        hideTooltip();
                        broadcastAngularEvent('PULL_REFRESH');
                        //Debug Log
                        debugNote('PULLREFRESH: Pull refresh detected');
                    }
                }
        }
    }
});

Hammer(document.getElementById('content')).on("dragend", function (event) {
    if (pullToRefreshEnabled) {
        pullingToRefreshSuccess = false;
        displayPullingQue(0);
        hideTooltip();
    }
});

//Helper function that displays the tooltip
function showTooltip() {
    showingTooltip = true;
    //Get classlist
    var cl = mintPullInfoTooltip.classList;
    if (!cl.contains('showPullInfo')) {
        //Add show class
        cl.add('showPullInfo');
    }
}
//Helper function that hides the tooltip
function hideTooltip() {
    showingTooltip = false;
    var cl = mintPullInfoTooltip.classList;
    //Remove show css to hide bar
    if (cl.contains('showPullInfo')) {
        cl.remove('showPullInfo');
    }
}