import { TestBed } from '@angular/core/testing';

import { DiscountSpService } from './discount-sp.service';

describe('DiscountSpService', () => {
  let service: DiscountSpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountSpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
