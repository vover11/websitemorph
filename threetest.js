
import * as THREE from 'https://cdn.skypack.dev/three@0.131.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/controls/OrbitControls.js';
// import { TWEEN } from '	https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js';
// import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
// import { OrbitControls } from './js/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/postprocessing/GlitchPass.js';
import { BokehPass } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/postprocessing/BokehPass.js';




var container3d = document.querySelector('.container3d');

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();
var clock = new THREE.Clock();



var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 100, ); // установить камеру над плоскостью
camera.lookAt(0, -1, 0); // направить камеру вниз

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


// var composer = new EffectComposer(renderer);
// composer.setSize(w, h);

// // Добавляем проход для рендеринга сцены
// var renderPass = new RenderPass(scene, camera);
// composer.addPass(renderPass);


// var glitchPass = new GlitchPass();
// glitchPass.uniforms.time = { value: 0.0 }; // добавляем переменную time
// glitchPass.uniforms.offset = { value: new THREE.Vector2(0.0, 0.0) }; // добавляем переменную offset
// composer.addPass(glitchPass);

// function update2() {
//   // Обновляем время для анимации
//   glitchPass.uniforms.time.value += 0.01;

//   // Изменяем позицию шума, чтобы создать впечатление движения
//   glitchPass.uniforms.offset.value = new THREE.Vector2(
//     Math.random(), // случайное значение X
//     Math.random() // случайное значение Y
//   );

//   // Рендеринг сцены
//   composer.render();

  
  
// }

// // Запуск обновления
// function animate2() {
//   update2();
//   requestAnimationFrame(animate2);
// }
// animate2();


var composer = new EffectComposer(renderer);
composer.setSize(w, h);

