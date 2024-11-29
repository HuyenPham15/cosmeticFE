import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detail } from './detail';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private baseURL = "http://localhost:8080/api/ad/admin";

  // Hiển thị thông tin sản phẩm ra trang chỉnh sửa
  getProductID(productID: string): Observable<Detail> {
    return this.httpClient.get<Detail>(`${this.baseURL}/${productID}`);
  }

  constructor(private httpClient: HttpClient) { }

  // Thêm phương thức lấy comment theo orderId
  getCommentsByOrderId(orderId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:8080/api/ad/reviews/${orderId}`);
  }
}
