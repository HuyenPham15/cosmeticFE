import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule, NavbarComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  title = 'FORGOT PASSWORD';
  email: string = '';
  verificationCodeSent: boolean = false; // Biến để theo dõi việc gửi mã xác nhận
  message: string | null = null;
  code: string = ''; // Biến để lưu mã xác nhận
  expirationTime = new Date().getTime() + (2 * 60 * 1000); // Tính thời gian hết hạn là một số nguyên

  constructor(private authService: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy kiểm tra định dạng email
    return emailPattern.test(email);
}
sendEmail() {
    // Kiểm tra xem người dùng đã nhập email chưa
    if (!this.email || this.email.trim() === '') {
      this.message = 'Vui lòng nhập địa chỉ email';
      return; // Dừng việc gửi email nếu không nhập
    }

  if (!this.isValidEmail(this.email)) {
    this.message = 'Địa chỉ email không hợp lệ.';
    return;
  }

  // Cập nhật expirationTime khi gửi email
  this.expirationTime = new Date().getTime() + (2 * 60 * 1000); // 2 phút kể từ lúc gửi

  this.authService.checkEmail(this.email).subscribe(
    response => {
      if (response.message) {
        this.verificationCodeSent = true;
        this.message = response.message;
      }
    },
    error => {
      console.error('Error checking email:', error);
      this.message = error.error?.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  );
}
confirmVerificationCode() {
  this.authService.confirmVerificationCode(this.email, this.code, this.expirationTime).subscribe(
      response => {
          if (response.message === 'Mã xác nhận thành công.') {
              this.router.navigate(['/change-password']); // Chuyển hướng đến trang đổi mật khẩu
          } else {
              this.message = 'Mã xác nhận không hợp lệ. Vui lòng thử lại.';
          }
      },
      error => {
          console.error('Error confirming verification code:', error);
          this.message = error.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      }
  );
}

}
