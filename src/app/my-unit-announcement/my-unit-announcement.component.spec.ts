import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUnitAnnouncementComponent } from './my-unit-announcement.component';

describe('MyUnitAnnouncementComponent', () => {
  let component: MyUnitAnnouncementComponent;
  let fixture: ComponentFixture<MyUnitAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyUnitAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUnitAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
