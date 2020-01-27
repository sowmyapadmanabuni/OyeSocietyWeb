import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelExpenseUploadComponent } from './excel-expense-upload.component';

describe('ExcelExpenseUploadComponent', () => {
  let component: ExcelExpenseUploadComponent;
  let fixture: ComponentFixture<ExcelExpenseUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelExpenseUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelExpenseUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
