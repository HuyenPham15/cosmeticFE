import { TestBed } from '@angular/core/testing';

import { AdminNotificationServiceService } from './admin-notification-service.service';

describe('AdminNotificationServiceService', () => {
  let service: AdminNotificationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminNotificationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
