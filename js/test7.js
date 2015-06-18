/* Déclaration des varibales */

var renderer, scene, camera;
var controls, effect;
var light;

// Set up Three.js
initThreeJS();

// Set up VR rendering
initVREffect();

// Create the scene content
initScene();

// Set up VR camera controls
initVRControls();

// Run the run loop
run();

function initThreeJS()
{

    container = document.getElementById("container");

    // Create the Three.js renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0xffffff } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to the canvas
    container.appendChild(renderer.domElement);

    // Manage resize situation
    window.addEventListener( 'resize', function(event) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false );

}

function initVREffect()
{

    // Set up Cardboard renderer
    effect = new THREE.StereoEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    // StereoEffect's default separation is in cm, we're in M
    // Actual cardboard eye separation is 2.5in
    // Finally, separation is per-eye so divide by 2
    effect.eyeSeparation = 2.5 * 0.0254 / 2;

    // Set up fullscreen mode handling
    var fullScreenButton = document.querySelector( '.button' );
    fullScreenButton.onclick = function() {
        if ( container.mozRequestFullScreen ) {
            container.mozRequestFullScreen();
        } else {
            container.webkitRequestFullscreen();
        }
    };
}

function initScene()
{

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set(100, 100, 100);
    scene.add(camera);

    // Add a light so everything won't be black
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    /*******************\
    * Chargement du sol *
    \*******************/

    /* Initialisation de la texture principale */

    var groundTexture = THREE.ImageUtils.loadTexture('textures/checker.png');         // Chargement de la texture
    groundTexture.wrapS = THREE.RepeatWrapping;                                       // Répétition de la texture sur le vecteur S
    groundTexture.wrapT = THREE.RepeatWrapping;                                       // Répétition de la texture sur le vecteur T
    groundTexture.repeat = new THREE.Vector2(50, 50);                                 // Nombre de répétitions sur chaque axe
    groundTexture.anisotropy = renderer.getMaxAnisotropy();                           // Anisotropy : Number of samples taken along the axis through the pixel that has the highest density of texels

    /* Initialisation du matériau du sol */

    var groundMaterial = new THREE.MeshPhongMaterial({      // Matériau de Phong
        color: 0xffffff,                                    // Blanc
        specular: 0xffffff,                                 // Blanc
        shininess: 20,                                      // Brillance
        shading: THREE.FlatShading,                         // Ombrage de Lambert
        map: groundTexture                                  // Association de la texture
    });

    /* Initialisation de la géométrie du sol */
    var groundGeometry = new THREE.PlaneGeometry(10000, 10000);     // Plan de 10000x10000

    /* Initialisation du mesh du sol */

    var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);        // Création du mesh
    groundMesh.rotation.x = -Math.PI / 2;                                   // Rotation de -PI/2 autour de l'axe X
    scene.add(groundMesh);                                                  // Ajout du mesh à la scène

    /*************************\
    * Chargement de la skybox *
    \*************************/

    /* Initialisation du matériau de la skybox */
    var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.BackSide });

    /* Initialisation de la géométrie de la skybox */
    var skyboxGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

    /* Initialisation du mesh de la skybox */

    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

}

function initVRControls()
{

    // Set up VR camera controls
    controls = new THREE.DeviceOrientationControls(camera);
}

function run()
{

    requestAnimationFrame(run);

    // Render the scene
    effect.render( scene, camera );

    // Update the VR camera controls
    controls.update();

}