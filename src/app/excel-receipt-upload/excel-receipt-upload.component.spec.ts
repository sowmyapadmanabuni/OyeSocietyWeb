import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelReceiptUploadComponent } from './excel-receipt-upload.component';

describe('ExcelReceiptUploadComponent', () => {
  let component: ExcelReceiptUploadComponent;
  let fixture: ComponentFixture<ExcelReceiptUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelReceiptUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelReceiptUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
