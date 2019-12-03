import { TestBed } from '@angular/core/testing';

import { ViewExpensesService } from './view-expenses.service';

describe('ViewExpensesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewExpensesService = TestBed.get(ViewExpensesService);
    expect(service).toBeTruthy();
  });
});
