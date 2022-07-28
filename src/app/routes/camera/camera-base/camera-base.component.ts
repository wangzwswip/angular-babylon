import {Component, ElementRef, OnInit, ViewChild, NgZone} from '@angular/core';
import {BabylonEngin} from "../../babylon-engin";
import {
  MeshBuilder,
  Color4,
  Mesh,
  StandardMaterial,
  Texture,
  Vector4,
  Plane,
  Vector3 } from "babylonjs";
@Component({
  selector: 'app-camera-base',
  templateUrl: './camera-base.component.html',
  styleUrls: ['./camera-base.component.scss']
})
export class CameraBaseComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  babylonTarget?: BabylonEngin
  constructor(private ngZone: NgZone) {}

  options = {
    universal_camera: true,
    rot_camera: false,
    follow_camera: false,
    cylinder: false,
    capsule: false,
  }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.babylonTarget = new BabylonEngin(this.rendererCanvas.nativeElement)
      this.babylonTarget.creatRotCamera()
      this.babylonTarget.creatUniversalCamera()
      this.babylonTarget.switchActiveCameraByName('universal-camera')
      this.babylonTarget.creatGround()
      this.babylonTarget.creatHemiLight()
      this.addBox()
      this.start();
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

  addBox() {
    let columns = 6;
    let rows = 1;
    const faceColor = new Array(6);
    const faceUV = new Array(6);
    for (let i = 0; i < 6; i++) {
      faceColor[i] = new Color4(Math.random(), Math.random(), Math.random(), 1.0)
      faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }
    const options = {
      faceUV: faceUV,
      wrap: true
    };
    let mesh = MeshBuilder.CreateBox('box', {size: 6, width: 4, faceColors: faceColor, faceUV: faceUV }, this.babylonTarget!.scene)
    mesh.position.x = 4.0
  }

  /**
   * @description 箱子
   * @param status
   */
  toggleUniversalCamera(status: Boolean) {
    if (status) {
      this.babylonTarget!.switchActiveCameraByName('universal-camera')
    } else {
      // this.babylonTarget?.removeCameraByName('universal-camera')
    }
  }

  toggleRotCamera(status: Boolean) {
    if (status) {
      this.babylonTarget!.switchActiveCameraByName('rot-camera')
    } else {
      this.babylonTarget!.switchActiveCameraByName('universal-camera')
    }
  }

  toggleFollowCamera(status: Boolean) {
    if (status) {
      if (this.babylonTarget && this.babylonTarget.followCamera) {
        let mesh = this.babylonTarget!.scene!.getMeshByName('box')
        if (mesh) {
          this.babylonTarget.followCamera.lockedTarget = mesh
        }
      }
    } else {
      this.babylonTarget!.switchActiveCameraByName('universal-camera')
    }
  }

  toggleCylinder(status: Boolean) {
    if (status) {
      // height：高度， diameterTop： 顶部直径，diameterBottom：底部直径，diameter，tessellation：径向划分，
      // subdivisions：圆划分，faceColors，faceUV，arc， hasRings，enclose

      const cylinder1 = MeshBuilder.CreateCylinder("cylinder1", {});
      cylinder1.position.x = 10
      const cylinder2 = MeshBuilder.CreateCylinder("cylinder2", {diameterTop: 0});
      cylinder2.position.x = 5
      const cylinder3 = MeshBuilder.CreateCylinder("cylinder3", {tessellation: 3});
      cylinder3.position.z = 5
      const cylinder4 = MeshBuilder.CreateCylinder("cylinder4", {arc: 0.6, sideOrientation: Mesh.DOUBLESIDE});
      cylinder4.position.z = 10
      const cylinder5 = MeshBuilder.CreateCylinder("cylinder5", {arc: 0.1, enclose: true, height: 0.3 });
      cylinder5.position.z = -5
      const canMaterial = new StandardMaterial("material_cylinder5", this.babylonTarget!.scene);
      canMaterial.diffuseTexture = new Texture("assets/image/logo_label.jpg")

      const faceUV = [];
      faceUV[0] =	new Vector4(0, 0, 0, 0);
      faceUV[1] =	new Vector4(1, 0, 0.25, 1); // x, z swapped to flip image
      faceUV[2] = new Vector4(0, 0, 0.24, 1);
      const faceColors = [ ];
      faceColors[0] = new Color4(0.5, 0.5, 0.5, 1)
      const can = MeshBuilder.CreateCylinder("cylinder6", {height:1.16, faceUV: faceUV, faceColors: faceColors});
      can.material = canMaterial;
      can.position.z = -10
    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('cylinder1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('cylinder2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
      let mesh3 = this.babylonTarget!.scene!.getMeshByName('cylinder3')
      if (mesh3) {
        this.babylonTarget!.scene!.removeMesh(mesh3)
      }
      let mesh4 = this.babylonTarget!.scene!.getMeshByName('cylinder4')
      if (mesh4) {
        this.babylonTarget!.scene!.removeMesh(mesh4)
      }
      let mesh5 = this.babylonTarget!.scene!.getMeshByName('cylinder5')
      if (mesh5) {
        this.babylonTarget!.scene!.removeMesh(mesh5)
      }
      let mesh6 = this.babylonTarget!.scene!.getMeshByName('cylinder6')
      if (mesh6) {
        this.babylonTarget!.scene!.removeMesh(mesh6)
      }
    }
  }

  toggleCapsule(status: Boolean) {
    if (status) {
      // orientation：方位，subdivisions：平行管方向，tessellation：圆柱分割，height，radius，capSubdivisions，
      // radiusTop，radiusBottom，topCapSubdivisions，bottomCapSubdivisions
      const capsule1 = MeshBuilder.CreateCapsule("capsule1", {}, this.babylonTarget!.scene)
      capsule1.position.x = 3
      capsule1.position.y = 3
      const capsule2 = MeshBuilder.CreateCapsule("capsule2", {radius:0.5, capSubdivisions: 1, height:2, tessellation:4, topCapSubdivisions:12});
      capsule2.position.x = -3
      capsule2.position.y = 3
      const capsule3 = MeshBuilder.CreateCapsule("capsule3", {radius:0.25, capSubdivisions: 6, subdivisions:6, tessellation:36, height:2, orientation: Vector3.Forward()});
      capsule3.position.z = -3
      capsule3.position.y = 3
      const capsule4 = MeshBuilder.CreateCapsule("capsule4", {radius:0.5, height:4, radiusTop:2});
      capsule4.position.z = 3
      capsule4.position.y = 3

    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('capsule1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('capsule2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
      let mesh3 = this.babylonTarget!.scene!.getMeshByName('capsule3')
      if (mesh3) {
        this.babylonTarget!.scene!.removeMesh(mesh3)
      }
      let mesh4 = this.babylonTarget!.scene!.getMeshByName('capsule4')
      if (mesh4) {
        this.babylonTarget!.scene!.removeMesh(mesh4)
      }
    }
  }
}
