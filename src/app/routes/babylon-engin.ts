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

export class BabylonEngin {
  canvas?: HTMLCanvasElement;
  engine?: Engine;
  camera?: FreeCamera;
  cameraRot?: ArcRotateCamera;
  scene?: Scene;
  lightHemi?: Light;
  lightPoint?: Light;
  ground?: Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    // 创建相机
    this.cameraRot = new ArcRotateCamera('camera0', Math.PI / 2, Math.PI / 2, 5, new Vector3(0, 2, 0), this.scene)
    this.cameraRot.attachControl(this.canvas, true)
    this.cameraRot.setTarget(Vector3.Zero());
    // 创建光源
    this.lightHemi = new HemisphericLight('light1', new Vector3(1, 1, 0), this.scene);
    this.lightHemi.intensity = 1;
    // this.lightPoint = new PointLight('light2', new Vector3(0, 1, -1), this.scene)
    // 创建地面
    this.ground = CreateGround("ground", {width: 150, height: 150}, this.scene);
    // 防止后面添加的地下z冲突
    this.ground.position.y = -0.02;
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

}
