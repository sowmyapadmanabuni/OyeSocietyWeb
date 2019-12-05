import { TestBed } from '@angular/core/testing';

import { AddBlockService } from './add-block.service';

describe('AddBlockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddBlockService = TestBed.get(AddBlockService);
    expect(service).toBeTruthy();
  });
});
