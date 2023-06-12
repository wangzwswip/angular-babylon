import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Camera,
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
  UniversalCamera
} from 'babylonjs'

const rotCameraDefaultOption = {
  name: 'rot-camera',
  alpha: Math.PI / 2,
  beta: Math.PI / 2,
  radius: 5,
  vector: [0, 2, 0]

}
export interface rotCameraOption {
  name?: string,
  alpha?: number,
  beta?: number,
  radius?:number,
  vector?: Array<number>
}

export class BabylonEngin {
  canvas?: HTMLCanvasElement;
  engine?: Engine;
  camera?: FreeCamera;
  arcRotateCamera?: ArcRotateCamera;
  universalCamera?: UniversalCamera;
  followCamera?: FollowCamera;
  scene?: Scene;
  lightHemi?: Light;
  lightPoint?: Light;
  ground?: Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 0);
  }

  animate(): void {
    const rendererLoopCallback = () => {
      this.scene?.render();
    };
    this.engine?.runRenderLoop(rendererLoopCallback);
    window.addEventListener('resize', () => {
      this.engine?.resize();
    });
  }

  /**
   * @description 根据相机名称移除相机
   * @param {string} [name] 相机名称
   * @return {number} 相机在场景中的索引
   */
  removeCameraByName(name: string) : number {
    let camera = this.scene?.getCameraByName(name)
    if (camera && this.scene) {
      return this.scene.removeCamera(camera)
    } else {
      return -1
    }
  }

  /**
   * @description 根据id移除相机
   * @param {string} [id] 相机id
   * @return {number} 相机在场景中的索引
   */
  removeCameraById(id: string) {
    let camera = this.scene?.getCameraById(id)
    if(camera) {
      return this.scene?.removeCamera(camera)
    } else {
      return -1
    }
  }

  /**
   * @description 通过名称激活相机
   * @param {string} [name] 相机名称
   */
  activeCameraByName(name: string) {
    this.scene?.setActiveCameraByName(name)
  }

  /**
   * @description 通过id激活对应相机
   * @param {string} [id] 相机id
   */
  activeCameraById(id: string) {
    this.scene?.setActiveCameraById(id)
  }

  /**
   * @description 通过名称切换相机
   * @param {string} [name]
   */
  switchActiveCameraByName(name: string){
    let newCamera = this.scene?.getCameraByName(name)
    if (newCamera) {
      this.scene?.switchActiveCamera(newCamera, true)
    }
  }

  /**
   * @description 通过id切换相机
   * @param {string} [id]
   */
  switchActiveCameraById(id: string){
    let newCamera = this.scene?.getCameraByID(id)
    if (newCamera) {
      this.scene?.switchActiveCamera(newCamera, true)
    }
  }
  createFreCamera(name = 'free-camera', vector = [3 ,3, 3]) {
    const _vector = new Vector3(vector[0], vector[1], vector[2])
    this.camera = new FreeCamera('free-camera',_vector)
    this.camera.attachControl(this.canvas, true);
  }
  /**
   * @description 创建通用相机
   * @param {string} [name='universal-camera'] 相机名称
   * @param {number[]} [vector=[3,8,3] 相机初始位置
   */
  creatUniversalCamera(name = 'universal-camera', vector = [3 ,3, 3]) {
    const _vector = new Vector3(vector[0], vector[1], vector[2])
    this.universalCamera = new UniversalCamera("UniversalCamera",_vector, this.scene);
    this.universalCamera.setTarget(Vector3.Zero());
    // Enable mouse wheel inputs.
    this.universalCamera.inputs.addMouseWheel();
    this.universalCamera.attachControl(this.canvas, true);
  }

  creatRotCamera (options?: rotCameraOption) {
    let _options
    if (options) {
      _options = Object.assign(rotCameraDefaultOption, options)
    } else {
      _options = Object.assign(rotCameraDefaultOption, {})
    }
    Reflect.defineProperty(_options, 'vectors', {value: new Vector3(_options.vector[0], _options.vector[1], _options.vector[2])})
    // 创建相机
    // @ts-ignore
    this.arcRotateCamera = new ArcRotateCamera(_options.name, _options.alpha, _options.beta, _options.radius, _options.vectors, this.scene)
    this.arcRotateCamera.attachControl(this.canvas, false)
    // this.arcRotateCamera.setTarget(Vector3.Zero());
    this.arcRotateCamera.zoomToMouseLocation = true
    // 添加鼠标平移视角的输入设备
//     this.arcRotateCamera.inputs.addMouseWheel();
//     this.arcRotateCamera.inputs.addPointers();
//     this.arcRotateCamera.inputs.addKeyboard();
//     this.arcRotateCamera.inputs.attached['mousewheel'].detachControl();
//     this.arcRotateCamera.inputs.attached['pointers'].detachControl();
//     this.arcRotateCamera.inputs.attached['keyboard'].detachControl();
//
// // 修改相机的 inputs 属性，以支持鼠标平移视角
//     this.arcRotateCamera.inputs.attached['pointers'].buttons = [0, 1, 2];
//     this.arcRotateCamera.inputs.attached.pointers.angularSensibilityX = -500;
//     this.arcRotateCamera.inputs.attached.pointers.angularSensibilityY = -500;
//     this.arcRotateCamera.inputs.attached.pointers.pinchPrecision = 200;
//     this.arcRotateCamera.inputs.attached.keyboard.keysUp.push(87); // W
//     this.arcRotateCamera.inputs.attached.keyboard.keysDown.push(83); // S
//     this.arcRotateCamera.inputs.attached.keyboard.keysLeft.push(65); // A
//     this.arcRotateCamera.inputs.attached.keyboard.keysRight.push(68); // D
  }

  creatFollowCamera(name = 'follow-camera', position = [0, 10, -10]) {
    const _vector = new Vector3(position[0], position[1], position[2])
    // Parameters: name, position, scene
    this.followCamera = new FollowCamera(name, _vector, this.scene);

    // The goal distance of camera from target
    this.followCamera.radius = 30;

    // The goal height of camera above local origin (centre) of target
    this.followCamera.heightOffset = 10;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    this.followCamera.rotationOffset = 0;

    // Acceleration of camera in moving from current to goal position
    this.followCamera.cameraAcceleration = 0.005;

    // The speed at which acceleration is halted
    this.followCamera.maxCameraSpeed = 10;

    // This attaches the camera to the canvas
    this.followCamera.attachControl(true);
    return this.followCamera
    // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
    // targetMesh created here.
    // this.followCamera.lockedTarget = targetMesh; //version 2.5 onwards
  }

  creatHemiLight(name = 'hemi-light', vector= [1,1,0]) {
    let _vector = new Vector3(vector[0], vector[1], vector[2])
    // 创建光源
    if (this.scene) {
      this.lightHemi = new HemisphericLight(name, _vector, this.scene);
      this.lightHemi.intensity = 1;
    }
  }

  creatGround(name= 'ground', width= 150, height= 150) {
    // 创建地面
    this.ground = CreateGround("ground", {width, height}, this.scene);
    // 防止后面添加的地下z冲突
    this.ground.position.y = -0.02;
  }

}
