import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {BabylonEngin} from "../../babylon-engin";
import {
  MeshBuilder,
  CubeTexture,
  Color3,
  StandardMaterial,
  Texture,
  Mesh,
  Sprite,
  ParticleSystem,
  SpriteManager,
  PointerEventTypes,
  Color4,
  Vector3, SceneLoader, Sound, Tools
} from "babylonjs";
@Component({
  selector: 'app-start-two',
  templateUrl: './start-two.component.html',
  styleUrls: ['./start-two.component.scss']
})
export class StartTwoComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  babylonTarget?: BabylonEngin
  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.babylonTarget = new BabylonEngin(this.rendererCanvas.nativeElement)
      // this.babylonTarget.creatRotCamera()
      this.babylonTarget.creatUniversalCamera('universal-camera',[0 ,16, 42])
      // this.babylonTarget.switchActiveCameraByName('universal-camera')
      this.creatGround()
      this.babylonTarget.creatHemiLight()
      this.start();
      this.addSky()
      this.addTree()
      this.addUfo()
      this.addWater()

    }
  }
  ngOnDestroy(): void {
    if (this.babylonTarget) {
      this.babylonTarget.scene?.dispose();
    }

  }

  start () {
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.babylonTarget!.scene?.render();
      };
      this.babylonTarget!.engine?.runRenderLoop(rendererLoopCallback);
      window.addEventListener('resize', () => {
        this.babylonTarget!.engine?.resize();
      });
    });
  }

  creatGround() {
    //Create Village ground
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseTexture = new Texture("assets/image/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = MeshBuilder.CreateGround("ground", {width:24, height:24});
    ground.material = groundMat;

    //large ground
    const largeGroundMat = new StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new Texture("assets/image/valleygrass.png");

    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "assets/image/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
    largeGround.material = largeGroundMat;
    largeGround.position.y = -0.01;
  }
  addSky() {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:950}, this.babylonTarget?.scene);
    const skyboxMaterial = new StandardMaterial("skyBox", this.babylonTarget?.scene);
    skyboxMaterial.backFaceCulling = false;
    if (this.babylonTarget?.scene) {
      skyboxMaterial.reflectionTexture = new CubeTexture("assets/sky/one/skybox", this.babylonTarget?.scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
      skyboxMaterial.specularColor = new Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
    }

  }

  addTree() {
    if (this.babylonTarget?.scene) {
      // 创建精灵管理器
      const spriteManagerTrees = new SpriteManager("treesManager", "assets/image/palmtree.png", 2000, {width: 512, height: 1024}, this.babylonTarget?.scene);

      //We create trees at random positions
      for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
      }

      for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
      }
    }

  }

  addUfo() {
    if (this.babylonTarget?.scene) {
      const spriteManagerUFO = new SpriteManager("UFOManager","assets/image/ufo.png", 1, { width: 128, height: 76 }, this.babylonTarget.scene);
      const ufo = new Sprite("ufo", spriteManagerUFO);
      ufo.playAnimation(0, 16, true, 125);
      ufo.position.y = 5;
      ufo.position.z = 0;
      ufo.width = 2;
      ufo.height = 1;
    }

  }

  addWater() {
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(10, 4, 0),
      new Vector3(8, 4, 0),
      new Vector3(8, 1, 0),
      new Vector3(1, 2, 0),
      new Vector3(1, 15, 0),
      new Vector3(3, 17, 0)
    ];

    //Create lathe
    if (this.babylonTarget?.scene) {
      const fountain = MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: Mesh.DOUBLESIDE}, this.babylonTarget.scene);
      fountain.scaling = new Vector3(0.2,0.2,0.2)
      fountain.position = new Vector3(10, 0, 10)

        // 创建粒子系统
      // Create a particle system
      let particleSystem = new ParticleSystem("particles", 5000, this.babylonTarget.scene);

      //Texture of each particle
      particleSystem.particleTexture = new Texture("assets/image/flare.png", this.babylonTarget.scene);

      // Where the particles come from
      particleSystem.emitter = new Vector3(10, 3, 10); // the starting object, the emitter
      particleSystem.minEmitBox = new Vector3(-1, 0, 0); // Starting all from
      particleSystem.maxEmitBox = new Vector3(1, 0, 0); // To...

      // Colors of all particles
      particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
      particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
      particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

      // Size of each particle (random between...
      particleSystem.minSize = 0.1;
      particleSystem.maxSize = 0.5;

      // Life time of each particle (random between...
      particleSystem.minLifeTime = 2;
      particleSystem.maxLifeTime = 3.5;

      // Emission rate
      particleSystem.emitRate = 1500;

      // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
      particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

      // Set the gravity of all particles
      particleSystem.gravity = new Vector3(0, -9.81, 0);

      // Direction of each particle after it has been emitted
      particleSystem.direction1 = new Vector3(-0.5, 2, 0.5);
      particleSystem.direction2 = new Vector3(0.5, 2, -0.5);

      // Angular speed, in radians
      particleSystem.minAngularSpeed = 0;
      particleSystem.maxAngularSpeed = Math.PI;

      // Speed
      particleSystem.minEmitPower = 1;
      particleSystem.maxEmitPower = 3;
      particleSystem.updateSpeed = 0.025;

      // Start the particle system
      // particleSystem.start();

      // 添加事件
      //Switch fountain on and off
      let switched = false;
      // @ts-ignore
      const pointerDown = (mesh) => {
        if (mesh === fountain) {
          switched = !switched;
          if(switched) {
            // Start the particle system
            particleSystem.start();
          }
          else {
            // Stop the particle system
            particleSystem.stop();
          }
        }

      }

      this.babylonTarget.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN:
            // @ts-ignore
            if(pointerInfo.pickInfo.hit) {
              // @ts-ignore
              pointerDown(pointerInfo.pickInfo.pickedMesh)
            }
            break;
        }
      });

    }
  }

}
