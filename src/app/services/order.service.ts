import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../ts/Order';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiURL = "http://localhost:8080/api"
  private baseURL = "http://localhost:8080/api/ad/qlhoadon"
  constructor(private httpClient: HttpClient) { }


  getOrder(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseURL}`);
  }
  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.apiURL);
  }

  createOrder(orderData: any): Observable<any> {
    return this.httpClient.post(`${this.apiURL}/order`, orderData);
  }
  updateOrderStatus(orderId: string, body: { status: number }): Observable<void> {
    return this.httpClient.put<void>(`${this.apiURL}/${orderId}/update-status`, body);
  }



  getStatuses(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiURL}/statuses`);
  }
  getOrdersByStatus(statusId: number): Observable<Order[]> {
    const params = new HttpParams().set('statusId', statusId.toString());
    return this.httpClient.get<Order[]>(`${this.apiURL}/status`, { params });
  }
  createOrderWithGHN(orderRequest: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.apiURL}/createOrder`, orderRequest, { headers });
  }
  getOrderById(orderId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/${orderId}`);
  }

}

