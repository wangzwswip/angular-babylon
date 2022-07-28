import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor() { }
  _Menus = [
    {
      title: '相机',
      link: '',
      icon: 'node-index',
      level: 1,
      open: true,
      selected: false,
      disabled: false,
      children: [
        {
          title: '相机',
          link: 'camera/camera-base',
          icon: '',
          level: 2,
          open: false,
          selected: true,
          disabled: false,
        },
        {
          title: '相机碰撞',
          link: 'camera/camera-crash',
          icon: '',
          level: 2,
          open: false,
          selected: false,
          disabled: false,
        },
      ]
    },
    // {
    //   title: '其他',
    //   link: '',
    //   icon: 'node-index',
    //   level: 1,
    //   open: false,
    //   selected: false,
    //   disabled: false,
    //   children: [
    //     {
    //       title: '父子通信',
    //       link: 'other/connection',
    //       icon: '',
    //       level: 2,
    //       open: false,
    //       selected: false,
    //       disabled: false,
    //     },
    //     {
    //       title: '录屏',
    //       link: 'other/screen',
    //       icon: '',
    //       level: 2,
    //       open: false,
    //       selected: false,
    //       disabled: false,
    //     },
    //     {
    //       title: '录音',
    //       link: 'other/recorde',
    //       icon: '',
    //       level: 2,
    //       open: false,
    //       selected: false,
    //       disabled: false,
    //     },
    //   ]
    // }
  ];
  menus() {
    return this._Menus;
  }
}
/** 菜单类：待用 */
export interface Menu {
  [key: string]: any;
  /** 文本 */
  title: string;
  /** 路由 */
  link?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** 图标 */
  icon?: string;
  /** 二级菜单 */
  children?: Menu[];
}
