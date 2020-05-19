import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollassociationComponent } from './enrollassociation.component';

describe('EnrollassociationComponent', () => {
  let component: EnrollassociationComponent;
  let fixture: ComponentFixture<EnrollassociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollassociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollassociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
