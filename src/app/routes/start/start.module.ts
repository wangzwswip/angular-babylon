import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartRoutingModule } from './start-routing.module';
import { StartOneComponent } from './start-one/start-one.component';
import { StartTwoComponent } from './start-two/start-two.component';
import { StartThreeComponent } from './start-three/start-three.component';


@NgModule({
  declarations: [
    StartOneComponent,
    StartTwoComponent,
    StartThreeComponent
  ],
  imports: [
    CommonModule,
    StartRoutingModule
  ]
})
export class StartModule { }
