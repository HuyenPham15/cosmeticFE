import { Component, OnInit } from '@angular/core';
import { Order } from '../ts/Order';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { Status } from '../ts/Status';
import { Address } from '../ts/Address';
import { Product } from '../ts/product';
import { Users } from '../ts/Users';
import { UserService } from '../services/user.service';
import { GhnService } from '../services/ghn.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  statuses: any[] = [];
  activeTab: number = 0;
  ordersByStatus: { [key: number]: any[] } = {};
  statusId: number = 0;
  orders: Order[] = [];

  userInfo: Users = new Users();
  orderID: string = '';
  amount: number = 0;
  userID!: number;
  showShippingForm: boolean = false;
  totalSelectedItems = 0;
  shippingFee: number = 0;
  userAddresses: Address[] = [];
  discountAmount = 0;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: any;
  selectedDistrict: any;
  specificAddress: any;
  selectedWard: any;
  products: Product[] = [];
  selectedPaymentMethod: number = 1;
  deliveryDate: Date | null = null;
  errorMessage = '';
  selectedDiscountCode: string | null = null;
  discountId: string | null = null;
  constructor(private orderService: OrderService, private userService: UserService, private ghnService: GhnService) { }

  ngOnInit(): void {
    this.loadStatuses();
    this.setActiveTab(this.activeTab);
  }

  loadStatuses(): void {
    this.orderService.getStatuses().subscribe(
      (statuses) => {
        this.statuses = statuses;
        if (this.statuses.length > 0) {
          this.setActiveTab(this.statuses[0].id);
        }
      },
      (error) => {
        console.error('Lỗi khi tải trạng thái:', error);
      }
    );
  }
  setActiveTab(statusId: number): void {
    if (statusId !== undefined) {
      this.activeTab = statusId;
      this.loadOrdersByStatus(statusId);
    }
  }
  loadOrdersByStatus(statusId: number): void {
    this.orderService.getOrdersByStatus(statusId).subscribe(
      (orders) => {
        console.log('Orders with user data:', orders);  // Kiểm tra dữ liệu trả về từ API
        this.ordersByStatus[statusId] = orders;
        this.orders = orders;  // Lưu trữ dữ liệu vào biến orders
      },
      (error) => {
        console.error('Lỗi khi tải đơn hàng:', error);
      }
    );
  }

  confirmOrder(orderId: string): void {
    const statusId = 2;
    // Truyền statusId như một đối tượng
    this.orderService.updateOrderStatus(orderId, { status: statusId }).subscribe({
      next: () => {
        alert('Xác nhận đơn hàng thành công!');
        this.loadOrdersByStatus(this.activeTab);
      },
      error: (error) => {
        console.error('Lỗi khi xác nhận đơn hàng:', error);
        alert(error.error || `Không thể xác nhận đơn hàng! Lỗi: ${error.message}`);
      }
    });
  }
  updateOrderStatus(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const statusId = Number(selectElement.value);
    if (isNaN(statusId) || statusId <= 1) {
      alert('Trạng thái không hợp lệ');
      return;
    }
    console.log('orderId:', this.orderID); // Kiểm tra console để xác nhận giá trị của orderId

    // Gọi service để cập nhật trạng thái đơn hàng
    this.orderService.updateOrderStatus(orderId, { status: statusId }).subscribe({
      next: () => {
        alert('Cập nhật trạng thái đơn hàng thành công!');
        this.loadOrdersByStatus(this.activeTab);
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        alert(error.error || `Không thể cập nhật trạng thái đơn hàng! Lỗi: ${error.message}`);
      }
    });
  }

}
