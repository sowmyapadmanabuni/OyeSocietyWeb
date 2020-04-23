import { TestBed } from '@angular/core/testing';

import { ContactformService } from './contactform.service';

describe('ContactformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactformService = TestBed.get(ContactformService);
    expect(service).toBeTruthy();
  });
});
