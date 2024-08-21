import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { superAdminGuard } from './guard/super-admin.guard';

describe('superAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => superAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
