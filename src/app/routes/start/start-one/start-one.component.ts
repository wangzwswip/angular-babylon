import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {
  MeshBuilder,
  Color4,
  Mesh,
  StandardMaterial,
  Texture,
  Vector4,
  Animation,
  Plane,
  Vector3, SceneLoader, Sound, Tools
} from "babylonjs";
import {BabylonEngin} from "../../babylon-engin";
import * as earcut from "earcut"
@Component({
  selector: 'app-start-one',
  templateUrl: './start-one.component.html',
  styleUrls: ['./start-one.component.scss']
})
export class StartOneComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  babylonTarget?: BabylonEngin
  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.babylonTarget = new BabylonEngin(this.rendererCanvas.nativeElement)
      // this.babylonTarget.creatRotCamera()
      this.babylonTarget.creatUniversalCamera('universal-camera',[0 ,46, 92])
      // this.babylonTarget.switchActiveCameraByName('universal-camera')
      this.babylonTarget.creatGround()
      this.babylonTarget.creatHemiLight()
      this.start();
      setTimeout(() => {
        this.addModel()
        this.addSound()
        this.main()
      }, 1000)
    }
  }
  ngOnDestroy(): void {
    if (this.babylonTarget) {
      this.babylonTarget.scene?.dispose();
    }

  }
  start () {
    console.log('开始运行了吗')
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
  addModel() {
    SceneLoader.ImportMeshAsync('', 'assets/models/', '1.gltf').then(result => {
      console.log('加载成功', result)
      // result.meshes[1].position.x = 20;
      // const myMesh1 = scene.getMeshByName("myMesh_1");
      // myMesh1.rotation.y = Math.PI / 2;

    })
  }
  addSound() {
    let sound = new Sound('test', 'assets/music/night.mp3')
    sound.play()
  }
  main() {
    //#region 材质 盒子 合并 位置 旋转 缩放
    // 添加一个盒子
    let box = MeshBuilder.CreateBox('box', {width: 5, height: 5, depth: 5})
    // box.scaling.x = 2;
    // box.scaling.y = 1.5;
    // box.scaling.z = 3;
    box.scaling = new Vector3(2, 1.5, 3);
    box.position = new Vector3(22, 4.2, 10);
    box.rotation.y = Tools.ToRadians(45);
    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 5.3, height: 5.2, tessellation: 5});
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    roof.position = new Vector3(22, 9.2, 10);

    // 材质
    // this.babylonTarget?.ground
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture('assets/image/grass.jpeg', this.babylonTarget?.scene);
    const boxMat = new StandardMaterial("boxMat");
    boxMat.diffuseTexture = new Texture("assets/image/rock.jpeg");
    roof.material = groundMat
    box.material = boxMat
    if ( this.babylonTarget && this.babylonTarget.ground) {
      this.babylonTarget.ground.material = roofMat; //Place the material property of the ground
    }

    // 组合mesh
    // const house = Mesh.MergeMeshes([box, roof])
    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)

    // 复制网格的两种主要方法是克隆网格或创建网格实例。克隆为您提供网格的独立副本，而实例仍链接到其材料的原始副本
    let clonedHouse = house?.clone("clonedHouse")
    if (clonedHouse) {
      clonedHouse.position = new Vector3(-52, 9.2, 10);
    }

    let instanceHouse = house?.createInstance("instanceHouse")
    if (instanceHouse) {
      instanceHouse.position = new Vector3(-32, 9.2, -30);
    }
    //#endregion

    //#region start 动画
    //1. 构建几何
    //base
    const outline = [
      new Vector3(-0.3, 0, -0.1),
      new Vector3(0.2, 0, -0.1),
    ]
    //curved front
    for (let i = 0; i < 20; i++) {
      outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
    }
    //top
    outline.push(new Vector3(0, 0, 0.1));
    outline.push(new Vector3(-0.3, 0, 0.1));
    //car face UVs
    const faceUV = [];
    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new Vector4(0, 0, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
    //car material
    const carMat = new StandardMaterial("carMat");
    carMat.diffuseTexture = new Texture("assets/image/car.png");

    const car = MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true}, this.babylonTarget?.scene, earcut);
    car.material = carMat;
    car.position = new Vector3(-10, 5, 40)
    car.rotation.x = - Math.PI / 2;

    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new Vector4(0, 0, 1, 1);
    wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new Vector4(0, 0, 1, 1);
    //car material
    const wheelMat = new StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new Texture("assets/image/wheel.png");

    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;
    console.log(wheelRB.animations)
    // 创建动画
    const animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const wheelKeys = [];
    //At the animation key 0, the value of rotation.y is 0
    wheelKeys.push({
      frame: 0,
      value: 0
    });
    //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
    wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI
    });
    //set the keys
    animWheel.setKeys(wheelKeys);
    //Link this animation to the right back wheel
    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);
    wheelRF.animations = [];
    wheelRF.animations.push(animWheel);
    wheelLB.animations = [];
    wheelLB.animations.push(animWheel);
    wheelLF.animations = [];
    wheelLF.animations.push(animWheel);
    this.babylonTarget?.scene?.beginAnimation(wheelRB, 0, 30, true);
    this.babylonTarget?.scene?.beginAnimation(wheelRF, 0, 30, true);
    this.babylonTarget?.scene?.beginAnimation(wheelLB, 0, 30, true);
    this.babylonTarget?.scene?.beginAnimation(wheelLF, 0, 30, true);
    car.scaling = new Vector3(10.0,10.0,10.0)

    // 给汽车添加动画
    const animCar = new Animation("carAnimation", "position.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    const carKeys = [];

    carKeys.push({
      frame: 0,
      value: -4
    });

    carKeys.push({
      frame: 150,
      value: 4
    });

    carKeys.push({
      frame: 210,
      value: 4
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    this.babylonTarget?.scene?.beginAnimation(car, 0, 210, true);
    //#endregion
  }
}
