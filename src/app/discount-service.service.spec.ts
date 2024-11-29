import { TestBed } from '@angular/core/testing';

import { DiscountServiceService } from './discount-service.service';

describe('DiscountServiceService', () => {
  let service: DiscountServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
