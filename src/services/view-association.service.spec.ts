import { TestBed } from '@angular/core/testing';

import { ViewAssociationService } from './view-association.service';

describe('ViewAssociationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewAssociationService = TestBed.get(ViewAssociationService);
    expect(service).toBeTruthy();
  });
});
