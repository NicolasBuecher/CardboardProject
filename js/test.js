/**
 * Created by buecher on 15/06/15.
 */

/* Gestion de l'événement "click sur le bouton OK" */

document.getElementById('fullscreen-button').addEventListener('click', function ()
{
    if (screenfull.enabled)             // Si le navigateur autorise le mode plein écran
    {
        document.body.removeChild(document.getElementById('message-container'));        // Suppression des balises restantes
        screenfull.request(document.body);                                              // Activation du mode plein écran
        init();                                                                         // Initialisation du rendu
        animate();                                                                      // Lancement de la boucle de rendu
    }
    else                                // Si le navigateur bloque le mode plein écran
    {
        document.getElementById('message').innerHTML = 'Désolé, votre navigateur bloque le mode plein écran.';      // Affichage d'un message d'explications
        document.getElementById('message-container').removeChild(document.getElementById('fullscreen-button'));     // Suppression du bouton OK
    }
});

/* Définition des variables globales */

var width, height;
var camera, scene, renderer;
var stereoEffect, orbitControls;
var canvasElement, canvasContainer;
var hemisphereLight, pointLight;

var clock = new THREE.Clock();              // Initialisation d'un timer

/* Fonction d'initialisation des données */

function init()
{

    /* Initialisation du renderer */
    renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true, clearColor: 0xffffff });    // WebGL Renderer, objets opaques, anticrénelage activé, couleur par défaut blanc

    /* Initialisation du canvas */

    canvasElement = renderer.domElement;                    // Récupération de l'élément HTML de la zone de rendu
    canvasContainer = document.body;                        // Récupération de l'élément body
    canvasContainer.appendChild(canvasElement);             // Application de la zone de rendu comme nouveau fils de l'élément body

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation de l'effet stéréo */
    stereoEffect = new THREE.StereoEffect(renderer);

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 20000);                   // Caméra en vue perspective, FOV de 45 degrés, ratio w/h, intervalle de profondeur [0.1, 20000]
    camera.position.set(0, 100, 150);                                          // Position de la caméra +0X +100Y +150Z
    scene.add(camera);                                                         // Ajout de la caméra à la scène

    /* Initialisation des contrôles */

    orbitControls = new THREE.OrbitControls(camera, canvasElement);         // Contrôles à la souris

    function setOrientationControls(e)                                      // Contrôles pour l'orientation du mobile
    {

        if (!e.alpha)
        {
            return;
        }

        orbitControls = new THREE.DeviceOrientationControls(camera, true);
        orbitControls.connect();
        orbitControls.update();

        //canvasElement.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls);

    }

    window.addEventListener('deviceorientation', setOrientationControls, true);     // Ajout d'un événement "Orientation du mobile"

    /* Initialisation de la lumière */

    hemisphereLight = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);           // Skycolor : gray, Groundcolor : black, Intensity : 0.6
    scene.add(hemisphereLight);                                                     // Ajout de la lumière à la scène

    /* Initialisation de la texture principale */

    var groundTexture = THREE.ImageUtils.loadTexture('textures/checker.png');         // Chargement de la texture
    groundTexture.wrapS = THREE.RepeatWrapping;                                       // Répétition de la texture sur le vecteur S
    groundTexture.wrapT = THREE.RepeatWrapping;                                       // Répétition de la texture sur le vecteur T
    groundTexture.repeat = new THREE.Vector2(50, 50);                                 // Nombre de répétitions sur chaque axe
    groundTexture.anisotropy = renderer.getMaxAnisotropy();                           // Anisotropy : Number of samples taken along the axis through the pixel that has the highest density of texels

    /* Initialisation du matériau du sol */

    var groundMaterial = new THREE.MeshPhongMaterial({            // Matériau de Phong
        color: 0xffffff,                                    // Blanc
        specular: 0xffffff,                                 // Blanc
        shininess: 20,                                      // Brillance
        shading: THREE.FlatShading,                         // Ombrage de Lambert
        map: groundTexture                                        // Association de la texture
    });

    /* Initialisation de la géométrie du sol */
    var groundGeometry = new THREE.PlaneGeometry(25000, 25000);     // Plan de 25000x25000

    /* Initialisation du mesh du sol */

    var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);        // Création du mesh
    groundMesh.rotation.x = -Math.PI / 2;                                   // Rotation de -PI/2 autour de l'axe X
    scene.add(groundMesh);                                                  // Ajout du mesh à la scène

    /* Initialisation du matériau du cube */
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });      // Matériau de Lambert

    /* Initialisation de la géométrie du cube */
    var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);                   // Cube de 50x50x50

    /* Initialisation du mesh du cube */

    var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);              // Création du mesh
    cubeMesh.rotation.y = Math.PI * 45 / 180;                               // Rotation de PI/4 autour de l'axe Y
    cubeMesh.position.set(0, 25, 0);                                        // Position affectée à +0X +25Y +0Z
    scene.add(cubeMesh);                                                    // Ajout du mesh à la scène

    window.addEventListener('resize', resize, false);               // Ajout d'un événement "redimensionner"
    setTimeout(resize, 1);                                          // Initialisation de la taille de la fenêtre de rendu

}

function resize()
{

    width = canvasContainer.offsetWidth;
    height = canvasContainer.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    stereoEffect.setSize(width, height);
}

function update(dt)
{

    camera.updateProjectionMatrix();

    orbitControls.update(dt);

}

function render(dt)
{

    stereoEffect.render(scene, camera);

}

function animate(t)
{

    requestAnimationFrame(animate);

    update(clock.getDelta());

    render(clock.getDelta());

}