import { TestBed } from '@angular/core/testing';

import { ApiDashboardService } from './api-dashboard.service';

describe('ApiDashboardService', () => {
  let service: ApiDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
