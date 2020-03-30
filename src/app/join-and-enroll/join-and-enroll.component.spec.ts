import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAndEnrollComponent } from './join-and-enroll.component';

describe('JoinAndEnrollComponent', () => {
  let component: JoinAndEnrollComponent;
  let fixture: ComponentFixture<JoinAndEnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinAndEnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinAndEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
