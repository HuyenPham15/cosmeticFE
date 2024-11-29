import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../ts/employee';
import { Authority } from '../ts/authorities';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseURL = "http://localhost:8080/rest/employee";
  constructor(private httpClient: HttpClient) {

  }

  getEmployeeList(roles: string[]): Observable<any[]> {
    let params = new HttpParams();

    roles.forEach(role => {
      params = params.append('roles', role);
    });

    console.log('URL:', this.baseURL, 'Params:', params.toString());

    return this.httpClient.get<any[]>(this.baseURL, { params });
  }

  createEmployee(employee: Employee): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, employee);
  }
  updateEmployee(employeeID: number, formData: FormData): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${employeeID}`, formData);
  }

  getEmployeeById(employeeID: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.baseURL}/${employeeID}`);
  }
  deleteEmployee(employeeID: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${employeeID}`);
  }
  disable(employeeID: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseURL}/${employeeID}/disable`, {});
  }
  enable(employeeID: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseURL}/${employeeID}/enable`, {});
  }

  getNextemployeeID(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/next-id`);
  }
  getEmployeesWithAuthorities(roles?: string[]): Observable<Employee[]> {
    let params = new HttpParams();
    if (roles && roles.length > 0) {
      params = params.append('roles', roles.join(','));
    }

    return this.httpClient.get<Employee[]>(`${this.baseURL}/auth`, { params });
  }

  updateEmployeeAuthorities(employeeID: number, authorities: Authority[]): Observable<void> {
    return this.httpClient.put<void>(`${this.baseURL}/${employeeID}/authorities`, authorities);
  }
}
