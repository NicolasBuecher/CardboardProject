/**
 * Created by Nicolas Buecher on 12/06/2015
 */

/* Définition des variables globales */

var width = window.innerWidth;              // Largeur de la fenêtre
var height = window.innerHeight;            // Hauteur de la fenêtre

var clock = new THREE.Clock();              // Initialisation d'un timer

var camera, scene, renderer;
var stereoEffect, orbitControls;
var element, container;
var hemisphereLight, pointLight;

/* Déclaration des fonctions */

init();
animate();

function init()
{
    /* Initialisation du renderer */

    renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true, clearColor: 0xffffff });  // WebGL Renderer, objets opaques, anticrénelage activé, couleur par défaut blanc
    renderer.setSize(width, height);                                                          // Taille du renderer égale à la taille de la fenêtre
    document.body.appendChild(renderer.domElement);                                           // Binding, la zone de rendu se situe dans le body de index.html

    /* Initialisation de la scène */
    scene = new THREE.Scene();

    /* Initialisation des effets */

    stereoEffect = new THREE.StereoEffect(renderer);
    stereoEffect.separation = 0.2;
    stereoEffect.targetDistance = 50;
    stereoEffect.setSize(width, height);

    /* Initialisation de la caméra */

    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 20000);        // Caméra en vue perspective, FOV de 45 degrés, ratio w/h, intervalle de profondeur [0.1, 20000]
    camera.position.set(0, 100, 150);                                          // Position de la caméra +0X +100Y +150Z
    scene.add(camera);                                                         // Ajout de la caméra à la scène

    /* Initialisation des contrôles */
    orbitControls = new THREE.OrbitControls(camera, element);


    /* Initialisation de la lumière */

    hemisphereLight = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);       // Skycolor : gray, Groundcolor : black, Intensity : 0.6
    scene.add(hemisphereLight);                                                           // Ajout de la lumière à la scène

    pointLight = new THREE.PointLight(0x00ff00);        // Lumière ponctuelle verte
    pointLight.position.set(0,800,-50);                 // Position de la lumière +0X +800Y -50Z
    scene.add(pointLight);                              // Ajout de la lumière à la scène

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
    scene.add(cubeMesh);                                                    // Ajout dy lesh à la scène

}

function update(dt)
{

    camera.updateProjectionMatrix();

    orbitControls.update(dt);

}

function render(dt) {
    stereoEffect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}