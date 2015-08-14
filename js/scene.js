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
 * @description Represents the scene displayed by the view
 *
 * @class Scene
 *
 * @property    {THREE.Scene}           itself      - The Three.JS Scene object
 * @property    {PerspectiveCamera}     camera      - The Three.JS PerspectiveCamera object to see the scene
 */
SIMU.Scene = function()
{
    this.itself             = null;
    this.camera             = null;
    this.textures           = [];

    this.renderableDatas    = [];

    this.parameters                 = {
        t                           : 0,
        deltaT                     : 0,
        active                      : false,
        pointSize                   : 0.5,
        fog                         : false,
        globalCamera                  : false,
        shaderType                  : SIMU.ShaderType.STATIC,
        color                       : [ 255, 255, 255],
        idInfo                      : -1,
        idTexture                   : -1,
        idBlending                  : -1,
        frustumCulling              : true,
        levelOfDetail               : 4
    };
}

/**
 * Sets up the properties of Scene
 *
 * @name Scene#setup
 * @method
 */
SIMU.Scene.prototype.setup = function()
{
    this.itself = new THREE.Scene();

    var axisHelper = new THREE.AxisHelper(1);
    axisHelper.frustumCulled = true;
    this.itself.add( axisHelper );

    this.camera = new THREE.PerspectiveCamera( 75, 1.0, 0.0001, 200);
    this.camera.rotation.order = 'ZYX'; // Useless ?
    this.camera.position.set( 0.5, 0.5, 0.5 );
    this.camera.lookAt( new THREE.Vector3(0, 0, 0) );
    this.camera.frustum = new THREE.Frustum();
}

SIMU.Scene.prototype.addRenderableData = function(data)
{
    this.currentRenderableDataId    = this.renderableDatas.length;
    this.renderableDatas.push(data);
}

SIMU.Scene.prototype.activateCurrentData = function()
{
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    currentRenderableData.resetData();
    this.enableCurrentDataShaderMode();
    currentRenderableData.isActive = true;
    this.itself.add(currentRenderableData.pointCloud);
};

SIMU.Scene.prototype.enableCurrentDataShaderMode = function()
{
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    switch(this.parameters.shaderType){
        case SIMU.ShaderType.STATIC :
            currentRenderableData.enableStaticShaderMode();
            break;
        case SIMU.ShaderType.ANIMATED :
            currentRenderableData.enableAnimatedShaderMode();
            break;
        case SIMU.ShaderType.PARAMETRICSTATIC :
            currentRenderableData.enableStaticParametricShaderMode();
            break;
        case SIMU.ShaderType.PARAMETRICANIMATED :
            currentRenderableData.enableAnimatedParametricShaderMode();
            break;
        default:
            break;
    }
};