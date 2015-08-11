/**
 * Created by Nicolas Buecher on 04/08/15.
 */

/**
 * @namespace
 */
var SIMU = SIMU || {};

// STEP 1 : Detect mobile devices
if (SIMU.isMobile.any())
{
    // STEP 2 : Detect API compatibility
    if (window.DeviceOrientationEvent)
    {
        // STEP 3 : Launch cardboard application
        var cardboard = new SIMU.Cardboard();
        cardboard.setup();

        var response = window.confirm("Warning !\n" +
            "To work, this application needs to download  an average of 200Mo of data or more.\n" +
            "Be sure to have a Wi-Fi connexion before continuing.\n" +
            "Click No if you don't want to go further.");

        if (response)
        {
            // Chargement des données
            alert("Ready ? Put your Google Cardboard on your nose now and enjoy !\n" +
                "(Tap the screen to go into fullscreen mode)");
        }
        else
        {
            console.error("User didn't give his permission to download data. The appplication will be aborted.");
        }
    }
    else
    {
        /*
        The browsers that support the DeviceOrientation API are :
            - Chrome 7+
            - Firefox 6+
            - Opera 15+
            - IE 11+
        In addition, the API is also supported by the browser of :
            - Blackberry 10+
            - Opera Mobile 12+
            - Mobile Safari 4.2+
            - Chrome 42+ on Android
            - Firefox 39+ on Android
            - Android Browser 3+
            - IE Mobile 11+
        Source : http://caniuse.com/#feat=deviceorientation
         */
        alert("DeviceOrientation API is not supported by this browser.\nTry to update your browser or use another browser.")
        console.error("DeviceOrientation API is not supported on this device, the application will be aborted.");
    }
}
else
{
    alert("No mobile device detected.\nYou need to use a mobile device to launch this application.")
    console.error("No mobile device detected, the application will be aborted.");
}
