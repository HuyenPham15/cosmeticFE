import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Address } from '../../ts/Address';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { GhnService } from '../../services/ghn.service';
import { Router } from '@angular/router';
import { Users } from '../../ts/Users';
import { UserService } from '../../services/user.service';
import { Order } from '../../ts/Order';
import { NavbarClientComponent } from "../../navbar-client/navbar-client.component";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NavbarClientComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userID!: number;
  user: Users = new Users();
  isEditing = false;
  selectedFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = null;
  changePasswordForm: FormGroup;
  showPassword: boolean = false;
  role: string | null = null;
  currentUser!: string; // userID của người dùng đang đăng nhập
  password: string | null = null;
  isChangingPassword: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  orders: Order[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: any;
  selectedDistrict: any;
  selectedWard: any;
  constructor(

    private userService: UserService,
    private fb: FormBuilder,
    private ghn: GhnService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }
  ngOnInit() {
    const userIDFromStorage = localStorage.getItem('userID');
    if (userIDFromStorage) {
      this.userID = parseInt(userIDFromStorage, 10);
      if (isNaN(this.userID) || this.userID <= 0) {
        console.error('ID người dùng không hợp lệ:', userIDFromStorage);
        alert('ID người dùng không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }
    } else {
      console.error('Không tìm thấy ID người dùng trong localStorage.');
      alert('Vui lòng đăng nhập để tiếp tục.');
      return;
    }

    this.role = localStorage.getItem('role') || '';
    const emailFromStorage = localStorage.getItem('email');
    this.currentUser = emailFromStorage ?? '';
    this.password = localStorage.getItem('password');

    console.log('Bạn đang là:', this.role);
    console.log('ID người dùng hiện tại:', this.userID);
    this.loadUser(this.userID);

  }
  loadUser(userID: number) {
    this.userService.getUserById(userID).subscribe(
      data => {
        this.user = data;
        if (!this.user.addresses || this.user.addresses.length === 0) {
          this.user.addresses = [new Address()];
        }

        const addr = this.user.addresses[0];
        this.selectedProvince = addr.city;
        this.selectedDistrict = addr.district;
        this.selectedWard = addr.ward;

        this.loadProvinces().then(() => {
          this.loadDistrictsForSelectedProvince(addr)
        });
      },
      error => {
        console.error('Error loading User:', error);
        alert('Không thể tải thông tin nhân viên.');
      }
    );
  }

  loadProvinces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ghn.getProvinces().subscribe(
        data => {
          this.provinces = data.data;
          console.log("Provinces: ", this.provinces)
          resolve();
        },
        error => {
          console.error('Error loading provinces', error);
          reject(error); // Gọi reject khi xảy ra lỗi
        }
      );
    });
  }

  onProvinceChange(addr: any): void {
    const selectedProvince = this.provinces.find(pro => pro.ProvinceName === addr.city);
    if (selectedProvince) {
      this.ghn.getDistricts(selectedProvince.ProvinceID).subscribe(
        response => {
          if (response && response.data) {
            this.districts = response.data;
            addr.district = null;
            console.log("Danh sách Huyện:", this.districts);
          }
        },
        error => {
          console.error('Lỗi khi tải quận/huyện', error);
        }
      );
    } else {
      console.warn('Tỉnh không tồn tại trong danh sách tỉnh đã tải.');
    }
  }

  loadDistrictsForSelectedProvince(addr: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedProvince = this.provinces.find(pro => pro.ProvinceName === addr.city);
      if (selectedProvince) {
        this.ghn.getDistricts(selectedProvince.ProvinceID).subscribe(
          data => {
            this.districts = data.data;
            console.log("Districts: ", this.districts)

            if (addr.district) {
              this.selectedDistrict = addr.district;
            } else {
              this.selectedDistrict = null;
            }
            this.loadWardsForSelectedDistrict(addr).then(() => {
              resolve();
            });
          },
          error => {
            console.error('Error loading districts', error);
            reject(error);
          }
        );
      } else {
        reject('Không tìm thấy tỉnh.');
      }
    });
  }

  loadWardsForSelectedDistrict(addr: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedDistrict = this.districts.find(dis => dis.DistrictName === addr.district);
      if (selectedDistrict) {
        this.ghn.getWards(selectedDistrict.DistrictID).subscribe(
          data => {
            this.wards = data.data; // Cập nhật danh sách xã/phường
            console.log("Danh sách xã/phường:", this.wards);

            if (addr.ward) {
              this.selectedWard = addr.ward;
              console.log("Phường:", addr.ward)
            } else {
              this.selectedWard = null;
            }
            resolve(); // Gọi resolve khi hoàn tất
          },
          error => {
            console.error('Error loading wards', error);
            reject(error); // Gọi reject khi có lỗi
          }
        );
      } else {
        console.warn('Huyện không tồn tại trong danh sách huyện đã tải.');
        reject('Huyện không tồn tại.');
      }
    });
  }

  onDistrictChange(addr: any): void {
    const selectedDistrict = this.districts.find(dis => dis.DistrictName === addr.district);
    if (selectedDistrict) {
      this.ghn.getWards(selectedDistrict.DistrictID).subscribe(
        data => {
          this.wards = data.data;
        },
        error => {
          console.error('Error loading wards', error);
        }
      );
    }
  }
  saveChange(): void {
    const formData = new FormData();
    const UserData = new Blob([JSON.stringify(this.user)], { type: 'application/json' });
    formData.append('User', UserData);
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.userService.updateUser(this.userID, formData).subscribe(
      data => {
        console.log('User information updated successfully:', data);
        alert('Thông tin nhân viên đã được cập nhật thành công.');
      },
      error => {
        console.error('Error updating User:', error);
        alert('Có lỗi xảy ra trong quá trình cập nhật thông tin. Vui lòng thử lại.');
      }
    );
  }
  loadOrders(): void {
    this.userService.getOrdersByUserId(this.userID).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải đơn hàng:', err);
      }
    });
  }
}
