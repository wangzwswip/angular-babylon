import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartRoutingModule } from './start-routing.module';
import { StartOneComponent } from './start-one/start-one.component';
import { StartTwoComponent } from './start-two/start-two.component';


@NgModule({
  declarations: [
    StartOneComponent,
    StartTwoComponent
  ],
  imports: [
    CommonModule,
    StartRoutingModule
  ]
})
export class StartModule { }
