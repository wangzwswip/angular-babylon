import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import {BabylonEngin} from "../../babylon-engin";

@Component({
  selector: 'app-camera-crash',
  templateUrl: './camera-crash.component.html',
  styleUrls: ['./camera-crash.component.scss']
})
export class CameraCrashComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  babylonTarget?: BabylonEngin
  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.babylonTarget = new BabylonEngin(this.rendererCanvas.nativeElement)
      this.babylonTarget.creatRotCamera()
      this.babylonTarget.creatUniversalCamera()
      this.babylonTarget.switchActiveCameraByName('universal-camera')
      this.babylonTarget.creatGround()
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
}
