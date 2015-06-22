/**
 * Created by buecher on 16/06/15.
 */

/* Définition des constantes */

var UNKNOWN = 0;
var DESKTOP = 1;
var OCULUS = 2;
var CARDBOARD = 3;

/* Déclaration des variables globales */

var renderer, scene, camera;
var effect, controls;

/* Choix du type d'affichage */

var desktop = document.getElementById('desktop');
var oculus = document.getElementById('oculus');
var cardboard = document.getElementById('cardboard');

desktop.addEventListener('click', initDesktop, false);
oculus.addEventListener('click', initOculus, false);
cardboard.addEventListener('click', initCardboard, false);

function initDesktop() {
    init();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    fullscreen();
    animateDesktop();
}

function initOculus() {
    init();
}

function initCardboard() {
    init();
    effect = new THREE.StereoEffect(renderer);                              // Effet stéréo
    controls = new THREE.DeviceOrientationControls(camera, true);           // Contrôle de l'orientation du mobile
    fullscreen();
    animateCardboard();
}



/* Fonction permettant de passer en mode plein écran */

function fullscreen() {

    var docElm = document.documentElement;

    document.getElementById('blocker').style.display = 'none';                      // Suppression du texte

    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (docElm.msRequestFullScreen) {
        docElm.msRequestFullScreen();
    }
    else {
        alert('Quelque chose empêche votre navigateur de passer en mode plein écran.'); // Message d'erreur
        document.getElementById('blocker').style.display = 'initial';                      // Réaffichage du texte
    }
}



/* Fonction d'initialisation générale */

function init()
{

    /* Initialisation du renderer */
    renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true, clearColor: 0xffffff });    // WebGL Renderer, objets opaques, anticrénelage activé, couleur par défaut blanc

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);   // Caméra en vue perspective, FOV de 45 degrés, ratio w/h, intervalle de profondeur [0.1, 10000]
    camera.position.set(0,150,0);                                               // Position de la caméra affectée à +0X +150Y +0Z
    scene.add(camera);                                                          // Ajout de la caméra à la scène

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );

    /* Initialisation de la lumière */

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    /* Chargement des décors */

    loadObjects();

}

function loadObjects()
{

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
    var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });

    /* Initialisation de la géométrie de la skybox */
    var skyboxGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

    /* Initialisation du mesh de la skybox */

    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

    /**********************\
     * Chargement des cubes *
     \**********************/

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

    var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);              // Création du mesh
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

function animateDesktop()
{

    requestAnimationFrame( animateDesktop );

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.update();

    renderer.render(scene, camera);

}

function animateOculus()
{

}

function animateCardboard()
{

    requestAnimationFrame( animateCardboard );

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    effect.setSize(window.innerWidth, window.innerHeight);

    controls.update();

    effect.render(scene, camera);

}

function resizeDesktop()
{

    width = canvasContainer.offsetWidth;
    height = canvasContainer.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    stereoEffect.setSize(width, height);

}

function resizeOculus()
{



}

function resizeCardboard()
{



}