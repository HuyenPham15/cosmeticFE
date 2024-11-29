import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  title = 'USER';
  Users: any[] = [];
  isDeleting = false;
  role: string | null = null;
  constructor(private userService: UserService,
    private router: Router, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    this.getUsers();

    // Lấy vai trò từ localStorage
    this.role = localStorage.getItem('role');
    console.log('Logged in role:', this.role);

  }

  private getUsers() {
    const roles = ['R03', 'R04']; // Đảm bảo là mảng
    this.userService.getUserList(roles).subscribe(data => {
      this.Users = data;
    }, error => {
      console.error('Error fetching Users:', error); // In ra lỗi nếu có
    });
  }
  deleteUser(userID: number) {
    this.isDeleting = true; // Vô hiệu hóa nút khi bắt đầu thao tác
    this.userService.disable(userID).subscribe(
      () => {
        console.log('Vô hiệu hóa thành công');
        this.getUsers(); // Gọi lại danh sách nhân viên mới
        this.isDeleting = false; // Kích hoạt lại nút sau khi thành công
      },
      (error: any) => {
        console.error('Lỗi khi vô hiệu hóa:', error);
        this.isDeleting = false; // Kích hoạt lại nút nếu có lỗi
      }
    );
  }

  UserDetails(userID: number) {
    this.router.navigate(['detail-User', userID]);
  }
}
