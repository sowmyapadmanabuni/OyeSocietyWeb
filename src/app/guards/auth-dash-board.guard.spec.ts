import { TestBed, async, inject } from '@angular/core/testing';

import { AuthDashBoardGuard } from './auth-dash-board.guard';

describe('AuthDashBoardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthDashBoardGuard]
    });
  });

  it('should ...', inject([AuthDashBoardGuard], (guard: AuthDashBoardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
