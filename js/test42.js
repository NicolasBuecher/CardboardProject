/* Test de la compatibilité WebGL du navigateur */

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

/* Déclaration des variables globales */

var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

/* Choix du type d'affichage */

var desktop = document.getElementById('desktop');
var oculus = document.getElementById('oculus');
var cardboard = document.getElementById('cardboard');

desktop.addEventListener('click', initDesktop, false);
oculus.addEventListener('click', initOculus, false);
cardboard.addEventListener('click', initCardboard, false);

/* Fonction d'initialisation pour une visualisation sur ordinateur */

function initDesktop()
{
    alert("Fonctionnalité pas encore disponible !");
}

/* Fonction d'initialisation pour visualisation avec un kit Oculus */

function initOculus()
{
    alert("Fonctionnalité pas encore disponible !");
}

/* Fonction d'initialisation avec un kit Google Cardboard */

function initCardboard()
{
    document.getElementById('blocker').style.display = 'none';      // Disparition du menu

    init();                                                         // Initialisation de la scène
    animate();                                                      // Boucle de rendu
}

/* Fonction d'initialisation générale */

function init()
{

    /* Initialisation du renderer */

    renderer = new THREE.WebGLRenderer();                   // Renderer de type WebGLRenderer
    renderer.alpha = 1;                                     // Opaque
    renderer.antialias = true;                              // Anticrénelage activé
    renderer.setPixelRatio( window.devicePixelRatio );      // Initialisation du ratio
    renderer.setClearColor( 0xffffff );                     // Couleur par défaut blanche

    /* Initialisation de la zone de rendu */

    element = renderer.domElement;                          // Récupération du canvas
    container = document.getElementById('example');         // Récupération du bloc destinée au rendu
    container.appendChild(element);                         // Création de la zone de rendu

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(150, 1, 0.1, 5000); // Caméra en vue perspective, FOV de 45 degrés, ratio 1, intervalle de profondeur [0.1, 5000]
    camera.position.set(0,150,0);                           // Position de la caméra affectée à +0X +150Y +0Z
    scene.add(camera);                                      // Ajout de la caméra à la scène

    effect = new THREE.StereoEffect(renderer);

    /*
    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 100, 100);
    scene.add(camera);
*/
    controls = new THREE.OrbitControls(camera, element);
    // controls.rotateUp(Math.PI / 4);
    // controls.rotateLeft(-Math.PI / 8);
    controls.target.set(
        camera.position.x,
        camera.position.y,
        camera.position.z - 0.1
    );
    controls.noZoom = true;
    controls.noPan = true;

    // var axh = new THREE.AxisHelper( 50 )
    // axh.position.y = -10;
    // scene.add( axh );

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);


    // Floor


    // var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    // scene.add(light);

    // var texture = THREE.ImageUtils.loadTexture(
    // 	'_assets/textures/patterns/checker.png'
    // );
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat = new THREE.Vector2(50, 50);
    // texture.anisotropy = renderer.getMaxAnisotropy();

    // var material = new THREE.MeshPhongMaterial({
    // 	color: 0xffffff,
    // 	specular: 0xffffff,
    // 	shininess: 20,
    // 	shading: THREE.FlatShading,
    // 	map: texture,
    // 	transparent: true,
    // 	opacity: 0.5
    // });

    // var geometry = new THREE.PlaneBufferGeometry(1000, 1000);

    // var mesh = new THREE.Mesh(geometry, material);
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.position.y = -10;
    // scene.add(mesh);




    // Photo taken with Photosynth app


    // Equirectangular panorama - broken on iOS because of iOS bug?

    // var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    // var material = new THREE.MeshBasicMaterial( {
    // 	map: THREE.ImageUtils.loadTexture( '_assets/images/slingshot-cubemap/environment.jpg' )
    // } );

    // mesh = new THREE.Mesh( geometry, material );
    // mesh.rotation.y = - Math.PI / 2;
    // scene.add( mesh );

    // wfh = new THREE.WireframeHelper( mesh, 0xffffff );
    // scene.add( wfh );


    /*
     // Cubemap Skybox

     var path = "_assets/images/slingshot-cubemap/";
     var format = '.png';
     var urls = [
     path + 'pos-x' + format, path + 'neg-x' + format,
     path + 'pos-y' + format, path + 'neg-y' + format,
     path + 'pos-z' + format, path + 'neg-z' + format
     ];

     var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
     reflectionCube.format = THREE.RGBFormat;

     var shader = THREE.ShaderLib[ "cube" ];
     shader.uniforms[ "tCube" ].value = reflectionCube;

     var material = new THREE.ShaderMaterial( {

     fragmentShader: shader.fragmentShader,
     vertexShader: shader.vertexShader,
     uniforms: shader.uniforms,
     depthWrite: false,
     side: THREE.BackSide

     });

     mesh = new THREE.Mesh( new THREE.BoxGeometry( 500, 500, 500 ), material );
     scene.add( mesh );

     // wfh = new THREE.WireframeHelper( mesh, 0xffffff );
     // scene.add( wfh );
     */

    var light = new THREE.PointLight( 0xffffff );
    light.position.set(200,200,200);
    scene.add(light);


    loadScene();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );


    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);
}

