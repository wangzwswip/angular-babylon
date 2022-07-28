import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CameraCrashComponent} from "./camera-crash/camera-crash.component";
import {CameraBaseComponent} from "./camera-base/camera-base.component";

const routes: Routes = [
  { path: '', redirectTo: 'camera', pathMatch: 'full' },
  { path: 'camera-base', component: CameraBaseComponent },
  { path: 'camera-crash', component: CameraCrashComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CameraRoutingModule { }
