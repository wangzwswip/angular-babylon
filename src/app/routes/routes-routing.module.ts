import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "../layout/default/default.component";

const routes: Routes = [
  { path: '', redirectTo: 'default', pathMatch: 'full' },
  {
    path: 'default',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'camera', pathMatch: 'full' },
      {
        path: 'camera',
        loadChildren: () => import('./camera/camera.module').then(m => m.CameraModule)
      },
      {
        path: 'start',
        loadChildren: () => import('./start/start.module').then(m => m.StartModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
