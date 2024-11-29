import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import {   HttpHeaders } from '@angular/common/http';
import { Transaction } from './transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseURL="http://localhost:8080/api/admin/transaction";

  constructor(private httpClient: HttpClient) { }
  getTransaction(): Observable<Transaction[]>{
    return this.httpClient.get<Transaction[]>(`${this.baseURL}`);
  } 
}
