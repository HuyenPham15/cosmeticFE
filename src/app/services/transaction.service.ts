import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/transaction/create';  // Đường dẫn API của bạn

  constructor(private http: HttpClient) { }

  // Phương thức tạo giao dịch
  createTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transactionData);
  }
}
