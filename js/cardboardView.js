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
 * @description Represents a cardboard view (with stereo effect)
 *
 * @class CardboardView
 *
 * @property    {HTML}              domElement      - HTML element of the view
 * @property    {Scene}             scene           - The scene displayed by the view
 * @property    {StereoEffect}      renderer        - Renderer for a cardboard view based on a webGL renderer
 * @property    {PerspectiveCamera} camera          - Camera to see the scene
 * @property    {number}            width           - Width of the canvas
 * @property    {number}            height          - Height of the canvas
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

    window.addEventListener('resize', this.resize.bind(this), false);
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
    this.renderer.render(this.scene.itself, this.camera);
}

SIMU.CardboardView.prototype.addData = function(data)
{
    var renderableData = new SIMU.RenderableData();
    renderableData.setData(data);
    this.scene.addRenderableData(renderableData);
}

SIMU.CardboardView.prototype.activateData = function()
{
    this.scene.activateCurrentData();
}