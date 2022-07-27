import { TestBed } from '@angular/core/testing';

import { ApiBillService } from './api-bill.service';

describe('ApiBillService', () => {
  let service: ApiBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
