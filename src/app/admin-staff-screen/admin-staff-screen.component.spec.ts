import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffScreenComponent } from './admin-staff-screen.component';

describe('AdminStaffScreenComponent', () => {
  let component: AdminStaffScreenComponent;
  let fixture: ComponentFixture<AdminStaffScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStaffScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStaffScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
