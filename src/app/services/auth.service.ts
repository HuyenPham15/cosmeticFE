import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PasswordResetDTO } from '../ts/PasswordResetDTO';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private currentUser: any; // Đây là nơi lưu trữ thông tin người dùng hiện tại
  isLoggedInFlag = false;  // Biến để lưu trạng thái đăng nhập

  token: string = "";
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUser = { userID: 1 }; // Ví dụ giả định ID người dùng là 1
  }

  register(user: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' });
  }

  login(user: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }

  saveUserSession(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('email') !== null;
    }
    return false;
  }
  confirmRegistration(email: string, code: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/confirm-registration`, { email, code });
  }
  resetPassword(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json' // Chỉ định kiểu phản hồi là text
    });
  }
  checkEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/send-verification-code`, { email }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  confirmVerificationCode(email: string, code: string, expirationTime: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/confirm-verification-code`, { email, code, expirationTime }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: { timestamp: new Date().getTime().toString() } // Ngăn caching
    });

  }
  changePassword(request: PasswordResetDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, request);
  }
  getCurrentUser() {
    return this.currentUser;
  }

}
