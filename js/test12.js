/* Déclaration des variables globales */

var renderer, scene, camera;
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

/* Fonction d'initialisation pour visualisation sur un ordinateur */

function initDesktop()
{
    init();
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // animate();
}

/* Fonction d'initialisation pour visualisation avec un kit Oculus */

function initOculus()
{
    init();
    controls = new THREE.VRControls(camera);
    effect = new THREE.VREffect(renderer);

    // animate();
}

/* Fonction d'initilisation pour visualisation avec un kit Google Cardboard */

function initCardboard()
{
    document.getElementById('blocker').style.display = 'none';                      // Suppression du texte

    init();

    effect = new THREE.StereoEffect(renderer);
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    window.addEventListener('deviceorientation', setOrientationControls, true);

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = undefined;
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        renderer.domElement.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }

    animate();
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

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation de la zone de rendu */
    document.body.appendChild( renderer.domElement );       // Zone de rendu contenue dans le body

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000); // Caméra en vue perspective, FOV de 45 degrés, ratio 1, intervalle de profondeur [0.1, 5000]
    camera.position.set(0,150,0);                           // Position de la caméra affectée à +0X +150Y +0Z
    scene.add(camera);                                      // Ajout de la caméra à la scène

    /* Initialisation des statistiques */

    stats = new Stats();
    stats.domElement.style.position = 'absolute';           // Position absolue
    stats.domElement.style.top = '0px';                     // Position en haut de la fenêtre
    stats.domElement.style.zIndex = 100;                    // Position en avant des autres éléments
    document.body.appendChild( stats.domElement )           // Zone de rendu contenue dans le body

    /* Initialisation de la lumière */

    var pointLight = new THREE.PointLight( 0xffffff );
    pointLight.position.set(200,200,200);
    scene.add(pointLight);

    /* Chargement des décors */
    loadScene();

    /* Gestion du redimensionnement */
    window.addEventListener('resize', resize, false);

    /* Initialisation de la taille du rendu */
    setTimeout(resize, 1);

}

/* Fonction de gestion du redimensionnement */

function resize()
{

    var width = document.body.offsetWidth;
    var height = document.body.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);

}

function update(dt)
{

    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);

}

function render(dt)
{

    // TODO: if device orientation !e.alpha, use renderer instead of stereo effect
    // renderer.render(scene, camera);

    effect.render(scene, camera);

}

function animate(t)
{

    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
    stats.update();

}

function fullscreen()
{

    if (document.body.requestFullscreen)
    {
        document.body.requestFullscreen();
    }

    else if (document.body.msRequestFullscreen)
    {
        document.body.msRequestFullscreen();
    }

    else if (document.body.mozRequestFullScreen)
    {
        document.body.mozRequestFullScreen();
    }

    else if (document.body.webkitRequestFullscreen)
    {
        document.body.webkitRequestFullscreen();
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