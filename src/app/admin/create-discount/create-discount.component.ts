import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive Forms
import { Router } from '@angular/router';
import { DiscountService } from '../discount/discount.service'; // Import DiscountService
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component'; // Import AsideComponent
import { FormsModule } from '@angular/forms'; // Import FormsModule để sử dụng [(ngModel)]
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule

@Component({
  selector: 'app-create-discount',
  standalone: true,  // Thêm standalone: true
  imports: [CommonModule, AsideComponent, FormsModule, NgxPaginationModule],
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent implements OnInit {
  discount = {
    discountCode: '',
    description: '',
    discountType: '%', // Mặc định là phần trăm
    amount: 0,
    startDate: '',
    endDate: '',
    active: true, // Mặc định là hoạt động
    maxUsage: 0
  };

  today: string = '';  // Khai báo thuộc tính today để lưu ngày hiện tại
  discountForm: FormGroup; // Khai báo FormGroup cho Discount
  isSubmitted: boolean = false; // Biến theo dõi trạng thái form đã được gửi hay chưa

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService, // Inject service tạo Discount
    private router: Router
  ) {
    // Tạo form với các trường cần thiết cho Discount
    this.discountForm = this.fb.group({
      discountCode: ['', Validators.required],
      description: ['', Validators.required],
      discountType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      active: [true, Validators.required],
      maxUsage: [0, [Validators.required, Validators.min(0)]],
      brandID: [null, Validators.required], // Liên kết với thương hiệu
    });
  }

  ngOnInit(): void {
    // Khởi tạo giá trị today là ngày hiện tại với định dạng yyyy-MM-dd
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // Định dạng yyyy-MM-dd
    this.discount.startDate = this.today;  // Đặt giá trị mặc định cho ngày bắt đầu
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // Kiểm tra giá trị phần trăm nếu loại khuyến mãi là phần trăm
    if (this.discount.discountType === '%' && this.discount.amount > 100) {
      alert('Giá trị phần trăm không được vượt quá 100%.');
      return;
    }

    // Kiểm tra ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00 để chỉ so sánh ngày

    const startDate = new Date(this.discount.startDate);
    const endDate = new Date(this.discount.endDate);

    // Kiểm tra nếu ngày bắt đầu nằm trong quá khứ
    if (startDate < today) {
      alert('Ngày bắt đầu không thể là ngày trong quá khứ.');
      return;
    }

    // Kiểm tra nếu ngày kết thúc trước ngày bắt đầu
    if (endDate < startDate) {
      alert('Ngày kết thúc không thể trước ngày bắt đầu.');
      return;
    }

    // Tiếp tục xử lý logic nếu ngày hợp lệ
    const discountDTO = {
      discountID: '', // Nếu discount_id do server tạo, để trống hoặc giá trị mặc định
      discountCode: this.discount.discountCode,
      description: this.discount.description,
      discountType: this.discount.discountType,
      amount: this.discount.amount,
      startDate: startDate,
      endDate: endDate,
      active: this.discount.active,
      maxUsage: this.discount.maxUsage,
      usageCount: 0 // Đặt mặc định là 0 nếu là discount mới
    };

    // Gọi API qua DiscountService để tạo mới khuyến mãi
    this.discountService.createDiscount(discountDTO).subscribe({
      next: (response) => {
        alert('Khuyến mãi đã được tạo thành công!');
        this.router.navigate(['/discounts']); // Điều hướng về trang danh sách khuyến mãi
      },
      error: (error) => {
        console.error('Error creating discount:', error);
        alert('Đã xảy ra lỗi khi tạo khuyến mãi. Vui lòng thử lại.');
      }
    });
  }


}
