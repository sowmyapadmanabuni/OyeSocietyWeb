import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrollingComponent } from './patrolling.component';

describe('PatrollingComponent', () => {
  let component: PatrollingComponent;
  let fixture: ComponentFixture<PatrollingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrollingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
