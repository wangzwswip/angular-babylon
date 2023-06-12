import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTwoComponent } from './start-two.component';

describe('StartTwoComponent', () => {
  let component: StartTwoComponent;
  let fixture: ComponentFixture<StartTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
