import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../ts/Users';
import { Authority } from '../ts/authorities';
import { Order } from '../ts/Order';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = "http://localhost:8080/rest/user";
  constructor(private httpClient: HttpClient) {

  }

  getUserList(roles: string[]): Observable<any[]> {
    let params = new HttpParams();

    roles.forEach(role => {
      params = params.append('roles', role);
    });

    console.log('URL:', this.baseURL, 'Params:', params.toString());

    return this.httpClient.get<any[]>(this.baseURL, { params });
  }

  createUser(user: Users): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, user);
  }
  updateUser(userID: number, formData: FormData): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${userID}`, formData);
  }

  getUserById(userID: number): Observable<Users> {
    return this.httpClient.get<Users>(`${this.baseURL}/${userID}`);
  }
  deleteUser(userID: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${userID}`);
  }
  // Phương thức để vô hiệu hóa nhân viên
  disable(userID: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseURL}/${userID}/disable`, {});
  }
  enable(userID: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseURL}/${userID}/enable`, {});
  }

  getNextUserId(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/next-id`);
  }
  getUsersWithAuthorities(roles?: string[]): Observable<Users[]> {
    let params = new HttpParams();
    if (roles && roles.length > 0) {
      params = params.append('roles', roles.join(','));
    }

    return this.httpClient.get<Users[]>(`${this.baseURL}/auth`, { params });
  }

  updateUserAuthorities(userId: number, authorities: Authority[]): Observable<void> {
    return this.httpClient.put<void>(`${this.baseURL}/${userId}/authorities`, authorities);
  }
  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseURL}/${userId}`);
  }
  getUserRole(): string {
    return localStorage.getItem('role') || 'Customer', 'Guest';
  }
}
