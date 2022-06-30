import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseOneComponent} from "./base-one/base-one.component";

const routes: Routes = [
  { path: '', redirectTo: 'base-one', pathMatch: 'full' },
  { path: 'base-one', component: BaseOneComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
