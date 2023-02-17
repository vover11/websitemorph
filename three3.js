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


var geometry = new THREE.TorusKnotGeometry(50, 6, 500, 16, 3, 2, 2);
var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.5, metalness: 1 });
var mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.position.z = 100; // move the mesh up to sit on top of the ground plane
scene.add(mesh);

var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 150);
scene.add(light);



var render = function () {
  requestAnimationFrame(render);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.05;

  renderer.render(scene, camera);
};
render();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  w = container3d.offsetWidth;
  h = container3d.offsetHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setClearColor(0xefefef, 1);
}