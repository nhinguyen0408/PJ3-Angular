import { TestBed } from '@angular/core/testing';

import { ApiProductionService } from './api-production.service';

describe('ApiProductionService', () => {
  let service: ApiProductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiProductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
