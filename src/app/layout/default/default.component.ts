import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  isCollapsed = false;
  triggerTemplate = null;
  date: number = (new Date()).getFullYear();
  constructor() {
  }

  launchSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  ngOnInit() {
  }


}
