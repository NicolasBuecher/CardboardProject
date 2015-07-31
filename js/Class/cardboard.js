/**
 * Created by buecher on 30/07/15.
 */

var SIMU = SIMU || {};

SIMU.Cardboard = function()
{
    this.datas = [];
    this.view = null;
    this.globalCamera = null;
    this.texture = [];
    this.windowResizeEvent = null;
}

SIMU.Cardboard.prototype.setup = function()
{
    if (SIMU.isMobile.any())
    {
        console.log("Mobile device detected !");

        if (window.DeviceOrientationEvent)
        {
            console.log("DeviceOrientation is supported !");

            this.globalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.00001, 200);
            this.globalCamera.rotation.order  = 'ZYX';
            this.globalCamera.position.set(0.5, 0.5, 0.5);
            this.globalCamera.lookAt(new THREE.Vector3(0, 0, 0));

            this.globalCamera.controls = new THREE.FirstPersonControls(this.globalCamera, document.getElementById('container'));
            this.globalCamera.controls.moveSpeed = 0.5;
            this.globalCamera.controls.enabled = false;

            this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/spark1.png"));
            this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/star.gif"));

            document.getElementById('container').innerHTML = "";

            this.view = new SIMU.View();
            this.view.setupView(0, 0, (window.innerWidth/2), window.innerHeight);
            this.view.setupScene();
            this.view.texture = this.texture;

            // Remplir Datas antérieurement
            for(var i = 0; i < this.datas.length;i++) {
                var renderableData = new SIMU.RenderableData();
                renderableData.setData(this.datas[i]);
                this.view.addRenderableData(renderableData);
            }

            document.getElementById('container').appendChild(this.currentView.domElement);
            this.view.isShown = true;
            this.view.resize(window.innerWidth, window.innerHeight, 0, 0);
            this.view.setGlobalCamera(this.globalCamera);
            this.view.render();

            if(this.windowResizeEvent){
                window.removeEventListener('resize', this.windowResizeEvent, false);
            }
            this.windowResizeEvent = this.onSingleviewWindowResize.bind(this);
            window.addEventListener( 'resize',this.windowResizeEvent, false );

            this.render();
        }
        else
        {
            console.error("DeviceOrientation is not supported on this device.");
        }
    }
    else
    {
        console.error("No mobile device detected, program will be aborted.");
    }
}

SIMU.Cardboard.prototype.render = function()
{
    var that = this;
    this.requestId = requestAnimationFrame(function (){
        that.render();
    });

    if (this.view.parameters.synchrorendering)
    {
        this.view.render();
    }
}