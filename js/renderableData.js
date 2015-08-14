/**
 * Created by Nicolas Buecher on 13/08/15.
 */

var SIMU = SIMU || {};

SIMU.RenderableData = function()
{
    this.data                               = null;
    this.pointCloud                         = null;

    this.isActive                           = false;
    this.isReady                            = false;

    this.drawCalls                          = [];
    this.levelOfDetail                      = 4;

    this.defaultColor                       = [255, 255, 255];
    this.idTexture                          = 0;
    this.idBlending                         = 1;
    this.idInfo                             = 0;

    this.clock                              = new THREE.Clock();

    this.bufferGeometry                             = new THREE.BufferGeometry();
    this.bufferGeometry.dynamic                     = true;

    this.pointCloud = new THREE.PointCloud(this.bufferGeometry, this.staticShaderMaterial);

    this.animatedAttributes                 = {
        departure:      {type: 'v3', value: []},
        direction:    {type: 'v3', value: []},
        color:          {type: 'v3', value: []}
    };

    this.staticAttributes                   = {
        color:          {type: 'v3', value: []}
    };
//
    this.animatedParametricAttributes       = {
        departure:              {type: 'v3', value: []},
        direction:            {type: 'v3', value: []},
        information:            {type: 'f', value: []},
        color:                  {type: 'v3', value: []}
    };
//
    this.staticParametricAttributes         = {
        information:            {type: 'f', value: []},
        color:                  {type: 'v3', value: []}
    };

    this.uniforms                           = {
        t:              { type: 'f', value: 0.001},
        currentTime:   { type: 'f', value: 60.0},
        size:           { type: 'f', value: 0.5},
        fogFactor:      { type: 'f', value: 0.9},
        fogDistance:    { type: 'f', value: 3.4},
        map:            { type: 't', value: THREE.ImageUtils.loadTexture("resources/textures/spark.png")},
        fog:            { type: 'i', value: 0},
        blink:          { type: 'i', value: 0},
        paramType:     { type: 'i', value: 0},
        minInfo:       { type: 'f', value: 0.0},
        maxInfo:       { type: 'f', value: 0.0}
    };

    this.animatedShaderMaterial             = new THREE.ShaderMaterial( {
        attributes:     this.animatedAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.default.animated.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.default.animated.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticShaderMaterial               = new THREE.ShaderMaterial({
        attributes:     this.staticAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.default.static.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.default.static.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.animatedParametricShaderMaterial           = new THREE.ShaderMaterial({
        attributes:     this.animatedParametricAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.parametric.animated.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.parametric.animated.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticParametricShaderMaterial           = new THREE.ShaderMaterial({
        attributes:     this.staticParametricAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.parametric.static.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getShaderManagerInstance().shaders.parametric.static.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });
}

SIMU.RenderableData.prototype.setData = function(data)
{
    this.data = data;
    this.resetData();
}

SIMU.RenderableData.prototype.resetData = function()
{
    alert("OHEEEE");
    if(this.data.isReady)
    {
        //Clear the memory
        this.pointCloud.geometry = null;
        this.bufferGeometry.dispose();

        if(this.data.departureIsSet){
            this.bufferGeometry.addAttribute('departure', new THREE.BufferAttribute(this.data.departure, 3));
        }

        if(this.data.infoIsSet){
            this.bufferGeometry.addAttribute('information', new THREE.BufferAttribute(this.data.info, 1));
        }

        if(this.data.positionIsSet){
            this.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.data.position, 3));
        }

        if(this.data.colorIsSet){
            this.bufferGeometry.addAttribute('color', new THREE.BufferAttribute(this.data.color, 3));
        }

        if(this.data.directionIsSet){
            this.bufferGeometry.addAttribute('direction', new THREE.BufferAttribute(this.data.direction, 3));
        }

        this.pointCloud.geometry = this.bufferGeometry;

        this.isReady = true;
    }
    else
    {
        this.isReady = false;
        console.log("Warning : data is set but not ready yet.");
    }
}

/**
 * Set the PointCloud in animated mode, i.e. with the position being compute within the shader (GPU)
 */
SIMU.RenderableData.prototype.enableAnimatedShaderMode = function(){
    if(this.data.currentDepartureIsSet && this.data.currentDirectionIsSet) {
        this.pointCloud.material = this.animatedShaderMaterial;
    }
    else {
        console.log("No direction set");
        this.pointCloud.material = this.staticShaderMaterial;
    }
};

/**
 * Set the PointCloud in static mode, i.e. with the position being compute within the CPU
 */
SIMU.RenderableData.prototype.enableStaticShaderMode = function(){
    this.pointCloud.material = this.staticShaderMaterial;

};

/**
 * Set the PointCloud in parametric mode, where the interpolate information within the shader, while computing position on CPU side
 */
SIMU.RenderableData.prototype.enableStaticParametricShaderMode = function(){
    if(this.data.currentInfoIsSet) {
        this.pointCloud.material = this.staticParametricShaderMaterial;
    }
    else {
        console.log("No information available");
        this.pointCloud.material = this.staticShaderMaterial;
    }

};

/**
 * Set the PointCloud in parametric mode, where the interpolate information within the shader, while computing position on GPU side
 */
SIMU.RenderableData.prototype.enableAnimatedParametricShaderMode = function(){
    if(this.data.currentDepartureIsSet && this.data.currentDirectionIsSet) {
        if(this.data.currentInfoIsSet) {
            this.pointCloud.material = this.animatedParametricShaderMaterial;
        }
        else {
            console.log("No information available");
            this.pointCloud.material = this.animatedShaderMaterial;
        }
    }
    else {
        console.log("No direction set");
        this.pointCloud.material = this.staticShaderMaterial;
    }
};