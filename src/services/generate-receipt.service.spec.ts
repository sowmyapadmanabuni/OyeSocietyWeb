import { TestBed } from '@angular/core/testing';

import { GenerateReceiptService } from './generate-receipt.service';

describe('GenerateReceiptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateReceiptService = TestBed.get(GenerateReceiptService);
    expect(service).toBeTruthy();
  });
});