window.addEventListener('resize', function() {
  composer.setSize(w, h);
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

// Добавляем проход для рендеринга сцены
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

var bokehPass = new BokehPass(scene, camera, {
  focus: 1,
  aperture: 0.025,
  maxblur: 0.09,
  width: w,
  height: h,
  renderTargetDepth: true // добавляем карту глубины
});
composer.addPass(bokehPass);

// Создаем объект Clock и сохраняем начальное время
var clock = new THREE.Clock();
var startTime = clock.getElapsedTime();
var animationDuration = 2; // Длительность анимации в секундах
var isAnimationFinished = false;

function update2() {
  // Изменяем параметры эффекта BokehPass
  if (!isAnimationFinished) {
    var elapsedTime = clock.getElapsedTime() - startTime;
    if (elapsedTime < animationDuration) {
      // Анимация еще не завершена, изменяем параметры эффекта
      bokehPass.uniforms.focus.value = Math.sin(elapsedTime / 2);
      bokehPass.uniforms.aperture.value = Math.abs(Math.sin(elapsedTime) / 2) * 0.025 + 0.01;
      bokehPass.uniforms.maxblur.value = Math.abs(Math.sin(elapsedTime / 1.5)) * 0.09 + 0.002;
    } else {
      // Анимация завершена
      isAnimationFinished = true;
      var endTime = clock.getElapsedTime();
      var fadeOutDuration = 2; // Длительность плавного отключения анимации в секундах
      var fadeOutStartTime = endTime;
      var fadeOutEndTime = endTime + fadeOutDuration;
      var initialMaxBlur = bokehPass.uniforms.maxblur.value;
      
      // Постепенно уменьшаем значение параметра maxblur
      function fadeOut() {
        var time = clock.getElapsedTime();
        if (time < fadeOutEndTime) {
          var fadeOutProgress = (time - fadeOutStartTime) / fadeOutDuration;
          bokehPass.uniforms.maxblur.value = (1 - fadeOutProgress) * initialMaxBlur;
          requestAnimationFrame(fadeOut);
        } else {
          // Отключаем анимацию полностью
          bokehPass.uniforms.maxblur.value = 0;
        }
      }
      requestAnimationFrame(fadeOut);
    }
  }
  // Рендеринг сцены
  composer.render();
}


// Запуск обновления
function animate2() {
  update2();
  requestAnimationFrame(animate2);
}
animate2();




// var numCubes = 900;
// var minSquareside = Math.ceil(Math.sqrt(numCubes));
// var cubeSize = 5; // задаем размер куба
// var squareSize = minSquareside * (cubeSize + 0); // 5 - промежуток между кубами
// var spacing = squareSize / minSquareside;

// var cubes = [];
// var waveFrequency = 0;
// var waveAmplitude = 0;
// var waveSpeed = 0;

// for (var i = 0; i < numCubes; i++) {
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.userData.initialScale = cube.scale.clone().divideScalar(cubeSize);
// cube.scale.set(cubeSize, cubeSize, cubeSize);
// var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
// var y = 0; // начальная высота куба
// var z = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
// cube.position.set(x, y, z);
// scene.add(cube);
// cubes.push(cube);
// }


// var isScrolling = false; // флаг для проверки наличия движения страницы

// window.addEventListener("wheel", function(event) {
//   if (event.deltaY > 0) { // проверка направления прокрутки
//     waveFrequency = 4;
//     waveAmplitude = 5;
//     isScrolling = true; // установка флага, если есть движение страницы
//   }
// });

// function updateCubes() {
//   for (var i = 0; i < numCubes; i++) {
//     var cube = cubes[i];
//     var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
//     var y = 0; // начальная высота куба
//     var z = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
//     var currentY = cube.position.y; // текущая высота куба
//     var targetY = isScrolling ? Math.sin(i * waveFrequency) * waveAmplitude : 0; // проверка флага движения страницы
//     var lerpedY = THREE.Math.lerp(currentY, targetY, 0.1); // плавный переход
//     cube.position.set(x, lerpedY, z); // обновление позиции куба
//   }
//   if (isScrolling) { // если есть движение страницы
//     waveFrequency += 0.0001; // увеличение частоты волны со временем
//   } else { // если движения нет
//     waveFrequency = 0; // сброс значений волны
//     waveAmplitude = 0;
//   }
//   isScrolling = false; // обнуление флага движения страницы
// }



// Волна анмиация 1
// var waveFrequency = 0;
// var waveAmplitude = 0;

// window.addEventListener("wheel", function(event) {
//   if (event.deltaY > 0) { // проверка направления прокрутки
//     waveFrequency = 4;
//     waveAmplitude = 5;
//   }
// });

// function updateCubes() {
//   for (var i = 0; i < numCubes; i++) {
//     var cube = cubes[i];
//     var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
//     var y = 0; // начальная высота куба
//     var z = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
//     var currentY = cube.position.y; // текущая высота куба
//     var targetY = Math.sin(i * waveFrequency) * waveAmplitude;
//     var lerpedY = THREE.Math.lerp(currentY, targetY, 0.1); // плавный переход
//     cube.position.set(x, lerpedY, z); // обновление позиции куба
//   }
//   waveFrequency += 0.0001; // увеличение частоты волны со временем
// }




// var geometry = new THREE.TorusKnotGeometry(40, 8, 500, 16, 3, 2, 2);
// var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x00033, roughness: 0.5, metalness: 3 });
// var textureLoader = new THREE.TextureLoader();

// var mesh = new THREE.Mesh(geometry, material);
// mesh.castShadow = true;
// mesh.position.set(0, 40, 30);
// scene.add(mesh);

// Создаем геометрию для кривой линии












var cubeGeometry = new THREE.BoxGeometry;
var cubeMaterial = new THREE.MeshPhongMaterial({
  color: 0x3300FF,
  roughness: 1,
  metalness: 2,
  side: THREE.FrontSide,
  // emissive: 0x3300FF,
  dithering: true
});



var numCubes = 900;
var minSquareside = Math.ceil(Math.sqrt(numCubes));
var cubeSize = 5;
var squareSize = minSquareside * (cubeSize + 0);
var spacing = squareSize / minSquareside;

var cubes = [];
var waveFrequency = 2;
var waveAmplitude = 2;
var waveSpeed = 0.0001;

for (var i = 0; i < numCubes; i++) {
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.userData.initialScale = cube.scale.clone().divideScalar(cubeSize);
  cube.scale.set(cubeSize, cubeSize, cubeSize);
  var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
  var y = Math.sin(i * waveFrequency) * waveAmplitude;
  var z = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
  cube.position.set(x, y, z);
  scene.add(cube);
  cubes.push(cube);
}

var isScrolling = false;
var startY, startX;
var scrollY = 0;

window.addEventListener("wheel", function(event) {
  if (event.deltaY > 0) {
    waveFrequency = 40;
    waveAmplitude = 200;
    waveSpeed = 0.1;
    isScrolling = true;
  } else {
    waveFrequency = 2;
    waveAmplitude = 2;
    waveSpeed = 0.0001;
    isScrolling = false;
  }
});

window.addEventListener("touchstart", function(event) {
  startY = event.touches[0].clientY;
  startX = event.touches[0].clientX;
});

window.addEventListener("touchmove", function(event) {
  if (Math.abs(event.touches[0].clientY - startY) > Math.abs(event.touches[0].clientX - startX)) {
    event.preventDefault();
    var deltaY = event.touches[0].clientY - startY; // расстояние перемещения пальца по оси Y
    waveFrequency = 40;
    waveAmplitude = deltaY; // использование расстояния перемещения для установки параметров анимации
    waveSpeed = 0.1; // изменение скорости движения волны
    isScrolling = true; // установка флага, если есть движение страницы
  }
});

window.addEventListener("touchend", function(event) {
  waveFrequency = 2;
  waveAmplitude = 2;
  waveSpeed = 0.0001;
  isScrolling = false;
});

window.addEventListener("scroll", function(event) {
  scrollY = window.scrollY;
  waveFrequency = 40;
  waveAmplitude = scrollY / 2;
  waveSpeed = 0.1;
  isScrolling = true;
});

function updateCubes() {
  waveFrequency += waveSpeed;
  for (var i = 0; i < numCubes; i++) {
    var cube = cubes[i];
    var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
    var y = Math.sin(i * waveFrequency) * waveAmplitude;
    var z = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
    var currentY = cube.position.y;
    var targetY = y;
    var lerpedY = THREE.Math.lerp(currentY, targetY, 0.1);
    cube.position.set(x, lerpedY, z);
  }
  if (!isScrolling) {
    waveFrequency += waveSpeed; // continue animation even when not scrolling
  }
  else {
    waveFrequency = 0;
    waveAmplitude = 0;
    waveSpeed = 0;
    isScrolling = false;
  }
}



function animate() {
  requestAnimationFrame(animate);
  updateCubes();
  renderer.render(scene, camera);
}

animate();





// var cubes = [];
// for (var i = 0; i < numCubes; i++) {
//   var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//   var x = (i % minSquareside) * spacing - squareSize / 2 + spacing / 2;
//   var y = Math.floor(i / minSquareside) * spacing - squareSize / 2 + spacing / 2;
//   cube.position.set(x, -50, y);
//   scene.add(cube);
//   cubes.push(cube);
// }

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
      var scaleFactor = 10 + Math.random() * 200; // Генерируем множитель для длины куба
      var initialScale = cube.userData.initialScale;
      function animate() {
        var elapsed = clock.getElapsedTime() - animationStartTime;
        var animationDuration = 5; // Длительность анимации
        var animationProgress = elapsed / animationDuration;
        if (animationProgress > 1) {
          animationProgress = 1;
          cube.userData.isAnimating = false;
          cube.scale.copy(initialScale); // Восстанавливаем начальный масштаб после анимации
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
      var scaleFactor = 2 + Math.random() * 20; // Генерируем множитель для длины куба
      function animate() {
        var elapsed = clock.getElapsedTime() - animationStartTime;
        var animationDuration = 5; // Длительность анимации
        var animationProgress = elapsed / animationDuration;
        if (animationProgress > 1) {
          animationProgress = 1;
          cube.userData.isAnimating = false;
          cube.scale.copy(initialScale); // Восстанавливаем начальный масштаб после анимации
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
  canvas.addEventListener('click', function (event) {
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
  canvas.addEventListener('touchstart', function (event) {
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



// function animateCubesDown() {
//   cubes.forEach(function (cube) {
//     if (!cube.userData.isAnimating) {
//       cube.userData.initialSize = cubeSize;
//       cube.userData.isAnimating = true;
//       var animationStartTime = clock.getElapsedTime();
//       var scaleFactor = cubeSize * (10 + Math.random() * 10) / cube.userData.initialSize;
//       var initialScale = cube.scale.clone();
//       function animate() {
//         var elapsed = clock.getElapsedTime() - animationStartTime;
//         var animationDuration = 4;
//         var animationProgress = elapsed / animationDuration;
//         if (animationProgress > 1) {
//           animationProgress = 1;
//           cube.userData.isAnimating = false;
//           cube.scale.copy(initialScale).multiplyScalar(1);
//           checkCubeSize(cube);
//         } else {
//           var scale = cube.scale.clone();
//           scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * cube.userData.initialSize * scaleFactor;
//           cube.scale.copy(scale);
//         }
//         if (cube.userData.isAnimating) {
//           requestAnimationFrame(animate);
//         }
//       }
//       animate();
//     }
//   });
// }


function checkCubeSize(cube) {
  if (cube.scale.x > cubeSize || cube.scale.y > cubeSize || cube.scale.z > cubeSize) {
    cube.scale.copy(cube.userData.initialScale).multiplyScalar(cubeSize);
  }
}



// function animateCubesUp() {
//   cubes.forEach(function (cube) {
//     if (!cube.userData.isAnimating) {
//       cube.userData.initialSize = cubeSize;
//       cube.userData.isAnimating = true;
//       var animationStartTime = clock.getElapsedTime();
//       var scaleFactor = cubeSize * (10 + Math.random() * 20) / cube.userData.initialSize;
//       var initialScale = cube.scale.clone();
//       function animate() {
//         var elapsed = clock.getElapsedTime() - animationStartTime;
//         var animationDuration = 4;
//         var animationProgress = elapsed / animationDuration;
//         if (animationProgress > 1) {
//           animationProgress = 1;
//           cube.userData.isAnimating = false;
//           cube.scale.copy(initialScale).multiplyScalar(1);
//           checkCubeSize(cube);
//         } else {
//           var scale = cube.scale.clone();
//           scale.y = Math.abs(Math.sin(animationProgress * Math.PI)) * cube.userData.initialSize * scaleFactor;
//           cube.scale.copy(scale);
//         }
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




var light = new THREE.PointLight(0xFFFFFF, 1, 420);
light.position.set(0, 300, 0);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
scene.add(light);



// Создаем красную точечную лампу
var pointLight = new THREE.PointLight(0xBC2649, 1, 150);
scene.add(pointLight);

function animateLights() {
  var elapsed = clock.getElapsedTime();

  // Определяем, на какой стадии анимации находится пульсирующий свет
  var animationDuration = 8;
  var animationProgress = (elapsed % animationDuration) / animationDuration;

  // Устанавливаем позицию света в центре поверхности пола кубов
  pointLight.position.set(0, -100, 0);
  pointLight.position.set(0, 0, 0);

  // Масштабируем интенсивность света с использованием кривой синуса,
  // чтобы создать пульсацию
  var intensity = Math.abs(Math.sin(animationProgress * Math.PI));
  pointLight.intensity = intensity * 50;
}


// var controls = new OrbitControls(camera, renderer.domElement);



function render() {
  requestAnimationFrame(render);

  animateCubes();
  animateLights();
  // animateLine();

  // Рендеринг сцены через EffectComposer
  composer.render();

  // Обновление контроллеров
  // controls.update();
}
render();
