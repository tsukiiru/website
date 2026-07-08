// why did i do this? i dont know any three.js
// thanks Mat for the cube model!!, i really appreciate it as i cant do uv wrapping for the life of me
// this is for you sky :3

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const TIME_MULTIPLIER = 0.005;
// higher = faster.
const CRAZY = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let cube;

loader.load(
  "./assets/sogcube.glb",
  function (gltf) {
    cube = gltf.scene;
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

camera.position.z = 5;

let light = new THREE.AmbientLight(0x404040, 2);
scene.add(light);

let hsv = [1, 1, 1];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function random_direction() {
  return Math.floor(Math.random() * 2) || -1;
}

let slidey = 1;
function rand() {
  hsv[0] = clamp(hsv[0] + random_direction() * 0.015, 0, 1);
  hsv[1] = clamp(hsv[1] + random_direction() * 0.015, 0, 1);
  hsv[2] = clamp(hsv[2] + random_direction() * 0.015, 0, 1);
}

const slider = document.getElementById("slider");
slider.oninput = function () {
  slidey = slider.value;
};

function animate(time) {
  time *= TIME_MULTIPLIER * slidey * 0.4;

  if (cube) {
    cube.rotation.x = time;
    cube.rotation.y = time;
  }

  rand();

  let color = new THREE.Color().setRGB(hsv[0], hsv[1], hsv[2]);

  if (CRAZY) {
    camera.position.z = clamp(
      camera.position.z + random_direction() * 1,
      2,
      10,
    );
  }

  light.color = color;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
