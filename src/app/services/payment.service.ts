import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8080/api/vnpay';

  constructor(private http: HttpClient) { }

  submitOrder(paymentData: { amount: number; orderInfo: string; orderID: string; paymentMethod: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/submitOrder`, paymentData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


}
