/**
 * Created by Nicolas Buecher on 06/08/15.
 */

/**
 * @namespace
 */
var SIMU = SIMU || {};

/**
 * Represents the scene displayed by the view
 *
 * @name Scene
 * @class
 *
 * @property    {THREE.Scene}               itself      - The Three.JS Scene object
 * @property    {THREE.PerspectiveCamera}   camera      - The Three.JS PerspectiveCamera object
 */
SIMU.Scene = function()
{
    this.itself         = null;
    this.camera         = null;
    this.textures       = [];
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
