import { TestBed, async, inject } from '@angular/core/testing';

import { AppGuardGuard } from './app-guard.guard';

describe('AppGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppGuardGuard]
    });
  });

  it('should ...', inject([AppGuardGuard], (guard: AppGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
