import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartOneComponent } from './start-one.component';

describe('StartOneComponent', () => {
  let component: StartOneComponent;
  let fixture: ComponentFixture<StartOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
