import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountServiceService {

  constructor(private http: HttpClient) { }
  getDiscounts(): Observable<any> {
    return this.http.get('http://localhost:8080/valid');
  }
}
