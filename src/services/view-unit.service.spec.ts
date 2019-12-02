import { TestBed } from '@angular/core/testing';

import { ViewUnitService } from './view-unit.service';

describe('ViewUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewUnitService = TestBed.get(ViewUnitService);
    expect(service).toBeTruthy();
  });
});
