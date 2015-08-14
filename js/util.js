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

SIMU.files = {
    darkMatterStart: function()
    {
        var result = [];
        for (var i = 0; i < 40; i++)
        {
            if (i < 10)
                result[i] = "data/Deparis_data_binaire/part_start/part.00000.p0000" + i;
            else if (i < 100)
                result[i] = "data/Deparis_data_binaire/part_start/part.00000.p000" + i;
            else
                result[i] = "data/Deparis_data_binaire/part_start/part.00000.p00" + i;
        }
        return result;
    },
    darkMatterEnd: function()
    {
        var result = [];
        for (var i = 0; i < 128; i++)
        {
            if (i < 10)
                result[i] = "data/Deparis_data_binaire/part_end/part.00010.p0000" + i;
            else if (i < 100)
                result[i] = "data/Deparis_data_binaire/part_end/part.00010.p000" + i;
            else
                result[i] = "data/Deparis_data_binaire/part_end/part.00010.p00" + i;
        }
        return result;
    },
    stars: function() {
        return null;
    }
};

SIMU.scripts = {
    darkMatter: function(file) {
        var array = new Float32Array(file);
        var nbElements = (array.length-2)/10;
        var position = new Float32Array(nbElements*3);
        var speed = new Float32Array(nbElements*3);
        var masse = new Float32Array(nbElements);
        var epot = new Float32Array(nbElements);
        var ekin = new Float32Array(nbElements);
        var index = new Float32Array(nbElements);

        for(var i = 0; i<nbElements;i++)
        {
            position[i * 3] = array[2 + i * 10];
            position[i * 3 + 1] = array[3 + i * 10];
            position[i * 3 + 2] = array[4 + i * 10];
            speed[i * 3] = array[5 + i * 10];
            speed[i * 3 + 1] = array[6 + i * 10];
            speed[i * 3 + 2] = array[7 + i * 10];
            index[i] = array[8 + i * 10];
            masse[i] = array[9 + i * 10];
            epot[i] = array[10 + i * 10];
            ekin[i] = array[11 + i * 10];
        }
        return  [   {name : "index", value : index},
                    {name : "position", value : position},
                    //{name : "speed", value : speed},
                    {name : "masse", value : masse},
                    {name : "epot", value : epot},
                    {name : "ekin", value : ekin}
                ];
    },
    stars: function(file) {
        return null;
    }
};

SIMU.ShaderType = {
    STATIC : 0,
    ANIMATED : 1,
    PARAMETRICSTATIC : 2,
    PARAMETRICANIMATED : 3
};