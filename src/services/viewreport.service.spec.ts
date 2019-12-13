import { TestBed } from '@angular/core/testing';

import { ViewreportService } from './viewreport.service';

describe('ViewreportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewreportService = TestBed.get(ViewreportService);
    expect(service).toBeTruthy();
  });
});
