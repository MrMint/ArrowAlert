var pullingToRefreshSuccess = false;
var showingTooltip = false;
var mintPullInfoTooltip = document.getElementById('mintPullInfo');
var pullToRefreshEnabled = false;

function displayPullingQue(percent) {
    var element = document.getElementById('mintPullRefreshQue');
    var windowWidth = window.innerWidth;
    element.style.left = 50 - (50 * percent) + '%';
    element.style.right = 50 - (50 * percent) + '%';
}
//
Hammer(document.getElementById('content')).on("drag", function (event) {
    if (pullToRefreshEnabled) {
        if (!pullingToRefreshSuccess) {
            if (event.gesture != null && event.gesture != 'undefined' && event.gesture.deltaY != 'undefined')
                if (event.gesture.direction == "down" && document.getElementById('content').scrollTop == 0) {
                    prevention(event);
                    if (!showingTooltip) {
                        showTooltip();
                    }
                    displayPullingQue(event.gesture.deltaY / 200);

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
        //broadcastAngularEvent('DEBUG_SETTING_CHANGE', true);
        //prevention(event);
        ////debug log
        //debugNote('INPUT: Swiperight event received on debugSwitch');
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