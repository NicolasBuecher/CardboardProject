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
var controlsEnabled = false;
var requestId;

var clock = new THREE.Clock();

/* Choix du type d'affichage */

var desktop = document.getElementById('desktop');
var oculus = document.getElementById('oculus');
var cardboard = document.getElementById('cardboard');

desktop.addEventListener('click', initDesktop, false);
oculus.addEventListener('click', initOculus, false);
cardboard.addEventListener('click', initCardboard, false);

/* Evénements pour retourner au menu selon le type d'affichage sélectionné */

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener(screenfull.raw.fullscreenchange, onFullscreenChange, false);

/* Fonction d'initialisation pour une visualisation sur ordinateur */

function initDesktop()
{

    if ( currentDevice == DESKTOP )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        controlsEnabled = true;

    }
    else
    {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (currentDevice !== UNKNOWN )
        {
            cancelAnimationFrame( requestId );
            container.removeChild(element);
        }

        /* Enregistrement du choix */

        currentDevice = DESKTOP;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        init();

        /* Levée des restrictions sur les contrôles */

        controls.noZoom = false;         // Zoom autorisé
        controls.noPan = false;          // Translation de la caméra autorisée

        /* Activation des contrôles */

        controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        animateDesktop();

    }

}

/* Fonction d'initialisation pour visualisation avec un kit Oculus */

function initOculus()
{

    if ( currentDevice == OCULUS )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        controlsEnabled = true;

    }
    else {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (currentDevice !== UNKNOWN) {
            cancelAnimationFrame(requestId);
            container.removeChild(element);
        }

        /* Enregistrement du choix */

        currentDevice = OCULUS;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        init();

        /* Initialisation de l'effet stéréo */

        effect = new THREE.VREffect(renderer, function () {
        });

        /* Restriction sur les contrôles */

        controls.noZoom = true;         // Pas de zoom
        controls.noPan = true;          // Pas de translation de la caméra

        /* Initialisation des contrôles Oculus */

        controls = new THREE.VRControls(camera);

        /* Activation des contrôles */

        controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        animateOculus();

    }

}

/* Fonction d'initialisation avec un kit Google Cardboard */

function initCardboard()
{

    if ( currentDevice == CARDBOARD )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        controlsEnabled = true;

    }
    else
    {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (currentDevice !== UNKNOWN )
        {
            cancelAnimationFrame( requestId );
            container.removeChild(element);
        }

        /* Enregistrement du choix */

        currentDevice = CARDBOARD;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        init();

        /* Initialisation de l'effet stéréo */

        effect = new THREE.StereoEffect(renderer);

        /* Restriction sur les contrôles */

        controls.noZoom = true;         // Pas de zoom
        controls.noPan = true;          // Pas de translation de la caméra

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

        /* Activation des contrôles */

        controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        animateCardboard();

    }

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

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000); // Caméra en vue perspective, FOV vertical de 45 degrés, ratio 1, intervalle de profondeur [0.1, 5000]
    camera.position.set(0,150,0);                           // Position de la caméra affectée à +0X +150Y +0Z
    if ( currentDevice !== DESKTOP ) camera.fov = 75;       // FOV vertical de 75 degrés dans le cas d'un affichage VR
    scene.add(camera);                                      // Ajout de la caméra à la scène

    /* Initialisation des contrôles de base */

    controls = new THREE.OrbitControls(camera, element);    // Contrôles à la souris ou au toucher

    controls.target.set(
        camera.position.x,
        camera.position.y,
        camera.position.z - 0.1
    );

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

    var width = window.innerWidth;
    var height = window.innerWidth;

    /* Mise à jour du ratio de la caméra */

    camera.aspect = width / height;

    /* Mise à jour de la matrice de projection */

    camera.updateProjectionMatrix();

    /* Mise à jour de la taille de la fenêtre de rendu */

    switch ( currentDevice )
    {
        case OCULUS:
            effect.setSize(width, height);
            break;
        case CARDBOARD:
            effect.setSize(width, height);
            break;
        case DESKTOP:
            renderer.setSize(width, height);
            break;
        default:
            break;
    }

}

/* Boucle de rendu pour un rendu basique */

function animateDesktop()
{

    /* Boucle à chaque fois qu'une frame est nécessaire */

    requestId = requestAnimationFrame(animateDesktop);

    /* Ne rien faire si les contrôles ont été bloqués */

    if ( controlsEnabled )
    {

        /* Mise à jour des contrôles */

        controls.update();

        /* Rendu de la scène */

        renderer.render(scene, camera);

        /* Mise à jour du panneau de statistiques */

        stats.update();

    }

}

/* Boucle de rendu pour un rendu VR */

function animateOculus()
{

    /* Boucle à chaque fois qu'une frame est nécessaire */

    requestId = requestAnimationFrame(animateOculus);

    /* Ne rien faire si les contrôles ont été bloqués */

    if ( controlsEnabled )
    {

        /* Mise à jour des contrôles */

        controls.update();

        /* Rendu de la scène */

        effect.render(scene, camera);

        /* Mise à jour du panneau de statistiques */

        stats.update();

    }

}

/* Boucle de rendu pour un rendu avec effet stéréo */

function animateCardboard()
{

    /* Boucle à chaque fois qu'une frame est nécessaire */

    requestId = requestAnimationFrame(animateCardboard);

    /* Ne rien faire si les contrôles ont été bloqués */

    if ( controlsEnabled )
    {

        /* Mise à jour des contrôles */

        controls.update();

        /* Rendu de la scène */

        effect.render(scene, camera);

        /* Mise à jour du panneau de statistiques */

        stats.update();

    }

}

/* Fonction permettant le passage en mode plein écran */

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

/* Fonction déterminant l'action à exécuter suite à la pression d'une touche */

function onKeyDown(e)
{

    console.log(e.keyCode);

    switch (e.keyCode )
    {
        case 27:
            controlsEnabled = false;
            document.getElementById('blocker').style.display = 'initial';
            break;
        default:
            break;
    }

}

/* Fonction déterminant l'action à exécuter suite au basculement du mode plein écran */

function onFullscreenChange()
{

    if ( currentDevice == CARDBOARD )
    {
        if ( ! screenfull.isFullscreen )
        {
            controlsEnabled = false;
            document.getElementById('blocker').style.display = 'initial';
        }
    }

}