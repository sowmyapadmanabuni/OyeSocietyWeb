import { TestBed } from '@angular/core/testing';

import { ViewDeliveryService } from './view-delivery.service';

describe('ViewDeliveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewDeliveryService = TestBed.get(ViewDeliveryService);
    expect(service).toBeTruthy();
  });
});
