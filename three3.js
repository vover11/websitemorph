import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/controls/OrbitControls.js';
// import { TWEEN } from '	https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js';
// import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
// import { OrbitControls } from './js/OrbitControls.js';

var container3d = document.querySelector('.container3d');

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();
var clock = new THREE.Clock();

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

// var geometry = new THREE.TorusKnotGeometry(40, 8, 500, 16, 3, 2, 2);
// var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x00033, roughness: 0.5, metalness: 3 });
// var textureLoader = new THREE.TextureLoader();

// var mesh = new THREE.Mesh(geometry, material);
// mesh.castShadow = true;
// mesh.position.set(0, 40, 30);
// scene.add(mesh);




var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
var cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x00033, roughness: 0.5, metalness: 0 });
var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

var numCubes = 500;
var minSquareside = Math.ceil(Math.sqrt(numCubes));
var squareSize = minSquareside * 10; // 10 is the size of each cube
var spacing = squareSize / minSquareside;



var cubes = [];
for (var i = 0; i < numCubes; i++) {
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
  var y = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
  cube.position.set(x, -50, y);
  scene.add(cube);
  cubes.push(cube);
}



function animateCubes() {
    var elapsed = clock.getElapsedTime();
    cubes.forEach(function(cube) {
    if (cube.userData.animationStartTime === undefined) {
    // Устанавливаем случайное начальное время для анимации в диапазоне от 0 до 3 секунд
    cube.userData.animationStartTime = elapsed - Math.random() * 300;
    // Устанавливаем случайный множитель для длины каждого куба
    cube.userData.scaleFactor = 2 + Math.random() * 10;
    }
    var animationDuration = 3; // Длительность анимации
    var animationProgress = (elapsed - cube.userData.animationStartTime) / animationDuration;
    if (animationProgress > 3) {
    animationProgress = 3;
    cube.userData.animationStartTime = undefined;
    }
    var scale = cube.scale.clone();
    // Изменяем масштаб по оси y в соответствии с прогрессом анимации
    scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * cube.userData.scaleFactor;
    cube.scale.copy(scale);
    });
}

var raycaster = new THREE.Raycaster(); // Создаем луч для выбора объектов
var mouse = new THREE.Vector2(); // Создаем вектор для хранения координат мыши

// Добавляем обработчик события клика/касания для каждого куба
cubes.forEach(function(cube) {
  cube.userData.animationStartTime = undefined; // Удаляем анимацию, чтобы не мешала выбору
  cube.userData.scaleFactor = 1; // Сбрасываем множитель масштаба
  cube.material.color.setHex(0x0000ff); // Устанавливаем начальный цвет
  cube.interactive = true; // Делаем куб интерактивным
  cube.on('click', function() {
    cube.material.color.setHex(Math.random() * 0xffffff); // Изменяем цвет на рандомный
  });
});

function onPointerUp(event) {
  // Получаем координаты касания на экране
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

  // Используем луч, чтобы определить, какой объект был выбран
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);

  // Если был выбран какой-то объект, вызываем его обработчик события клика/касания
  if (intersects.length > 0) {
    intersects[0].object.dispatchEvent({ type: 'click' });
  }
}

// Добавляем обработчики событий клика/касания на сцену
window.addEventListener('click', onPointerUp, false);
window.addEventListener('touchstart', onPointerUp, false);
window.addEventListener('touchend', onPointerUp, false);



var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
scene.add(light);



// // Создаем красную точечную лампу
// var pointLight = new THREE.PointLight(0xff0000, 1, 300);
// scene.add(pointLight);

// function animateLights() {
//   var elapsed = clock.getElapsedTime();

//   // Определяем, на какой стадии анимации находится пульсирующий свет
//   var animationDuration = 5;
//   var animationProgress = (elapsed % animationDuration) / animationDuration;

//   // Устанавливаем позицию света в центре поверхности пола кубов
//   pointLight.position.set(0, 100, 0);

//   // Масштабируем интенсивность света с использованием кривой синуса,
//   // чтобы создать пульсацию
//   var intensity = Math.abs(Math.sin(animationProgress * Math.PI));
//   pointLight.intensity = intensity * 50;
// }


var controls = new OrbitControls(camera, renderer.domElement);

  
function render() {
  requestAnimationFrame(render);
  animateCubes();
  // animateLights();
  controls.update();
  renderer.render(scene, camera);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.02;

  shadowMesh.position.x = mesh.position.x;
  shadowMesh.position.z = mesh.position.z;
  shadowMesh.rotation.y = mesh.rotation.y;
}
render();
