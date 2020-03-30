import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationVisitorComponent } from './association-visitor.component';

describe('AssociationVisitorComponent', () => {
  let component: AssociationVisitorComponent;
  let fixture: ComponentFixture<AssociationVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
