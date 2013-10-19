//Document elements that are frequently altered and not in a partial view
var bodyElement = document.getElementById('main');

//-----------Hammer bind funtions-----------//
//Binds
function bindHammerIndex() {
    //Binds swiperight to body
    var hammertime = Hammer(bodyElement).on("swiperight", function (event) {
        debugNote('INPUT: Swiperight event received');
        prevention(event);
        openNav();
    });

    //Binds swipeleft to body
    var hammertime = Hammer(bodyElement).on("swipeleft", function (event) {
        debugNote('INPUT: Swipeleft event received');
        prevention(event);
        closeNav();
    });
}

function bindHammerSettings() {

    //Binds swipeleft to debug switch
    var hammertime = Hammer(document.getElementById('debugSwitch')).on("swipeleft", function (event) {
        broadcastAngularEvent('DEBUG_SETTING_CHANGE', false);
        
        prevention(event);
        debugNote('INPUT: Swipeleft event received on debugSwitch');
    });

    //Binds swiperight to debug switch
    var hammertime = Hammer(document.getElementById('debugSwitch')).on("swiperight", function (event) {
        broadcastAngularEvent('DEBUG_SETTING_CHANGE', true);
        prevention(event);
        //debug log
        debugNote('INPUT: Swiperight event received on debugSwitch');
    });

    
}
//-----------Hammer helper funtions-----------//

function prevention(event) {
    event.preventDefault();
    event.stopPropagation();
    event.gesture.preventDefault();
}

//-----------Helper functions for altering UI-----------//

//Opens the nav bar
function openNav() {
    var cl = site.classList;
    if (!cl.contains('open')) {
        cl.add('open');
    }
}

//Closes the nav bar
function closeNav() {
    
    var cl = site.classList;
    if (cl.contains('open')) {
        cl.remove('open');
    }
}

//Changes Nav open state to opposite of current
function changeNav() {
    var cl = site.classList;
    if (cl.contains('open')) {
        cl.remove('open');
    } else {
        cl.add('open');
    }
}

