/**
 * Created by Nicolas Buecher on 06/08/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

/**
 * Represents a cardboard view (with stereo effect)
 *
 * @name CardboardView
 * @class
 *
 * @property    {HTML}      domElement      : HTML element of the view
 * @property    {Scene}     scene           : The scene displayed by the view
 */
SIMU.CardboardView = function()
{
    this.domElement             = null;
    this.scene                  = null;
    this.renderer               = null;

    this.width                  = 0;
    this.height                 = 0;

    this.sceneParameters            = {
        t                           : 0,                                    /** The snapshot time **/
        delta_t                     : 0,                                    /** The current elapsed time **/
        active                      : false,                                /** True if the current point cloud is displayed **/
        pointsize                   : 0.5,                                  /** Size of the particle within the point cloud **/
        fog                         : false,                                /** True if the fog is enable **/
        blink                       : false,                                /** True if blinking effect is enable **/
        linkcamera                  : false,                                /** True if the current used camera is the global one **/
        isStatic                    : true,                                 /** True if we are in static mode **/
        color                       : [ 255, 255, 255],                     /** Default color of the current point cloud **/
        idInfo                      : -1,                                   /** Id of the current info of the current point cloud **/
        idTexture                   : -1,                                   /** Id of the texture used in the current point cloud **/
        idBlending                  : -1,                                   /** Id of the blending mode used in the current point cloud **/
        frustumculling              : true,                                 /** True if view frustum culling is enabled **/
        levelOfDetail               : 4,                                    /** level of detail of the point cloud **/
        oculus                      : false,
        idParam                     : 0,
        paramEnabled                : false
    };

    this.clock                  = null;
}

/**
 * Sets up the properties of CardboardView
 *
 * @name CardboardView#setup
 * @method
 */
SIMU.CardboardView.prototype.setup = function()
{
    this.clock = new THREE.Clock();

    this.scene = new SIMU.Scene();
    this.scene.setup();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    var webGLRenderer = new THREE.WebGLRenderer();
    this.domElement = webGLRenderer.domElement;

    this.renderer = new THREE.StereoEffect( webGLRenderer );
    this.renderer.eyeSeparation = 0.1;
    this.renderer.setSize(this.width, this.height);

    this.camera = this.scene.camera;
    //this.camera.useDeviceOrientationControls(this);

    this.resize();
}

SIMU.CardboardView.prototype.resize = function()
{
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );
};

SIMU.CardboardView.prototype.render = function()
{
    /*
    var that = this;
    requestAnimationFrame(function () {
        that.render();
    });
*/
    this.animate();
/*
    if (this.sceneParameters.frustumculling) {
        this.scene.computeCulling(this.camera);
    }
*/
    //this.scene.setDeltaT(this.clock.elapsedTime);
    this.renderer.render(this.scene.itself, this.camera);
}

SIMU.CardboardView.prototype.animate = function()
{
//    if (!this.camera.isNotFree)
//    {
        this.camera.controls.update(this.clock.getDelta());
/*    }
    else
    {
        this.time += 1/60;
        if (this.time < 1.0)
        {
            this.camera.position.set(this.origin.x + this.time * this.objectif.x,
                this.origin.y + this.time * this.objectif.y,
                this.origin.z + this.time * this.objectif.z);
        }
        else
        {
            this.camera.isNotFree = false;
        }
    }
*/
    //TODO Update frustum only if camera has changed
    if (this.scene.parameters.frustumculling)
    {
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);

        this.camera.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    }
};

SIMU.CardboardView.prototype.getCanvas = function()
{
    return this.renderer.domElement;
}