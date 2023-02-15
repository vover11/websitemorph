let container3d = document.querySelector('.container3d')
var w = container3d.offsetWidth;
var h = container3d.offsetHeight;
// var w = container3d.offsetWidth;
// var h = container3d.offsetHeight;
// var container3d = document.getElementById( 'canvas' )





let linksObject = {
    1: "https://vasiliyanikin.com/",
    2: "https://vasiliyanikin.com/",
    3: "https://vasiliyanikin.com/",
    4: "https://vasiliyanikin.com/",
    5: "https://vasiliyanikin.com/",
    6: "https://vasiliyanikin.com/",
    7: "https://vasiliyanikin.com/",
    8: "https://vasiliyanikin.com/",
}

import * as THREE from 'https://cdn.skypack.dev/three@v0.119.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.119.0/examples/jsm/loaders/GLTFLoader.js';

let scene,
    camera,
    renderer,
    controls,
    textureLoader,
    GLLoader

init();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    container3d.appendChild(renderer.domElement);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000);
    renderer.domElement.id = "canvasfirst";
    renderer.domElement.classList.add("canvasfirst");

    

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, w / h, .5, 200);
    camera.lookAt(scene.position);
    camera.position.z = -9;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 9;
    controls.minDistance = 1;
    controls.rotateSpeed = -.3;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = .5;

    textureLoader = new THREE.TextureLoader();
    GLLoader = new GLTFLoader();

    // light

    let ambient = new THREE.AmbientLight(0xffffff, 2)
    scene.add(ambient)

    // mesh

    let modelsPaths = [
        'https://raw.githubusercontent.com/vover11/newcube/main/cube.gltf',
        'models/cube.glb',
        'models/cube.gltf',
    ]

    let root = new THREE.Object3D()

    let links = []

    GLLoader.load(modelsPaths[0], (gltf) => {
        root = gltf.scene
        scene.add(root)
        root.position.set(0, 0, 0)

        root.traverse(function (node) {

            if (node instanceof THREE.Mesh && node.name !== 'root' && node.name !== 'Cube') {
                links.push(node)
            }

        });
    })

    // interactive

    const raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    let move = 0
    let linkHover = 0
    let linkClick = 0

    function onChangeControl() {
        move = 1
    }

    raycastSprite()

    function raycastSprite() {

        let headerHeight = 0;
        var container3d = document.getElementsByClassName('container3d')[0];
        window.onmousemove = (function (e) {

            if (window.innerWidth > 920) {

                e.preventDefault();
                mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -((e.clientY - headerHeight + pageYOffset) / renderer.domElement.clientHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                let intersects = raycaster.intersectObjects(links, true);

                if (intersects.length > 0) {

                    document.body.style.cursor = 'url("https://child-toy.ru/image/circle_2.png"), auto';
                    //container3d.style.cursor = 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/9632/heart.png"), auto';
                    linkHover = 1

                } else {
                    document.body.style.cursor = 'url("https://child-toy.ru/image/circle_3.png"), auto';
                    //container3d.style.cursor = '';
                    controls.removeEventListener('change', onChangeControl)
                    move = 0
                    linkHover = 0
                    linkClick = 0
                }
            }
        });

        if (window.innerWidth > 920) {
            window.addEventListener('mousedown', pointerDown, false)
            window.addEventListener('mouseup', openLink, false)
        }
        else {
            container3d.querySelector('canvas').addEventListener('pointerup', openLinkMobile, false)
            container3d.querySelector('canvas').addEventListener('pointerdown', pointerDown, false)
        }
        var pd = false;
        function pointerDown() {

            pd = true;
            setTimeout(function () {

                pd = false;
            }, 500);

        }
        function openLinkMobile(e) {
            e.preventDefault();
            mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            let intersects = raycaster.intersectObjects(links, true);
            if (intersects.length > 0 && pd) {
                intersects = intersects.sort(function (a, b) {
                    return a.distanceToRay - b.distanceToRay;
                });
                let link = intersects[0].object;
                location.href = linksObject[Number(link.name)]
            } else {
            }
        }


        function openLink(e) {

            e.preventDefault();
            mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -((e.clientY - headerHeight + pageYOffset) / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            let intersects = raycaster.intersectObjects(links, true);
            if (intersects.length > 0) {

                intersects = intersects.sort(function (a, b) {
                    return a.distanceToRay - b.distanceToRay;
                });
                let link = intersects[0].object;

                linkClick = 1
                controls.addEventListener('change', onChangeControl)

                window.addEventListener('click', () => pd && linkHover && linkClick ? location.href = linksObject[Number(link.name)] : '')

            } else {

            }

        }
    }

    window.addEventListener('resize', onWindowResize)

    animate()
}


function animate() {

    camera.updateProjectionMatrix();

    renderer.render(scene, camera);

    controls.update();
    requestAnimationFrame(animate);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

}