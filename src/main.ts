import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const COLORS = [
  0x00ff00, 0x0000ff, 0xff0000,
  0xffff00, 0x00ffff, 0xff00ff,
  0x0ff000, 0x000ff0, 0xf0000f,
];

const floor = new THREE.Mesh(
  new THREE.BoxGeometry( 200, 1, 200 ),
  new THREE.MeshBasicMaterial( { color: 0xCCCCCC } )
);
floor.position.y = -1;
scene.add(floor);

let colorIndex = 0;
for (let i = 0; i <= 20; i++) {
  for (let j = 0; j <= 20; j++) {
    colorIndex++;
    if (colorIndex >= COLORS.length) {
      colorIndex = 0;
    }
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: COLORS[colorIndex] } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = -100 + 10 * i;
    cube.position.z = -100 + 10 * j;
    scene.add( cube );
  }
}

const controls = new PointerLockControls( camera, document.body );
scene.add(controls.getObject());

document.body.addEventListener('click', () => {
  controls.lock();
});

let moveForward = false, moveBackward = false;
document.body.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;
  }
});

document.body.addEventListener('keyup', (e) => {
  switch(e.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
        moveBackward = false;
        break;
  }
});

camera.position.z = 5;

const clock = new THREE.Clock();

const velocity = new THREE.Vector3();

function animate() {
	requestAnimationFrame( animate );
  const delta = clock.getDelta();

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

  if ( moveForward || moveBackward ) velocity.z -= (moveBackward ? -1 : 1) * 400.0 * delta;

  controls.moveRight( - velocity.x * delta );
  controls.moveForward( - velocity.z * delta );
  // controls.getObject().position.y += ( velocity.y * delta ); // new behavior

  if ( controls.getObject().position.y < 10 ) {
    velocity.y = 0;
    // controls.getObject().position.y = 10;
  }

	renderer.render( scene, camera );
}
animate();