import { TestBed } from '@angular/core/testing';

import { EditprofileService } from './editprofile.service';

describe('EditprofileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditprofileService = TestBed.get(EditprofileService);
    expect(service).toBeTruthy();
  });
});
