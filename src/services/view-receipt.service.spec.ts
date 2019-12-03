import { TestBed } from '@angular/core/testing';

import { ViewReceiptService } from './view-receipt.service';

describe('ViewReceiptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewReceiptService = TestBed.get(ViewReceiptService);
    expect(service).toBeTruthy();
  });
});
