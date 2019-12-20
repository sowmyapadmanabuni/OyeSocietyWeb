import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentInvoiceComponent } from './resident-invoice.component';

describe('ResidentInvoiceComponent', () => {
  let component: ResidentInvoiceComponent;
  let fixture: ComponentFixture<ResidentInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidentInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
