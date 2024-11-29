import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Skintype } from './skin-type';

@Injectable({
  providedIn: 'root'
})
export class SkinTypeService {
  private baseURL="http://localhost:8080/api/ad/skin_type";
  constructor(private httpClient: HttpClient) { }

  getSkintype(): Observable<Skintype[]>{
    return this.httpClient.get<Skintype[]>(`${this.baseURL}`);
  } 
}
