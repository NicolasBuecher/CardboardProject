/**
 * Created by buecher on 30/07/15.
 */

var SIMU = SIMU || {};

SIMU.Cardboard = function(view)
{
    this.view = view;
    this.texture = [];
    this.effect = null;
}

SIMU.Cardboard.prototype.setupView = function()
{
    this.effect = new THREE.StereoEffect(this.view.renderer);
    this.effect.eyeSeparation = 0.1;
    this.effect.setSize( window.innerWidth, window.innerHeight );
    //this.view.privateCamera.effect = new THREE.StereoEffect(this.view.renderer);
}

SIMU.Cardboard.prototype.render = function()
{
    var that = this;
    if(!this.view.parameters.synchrorendering) {
        this.renderId = requestAnimationFrame(function () {
            that.render();
        });
    }

    this.animate();

    for(var i = 0; i < this.view.renderableDatas.length;i++){
        if(this.view.renderableDatas[i].isActive && this.view.renderableDatas[i].isReady) {
            if(this.view.parameters.frustumculling) {
                this.view.renderableDatas[i].computeCulling(this.view.camera);
            }
            this.view.renderableDatas[i].uniforms.current_time.value = this.view.clock.elapsedTime;
        }
    }

    this.effect.render(this.view.scene, this.view.camera);

    this.view.showDebuginfo();
    this.view.stats.update();

    //this.view.privateCamera.effect.render(this.view.scene, this.view.privateCamera);
}

SIMU.Cardboard.prototype.animate = function(){
    if(!this.view.camera.isNotFree) {
        this.view.camera.controls.update(this.view.clock.getDelta());
    }else{
        this.view.time += 1/60;
        if(this.view.time < 1.0) {
            this.view.camera.position.set(this.view.origin.x + this.view.time * this.view.objectif.x,
                this.view.origin.y + this.view.time * this.view.objectif.y,
                this.view.origin.z + this.view.time * this.view.objectif.z);
        }else{
            this.view.camera.isNotFree = false;
        }
    }

    //TODO Update frustum only if camera has changed
    if(this.view.parameters.frustumculling) {
        this.view.camera.updateMatrix();
        this.view.camera.updateMatrixWorld();
        this.view.camera.matrixWorldInverse.getInverse(this.view.camera.matrixWorld);

        this.view.camera.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.view.camera.projectionMatrix, this.view.camera.matrixWorldInverse));
    }
};