import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenusService, ColorService,  } from './services';

// 应该 只保留providers属性

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    MenusService,
    ColorService,
  ]
})
export class CoreModule { }
