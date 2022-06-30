import { Injectable, ElementRef, NgZone } from '@angular/core';
import { GLTFFileLoader } from 'babylonjs-loaders'
import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  Vector4,
  HemisphericLight,
  PointLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  Space,
  CreateGround,
  ArcRotateCamera,
  CreateBox,
  SceneLoader,
  Sound,
  MeshBuilder,
  Animation,
  Axis,
  Tools,
  CubeTexture,
  SpriteManager,
  Sprite,
  ParticleSystem,
  PointerEventTypes,
  SpotLight,
  DirectionalLight,
  ShadowGenerator,
  FollowCamera,
} from 'babylonjs'

@Injectable({
  providedIn: 'root'
})
export class BabylonEnginService {
  private canvas?: HTMLCanvasElement;
  private engine?: Engine;
  private camera?: FreeCamera;
  private cameraRot?: ArcRotateCamera;
  private scene?: Scene;
  private lightHemi?: Light;
  private lightPoint?: Light;

  private ground?: Mesh;
  private sphere?: Mesh;

  constructor(private ngZone: NgZone,) {
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas, true);
    SceneLoader.RegisterPlugin(new GLTFFileLoader());
    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 0);

    // ArcRotateCamera 是一个朝向指定目标位置的摄像机
    this.cameraRot = new ArcRotateCamera('camera0', Math.PI / 2, Math.PI / 2, 5, new Vector3(0, 2, 0), this.scene)
    this.cameraRot.attachControl(this.canvas, true)
    this.cameraRot.setTarget(Vector3.Zero());
    const xr = this.scene.createDefaultXRExperienceAsync();
    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    // this.camera = new FreeCamera('camera1', new Vector3(5, 10, -20), this.scene);
    // target the camera to scene origin
    // this.camera.setTarget(Vector3.Zero());
    // attach the camera to the canvas
    // this.camera.attachControl(this.canvas, true);

    // 创建光源
    this.lightHemi = new HemisphericLight('light1', new Vector3(1, 1, 0), this.scene);
    this.lightHemi.intensity = 1;
    this.lightPoint = new PointLight('light2', new Vector3(0, 1, -1), this.scene)

    // 创建地面
    this.ground = CreateGround("ground", {width: 150, height: 150}, this.scene);
    // 防止后面添加的地下z冲突
    this.ground.position.y = -0.02;

    // generates the world x-y-z axis for better understanding
    this.showWorldAxis(8);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene?.render();
      };
      this.engine?.runRenderLoop(rendererLoopCallback);


      window.addEventListener('resize', () => {
        this.engine?.resize();
      });
    });
  }

  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  public showWorldAxis(size: number): void {

    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene!, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this.scene!,
      true
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
      ],
      this.scene!,
      true
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
      ],
      this.scene!,
      true
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }

  public changeGroundColor(): void {
    if (this.ground) {
      let groundMaterial = new StandardMaterial("Ground Material", this.scene);
      this.ground.material = groundMaterial;
      let groundTexture = new Texture('assets/image/grass.jpeg', this.scene);
      // @ts-ignore
      this.ground.material!.diffuseTexture = groundTexture;
    }
  }

  public createThings(): void {
    const box = CreateBox("box", {});
    box.position.x = -1
    box.position.z = -1
    box.position.y = 1
    // 创建材质
    const spherMaterial = new StandardMaterial('sun_surface', this.scene);
    spherMaterial.diffuseTexture = new Texture('assets/image/sun.jpg', this.scene);
    box.material = spherMaterial;
    // 创建棱镜
    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.0, height: 1.0, tessellation: 3});
    roof.position.x = -1;
    // roof.rotation.z = -Math.PI / 2;
    roof.position.z = -1.2;
    roof.position.y = 2;
    let roofMaterial = new StandardMaterial("Ground Material", this.scene);
    roof.material = roofMaterial;
    let groundTexture = new Texture('assets/image/grass.jpeg', this.scene);
    // @ts-ignore
    roof.material.diffuseTexture = groundTexture;

    // 组合mesh
    // 这种只会使用一种材质
    // const house = Mesh.MergeMeshes([box, roof])
    // 这种可以使用各自材质，但这个参数是最后一个，使用麻烦。
    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)

    // 克隆
    const clonedHouse = house!.clone("clonedHouse")
    clonedHouse.position.y = 1
    clonedHouse.position.x = 1
    clonedHouse.position.z = 1
    const instanceHouse = house!.createInstance("instanceHouse")
    instanceHouse.position.y = 1
    instanceHouse.position.x = 3
    instanceHouse.position.z = 5
  }

  public createBall(): void {
    // 创建网格
    this.sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene);

    // 创建材质
    const spherMaterial = new StandardMaterial('sun_surface', this.scene);
    spherMaterial.diffuseTexture = new Texture('assets/image/sun.jpg', this.scene);
    this.sphere.material = spherMaterial;

    // 移动位置
    this.sphere.position.z = 5;
  }

  public addGLTF(): void {
    // @ts-ignore
    SceneLoader.ImportMesh("", 'assets/model/', 'sate.gltf', this.scene, function (newMeshes) {
      newMeshes[0].scaling = new Vector3(0.01, 0.01, 0.01);
      newMeshes[0].position.y = 0.4
      newMeshes[0].position.x = 3
      newMeshes[0].position.z = 1
    });
  }

  public addMusic(): void {
    console.log('进来了')
    // @ts-ignore
    const sound = new Sound("test", "assets/audio/test.wav", this.scene, null, {loop: true, autoplay: true});
    // sound.play()
    console.log('voice添加成功')
  }


  public createPeople(): void {
    class walk {
      turn: number;
      dist: number;

      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }

    }

    const track: walk[] = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))
    SceneLoader.ImportMeshAsync("him", "assets/model/people/", "Dude.babylon", this.scene).then((result) => {
      let dude = result.meshes[0];
      dude.scaling = new Vector3(0.01, 0.01, 0.01);

      dude.position = new Vector3(-6, 0, 0);
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      // 由于从.babylon文件导入的字符dude已使用roting四元数而不是旋转设置其旋转，因此我们使用roting方法来重置字符方向
      const startRotation = dude.rotationQuaternion!.clone();

      this.scene!.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      this.scene!.onBeforeRenderObservable.add(() => {
        dude.movePOV(0, 0, step);
        distance += step;

        if (distance > track[p].dist) {

          dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
          p += 1;
          p %= track.length;
          if (p === 0) {
            distance = 0;
            dude.position = new Vector3(-6, 0, 0);
            dude.rotationQuaternion = startRotation.clone();
          }
        }

      })
    });
  }

  // 添加地形
  public addGroundShape(): void {

    // 创建局部细节地形
    //Create Village ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("assets/image/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 24, height: 24});
    ground.material = groundMat;


    // 创建大背景地形
    //Create large ground for valley environment
    const largeGroundMat = new StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new Texture("assets/image/valleygrass.png");


    //Create large ground for valley environment
    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "assets/image/villageheightmap.png", {
      width: 150,
      height: 150,
      subdivisions: 20,
      minHeight: 0,
      maxHeight: 10
    });

    largeGround.material = largeGroundMat;
    largeGround.position.y = -0.01
  }

  // 添加天空盒
  public addSkyBox(): void {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size: 150}, this.scene);
    const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/image/babylonSkybox/skybox", this.scene!);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }

  // 精灵树
  public addSpiritTree(): void {
    // 参数是管理器的名称，图像的URL，最大子画面数，指定子画面宽度和高度的对象，在本例中是图像的宽度和高度
    const spriteManagerTrees = new SpriteManager("treesManager",
      "assets/image/palm.png", 2000,
      {width: 512, height: 1024}, this.scene!);

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
      tree.position.z = Math.random() * -35 + 8;
      tree.position.y = 0.5;
    }
  }

  // 喷泉
  public createFountain(): void {
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
    const fountain = MeshBuilder.CreateLathe("fountain", {
      shape: fountainProfile,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, this.scene);
    // fountain.position.x = -4;
    // fountain.position.z = -6;
    fountain.position.y = -5;

    // Create a particle system
    let particleSystem = new ParticleSystem("particles", 5000, this.scene!);

    //Texture of each particle
    particleSystem.particleTexture = new Texture("assets/image/flare.png", this.scene);

    // Where the particles come from
    particleSystem.emitter = new Vector3(0, 10, 0); // the starting object, the emitter
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
    particleSystem.direction1 = new Vector3(-2, 8, 2);
    particleSystem.direction2 = new Vector3(2, 8, -2);

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
    const pointerDown = (mesh: any) => {
      if (mesh === fountain) {
        switched = !switched;
        if (switched) {
          // Start the particle system
          particleSystem.start();
        } else {
          // Stop the particle system
          particleSystem.stop();
        }
      }

    }

    // @ts-ignore
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo?.hit) {
            pointerDown(pointerInfo.pickInfo.pickedMesh)
          }
          break;
      }
    });
  }

  // 路灯
  public createLamp(): void {
    const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, this.scene!);
    lampLight.diffuse = Color3.Yellow();
    //shape to extrude
    const lampShape = [];
    for (let i = 0; i < 20; i++) {
      lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
    lampShape.push(lampShape[0]); //close shape

    //extrusion path
    const lampPath = [];
    lampPath.push(new Vector3(0, 0, 0));
    lampPath.push(new Vector3(0, 10, 0));
    for (let i = 0; i < 20; i++) {
      lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new Vector3(3, 11, 0));

    const yellowMat = new StandardMaterial("yellowMat");
    yellowMat.emissiveColor = Color3.Yellow();

    //extrude lamp
    const lamp = MeshBuilder.ExtrudeShape("lamp", {cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});

    //add bulb
    const bulb = MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});

    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;
    lamp.position = new Vector3(2, 0, 2);
    lamp.rotation = Vector3.Zero();
    lamp.rotation.y = -Math.PI / 4;

    let lamp3 = lamp.clone("lamp3");
    lamp3.position.z = -8;

    let lamp1 = lamp.clone("lamp1");
    lamp1.position.x = -8;
    lamp1.position.z = 1.2;
    lamp1.rotation.y = Math.PI / 2;

    let lamp2 = lamp1.clone("lamp2");
    lamp2.position.x = -2.7;
    lamp2.position.z = 0.8;
    lamp2.rotation.y = -Math.PI / 2;
  }

  public createGui(): void {
    // GUI
    // @ts-ignore
    const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // @ts-ignore
    const panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.top = "-25px";
    // @ts-ignore
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    // @ts-ignore
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    adt.addControl(panel);
    // @ts-ignore
    const header = new BABYLON.GUI.TextBlock();
    header.text = "Night to Day";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header);
    // @ts-ignore
    const slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 1;
    slider.borderColor = "black";
    slider.color = "gray";
    slider.background = "white";
    slider.value = 1;
    slider.height = "20px";
    slider.width = "200px";
    slider.onValueChangedObservable.add((value: number) => {
      if (this.lightHemi) {
        this.lightHemi.intensity = value;
      }
    });
    panel.addControl(slider);
  }

  public createShadow(): void {
    const light = new DirectionalLight("dir01", new Vector3(0, -1, 1), this.scene!);
    light.position = new Vector3(0, 15, -30);

    this.ground!.receiveShadows = true;

    // Shadow generator
    const shadowGenerator = new ShadowGenerator(1024, light);

    SceneLoader.ImportMeshAsync("him", "assets/model/people/", "Dude.babylon", this.scene).then((result) => {
      let dude = result.meshes[0];
      dude.scaling = new Vector3(0.03, 0.03, 0.01);

      dude.position = new Vector3(-2, 0, 0);
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      // 由于从.babylon文件导入的字符dude已使用roting四元数而不是旋转设置其旋转，因此我们使用roting方法来重置字符方向
      const startRotation = dude.rotationQuaternion!.clone();
      shadowGenerator.addShadowCaster(dude, true);
      this.scene!.beginAnimation(dude, 0, 100, true, 1.0);
    });
  }

  public createFollowCamera(): void {
    // This creates and initially positions a follow camera
    const camera = new FollowCamera("FollowCam", new Vector3(-6, 0, 0), this.scene);

    //The goal distance of camera from target
    camera.radius = 2;

    // The goal height of camera above local oriin (centre) of target
    camera.heightOffset = 8;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    //Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.005

    //The speed at which acceleration is halted
    camera.maxCameraSpeed = 10

    //camera.target is set after the target's creation

    // This attaches the camera to the canvas
    camera.attachControl(true);

    class walk {
      turn: number;
      dist: number;

      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }

    }

    const track: walk[] = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))
    SceneLoader.ImportMeshAsync("him", "assets/model/people/", "Dude.babylon", this.scene).then((result) => {
      let dude = result.meshes[0];
      dude.scaling = new Vector3(0.01, 0.01, 0.01);

      dude.position = new Vector3(-6, 0, 0);
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      // 由于从.babylon文件导入的字符dude已使用roting四元数而不是旋转设置其旋转，因此我们使用roting方法来重置字符方向
      const startRotation = dude.rotationQuaternion!.clone();
      camera.lockedTarget = dude;
      this.scene!.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      this.scene!.onBeforeRenderObservable.add(() => {
        dude.movePOV(0, 0, step);
        distance += step;

        if (distance > track[p].dist) {

          dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
          p += 1;
          p %= track.length;
          if (p === 0) {
            distance = 0;
            dude.position = new Vector3(-6, 0, 0);
            dude.rotationQuaternion = startRotation.clone();
          }
        }

      })
    });
  }
}
