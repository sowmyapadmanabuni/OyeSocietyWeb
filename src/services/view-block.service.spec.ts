import { TestBed } from '@angular/core/testing';

import { ViewBlockService } from './view-block.service';

describe('ViewBlockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewBlockService = TestBed.get(ViewBlockService);
    expect(service).toBeTruthy();
  });
});
