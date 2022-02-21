import { TestBed } from '@angular/core/testing';

import { ApiVoucherService } from './api-voucher.service';

describe('ApiVoucherService', () => {
  let service: ApiVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
