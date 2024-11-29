import { Component, OnInit } from '@angular/core';
import { Employee } from '../../ts/employee';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent implements OnInit {
  title = 'CREATE EMPLOYEES MANAGENT'

  employee: Employee = new Employee();
  nextUserId!: number;  // Khai báo nextUserId

  constructor(private employeeService: EmployeeService,
    private router: Router) { }
  ngOnInit(): void {

    this.employeeService.getNextemployeeID().subscribe(
      (nextId: number) => {
        console.log('Next User ID:', nextId);  // Kiểm tra xem giá trị có đúng không
        this.nextUserId = nextId;
        this.employee.id = this.nextUserId;
      },
      (error) => {
        console.error('Error fetching next userID:', error);
      }
    );
  }

  getNextUserId() {
    this.employeeService.getNextemployeeID().subscribe(
      (nextUserId: number) => {
        this.employee.id = nextUserId;  // Gán giá trị userID tiếp theo vào form
      },
      (error) => {
        console.error('Error fetching next userID:', error);
      }
    );
  }
  saveEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe(data => {
      console.log(data)
      this.goToEmployeeList();
      alert("Thêm mới thành công")
    },
      error => console.log(error));

  }
  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }
  onSubmit() {

    console.log(this.employee);
    this.saveEmployee();
  }
  onCancel(form: any) {
    this.router.navigate(['/employees']);  // Điều hướng về trang danh sách nhân viên (hoặc trang khác)
  }

}
