import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';  // Import thêm NgForm từ @angular/forms
import { CommonModule } from '@angular/common';  // Import CommonModule

import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule],  // Add CommonModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  title = 'ĐĂNG KÍ';

  user = { last_name: '', first_name: '', email: '', password: '', confirmPassword: '' };
  message = '';
  email: string = '';
  code: string = '';
  ngOnInit() {

  }
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  register(registerForm: NgForm) {
    if (this.user.password !== this.user.confirmPassword) {
      this.message = 'Mật khẩu không khớp!';
      return;
    }

    if (registerForm.invalid) {
      Object.keys(registerForm.controls).forEach(field => {
        const control = registerForm.controls[field];
        control?.markAsTouched({ onlySelf: true });
      });
      this.message = 'Vui lòng kiểm tra lại thông tin đã nhập.';
      return;
    }

    console.log('User data:', this.user);

    this.authService.register(this.user).subscribe(
      (response) => {
        this.message = response;
        alert("Vui lòng xác nhận tài khoản qua email!");
        //  this.router.navigate(['/confirm-register'], { queryParams: { email: this.user.email } });
      },
      (error) => {
        console.error('Lỗi đăng ký: ', error);
        this.message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
    );
  }

}
