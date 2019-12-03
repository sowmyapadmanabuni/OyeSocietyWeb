import { TestBed } from '@angular/core/testing';

import { AddExpenseService } from './add-expense.service';

describe('AddExpenseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddExpenseService = TestBed.get(AddExpenseService);
    expect(service).toBeTruthy();
  });
});
