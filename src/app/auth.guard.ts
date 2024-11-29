import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Đường dẫn đến AuthService của bạn

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn(); // Giả sử bạn có phương thức này trong AuthService

    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
