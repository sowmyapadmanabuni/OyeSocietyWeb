import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationManagementComponent } from './association-management.component';

describe('AssociationManagementComponent', () => {
  let component: AssociationManagementComponent;
  let fixture: ComponentFixture<AssociationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
