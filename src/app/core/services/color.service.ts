import { Injectable } from '@angular/core';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ColorService {
  _colors = ['#d8bd14', '#177ddc', '#d32029', '#431418', '#695f2f', '#112a45', '#2b4acb',
  '#8bbb11', '#d84a1b', '#69390a', '#578653', '#161d40', '#642ab5']
  constructor() {
  }

  colors() {
    return this._colors
  }
}