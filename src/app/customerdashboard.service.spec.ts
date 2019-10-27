import { TestBed } from '@angular/core/testing';

import { CustomerdashboardService } from './customerdashboard.service';

describe('CustomerdashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerdashboardService = TestBed.get(CustomerdashboardService);
    expect(service).toBeTruthy();
  });
});
