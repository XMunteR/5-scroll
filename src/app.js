import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import gsap from 'gsap';

/* 
    Actividad
    - Cambiar imagenes por modelos(puede ser el mismo modelo)
    - Limitar el scroll
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

let y = 0;
let position = 0;

let objs = [];

document.body.onload = () => {
  main();
};

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

window.addEventListener('wheel', onMouseWheel);

function main() {
  // Configurracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 2;
  scene.add(camera);

  // Lights
  setupLights();

  // Imagenes
  loadImages();

  animate();
}

function loadImages() {
  // Loader de Textura
  const textureLoader = new THREE.TextureLoader();

  const geometry = new THREE.PlaneBufferGeometry(1, 1.3);

  for (let i = 0; i < 4; i++) {
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(`/assets/${i}.jpg`),
    });

    const img = new THREE.Mesh(geometry, material);
    img.position.set(Math.random() + 0.3, i * -1.8);

    scene.add(img);
  }

  scene.traverse((object) => {
    if (object.isMesh) objs.push(object);
  });
}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function setupLights() {
  const pointLight = new THREE.PointLight(0xffffff, 0.1);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);
}

function onMouseWheel(event) {
  y = -event.deltaY * 0.0007;
}

function updateElements() {
  position += y;
  y *= 0.9;

  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objs);

  for (const intersect of intersects) {
    gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
    gsap.to(intersect.object.rotation, { y: -0.5 });
    gsap.to(intersect.object.position, { z: -0.9 });
  }

  for (const object of objs) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      gsap.to(object.scale, { x: 1, y: 1 });
      gsap.to(object.rotation, { y: 0 });
      gsap.to(object.position, { z: 0 });
    }
  }

  camera.position.y = position;
}