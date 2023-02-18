import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/controls/OrbitControls.js';
// import { TWEEN } from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.min.js';
// import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
// import { OrbitControls } from './js/OrbitControls.js';

var container3d = document.querySelector('.container3d');

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 250);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.id = "canvasfirst";
renderer.domElement.classList.add("canvasfirst");
container3d.appendChild(renderer.domElement);
const canvas = renderer.domElement;
renderer.setSize(w, h);
renderer.setClearColor(0xFFFFFF, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;




var geometry = new THREE.TorusKnotGeometry(50, 8, 500, 16, 3, 2, 2);
var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x00033, roughness: 0.5, metalness: 3 });
// var material = new THREE.MeshStandardMaterial({ 
//   color: 0x0000ff, // цвет
//   roughness: 0, // шероховатость поверхности
//   metalness: 1, // металлический блеск
//   opacity: 0.5, // прозрачность
//   transparent: true, // прозрачный материал
//   envMapIntensity: 1.0, // интенсивность отражения окружающей среды
  
// });

var textureLoader = new THREE.TextureLoader();



// textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/uv_grid_opengl.jpg', function(texture) {
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(4, 4);

//   var material = new THREE.MeshBasicMaterial({ map: texture });
//   mesh.material = material;
//   mesh.needsUpdate = true;
// });


var mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.position.set(0, 40, 30);
scene.add(mesh);

var planeGeometry = new THREE.PlaneGeometry(500, 500);
var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0 });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // rotate the plane to be horizontal
plane.position.set(0, -50, 0);
plane.receiveShadow = true; // enable receiving shadows for the plane
// mesh.castShadow = true; // enable casting shadows for the mesh
// scene.add(plane);



var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
var cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x00033, roughness: 0.5, metalness: 0 });

// Create a wireframe material with black color
var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

var numCubes = 500;
var minSquareside = Math.ceil(Math.sqrt(numCubes));
var squareSize = minSquareside * 10; // 10 is the size of each cube

// Calculate the spacing between each cube in the square
var spacing = squareSize / minSquareside;

var cubes = [];


for (var i = 0; i < numCubes; i++) {
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // // Set the wireframe material as the edges material for the cube
  // cube.add(new THREE.Mesh(cubeGeometry, wireframeMaterial));

  // Calculate the x and y position of the cube based on its index in the square
  var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
  var y = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;

  cube.position.set(x, -50, y);
  scene.add(cube);

  // Add the cube to the array of cubes
  cubes.push(cube);
}

// Animate the cubes
function animateCubes() {
  cubes.forEach(function(cube) {
    // Randomly scale the cube along the y-axis
    cube.scale.y = Math.random() * 1 + 1;

    // Return the cube to its original size after a delay
    setTimeout(function() {
      cube.scale.y = 2;
    }, 50);

  });
  // Loop the animation
  setTimeout(animateCubes, 50);
}

// Start the animation loop
animateCubes();







var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 300, 0);
light.castShadow = true; // enable casting shadows for the light
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
scene.add(light);

// Set up shadow material for the mesh
var shadowMaterial = new THREE.ShadowMaterial({ color: 0x111111, transparent: true, opacity: 0.5 });
var shadowMesh = new THREE.Mesh(geometry, shadowMaterial);
shadowMesh.position.y = -50; 
shadowMesh.rotation.x = -Math.PI / 2;
shadowMesh.scale.set(1.2, 1.2, 1.2);
scene.add(shadowMesh);

// Set up the helper for debugging shadows
// var helper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(helper);

// Add Orbit Controls
var controls = new OrbitControls(camera, renderer.domElement);

var render = function () {
  requestAnimationFrame(render);
  // animateCubes();

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.02;

  shadowMesh.position.x = mesh.position.x;
  shadowMesh.position.z = mesh.position.z;
  shadowMesh.rotation.y = mesh.rotation.y;

  // Update the controls
  controls.update();

  renderer.render(scene, camera);
  
};
render();
