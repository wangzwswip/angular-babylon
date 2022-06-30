import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared';

import { DefaultComponent } from './default/default.component';
import { SiderComponent } from './default/sider/sider.component';


// LayoutModule应该 导入 SharedModule；
// LayoutModule应该 导出所有 layout component；
// LayoutModule不应该 导入和声明任何路由；

const COMPONENTS = [
  DefaultComponent,
  SiderComponent
]
@NgModule({
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
  ]
})
export class LayoutModule { }
