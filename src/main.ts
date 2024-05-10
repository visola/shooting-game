import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Controller } from './controller';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new GLTFLoader().load('/models/room.glb', (gltf) => {
  gltf.scene.children.forEach((c) => {
    c.castShadow = true;
    c.receiveShadow = true;
  });
  scene.add(gltf.scene);
}, () => console.error)

const COLORS = [
  0x00ff00, 0x0000ff, 0xff0000,
  0xffff00, 0x00ffff, 0xff00ff,
  0x0ff000, 0x000ff0, 0xf0000f,
];

let colorIndex = 0;
const size = 3;
for (let i = 0; i <= 20; i++) {
  for (let j = 0; j <= 20; j++) {
    colorIndex++;
    if (colorIndex >= COLORS.length) {
      colorIndex = 0;
    }
    
    const geometry = new THREE.BoxGeometry( size, size, size );
    const material = new THREE.MeshStandardMaterial( { color: COLORS[colorIndex] } );
    const cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.x = -100 + 10 * i;
    cube.position.y = size / 2 + 2;
    cube.position.z = -100 + 10 * j;
    scene.add( cube );
  }
}

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.01);
scene.add(ambientLight);

const start = -130;
const increment = 120;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const light = new THREE.PointLight(0xFFFFFF, 250, 100);
    light.position.set(start + increment * i, 15, start + increment * j);
    light.castShadow = true;
    scene.add(light);
  }
}

const controller = new Controller(camera, document.body, scene);

document.body.addEventListener('click', () => {
  if (!controller.isLocked) {
    controller.lock();
    return;
  }

  // Control shooting
});

camera.position.z = 5;

const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );
  const delta = clock.getDelta();
  controller.animate(delta);
	renderer.render( scene, camera );
}
animate();