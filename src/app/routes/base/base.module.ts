import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared';

import { BaseRoutingModule } from './base-routing.module';
import { CameraComponent } from './camera/camera.component';


@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    SharedModule
  ]
})
export class BaseModule { }
