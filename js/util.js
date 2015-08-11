/**
 * Created by Nicolas Buecher on 06/08/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

/**
 * @author Nicolas Buecher
 * @date 06/08/15
 * @version 1.0
 *
 * @description Contains all the functions necessary to know if the current device is a mobile device or not and which type of OS is used
 *
 * @name isMobile
 * @global
 *
 * @property    {function}      Android     - Returns true if it's an android device, false otherwise
 * @property    {function}      BlackBerry  - Returns true if it's a blackberry device, false otherwise
 * @property    {function}      iOS         - Returns true if it's an iOS device, false otherwise
 * @property    {function}      Opera       - Returns true if it's an opera device, false otherwise
 * @property    {function}      Windows     - Returns true if it's a windows device, false otherwise
 * @property    {function}      any         - Returns true if it's any of android, blackberry, iOS, opera or windows device, false otherwise
 */
SIMU.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (SIMU.isMobile.Android() || SIMU.isMobile.BlackBerry() || SIMU.isMobile.iOS() || SIMU.isMobile.Opera() || SIMU.isMobile.Windows());
    }
};