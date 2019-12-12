import { TestBed } from '@angular/core/testing';

import { AddVisitorService } from './add-visitor.service';

describe('AddVisitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddVisitorService = TestBed.get(AddVisitorService);
    expect(service).toBeTruthy();
  });
});
