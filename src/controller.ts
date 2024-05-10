import { Camera, Scene, Vector3 } from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Controller {
  readonly baseElement:HTMLElement;
  readonly controls:PointerLockControls;
  readonly velocity:Vector3;

  movingBackward:boolean = false;
  movingForward:boolean = false;
  
  constructor(camera:Camera, baseElement:HTMLElement, scene:Scene) {
    this.velocity = new Vector3();
    this.controls = new PointerLockControls(camera, baseElement);
    this.baseElement = baseElement;

    scene.add(this.controls.getObject());
    this.addEventHandlers();
  }

  addEventHandlers() {
    this.baseElement.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.movingForward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.movingBackward = true;
          break;
      }
    });

    this.baseElement.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.movingForward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.movingBackward = false;
          break;
      }
    });
  }

  animate(delta:number) {
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  
    if (this.movingBackward || this.movingForward) {
      this.velocity.z -= (this.movingBackward ? -1 : 1) * 400.0 * delta;
    }
  
    this.controls.moveRight( - this.velocity.x * delta );
    this.controls.moveForward( - this.velocity.z * delta );
    // controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior
  
    if (this.controls.getObject().position.y < 10) {
      this.velocity.y = 0;
      this.controls.getObject().position.y = 10;
    }
  }

  get isLocked() {
    return this.controls.isLocked;
  }

  lock() {
    this.controls.lock();
  }
}



