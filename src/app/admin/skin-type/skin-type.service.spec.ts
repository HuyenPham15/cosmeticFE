import { TestBed } from '@angular/core/testing';

import { SkinTypeService } from './skin-type.service';

describe('SkinTypeService', () => {
  let service: SkinTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkinTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
