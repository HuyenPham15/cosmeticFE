import { Component, OnInit } from '@angular/core';
import { Employee } from '../ts/employee';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  employees: Employee[] = []; // Dữ liệu nhân viên
  roles: string[] = []; // Có thể thêm danh sách vai trò nếu cần

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    const employeeId = 1; // Thay đổi ID nhân viên theo nhu cầu
    this.getUsers();
  }
  private getUsers() {
    this.employeeService.getEmployeesWithAuthorities(this.roles).subscribe(
      data => {
        this.employees = data; // Gán dữ liệu nhân viên từ API
      },
      error => {
        console.error('Error fetching employees:', error); // In ra lỗi nếu có
      }
    );
  }
}
