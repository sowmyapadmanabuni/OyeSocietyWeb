import { TestBed } from '@angular/core/testing';

import { ViewInvoiceService } from './view-invoice.service';

describe('ViewInvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewInvoiceService = TestBed.get(ViewInvoiceService);
    expect(service).toBeTruthy();
  });
});
