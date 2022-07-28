import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraCrashComponent } from './camera-crash.component';

describe('CameraCrashComponent', () => {
  let component: CameraCrashComponent;
  let fixture: ComponentFixture<CameraCrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraCrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraCrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
