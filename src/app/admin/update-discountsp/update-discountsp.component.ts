import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountSpService } from '../discount-sp/discount-sp.service';
import { Discount_sp } from '../discount-sp/discount-sp';
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule để sử dụng [(ngModel)]
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
@Component({
  selector: 'app-update-discountsp',
  standalone: true,
  imports: [CommonModule, AsideComponent, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './update-discountsp.component.html',
  styleUrls: ['./update-discountsp.component.scss'] // Sửa lại từ styleUrl thành styleUrls
})
export class UpdateDiscountspComponent implements OnInit {
  discountForm: FormGroup;
  discountId: string = '';

  constructor(
    private fb: FormBuilder,
    private discountSpService: DiscountSpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Tạo form với FormBuilder và định nghĩa các trường
    this.discountForm = this.fb.group({
      discount_sp: ['', [Validators.required, Validators.min(0)]], // Giá trị khuyến mãi, yêu cầu phải >= 0
      start_date: ['', Validators.required], // Ngày bắt đầu, yêu cầu không để trống
      end_date: ['', Validators.required], // Ngày kết thúc, yêu cầu không để trống
      status: [true, Validators.required] // Trạng thái khuyến mãi, mặc định là true
    });
  }

  ngOnInit(): void {
    // Lấy ID từ URL
    this.discountId = this.route.snapshot.paramMap.get('id') ?? '';

    // Gọi API để lấy thông tin discount theo ID và điền vào form
    if (this.discountId) {
      this.discountSpService.getDiscountById(this.discountId).subscribe({
        next: (data) => {
          this.discountForm.patchValue(data); // Đặt giá trị từ API vào form
        },
        error: (err) => {
          console.error('Lỗi khi lấy thông tin khuyến mãi:', err);
          alert('Đã xảy ra lỗi khi lấy thông tin khuyến mãi.');
        }
      });
    }
  }

  // Tải thông tin discount từ server
  loadDiscountData(id: string): void {
    this.discountSpService.getDiscountById(id).subscribe({
      next: (discount) => {
        this.discountForm.patchValue({
          discount_sp: discount.discount_sp,
          start_date: discount.start_date,
          end_date: discount.end_date,
          status: discount.status
        });
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin khuyến mãi:', err);
        alert('Không thể tải thông tin khuyến mãi. Vui lòng thử lại sau.');
      }
    });
  }

  // Cập nhật discount
  // Cập nhật discount
  updateDiscount(): void {
    if (this.discountForm.valid) {
      // Lấy giá trị ngày bắt đầu và ngày kết thúc từ form
      const startDate = new Date(this.discountForm.get('start_date')?.value);
      const endDate = new Date(this.discountForm.get('end_date')?.value);

      // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
      if (endDate < startDate) {
        alert('Ngày kết thúc không thể trước ngày bắt đầu. Vui lòng nhập lại.');
        return;
      }

      // Lấy giá trị discount_sp từ form
      const discountValue = this.discountForm.get('discount_sp')?.value;

      // Kiểm tra giá trị discount_sp không được lớn hơn 100
      if (discountValue > 100) {
        alert('Giá trị giảm giá không được lớn hơn 100%. Vui lòng nhập lại.');
        return;
      }

      // Tạo đối tượng discount_sp từ form
      const updatedDiscount: Discount_sp = {
        ...this.discountForm.value,
        discountsp_id: this.discountId // Thêm ID để cập nhật
      };

      // Gọi service để cập nhật discount
      this.discountSpService.updateDiscount_sp(this.discountId, updatedDiscount).subscribe({
        next: () => {
          alert('Khuyến mãi đã được cập nhật thành công!');
          this.router.navigate(['/qldiscount-sp']); // Điều hướng về trang danh sách khuyến mãi sau khi cập nhật thành công
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật khuyến mãi:', err);
          alert('Đã xảy ra lỗi khi cập nhật khuyến mãi. Vui lòng thử lại.');
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }


}
