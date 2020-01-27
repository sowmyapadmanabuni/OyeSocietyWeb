import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelBlockUploadComponent } from './excel-block-upload.component';

describe('ExcelBlockUploadComponent', () => {
  let component: ExcelBlockUploadComponent;
  let fixture: ComponentFixture<ExcelBlockUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelBlockUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelBlockUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
