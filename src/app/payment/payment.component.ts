import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckCartComponent } from '../check-cart/check-cart.component';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Address } from '../ts/Address';
import { CartItem } from '../ts/cartItem';
import { GhnService } from '../services/ghn.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  orderId: string | null = null;
  totalPrice: string | null = null;
  paymentTime: string | null = null;
  transactionId: string | null = null;
  paymentStatus: string = 'failed'; // Mặc định là thất bại

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Lấy tham số từ URL
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.totalPrice = params['totalPrice'];
      this.paymentTime = params['paymentTime'];
      this.transactionId = params['transactionId'];
      this.paymentStatus = params['status']; // Lấy trạng thái thanh toán từ URL
    });
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
}
