// @ts-nocheck
import * as THREE from 'three';

import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

const IMAGE_ASPECT = 1096 / 1032;

const canvas = document.querySelector('[data-canvas]');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
let mesh;
let geometry;
let time = 0;

const cameraDistance = 600;
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
camera.position.z = cameraDistance;

// function textureFitCover(texture, aspect, imageAspect) {
//   if (aspect < imageAspect) {
//     texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
//   } else {
//     texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
//   }
//
//   return texture;
// }

/** @return {Object[]} */
function createImage() {
  const imgElements = /** @type {NodeListOf<HTMLElement> | null} */ (
    document.querySelectorAll('[data-image]')
  );

  const imgElementsResized = /** @type {NodeListOf<HTMLElement> | null} */ (
    document.querySelectorAll('[data-resized-image]')
  );

  if (!imgElements || !imgElementsResized) {
    return [];
  }

  const texture = textureLoader.load('/cat.jpg');
  texture.needsUpdate = true;
  texture.matrixAutoUpdate = false;
  const aspectRatio = window.innerWidth / window.innerHeight;
  // const textureCover = textureFitCover(texture, aspectRatio, IMAGE_ASPECT);

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      colorMap: { value: texture },
      uTime: { value: time },
      aspectRatio: { value: aspectRatio / IMAGE_ASPECT },
      hover: { value: new THREE.Vector2(0.5, 0.5) },
      hoverState: { value: 0 },
    },
  });

  geometry = new THREE.PlaneGeometry(
    window.innerWidth,
    window.innerHeight,
    10,
    10
  );

  mesh = new THREE.Mesh(geometry, shaderMaterial);

  scene.add(mesh);

  return {
    mesh,
    texture,
  };
}

function init() {
  createImage();
  resize();
}
init();

function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  mesh.geometry.width = windowWidth;
  mesh.geometry.height = windowHeight;
  const aspectRatio = windowWidth / windowHeight;
  renderer.setSize(windowWidth, windowHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = aspectRatio;
  camera.fov =
    2 * Math.atan(windowHeight / 2 / cameraDistance) * (180 / Math.PI);
  camera.updateProjectionMatrix();

  geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(windowWidth, windowHeight, 10, 10);
  mesh.material.uniforms.aspectRatio.value = aspectRatio / IMAGE_ASPECT;
}

window.addEventListener('resize', resize, false);

function update() {
  time += 0.001;

  requestAnimationFrame(update);

  if (mesh) {
    mesh.material.uniforms.uTime.value = time;
  }

  renderer.render(scene, camera);
}

update();
