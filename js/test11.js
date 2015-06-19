window.addEventListener('click', fullscreen, false);

function fullscreen() {

    var docElm = document.documentElement;

    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (docElm.msRequestFullScreen) {
        docElm.msRequestFullScreen();
    }
}