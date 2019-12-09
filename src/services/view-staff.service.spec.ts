import { TestBed } from '@angular/core/testing';

import { ViewStaffService } from './view-staff.service';

describe('ViewStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewStaffService = TestBed.get(ViewStaffService);
    expect(service).toBeTruthy();
  });
});
