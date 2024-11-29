import { Injectable } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private topic = '/topic/orders';

  constructor(private stompService: StompRService) { }

  getOrderNotifications(): Observable<any> {
    return this.stompService.subscribe(this.topic).pipe(
      map((message) => JSON.parse(message.body))
    );
  }
}
