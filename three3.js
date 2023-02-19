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
camera.position.set(0, 100, 0); // установить камеру над плоскостью
camera.lookAt(0, 0, 0); // направить камеру на центр плоскости

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.id = "canvasfirst";
renderer.domElement.classList.add("canvasfirst");
container3d.appendChild(renderer.domElement);
const canvas = renderer.domElement;
renderer.setSize(w, h);
renderer.setClearColor(0x000000, 1);
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
var cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  roughness: 0.5,
  metalness: 2,

});



var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

var numCubes = 1000;
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

var prevScrollY = 0;

window.addEventListener('scroll', onScroll, false);

function onScroll() {
  var currentScrollY = window.scrollY;
  if (currentScrollY > prevScrollY) {
    animateCubesDown();
  } else {
    animateCubesUp();
  }
  prevScrollY = currentScrollY;
}

function animateCubes() {
  cube.userData.isAnimating = false; // Добавляем свойство isAnimating для каждого куба

}

var raycaster = new THREE.Raycaster(); // Создаем луч для выбора объектов
var mouse = new THREE.Vector2(); // Создаем вектор для хранения координат мыши

// Добавляем обработчик события клика для каждого куба
cubes.forEach(function (cube) {
  cube.userData = {}; // Создаем объект userData для каждого куба
  animateCubes(cube); // Вызываем функцию animateCubes для каждого куба
  cube.material.color.set(0x0000ff); // Устанавливаем начальный цвет
  cube.interactive = true; // Делаем куб интерактивным
  cube.addEventListener('click', function () {
    cube.material.color.set(Math.random() * 0xffffff); // Изменяем цвет на рандомный
  });
  cube.addEventListener('touchstart', function (event) {
    event.preventDefault(); // Предотвращаем переход в режим скроллинга веб-страницы при касании элемента
    cube.material.color.set(Math.random() * 0xffffff);
  });
  

  cube.addEventListener('click', function () {
    if (!cube.userData.isAnimating) {
      cube.userData.isAnimating = true;
      var animationStartTime = clock.getElapsedTime(); // Запоминаем время начала анимации
      var scaleFactor = 2 + Math.random() * 10; // Генерируем множитель для длины куба
      function animate() {
        var elapsed = clock.getElapsedTime() - animationStartTime;
        var animationDuration = 3; // Длительность анимации
        var animationProgress = elapsed / animationDuration;
        if (animationProgress > 1) {
          animationProgress = 1;
          cube.userData.isAnimating = false;
        }
        var scale = cube.scale.clone();
        // Изменяем масштаб по оси y в соответствии с прогрессом анимации
        scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * scaleFactor;
        cube.scale.copy(scale);
        if (cube.userData.isAnimating) {
          requestAnimationFrame(animate);
        }
      }
      animate();
    }
  });

  cube.addEventListener('touchstart', function () {
    if (!cube.userData.isAnimating) {
      cube.userData.isAnimating = true;
      var animationStartTime = clock.getElapsedTime(); // Запоминаем время начала анимации
      var scaleFactor = 2 + Math.random() * 10; // Генерируем множитель для длины куба
      function animate() {
        var elapsed = clock.getElapsedTime() - animationStartTime;
        var animationDuration = 3; // Длительность анимации
        var animationProgress = elapsed / animationDuration;
        if (animationProgress > 1) {
          animationProgress = 1;
          cube.userData.isAnimating = false;
        }
        var scale = cube.scale.clone();
        // Изменяем масштаб по оси y в соответствии с прогрессом анимации
        scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * scaleFactor;
        cube.scale.copy(scale);
        if (cube.userData.isAnimating) {
          requestAnimationFrame(animate);
        }
      }
      animate();
    }
  });
});

