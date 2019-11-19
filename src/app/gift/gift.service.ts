import { Injectable, NgZone, ElementRef } from '@angular/core';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  Color3,
  StandardMaterial,
  Texture,
  Mesh,
  ParticleSystem,
  Color4
} from "@babylonjs/core";
import { Gift } from './gift';

@Injectable({
  providedIn: 'root'
})
export class GiftService {

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private light: HemisphericLight;
  public rendererCanvas: ElementRef<HTMLCanvasElement>;



  constructor(private ngZone: NgZone) { }

  animate() {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, options: Gift) {
    console.log(canvas);
    this.engine = new Engine(canvas.nativeElement);

    // Create scene
    this.scene = new Scene(this.engine);

    // Create camera
    // Parameters: alpha, beta, radius, target position, scene
    const camera = new ArcRotateCamera(
      "camera",
      0.3,
      Math.PI / 2,
      30.0,
      new Vector3(),
      this.scene
    );

    // This can be passed to component
    camera.setPosition(new Vector3(0, 0, 20));

    camera.attachControl(canvas.nativeElement, true);

    // Create light
    const light = new HemisphericLight(
      "hemiLight",
      new Vector3(1, 1, 0),
      this.scene
    );
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 1, 1);
    light.groundColor = new Color3(0, 0, 0);

    // Create a material with our land texture.
    const groundMaterial = new StandardMaterial("ground", this.scene);
    groundMaterial.diffuseTexture = new Texture(options.groundPattern, this.scene);

    // Use CreateGroundFromHeightMap to create a height map of 200 units by 200
    // units, with 250 subdivisions in each of the `x` and `z` directions, for a
    // total of 62,500 divisions.
    const ground = Mesh.CreateGroundFromHeightMap(
      "ground",
      options.groundPattern,
      80,
      80,
      200,
      -2,
      -6,
      this.scene,
      false
    );
    ground.material = groundMaterial;

    // Create giftwrap
    const wrapping = new StandardMaterial("wrapping", this.scene);
    wrapping.diffuseTexture = new Texture(options.wrapPattern, this.scene);

    // Diffuse texture
    const gift = MeshBuilder.CreateBox("gift", {}, this.scene);
    gift.position.x = 0;
    gift.position.y = -4.8;
    gift.position.z = 0;
    gift.material = wrapping;

    // Spotlight on the gift
    const spotLight = new SpotLight(
      "spotLight",
      new Vector3(0, -2, 0),
      new Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      this.scene
    );

    if (options.snowing) {
      // Create a particle system
      const snowParticleSystem = new ParticleSystem("particles", 5000, this.scene);

      // Texture of each particle
      snowParticleSystem.particleTexture = new Texture(options.snowPattern, this.scene);

      // Where the particles come from
      snowParticleSystem.emitter = new Vector3(0, 5, 0); // the starting object, the emitter
      snowParticleSystem.minEmitBox = new Vector3(-50, -10, -50); // Starting all from
      snowParticleSystem.maxEmitBox = new Vector3(50, 20, 50); // To...

      // Size of each particle (random between...)
      snowParticleSystem.minSize = 0.1;
      snowParticleSystem.maxSize = 0.5;

      // Color of each particle
      snowParticleSystem.color1 = new Color4(0.38, 0.55, 1, 0.26);
      snowParticleSystem.colorDead = new Color4(0, 0, 0, 0);

      // Particles emitted per second
      snowParticleSystem.emitRate = 1000;

      // Set the gravity of all particles
      snowParticleSystem.gravity = new Vector3(0, -10, 0);

      // Start the particle system
      snowParticleSystem.start();
    }


    // Enable VR
    const VRHelper = this.scene.createDefaultVRExperience();
    VRHelper.enableTeleportation({ floorMeshName: "ground" });

    return this.scene;
  }
}
