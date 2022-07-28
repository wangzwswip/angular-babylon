import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared';

import { CameraRoutingModule } from './camera-routing.module';
import {CameraBaseComponent} from "./camera-base/camera-base.component";
import { CameraCrashComponent} from "./camera-crash/camera-crash.component";


@NgModule({
  declarations: [
    CameraBaseComponent,
    CameraCrashComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CameraRoutingModule
  ]
})
export class CameraModule { }
