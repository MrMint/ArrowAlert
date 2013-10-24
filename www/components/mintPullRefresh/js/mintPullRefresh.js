var pullingToRefreshSuccess = false;
var oldDeltaY = 0;


//function addTransitionsToTarget(element) {
//    //element.style.Transition = 'all .1s linear';
//    //element.style.OTransition = 'all .1s linear';          // Opera
//    //element.style.msTransition = 'all .1s linear';         // IE 9
//    //element.style.MozTransition = 'all .1s linear';        // Firefox
//    element.style.WebkitTransition = '-webkit-transform .2s ease-out';     // Safari and Chrome
//}

//function transformElement3d(element, x, y, z) {
//    element.style.transform = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
//    element.style.OTransform = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';          // Opera
//    element.style.msTransform = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';         // IE 9
//    element.style.MozTransform = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';        // Firefox
//    element.style.WebkitTransform = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';     // Safari and Chrome
//}

function displayPullingQue(percent) {
    var element = document.getElementById('mintPullRefreshQue');
    var windowWidth = window.innerWidth;
    element.style.left = 50 - (50 * percent) + '%';
    element.style.right = 50 - (50 * percent) + '%';
}
Hammer(document.getElementById('content')).on("drag", function (event) {
    if (!pullingToRefreshSuccess) {
        if (event.gesture != null && event.gesture != 'undefined' && event.gesture.deltaY != 'undefined')
            if (event.gesture.direction == "down" && document.getElementById('content').scrollTop == 0) {
                var y = event.gesture.deltaY - oldDeltaY;
                displayPullingQue(event.gesture.deltaY / 200);
                //transformElement3d(document.getElementById('content'), 0, event.gesture.deltaY/2, 0);
                oldDeltaY = event.gesture.deltaY;
                if (event.gesture.deltaY >= 200) {
                    //addTransitionsToTarget(document.getElementById('content'));
                    pullingToRefreshSuccess = true;
                    mintNotify.success("Refreshing!");
                    displayPullingQue(0);
                    //transformElement3d(document.getElementById('content'), 0, 0, 0);
                    //debugNote('We are draggin down! distance: ' + event.gesture.deltaY);
                }
            }
    }


    //broadcastAngularEvent('DEBUG_SETTING_CHANGE', true);
    //prevention(event);
    ////debug log
    //debugNote('INPUT: Swiperight event received on debugSwitch');
});

Hammer(document.getElementById('content')).on("dragend", function (event) {
    pullingToRefreshSuccess = false;
    oldDeltaY = 0;
    displayPullingQue(0);
    //broadcastAngularEvent('DEBUG_SETTING_CHANGE', true);
    //prevention(event);
    ////debug log
    //debugNote('INPUT: Swiperight event received on debugSwitch');
});