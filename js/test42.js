/* Test de la compatibilité WebGL du navigateur */

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

/* Déclaration des constantes */

var UNKNOWN = 0;
var DESKTOP = 1;
var OCULUS = 2;
var CARDBOARD = 3;

/* Déclaration des variables globales */

var camera, scene, renderer;
var effect, controls;
var element, container;

var currentDevice = UNKNOWN;

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

    /* Enregistrement du choix */

    currentDevice = DESKTOP;

    alert("Fonctionnalité pas encore disponible !");
}

/* Fonction d'initialisation pour visualisation avec un kit Oculus */

function initOculus()
{

    /* Enregistrement du choix */

    currentDevice = OCULUS;

    alert("Fonctionnalité pas encore disponible !");
}

/* Fonction d'initialisation avec un kit Google Cardboard */

function initCardboard()
{

    /* Enregistrement du choix */

    currentDevice = CARDBOARD;

    /* Disparition du menu */

    document.getElementById('blocker').style.display = 'none';

    /* Initialisation de la scène */

    init();

    /* Initialisation de l'effet stéréo */

    effect = new THREE.StereoEffect(renderer);

    /* Initialisation du contrôle par orientation du mobile */

    function setOrientationControls(e)
    {

        if (!e.alpha)
        {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);                   // Contrôles par orientation du mobile
        controls.connect();                                                             // Initialisation
        controls.update();                                                              // Mise à jour

        element.addEventListener('click', fullscreen, false);                           // Passage en mode plein écran pour les mobiles

        window.removeEventListener('deviceorientation', setOrientationControls, true);  // Suppression de l'événement

    }

    window.addEventListener('deviceorientation', setOrientationControls, true);         // Mise en place des contrôles pour mobile si détection de mobile compatible

    /* Lancement de la boucle de rendu */
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

    /* Initialisation de la zone de rendu */

    element = renderer.domElement;                          // Récupération du canvas
    container = document.getElementById('example');         // Récupération du bloc destinée au rendu
    container.appendChild(element);                         // Création de la zone de rendu

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(90, 1, 0.1, 5000); // Caméra en vue perspective, FOV vertical de 90 degrés, ratio 1, intervalle de profondeur [0.1, 5000]
    camera.position.set(0,150,0);                           // Position de la caméra affectée à +0X +150Y +0Z
    scene.add(camera);                                      // Ajout de la caméra à la scène

    /* Initialisation des contrôles de base */

    controls = new THREE.OrbitControls(camera, element);    // Contrôles à la souris ou au toucher

    controls.target.set(
        camera.position.x,
        camera.position.y,
        camera.position.z - 0.1
    );

    controls.noZoom = true;                                 // Restriction sur les contrôles : pas de zoom
    controls.noPan = true;                                  // Restriction sur les contrôles : pas de translation de la caméra

    /* Initialisation de la lumière */

    var light = new THREE.PointLight( 0xffffff );
    light.position.set(200,200,200);
    scene.add(light);

    /* Chargement des décors */

    loadScene();

    /* Initialisation du panneau de statistiques */

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    /* Gestion du redimensionnement */

    window.addEventListener('resize', resize, false);

    /* Initialisation de la taille de la fenêtre de rendu */

    setTimeout(resize, 1);

}

/* Fonction de redimensionnement du canvas en cas de redimensionnement de la fenêtre */

function resize()
{

    /* Récupération des dimensions du container */

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    /* Mise à jour du ratio de la caméra */

    camera.aspect = width / height;

    /* Mise à jour de la matrice de projection */

    camera.updateProjectionMatrix();

    /* Mise à jour de la taille de la fenêtre de rendu */

    switch ( currentDevice )
    {
        case OCULUS:
        case CARDBOARD:
            effect.setSize(width, height);
            break;
        case DESKTOP:
            renderer.render(scene, camera);
            break;
        default:
            break;
    }

}

function update(dt) {
    //resize();

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


/*controls = new THREE.OrbitControls(camera, element);

 controls.target.set(
 camera.position.x,
 camera.position.y,
 camera.position.z - 0.1
 );
 controls.noZoom = true;
 controls.noPan = true;
 */