import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { DiscountSpService } from './discount-sp.service'; // Import DiscountSpService
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule để sử dụng [(ngModel)]
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
import { Discount_sp } from './discount-sp'; // Import lớp Discount_sp



@Component({
  selector: 'app-discount-sp',
  standalone: true,
  imports: [CommonModule, AsideComponent, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './discount-sp.component.html',
  styleUrls: ['./discount-sp.component.scss']
})
export class DiscountSpComponent implements OnInit {
  discountForm: FormGroup;
  today: string = '';  // Khai báo thuộc tính today để lưu ngày hiện tại

  constructor(
    private fb: FormBuilder,
    private discountSpService: DiscountSpService // Inject DiscountSpService để làm việc với API
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
    // Định dạng ngày hiện tại thành yyyy-MM-dd
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd
    this.discountForm.patchValue({ start_date: this.today }); // Đặt giá trị mặc định cho ngày bắt đầu
  }

  // Chức năng thêm mới `discount_sp`
  createDiscount(): void {
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
  
      // Tạo một đối tượng mới từ form
      const newDiscount: Discount_sp = {
        ...this.discountForm.value,
        discountsp_id: this.generateRandomId() // Backend có thể ghi đè giá trị này nếu cần
      };
  
      // Gọi API thông qua service để thêm mới discount
      this.discountSpService.createDiscount_sp(newDiscount).subscribe({
        next: (response) => {
          alert('Khuyến mãi đã được tạo thành công!');
          this.discountForm.reset(); // Xóa dữ liệu trong form sau khi tạo thành công
          this.discountForm.patchValue({ status: true }); // Đặt giá trị mặc định cho trạng thái
        },
        error: (error) => {
          console.error('Lỗi khi tạo mới khuyến mãi:', error);
          alert('Đã xảy ra lỗi khi tạo mới khuyến mãi. Vui lòng thử lại.');
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
  

// Hàm tạo ID ngẫu nhiên 8 chữ số
generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

}
