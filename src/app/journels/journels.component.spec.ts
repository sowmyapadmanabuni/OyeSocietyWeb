import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournelsComponent } from './journels.component';

describe('JournelsComponent', () => {
  let component: JournelsComponent;
  let fixture: ComponentFixture<JournelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
