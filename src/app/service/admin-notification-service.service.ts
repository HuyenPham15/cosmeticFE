import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {
  private stompClient: Client;
  private notificationSubject = new Subject<any>();

  constructor() {
    // Khởi tạo Stomp Client với SockJS endpoint
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Địa chỉ WebSocket endpoint
      debug: (str) => console.log(str), // Thêm để debug nếu cần
      reconnectDelay: 5000, // Thử kết nối lại nếu ngắt
      onConnect: () => this.onConnected(),
      onStompError: (frame) => console.error('STOMP Error', frame)
    });

    // Kích hoạt kết nối
    this.stompClient.activate();
  }

  private onConnected() {
    // Khi kết nối thành công, subscribe vào topic để nhận thông báo
    this.stompClient.subscribe('/topic/orders', (message: Message) => {
      const notification = JSON.parse(message.body);
      this.notificationSubject.next(notification); // Đẩy thông báo vào Subject
    });
  }

  getNotifications(): Observable<any> {
    return this.notificationSubject.asObservable(); // Trả về Observable để admin có thể subscribe
  }
}
