import { Component, Inject, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { NotificationService } from '../service/notification.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  role: string | null = null;  // Biến để lưu vai trò người dùng
  hasNewNotification: boolean = false;
  @Input() title: string = '';
  newOrder: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private orderService: OrderService, private notification: NotificationService) { }

  ngOnInit() {
    this.checkUserLogin();
    this.role = localStorage.getItem('role');  // Hoặc gọi từ authService nếu cần
    this.notification.getAdminNotifications().subscribe({
      next: (notification) => {
        this.notifications.push(notification);
        console.log('New order notification:', notification);
        this.hasNewNotification = true;
      },
      error: (err) => console.error('WebSocket connection error:', err)
    });
  }
  checkPermission(event: MouseEvent) {
    if (this.role !== 'R01') {
      event.preventDefault();  // Ngăn hành động mặc định (chuyển hướng)
      alert('Bạn không có quyền truy cập vào trang này.');  // Hiển thị thông báo
    }
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
    // this.logout(); 
  }

  notifications: any[] = [];


  confirmOrder(orderId: string) {
    // Thực hiện xác nhận đơn hàng
    console.log(`Xác nhận đơn hàng với ID: ${orderId}`);
  }
}
