import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartThreeComponent } from './start-three.component';

describe('StartThreeComponent', () => {
  let component: StartThreeComponent;
  let fixture: ComponentFixture<StartThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
