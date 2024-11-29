import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../ts/employee';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordResetDTO } from '../../ts/PasswordResetDTO';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-detail-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './detail-employee.component.html',
  styleUrls: ['./detail-employee.component.scss']
})
export class DetailEmployeeComponent implements OnInit {
  title = ' DETAIL EMPLOYEES MANAGENT'

  userID!: number;
  employee: Employee = new Employee();
  isEditing = false;
  selectedFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = null;
  changePasswordForm: FormGroup;
  showPassword: boolean = false;
  role: string | null = null;
  currentUser!: string; // userID của người dùng đang đăng nhập
  password : string | null = null;
  isChangingPassword: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;


  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
  });
  }

  ngOnInit() {
    this.userID = this.route.snapshot.params['userID'];
    this.loadEmployee();
    // Lấy vai trò và ID người dùng hiện tại từ localStorage
    this.role = localStorage.getItem('role') || '';
    // Lấy ID người dùng hiện tại từ localStorage
    const emailFromStorage = localStorage.getItem('email');
    this.currentUser = emailFromStorage ?? ''; // Gán chuỗi rỗng nếu là null
    this.password = localStorage.getItem('password');
    console.log('Bạn đang là :', this.role);
    console.log('ID người dùng hiện tại:', this.currentUser);
    
  }

  // Load employee details
  loadEmployee() {
    this.employeeService.getEmployeeById(this.userID).subscribe(
      data => {
        this.employee = data;
      },
      error => console.log(error)
    );
  }

  // Handle file selection for avatar
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Preview the selected avatar
      const reader = new FileReader();
      reader.onload = e => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }
  saveChange(): void {
    if (this.isEditing) {
        const formData = new FormData();
        const employeeData = new Blob([JSON.stringify(this.employee)], { type: 'application/json' });
        formData.append('employee', employeeData);

        // Append avatar if a new file is selected
        if (this.selectedFile) {
            formData.append('avatar', this.selectedFile);
        }

        // Kiểm tra xem có cần đổi mật khẩu không
        const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
        const newPassword = this.changePasswordForm.get('newPassword')?.value;
        const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword')?.value;

        // Chỉ thực hiện thay đổi mật khẩu nếu các trường mật khẩu hợp lệ
        if (currentPassword && newPassword && confirmNewPassword) {
            if (newPassword !== confirmNewPassword) {
                alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                return;
            }

            const request: PasswordResetDTO = {
                email: this.employee.email,
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            };

            // Gọi service đổi mật khẩu
            this.authService.changePassword(request).subscribe(
                response => {
                    console.log('Password changed successfully:', response);
                    alert('Mật khẩu đã được thay đổi thành công.');
                    this.changePasswordForm.reset();
                },
                error => {
                    console.error('Error changing password:', error);
                    alert('Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại.');
                }
            );
        }

        // Cập nhật thông tin nhân viên mà không cần phải thay đổi mật khẩu
        this.employeeService.updateEmployee(this.userID, formData).subscribe(
            data => {
                console.log('Employee information updated successfully:', data);
                alert('Thông tin nhân viên đã được cập nhật thành công.');
                this.router.navigate(['/employees']);
            },
            error => {
                console.error('Error updating employee:', error);
                alert('Có lỗi xảy ra trong quá trình cập nhật thông tin. Vui lòng thử lại.');
            }
        );

        this.isEditing = false;
    }
}
  // Reset password fields
  resetPasswordFields() {
    this.changePasswordForm.reset();
  }
  cancelEdit() {
    this.isEditing = false;
    // this.loadEmployee();
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Hàm để điều hướng trở lại danh sách nhân viên
  list(): void {
    this.router.navigate(['/employees']);
  }
    togglePassword(type: string) {
    switch(type) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}
