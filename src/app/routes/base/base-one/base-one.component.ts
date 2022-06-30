import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BabylonEnginService} from "../../babylon-engin.service";

@Component({
  selector: 'app-base-one',
  templateUrl: './base-one.component.html',
  styleUrls: ['./base-one.component.scss']
})
export class BaseOneComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas?: ElementRef<HTMLCanvasElement>
  constructor(private engServ: BabylonEnginService) { }

  ngOnInit(): void {
    if (this.rendererCanvas) {
      this.engServ.createScene(this.rendererCanvas);
      this.engServ.animate();
    }
  }


}
