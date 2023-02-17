import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/controls/OrbitControls.js';

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
renderer.setClearColor(0x333333, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var geometry = new THREE.TorusKnotGeometry(50, 6, 500, 16, 3, 2, 2);
var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.5, metalness: 1 });
var mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.position.set(0, 30, 70);
scene.add(mesh);

var planeGeometry = new THREE.PlaneGeometry(500, 500);
var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0 });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // rotate the plane to be horizontal
plane.position.set(0, -50, 0);
plane.receiveShadow = true; // enable receiving shadows for the plane
mesh.castShadow = true; // enable casting shadows for the mesh
scene.add(plane);

var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 150);
light.castShadow = true; // enable casting shadows for the light
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
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

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.05;

  shadowMesh.position.x = mesh.position.x;
  shadowMesh.position.z = mesh.position.z;
  shadowMesh.rotation.y = mesh.rotation.y;

  // Update the controls
  controls.update();

  renderer.render(scene, camera);
};
render();