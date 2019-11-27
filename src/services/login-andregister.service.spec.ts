import { TestBed } from '@angular/core/testing';

import { LoginAndregisterService } from './login-andregister.service';

describe('LoginAndregisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginAndregisterService = TestBed.get(LoginAndregisterService);
    expect(service).toBeTruthy();
  });
});
