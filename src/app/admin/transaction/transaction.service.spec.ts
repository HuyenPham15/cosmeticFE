import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
describe('TransacticonService', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
