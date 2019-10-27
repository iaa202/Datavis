import { TestBed } from '@angular/core/testing';

import { GoogleapiService } from './googleapi.service';

describe('GoogleapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleapiService = TestBed.get(GoogleapiService);
    expect(service).toBeTruthy();
  });
});
