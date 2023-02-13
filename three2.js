var container3d = document.querySelector('.container3d');

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 200;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.id = "canvasfirst";
renderer.domElement.classList.add("canvasfirst");
container3d.appendChild(renderer.domElement);
renderer.setSize(w, h);
renderer.setClearColor(0xefefef, 1);

// Hero
const geometry = new THREE.SphereBufferGeometry(100, 50, 20);
const wireframe = new THREE.WireframeGeometry(geometry);
const material = new THREE.LineBasicMaterial({
  color: 0xff0000,
});
let line = new THREE.LineSegments(wireframe, material);

scene.add(line);

// Action
const degree = radian => radian / 180 * Math.PI;
const render = () => {
  let frame = requestAnimationFrame(render);
  line.rotation.x += 0.01;
  line.rotation.z += 0.005;
  line.geometry = new THREE.SphereBufferGeometry(100, 50, 23 + Math.round(20 * Math.sin(degree(frame))));
  line.material.color = new THREE.Color(`hsl(${frame % 360}, 100%, 50%)`);
  camera.position.z = 120 + 50 * Math.cos(degree(frame % 360));
	return renderer.render(scene, camera);
};
render();
