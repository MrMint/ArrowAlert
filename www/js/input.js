var element = document.getElementById('content');
var hammertime = Hammer(element).on("swiperight", function (event) {
    debugNote('Hammer: Swiperight event received');
    event.preventDefault();
    event.gesture.preventDefault();
    openNav();
});

var hammertime = Hammer(element).on("swipeleft", function (event) {
    debugNote('Hammer: Swipeleft event received');
    event.preventDefault();
    event.gesture.preventDefault();
    closeNav();
});