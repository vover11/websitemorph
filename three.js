let container3d = document.querySelector('.container3d')

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, w/h, 0.1,1000);
camera.position.z = 200;


var renderer = new THREE.WebGLRenderer({ antialias: true });
container3d.appendChild(renderer.domElement);
renderer.setSize( w, h);
renderer.setClearColor( 0xefefef, 0);




var geometry = new THREE.TorusKnotGeometry(50, 6, 500, 16, 3, 2, 2);
var material = new THREE.MeshNormalMaterial({wireframe:true});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 10, 25);
scene.add(light);

var render = function () {
  requestAnimationFrame(render);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.05;
  
  renderer.render(scene, camera);
  
};
render();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

}