function onMouseClick(event) {
  canvas.addEventListener('click', function(event) {
    // Обновляем координаты мыши в соответствии с положением клика
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;
  
    // Используем луч, чтобы определить, какой объект был выбран
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(cubes, true);
  
    // Если был выбран какой-то куб, вызываем его обработчик события клика
    if (intersects.length > 0) {
      event.stopPropagation(); // Предотвращаем всплытие события
      intersects[0].object.dispatchEvent({ type: 'click' });
    }
  });
}
function onTouchStart(event) {
  canvas.addEventListener('touchstart', function(event) {
    // Обновляем координаты мыши в соответствии с положением клика
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;
  
    // Используем луч, чтобы определить, какой объект был выбран
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(cubes, true);
  
    // Если был выбран какой-то куб, вызываем его обработчик события клика
    if (intersects.length > 0) {
      event.stopPropagation(); // Предотвращаем всплытие события
      intersects[0].object.dispatchEvent({ type: 'click' });
    }
  });
}

function animateCubesDown() {
  cubes.forEach(function (cube) {
    if (!cube.userData.isAnimating) {
      cube.userData.isAnimating = true;
      var animationStartTime = clock.getElapsedTime(); // Запоминаем время начала анимации
      var scaleFactor = 1 + Math.random() * 20; // Генерируем множитель для длины куба
      function animate() {
        var elapsed = clock.getElapsedTime() - animationStartTime;
        var animationDuration = 5; // Длительность анимации
        var animationProgress = elapsed / animationDuration;
        if (animationProgress > 1) {
          animationProgress = 1;
          cube.userData.isAnimating = false;
        }
        var scale = cube.scale.clone();
        // Изменяем масштаб по оси y в соответствии с прогрессом анимации
        scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * scaleFactor;
        cube.scale.copy(scale);
        if (cube.userData.isAnimating) {
          requestAnimationFrame(animate);
        }
      }
      animate();
    }
  });
}

// function animateCubesUp() {
//   cubes.forEach(function (cube) {
//     if (!cube.userData.isAnimating) {
//       cube.userData.isAnimating = true;
//       var animationStartTime = clock.getElapsedTime(); // Запоминаем время начала анимации
//       var scaleFactor = 2 + Math.random() * 10; // Генерируем множитель для длины куба
//       function animate() {
//         var elapsed = clock.getElapsedTime() - animationStartTime;
//         var animationDuration = 3; // Длительность анимации
//         var animationProgress = elapsed / animationDuration;
//         if (animationProgress > 1) {
//           animationProgress = 1;
//           cube.userData.isAnimating = false;
//         }
//         var scale = cube.scale.clone();
//         // Изменяем масштаб по оси y в соответствии с прогрессом анимации
//         scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * scaleFactor;
//         cube.scale.copy(scale);
//         if (cube.userData.isAnimating) {
//           requestAnimationFrame(animate);
//         }
//       }
//       animate();
//     }
//   });
// }

// Добавляем обработчик события клика на сцену
window.addEventListener('click', onMouseClick, false);
window.addEventListener('touchstart', onTouchStart, false);
// Добавляем обработчик события touchstart на сцену
window.addEventListener('touchstart', function (event) {
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onMouseClick(event);
}, false);




var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
scene.add(light);



// Создаем красную точечную лампу
var pointLight = new THREE.PointLight(0xff0000, 1, 300);
scene.add(pointLight);

function animateLights() {
  var elapsed = clock.getElapsedTime();

  // Определяем, на какой стадии анимации находится пульсирующий свет
  var animationDuration = 5;
  var animationProgress = (elapsed % animationDuration) / animationDuration;

  // Устанавливаем позицию света в центре поверхности пола кубов
  pointLight.position.set(0, 100, 0);

  // Масштабируем интенсивность света с использованием кривой синуса,
  // чтобы создать пульсацию
  var intensity = Math.abs(Math.sin(animationProgress * Math.PI));
  pointLight.intensity = intensity * 25;
}


// var controls = new OrbitControls(camera, renderer.domElement);



function render() {


  requestAnimationFrame(render);
  animateCubes();
  animateLights();
  // controls.update();
  renderer.render(scene, camera);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.02;

  shadowMesh.position.x = mesh.position.x;
  shadowMesh.position.z = mesh.position.z;
  shadowMesh.rotation.y = mesh.rotation.y;
}
render();
