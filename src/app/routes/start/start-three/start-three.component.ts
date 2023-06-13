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
  HemisphericLight,
  SpriteManager,
  SpotLight,
  Vector3, SceneLoader, Sound, Tools
} from "babylonjs";
// import {AdvancedDynamicTexture, StackPanel, Control, Slider, TextBlock} from "@babylonjs/gui";
@Component({
  selector: 'app-start-three',
  templateUrl: './start-three.component.html',
  styleUrls: ['./start-three.component.scss']
})
export class StartThreeComponent implements OnInit {

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
      // @ts-ignore
      console.log('ggg', window.GUI)
      // this.babylonTarget.creatHemiLight()
      this.start();
      this.addSky()
      this.addTree()
      this.addLight()
      this.addGUI()
      // if (this.babylonTarget.arcRotateCamera) {
      //   this.babylonTarget.arcRotateCamera.upperBetaLimit = Math.PI / 2.2;
      //
      // }

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
  addLight() {
    if (this.babylonTarget?.scene) {
      const light = new HemisphericLight("hemi", new Vector3(0, 50, 0), this.babylonTarget.scene);
      light.intensity = 0.1

      //add a spotlight and later after a mesh lamp post and a bulb have been created
      //then will make the post a parent to the bulb and
      //the bulb to the parent
      const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, this.babylonTarget.scene);
      lampLight.diffuse = Color3.Yellow();

      //shape to extrude
      const lampShape = [];
      for(let i = 0; i < 20; i++) {
        lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
      }
      lampShape.push(lampShape[0]); //close shape

      //extrusion path
      const lampPath = [];
      lampPath.push(new Vector3(0, 0, 0));
      lampPath.push(new Vector3(0, 10, 0));
      for(let i = 0; i < 20; i++) {
        lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
      }
      lampPath.push(new Vector3(3, 11, 0));

      const yellowMat = new StandardMaterial("yellowMat");
      yellowMat.emissiveColor = Color3.Yellow();

      //extrude lamp
      const lamp = MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});

      //add bulb
      const bulb = MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});

      bulb.material = yellowMat;
      bulb.parent = lamp;
      bulb.position.x = 2;
      bulb.position.y = 10.5;

      lampLight.parent = bulb;

      // 添加GUI控制
      // GUI
      // const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
      //
      // const panel = new StackPanel();
      // panel.width = "220px";
      // panel.top = "-25px";
      // panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      // panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      // adt.addControl(panel);
      //
      // const header = new TextBlock();
      // header.text = "Night to Day";
      // header.height = "30px";
      // header.color = "white";
      // panel.addControl(header);
      //
      // const slider = new Slider();
      // slider.minimum = 0;
      // slider.maximum = 1;
      // slider.borderColor = "black";
      // slider.color = "gray";
      // slider.background = "white";
      // slider.value = 1;
      // slider.height = "20px";
      // slider.width = "200px";
      // // @ts-ignore
      // slider.onValueChangedObservable.add((value) => {
      //   if (light) {
      //     light.intensity = value;
      //   }
      // });
      // panel.addControl(slider);
    }

  }
  addGUI() {

  }
}
