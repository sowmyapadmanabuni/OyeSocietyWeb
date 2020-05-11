import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleveryScreenComponent } from './admin-delevery-screen.component';

describe('AdminDeleveryScreenComponent', () => {
  let component: AdminDeleveryScreenComponent;
  let fixture: ComponentFixture<AdminDeleveryScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeleveryScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleveryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
