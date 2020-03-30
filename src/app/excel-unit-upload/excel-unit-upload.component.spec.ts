import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelUnitUploadComponent } from './excel-unit-upload.component';

describe('ExcelUnitUploadComponent', () => {
  let component: ExcelUnitUploadComponent;
  let fixture: ComponentFixture<ExcelUnitUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelUnitUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelUnitUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
