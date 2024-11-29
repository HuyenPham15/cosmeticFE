import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountService } from '../discount/discount.service';
import { Discount } from '../discount/discount';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule để sử dụng [(ngModel)]
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
@Component({
  selector: 'app-update-discount',
  standalone: true,  // Thêm standalone: true
  imports: [CommonModule, AsideComponent, FormsModule, NgxPaginationModule],
  templateUrl: './update-discount.component.html',
  styleUrls: ['./update-discount.component.scss']
})
export class UpdateDiscountComponent implements OnInit {
  discountID!: string;
  discountForm: FormGroup;
  discount!: Discount;

  constructor(
    private route: ActivatedRoute,
    private discountService: DiscountService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.discountForm = this.fb.group({
      discountCode: ['', Validators.required],
      description: ['', Validators.required],
      discountType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      active: [true, Validators.required],
      maxUsage: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.discountID = this.route.snapshot.paramMap.get('id') || '';
    this.discountService.getDiscountById(this.discountID).subscribe(
      (data) => {
        this.discount = data;
        this.discountForm.patchValue(this.discount); // Gán dữ liệu vào form
        console.log('Discount data:', this.discount); // Kiểm tra dữ liệu trả về

      },
      (error) => {
        console.error('Error fetching discount details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.discount.discountType === '%' && this.discount.amount > 100) {
      alert('Giá trị phần trăm không được vượt quá 100%.');
      return;
    }


    const startDate = new Date(this.discount.startDate);
    const endDate = new Date(this.discount.endDate);
    const today = new Date();

    // Đặt thời gian về 00:00:00 để chỉ so sánh ngày
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

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

    // Thực hiện gọi API cập nhật discount
    this.discountService.updateDiscount(this.discount.discountID, this.discount).subscribe({
      next: (response) => {
        alert('Khuyến mãi đã được cập nhật thành công!');
        this.router.navigate(['/discount']);
      },
      error: (error) => {
        console.error('Đã xảy ra lỗi khi cập nhật khuyến mãi:', error);
        alert('Đã xảy ra lỗi khi cập nhật khuyến mãi. Vui lòng thử lại.');
      }
    });
  }




}
