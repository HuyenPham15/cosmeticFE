import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HostListener } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  title = 'EMPLOYEES MANAGENT'
  employees: any[] = [];
  isDeleting = false;
  role: string | null = null;
  constructor(private employeeService: EmployeeService,
    private router: Router, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    this.getEmployees();
    this.role = localStorage.getItem('role');
    console.log('Logged in role:', this.role);

  }

  private getEmployees() {
    const roles = ['R02', 'R01']; // Đảm bảo là mảng
    this.employeeService.getEmployeeList(roles).subscribe(data => {
      this.employees = data;
    }, error => {
      console.error('Error fetching employees:', error); // In ra lỗi nếu có
    });
  }

  updateEmployee(userID: number) {
    this.router.navigate(['update-employee', userID]);
  }

  deleteEmployee(userID: number) {
    this.isDeleting = true; // Vô hiệu hóa nút khi bắt đầu thao tác
    this.employeeService.disable(userID).subscribe(
      () => {
        console.log('Vô hiệu hóa thành công');
        alert("Đã vô hiệu hóa nhân viên thành công")
        this.getEmployees(); // Gọi lại danh sách nhân viên mới
        this.isDeleting = false; // Kích hoạt lại nút sau khi thành công
      },
      (error: any) => {
        console.error('Lỗi khi vô hiệu hóa:', error);
        this.isDeleting = false; // Kích hoạt lại nút nếu có lỗi
      }
    );
  }
  enable(userID: number): void {
    this.employeeService.enable(userID).subscribe({
      next: () => {
        console.log('User enabled successfully');
        alert('Kích hoạt thành công')
        this.getEmployees(); // Gọi lại danh sách nhân viên mới
      },
      error: (err) => console.error('Error enabling user:', err)
    });
  }

  employeeDetails(userID: number) {
    this.router.navigate(['detail-employee', userID]);
  }


  get firstName(): string | null {
    return this.getItemFromLocalStorage('firstName');
  }

  get lastName(): string | null {
    return this.getItemFromLocalStorage('lastName');
  }

  get userEmail(): string | null {
    return this.getItemFromLocalStorage('email');
  }

  private getItemFromLocalStorage(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }

  private checkUserLogin() {
    if (!this.userEmail) {
      this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      // Thông báo hoặc thông báo người dùng đã đăng xuất
    }
    this.router.navigate(['/login']);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    // Chỉ nên gọi logout nếu có điều kiện cụ thể
    this.logout();
  }

}