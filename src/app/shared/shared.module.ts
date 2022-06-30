import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


// 应该 包含 Angular 通用模块(例如：CommonModule、FormsModule、RouterModule、ReactiveFormsModule)、
// 第三方通用依赖模块、所有组件（自己写的非业务相关的通用组件）、指令、管道；
// 应该导出所有包含模块
// 不应该 有providers属性
const SHARED = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  HttpClientModule,
  NzLayoutModule,
  NzIconModule,
  NzInputModule,
  NzDropDownModule,
  NzTableModule,
  NzButtonModule,
  NzTreeModule,
  NzMessageModule,
  NzFormModule,
  NzRadioModule,
  NzCheckboxModule,
  NzAlertModule,
  NzDividerModule,
  NzGridModule,
  NzSliderModule,
  NzTabsModule,

]

// const COMPONENTS = [

// ];
const DIRECTIVES = [
]

@NgModule({

  imports: [...SHARED],
  exports: [...SHARED]
})
export class SharedModule { }
