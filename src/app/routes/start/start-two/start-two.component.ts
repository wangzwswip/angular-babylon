import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {BabylonEngin} from "../../babylon-engin";
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
      this.babylonTarget.creatUniversalCamera('universal-camera',[0 ,46, 92])
      // this.babylonTarget.switchActiveCameraByName('universal-camera')
      this.creatGround()
      this.babylonTarget.creatHemiLight()
      this.start();

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

}
