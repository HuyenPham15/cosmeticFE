import { Injectable, OnDestroy } from '@angular/core';
import { StompService, StompConfig } from '@stomp/ng2-stompjs';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  private stompService: StompService;
  private notificationSubscription: Subscription | null = null;

  constructor() {
    const stompConfig: StompConfig = {
      url: 'ws://localhost:8080/admin-websocket',
      headers: {},
      heartbeat_in: 10000,
      heartbeat_out: 10000,
      reconnect_delay: 5000,
      debug: true,
    };
    this.stompService = new StompService(stompConfig);
  }

  public getAdminNotifications(): Observable<any> {
    return new Observable((observer) => {
      // Kiểm tra kết nối đã mở trước khi đăng ký
      this.stompService.state
        .pipe(
          filter((state) => state === 1), // Thay OPEN bằng giá trị số của trạng thái WebSocket OPEN
          map(() => {
            // Đăng ký vào chủ đề thông báo
            this.notificationSubscription = this.stompService
              .subscribe('/topic/admin-notifications')
              .pipe(
                map((message) => {
                  try {
                    return JSON.parse(message.body);
                  } catch (e) {
                    console.error('Error parsing notification message', e);
                    observer.error(e); // Xử lý lỗi phân tích JSON
                    return null;
                  }
                })
              )
              .subscribe(
                (message) => {
                  if (message) {
                    observer.next(message);
                  }
                },
                (error) => observer.error(error)
              );
          })
        )
        .subscribe();
    });
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    this.stompService.deactivate(); // Đóng kết nối WebSocket khi service bị huỷ
  }
}
