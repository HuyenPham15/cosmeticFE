import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseURL="http://localhost:8080/rest/employee";
  constructor(private httpClient: HttpClient) { }

  getEmployeeList(roles: string[]): Observable<any[]> {
    let params = new HttpParams();
    
    roles.forEach(role => {
        params = params.append('roles', role);
    });
    
    console.log('URL:', this.baseURL, 'Params:', params.toString());
    
    return this.httpClient.get<any[]>(this.baseURL, { params });
}



  createEmployee(employee: Employee): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`, employee);
  }
  updateEmployee(userID: string, employee: Employee): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/${userID}`, employee);
  }
  getEmployeeById(userID: string): Observable<Employee>{
    return this.httpClient.get<Employee>(`${this.baseURL}/${userID}`);
  }
  deleteEmployee(userID: string): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/${userID}`);
  }
}
