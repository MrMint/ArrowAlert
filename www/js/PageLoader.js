/**
 * Load page into url
 *
 * @param url           The url to load
 * @param onleave       The function to call before leaving
 * @param onenter       The function to call after loading
 */
function loadPage(url, onleave, onenter) {

    // If onleave function specified
    if (onleave) {
        onleave();
    }

    var xmlhttp = new XMLHttpRequest();

    // Callback function when XMLHttpRequest is ready
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState === 4){
            if (xmlhttp.status === 200) {
                document.getElementById('content').innerHTML = xmlhttp.responseText;

                // If onenter function specified
                if (onenter) {
                    onenter();
                }
            }
            else {
                document.getElementById('content').innerHTML = "Error loading page " + url;
            }
        }
    };
    xmlhttp.open("GET", url , true);
    xmlhttp.send();
}