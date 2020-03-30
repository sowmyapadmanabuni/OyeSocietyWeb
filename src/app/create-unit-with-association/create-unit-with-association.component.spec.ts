import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUnitWithAssociationComponent } from './create-unit-with-association.component';

describe('CreateUnitWithAssociationComponent', () => {
  let component: CreateUnitWithAssociationComponent;
  let fixture: ComponentFixture<CreateUnitWithAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUnitWithAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUnitWithAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
