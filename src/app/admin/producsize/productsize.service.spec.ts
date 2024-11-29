import { TestBed } from '@angular/core/testing';

import { ProductsizeService } from './productsize.service';
describe('ProductsizeService', () => {
  let service: ProductsizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
