import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Đảm bảo nhập từ @angular/router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-confirm-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.scss'] // Đã sửa `styleUrl` thành `styleUrls`
})
export class ConfirmRegisterComponent implements OnInit {
  email: string = '';
  code: string = '';
  message:  string = '';


  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Lấy email và mã xác nhận từ URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
    });
    this.confirm();
  }
  confirm() {
    this.authService.confirmRegistration(this.email, this.code).subscribe(
      (response) => {
        this.message = response.message || 'Xác nhận tài khoản thành công!'; // Hiển thị thông báo
        if (confirm("Bạn đã đăng ký thành công! Nhấn OK để tiếp tục.")) {
          this.router.navigate(['/login']); // Điều hướng đến trang login khi nhấn "OK"
        }
      },
      (error) => {
          // Trường hợp có lỗi
      console.error('Lỗi khi xác nhận tài khoản:', error);  // Ghi log lỗi ra console
      this.message = error.error?.error || 'Có lỗi xảy ra trong quá trình xác nhận tài khoản.';
      alert(this.message);  // Hiển thị thông báo lỗi cho người dùng
      }
    );
  }
}
