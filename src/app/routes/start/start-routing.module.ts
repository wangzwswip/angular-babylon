import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartOneComponent} from "./start-one/start-one.component";
import {StartTwoComponent} from "./start-two/start-two.component";
import {StartThreeComponent} from "./start-three/start-three.component";

const routes: Routes = [
  { path: '', redirectTo: 'start-one', pathMatch: 'full' },
  { path: 'start-one', component: StartOneComponent },
  { path: 'start-two', component: StartTwoComponent },
  { path: 'start-three', component: StartThreeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
