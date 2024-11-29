import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';  // Import SocialLoginModule
import { HttpClient } from '@angular/common/http';
import { SocialUser } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, SocialLoginModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  title = 'ĐĂNG NHẬP';

  user = { email: '', password: '' };
  message = '';
  email: string | null = null;
  code: string | null = null;
  rememberMe: boolean = false;  // Biến để kiểm soát checkbox
  loginAttempts: number = 0;    // Đếm số lần đăng nhập sai
  users!: SocialUser; // Assert that it will be initialized later
  loggedIn: boolean = false;
  private accessToken = '';
  emailForReset: string = ''; // Biến để lưu trữ email nhập vào



  constructor(private authService: AuthService, private router: Router,
    private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object,
    private oauthService: SocialAuthService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.user.email = '';
    this.user.password = '';
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
    });
    this.oauthService.authState.subscribe((user) => {
      this.users = user;
      this.loggedIn = (user != null);
    });
  }
  onEmailInput() {
    // Kiểm tra xem có đang chạy trong trình duyệt hay không
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('userEmail');
      const savedPassword = localStorage.getItem('userPassword');
      // Nếu email nhập vào khớp với email đã lưu, tự động điền mật khẩu
      if (this.user.email === savedEmail && savedPassword) {
        this.user.password = savedPassword;
      } else {
        // Nếu email không khớp, xóa mật khẩu đã nhập
        this.user.password = ''; // Reset password
      }
    }
  }

  login() {
    this.authService.login(this.user).subscribe(
      (response) => {
        console.log('Server response:', response);

        this.loginAttempts = 0; // Reset số lần đăng nhập sai

        // Kiểm tra phản hồi từ server
        if (response && response.firstName && response.lastName && response.roles && response.roles.length > 0) {
          // Lưu thông tin người dùng vào localStorage một cách an toàn
          this.saveUserDataToLocal(response);

          // Điều hướng người dùng dựa trên vai trò
          const role = response.roles[0];
          if (role === 'R01' || role === 'R02') {
            this.router.navigate(['/admin']);
          } else if (role === 'R03' || role === 'R04') {
            this.router.navigate(['/home']);
          } else {
            console.error('Unknown role:', role);
          }
        } else {
          console.error('Missing user details in the response');
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.handleLoginError(error);
      }
    );
  }

  /**
   * Lưu thông tin người dùng vào localStorage
   */
  private saveUserDataToLocal(response: any): void {
    // Save basic user data to localStorage
    localStorage.setItem('firstName', response.firstName);
    localStorage.setItem('lastName', response.lastName);
    localStorage.setItem('email', response.email);
    localStorage.setItem('phoneNumber', response.phoneNumber || '');
    localStorage.setItem('userID', response.userID ? String(response.userID) : '');

    // Save address if available
    if (Array.isArray(response.address) && response.address.length > 0) {
      localStorage.setItem('address', JSON.stringify(response.address));
    } else {
      localStorage.setItem('address', ''); // Store empty string instead of removing it
    }

    // Save the first role, if available
    const role = response.roles && response.roles.length > 0 ? response.roles[0] : '';
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role'); // If no role, ensure it's removed
    }

    // Handle "remember me" functionality without storing password
    if (this.rememberMe) {
      localStorage.setItem('userEmail', this.user.email);
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword'); // Clear password if not remembered
    }
  }
  /**
   * Xử lý lỗi khi đăng nhập thất bại
   */
  private handleLoginError(error: any): void {
    this.loginAttempts++;

    if (error.status === 401) {
      this.message = 'Mật khẩu không chính xác hoặc tài khoản không tồn tại.';
    } else if (error.status === 403) {
      this.message = 'Tài khoản của bạn đã bị khóa. Vui lòng kiểm tra email để khôi phục.';
      this.router.navigate(['/forgot-pass']);
    } else {
      this.message = 'Đăng nhập thất bại. Vui lòng thử lại.';
    }

    // Kiểm tra số lần đăng nhập sai
    if (this.loginAttempts >= 5) {
      this.message = 'Bạn đã đăng nhập sai quá 5 lần. Chuyển đến trang khôi phục mật khẩu.';
      setTimeout(() => {
        this.router.navigate(['/forgot-pass']);
      }, 3000);
    }
  }


  signInWithFB(): void {
    this.oauthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data => {
        console.log(data);
      }
    );
  }
  refreshToken(): void {
    this.oauthService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID).then(
      () => {
        console.log('Token refreshed');
        this.getAccessToken();
      }
    ).catch(err => {
      console.error('Error refreshing token:', err);
    });
  }

  getAccessToken(): void {
    this.oauthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }

  getGoogleCalendarData(): void {
    if (!this.accessToken) return;

    this.httpClient
      .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .subscribe((events) => {
        alert('Look at your console');
        console.log('events', events);
      });
  }
  signInWithGoogle(): void {
    this.oauthService.signIn(GoogleLoginProvider.PROVIDER_ID, {
      scope: 'email profile openid https://www.googleapis.com/auth/calendar'
    }).then(data => {
      console.log('Google sign-in successful:', data);
      this.loggedIn = true;
      this.getAccessToken();
    }).catch(err => {
      console.error('Google sign-in error:', err);
    });
  }

  handleError(error: any): void {
    console.error('Error during Google sign-in:', error);
  }


}
