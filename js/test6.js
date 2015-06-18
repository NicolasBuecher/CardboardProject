


var container = null,
    renderer = null,
    effect = null,
    controls = null,
    scene = null,
    camera = null,
    cube = null;


$(document).ready(
    function() {

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
    }
);

var duration = 10000; // ms
var currentTime = Date.now();
function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    cube.rotation.y += angle;
}

function run() {
    requestAnimationFrame(function() { run(); });

    // Render the scene
    effect.render( scene, camera );

    // Update the VR camera controls
    controls.update();

    // Spin the cube for next frame
    animate();

}

function initThreeJS() {

    container = document.getElementById("container");

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);


    window.addEventListener( 'resize', function(event) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false );

}

function initVREffect() {

    // Set up Cardboard renderer
    effect = new THREE.StereoEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    // StereoEffect's default separation is in cm, we're in M
    // Actual cardboard eye separation is 2.5in
    // Finally, separation is per-eye so divide by 2
    effect.separation = 2.5 * 0.0254 / 2;


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

function initScene() {
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 4000 );
    scene.add(camera);

    // Create a texture-mapped cube and add it to the scene
    // First, create the texture map
    var mapUrl = "../images/webvr-logo-512.jpeg";
    var map = THREE.ImageUtils.loadTexture(mapUrl);

    // Now, create a Basic material; pass in the map
    var material = new THREE.MeshBasicMaterial({ map: map });

    // Create the cube geometry
    var geometry = new THREE.BoxGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Move the mesh back from the camera and tilt it toward the viewer
    cube.position.z = -6;
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Finally, add the mesh to our scene
    scene.add( cube );

}

function initVRControls() {

    // Set up VR camera controls
    controls = new THREE.DeviceOrientationControls(camera);
}