function render(dt) {
    // TODO: if device orientation !e.alpha, use renderer instead of stereo effect
    // renderer.render(scene, camera);

    effect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
    stats.update();
}

function fullscreen()
{

    if (screenfull.enabled)
    {
        screenfull.request(container);
    }
    else
    {
        alert("Impossible de passer en mode plein écran.");
    }
}



function loadScene()
{
    loadGround();
    loadSkyBox();
    loadCubes();
}

function loadGround()
{

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

}

function loadSkyBox()
{

    /* Initialisation du matériau de la skybox */
    var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });

    /* Initialisation de la géométrie de la skybox */
    var skyboxGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

    /* Initialisation du mesh de la skybox */

    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

}

function loadCubes()
{

    var cubeMesh;

    /* Initialisation du matériau des cubes */
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });      // Matériau de Lambert
    var cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });     // Matériau de Lambert
    var cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0x0000ff });     // Matériau de Lambert
    var cubeMaterial4 = new THREE.MeshLambertMaterial({ color: 0xff00ff });     // Matériau de Lambert

    /* Initialisation de la géométrie des cubes */
    var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);                   // Cube de 50x50x50
    var cubeGeometry2 = new THREE.BoxGeometry(100, 100, 100);               // Cube de 100x100x100
    var cubeGeometry3 = new THREE.BoxGeometry(200, 200, 200);               // Cube de 200x200x200
    var cubeGeometry4 = new THREE.BoxGeometry(400, 400, 400);               // Cube de 400x400x400

    /* Initialisation des meshs des cubes */

    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);              // Création du mesh
    cubeMesh.rotation.y = Math.PI * 45 / 180;                               // Rotation de PI/4 autour de l'axe Y
    cubeMesh.position.set(-200, 25, -200);                                  // Position affectée à -200X +25Y -200Z
    scene.add(cubeMesh);                                                    // Ajout du mesh à la scène

    cubeMesh = new THREE.Mesh(cubeGeometry2, cubeMaterial2);                // Création du mesh
    cubeMesh.rotation.y = Math.PI * 45 / 180;                               // Rotation de PI/4 autour de l'axe Y
    cubeMesh.position.set(-100, 50, 100);                                   // Position affectée à -100X +50Y +100Z
    scene.add(cubeMesh);                                                    // Ajout du mesh à la scène

    cubeMesh = new THREE.Mesh(cubeGeometry3, cubeMaterial3);                // Création du mesh
    cubeMesh.rotation.y = Math.PI * 45 / 180;                               // Rotation de PI/4 autour de l'axe Y
    cubeMesh.position.set(200, 100, -50);                                   // Position affectée à +200X +100Y -50Z
    scene.add(cubeMesh);                                                    // Ajout du mesh à la scène

    cubeMesh = new THREE.Mesh(cubeGeometry4, cubeMaterial4);                // Création du mesh
    cubeMesh.rotation.y = Math.PI * 45 / 180;                               // Rotation de PI/4 autour de l'axe Y
    cubeMesh.position.set(800, 200, 200);                                   // Position affectée à +800X +200Y +200Z
    scene.add(cubeMesh);                                                    // Ajout du mesh à la scène

}