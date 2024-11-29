import { Component, OnInit } from '@angular/core';
import { Employee } from '../../ts/employee';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [FormsModule, RouterModule, NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'] // Sửa thành styleUrls thay vì styleUrl
})
export class UpdateEmployeeComponent implements OnInit {
  title = 'UPDATE EMPLOYEES MANAGENT'
  showPassword: boolean = false;
  employee: Employee = new Employee();
  userID!: number;
  selectedFile: File | null = null; // Biến để lưu trữ file đã chọn

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['userID'];
    
    // Gọi API để lấy thông tin nhân viên
    this.employeeService.getEmployeeById(this.userID)
      .subscribe(data => {
        console.log(data);
        this.employee = data; 
      }, error => console.log(error));
  }

  updateEmployee(): void {
    const formData = new FormData();
  
    const employeeData = new Employee(
      this.employee.lastName,
      this.employee.firstName,
      this.employee.email,
      this.employee.password, 
      this.employee.phoneNumber,
      this.employee.avatar,
      this.employee.gender,
      this.employee.total_point
    );
  
    const employeeBlob = new Blob([JSON.stringify(employeeData)], { type: 'application/json' });
    formData.append('employee', employeeBlob);
  
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile); 
    }
  
    this.employeeService.updateEmployee(this.userID, formData).subscribe(data => {
      console.log('Thông tin nhân viên đã được cập nhật:', data);
      alert('Thông tin nhân viên đã được cập nhật thành công.');
      this.router.navigate(['/employees']); 
    }, error => {
      console.error('Có lỗi xảy ra trong quá trình cập nhật:', error);
      alert('Có lỗi xảy ra trong quá trình cập nhật thông tin. Vui lòng thử lại.');
    });
  }
  

  onSubmit() {
    if (this.employee.password && this.employee.password.trim() !== '') {
      this.updateEmployee();
    } else {
      this.employee.password
      this.updateEmployee();
    }
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']); // Chuyển hướng về danh sách nhân viên
  }
  cancel(){
    this.router.navigate(['/employees']);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
