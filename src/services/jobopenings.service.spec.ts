import { TestBed } from '@angular/core/testing';

import { JobopeningsService } from './jobopenings.service';

describe('JobopeningsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobopeningsService = TestBed.get(JobopeningsService);
    expect(service).toBeTruthy();
  });
});
