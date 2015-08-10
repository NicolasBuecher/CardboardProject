/**
 * Created by Nicolas Buecher on 04/08/15.
 */

var SIMU = SIMU || {};

/**
 * @author Nicolas Buecher
 * @date 04/08/15
 * @version 1.0
 *
 * Represents the whole simulation
 *
 * @name Cardboard
 * @class
 *
 * @property
 * @property
 */
SIMU.Cardboard = function()
{
    this.scene          = null;

    this.parameters     = {
        "t"                 : 0.0001,
        "position"          : 0,
        "speed"             : 0.5,
        "idScript"          : 0,
        "raycasting"        : false,
        "frustumculling"    : false,
        "play"              : false,
        "octreeprecision"   : 0
    };

    this.datas          = null;

    this.camera         = null;

    this.script         = null;

    this.textures       = [];

    this.view           = null;

    this.controls       = null;

    this.loadingBar     = null;

    this.domElement     = null;
    this.container      = null;

    this.width          = 0;
    this.height         = 0;
}

SIMU.Cardboard.prototype.setup = function()
{
    /* Load textures */
    this.textures.push(THREE.ImageUtils.loadTexture("resources/textures/spark.png"));
    this.textures.push(THREE.ImageUtils.loadTexture("resources/textures/star.gif"));
    this.textures.push(THREE.ImageUtils.loadTexture("resources/textures/starburst.jpg"));
    this.textures.push(THREE.ImageUtils.loadTexture("resources/textures/flatstar.jpg"));

    this.container = document.getElementById('container');

    // Step 4 : Create cardboard view
    this.view = new SIMU.CardboardView();
    this.view.setup();
    this.view.scene.textures = this.textures;

    this.container.appendChild(this.view.domElement);
    this.view.resize();
    this.view.render();

    var that = this;

    // Step 5 : Enable head tracking controls
    function setOrientationControls(e) {

        if (!e.alpha) {
            return;
        }

        that.controls = new THREE.DeviceOrientationControls(that.view.camera,  true);                   // Contrôles par orientation du mobile
        that.controls.connect();                                                             // Initialisation
        that.controls.update();                                                              // Mise à jour

        that.view.domElement.addEventListener('click', that.fullscreen, false);                           // Passage en mode plein écran pour les mobiles

        window.removeEventListener('deviceorientation', setOrientationControls, false);  // Suppression de l'événement

        // Step 6 : If all is good, render view
        that.render();
    }

    window.addEventListener('deviceorientation', setOrientationControls, false);         // Mise en place des contrôles pour mobile si détection de mobile compatible
}


SIMU.Cardboard.prototype.render = function()
{
    var that = this;
    requestAnimationFrame(function () {
        that.render();
    });

    this.controls.update();
    this.view.render();
}

SIMU.Cardboard.prototype.fullscreen = function()
{
    if (screenfull.enabled)
    {
        screenfull.request(document.body);
    }
    else
    {
        alert("Impossible de passer en mode plein écran.");
    }
}