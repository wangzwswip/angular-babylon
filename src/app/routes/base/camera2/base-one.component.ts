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
  selector: 'app-base-one',
  templateUrl: './base-one.component.html',
  styleUrls: ['./base-one.component.scss']
})
export class BaseOneComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  babylonTarget?: BabylonEngin
  constructor(private ngZone: NgZone) {}

  options = {
    box: false,
    tiled_box: false,
    sphere: false,
    cylinder: false,
    capsule: false,
    plane: false,
    tiled_plane: false,
    disc: false,
    torus: false,
    torus_knot: false
  }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.babylonTarget = new BabylonEngin(this.rendererCanvas.nativeElement)
      this.start();
      this.addGroundMaterial()
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

  addGroundMaterial() {
    if (this.babylonTarget) {
      let groundMaterial = new StandardMaterial("Ground Material", this.babylonTarget.scene);
      if (this.babylonTarget.ground) {
        this.babylonTarget.ground.material = groundMaterial;
        let groundTexture = new Texture('assets/image/grass.jpeg', this.babylonTarget.scene);
        // @ts-ignore
        this.babylonTarget.ground.material!.diffuseTexture = groundTexture;
      }
    }

  }

  /**
   * @description 箱子
   * @param status
   */
  toggleBox(status: Boolean) {
    if (status) {
      // option选项有：size: 大小， height，width，depth 覆盖size, faceColors: 各个面颜色 [Color4(1,1,1,1)] 共六个元素，faceUV: 每个面的法向量
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
    } else {
      let mesh = this.babylonTarget!.scene!.getMeshByName('box')
      if (mesh) {
        this.babylonTarget!.scene!.removeMesh(mesh)
      }
    }
  }

  toggleTiledBox(status: Boolean) {
    if (status) {
      // option选项有：size: 大小， height，width，depth 覆盖size, faceColors: 各个面颜色 [Color4(1,1,1,1)] 共六个元素，faceUV: 每个面的法向量
      // tileSize: 每个面的平铺大小， pattern： 平铺模式， alignVertical： 对齐模式， alignHorizontal
      let mat = new StandardMaterial("arrows");
      mat.diffuseTexture = new Texture("assets/image/arrows.jpg");

      const pat = Mesh.ROTATE_TILE; // FLIP_TILE, ROTATE_TILE, FLIP_ROW, ROTATE_ROW, FLIP_N_ROTATE_TILE, FLIP_N_ROTATE_ROW

      const columns = 6;  // 6 columns
      const rows = 1;  // 4 rows

      const faceUV = new Array(6);

      for (let i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
      }

      const options = {
        pattern: pat,
        faceUV: faceUV,
        width: 7,
        height: 4,
        depth: 4,
        tileSize: 1,
        tileWidth:1
      }

      const tiledBox = MeshBuilder.CreateTiledBox("tiled_box", options);
      tiledBox.material = mat;
      tiledBox.position.z = 4
    } else {
      let mesh = this.babylonTarget!.scene!.getMeshByName('tiled_box')
      if (mesh) {
        this.babylonTarget!.scene!.removeMesh(mesh)
      }
    }
  }

  toggleSphere(status: Boolean) {
    if (status) {
      // segments: 水平， diameter： 轴长度，diameterX： 单轴设置， arc：经度划分0~1，slice： 纬度划分0~1
      let optOne = {
        segments: 16,
        diameter: 2,
        arc: 1,
        slice: 1,
      }
      let optTwo = {
        segments: 32,
        diameter: 2,
        arc: 1,
        slice: 0.5,
      }
      const sphere1 = MeshBuilder.CreateSphere("sphere1", optOne);
      sphere1.position.x = -7
      sphere1.position.y = 7
      const sphere2 = MeshBuilder.CreateSphere("sphere2", optTwo);
      sphere2.position.z = -8
      sphere2.position.y = 7

    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('sphere1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('sphere2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
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

  togglePlane(status: Boolean){
    if (status) {
      // size， width， height，updatable，sideOrientation，sourcePlane
      const plane1 = MeshBuilder.CreatePlane("plane1", {height:2, width: 1});
      plane1.position.x = 8
      plane1.position.y = 5
      const plane2 = MeshBuilder.CreatePlane("plane2", {height:2, width: 1, sideOrientation: Mesh.DOUBLESIDE});
      plane2.position.x = -8
      plane2.position.y = 5

      const mat = new StandardMaterial("");
      mat.diffuseTexture = new Texture("assets/image/tile1.jpg");

      const f = new Vector4(0,0, 0.5, 1); // front image = half the whole image along the width
      const b = new Vector4(0.5,0, 1, 1); // back image = second half along the width

      const plane3 = MeshBuilder.CreatePlane("plane3", {frontUVs: f, backUVs: b, sideOrientation: Mesh.DOUBLESIDE});
      plane3.material = mat;
      plane3.position.z = 4
      plane3.position.y = 5

      //abstract plane from its position and normal
      const abstractPlane = Plane.FromPositionAndNormal(new Vector3(1, 1, 1), new Vector3(0.2, 0.5, -1));

      const plane4 = MeshBuilder.CreatePlane("plane4", {sourcePlane: abstractPlane, sideOrientation: Mesh.DOUBLESIDE});
      plane4.position.z = -4
      plane4.position.y = 5

    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('plane1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('plane2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
      let mesh3 = this.babylonTarget!.scene!.getMeshByName('plane3')
      if (mesh3) {
        this.babylonTarget!.scene!.removeMesh(mesh3)
      }
      let mesh4 = this.babylonTarget!.scene!.getMeshByName('plane4')
      if (mesh4) {
        this.babylonTarget!.scene!.removeMesh(mesh4)
      }
    }
  }

  toggleTiledPlane(status: Boolean) {
    if (status) {
      // size, width, height, tileSize: 平铺大小，tileHeight，tileWidth，frontUVs，backUVs，
      // pattern： 平铺模式，alignVertical，alignHorizontal：对齐方式，updatable，sideOrientation
      const mat = new StandardMaterial("");
      mat.diffuseTexture = new Texture("assets/image/lavatile.webp");

      const pat = Mesh.NO_FLIP;

      const options = {
        sideOrientation: Mesh.DOUBLESIDE,
        pattern: pat,
        width: 5,
        height: 5,
        tileSize: 1,
        tileWidth:1
      }

      const tiledPane1 = MeshBuilder.CreateTiledPlane("tiled_plane1", options);
      tiledPane1.material = mat;
      tiledPane1.position.x = 4
      tiledPane1.position.y = 4

      const pat2 = Mesh.FLIP_TILE;

      const options2 = {
        sideOrientation: Mesh.DOUBLESIDE,
        pattern: pat,
        width: 5,
        height: 5,
        tileSize: 1,
        tileWidth:1
      }

      const tiledPane2 = MeshBuilder.CreateTiledPlane("tiled_plane2", options2);
      tiledPane2.material = mat;
      tiledPane2.position.x = -4
      tiledPane2.position.y = 4

      const mat3 = new StandardMaterial("");
      mat3.diffuseTexture = new Texture("assets/image/tile1.jpg");

      const pat3 = Mesh.FLIP_ROW;

      const options3 = {
        sideOrientation: Mesh.DOUBLESIDE,
        pattern: pat,
        width: 3 * 4,
        height: 8,
        tileSize: 1,
        tileWidth:2
      }

      const tiledPane3 = MeshBuilder.CreateTiledPlane("tiled_plane3", options3);
      tiledPane3.material = mat3;
      tiledPane3.position.z = -4
      tiledPane3.position.y = 4
    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('tiled_plane1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('tiled_plane2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
      let mesh3 = this.babylonTarget!.scene!.getMeshByName('tiled_plane3')
      if (mesh3) {
        this.babylonTarget!.scene!.removeMesh(mesh3)
      }
    }
  }

  toggleDisc(status: Boolean) {
    if (status) {
      // radius: 半径大小，tessellation，arc：分割，updatable，sideOrientation

      const disc1 = MeshBuilder.CreateDisc("disc1", {});
      disc1.position.y = 4
      disc1.position.x = 4
      const disc2 = MeshBuilder.CreateDisc("disc2", {tessellation: 3});
      disc1.position.y = 4
      disc1.position.x = -4
    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('disc1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('disc2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
    }
  }

  toggleTorus(status: Boolean) {
    if (status) {
      // diameter: 直径， thickness：厚度，tessellation：分割，updatable，sideOrientation，
      // frontUVs，backUVs
      const torus1 = MeshBuilder.CreateTorus("torus1", {});
      torus1.position.y = 4
      torus1.position.x = 4

      const torus2 = BABYLON.MeshBuilder.CreateTorus("torus2", {thickness: 0.25, diameter: 2});
      torus2.position.y = 4
      torus2.position.x = -4
    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('torus1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('torus2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
    }
  }

  toggleTorusKnot(status: Boolean){
    if (status) {
      // radius: 半径， tube：厚度，radialSegments，tubularSegments：分割，updatable，sideOrientation，
      // frontUVs，backUVs，p，q
      const torus_knot1 = MeshBuilder.CreateTorusKnot("torus_knot1", {tube: 0.1, radialSegments: 128})
      torus_knot1.position.y = 4
      torus_knot1.position.x = 4

      const torus_knot2 = MeshBuilder.CreateTorusKnot("torus_knot2", {tube: 0.1, radialSegments: 128, p:5, q:2});
      torus_knot2.position.y = 4
      torus_knot2.position.x = -4

      const torus_knot3 = BABYLON.MeshBuilder.CreateTorusKnot("torus_knot3", {tube: 0.01, radialSegments: 1024, p:120, q:180});
      torus_knot3.position.y = 4
      torus_knot3.position.z = -4

      const torus_knot4 = BABYLON.MeshBuilder.CreateTorusKnot("torus_knot4", {tube: 0.01, radialSegments: 1024, p:-117.885, q:-169.656465});
      torus_knot4.position.y = 4
      torus_knot4.position.z = 4


    } else {
      let mesh1 = this.babylonTarget!.scene!.getMeshByName('torus_knot1')
      if (mesh1) {
        this.babylonTarget!.scene!.removeMesh(mesh1)
      }
      let mesh2 = this.babylonTarget!.scene!.getMeshByName('torus_knot2')
      if (mesh2) {
        this.babylonTarget!.scene!.removeMesh(mesh2)
      }
      let mesh3 = this.babylonTarget!.scene!.getMeshByName('torus_knot3')
      if (mesh3) {
        this.babylonTarget!.scene!.removeMesh(mesh3)
      }
      let mesh4 = this.babylonTarget!.scene!.getMeshByName('torus_knot4')
      if (mesh4) {
        this.babylonTarget!.scene!.removeMesh(mesh4)
      }
    }
  }
}
