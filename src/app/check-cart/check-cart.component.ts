import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../ts/cartItem';
import { CartService } from '../services/cart.service';
import { GhnService } from '../services/ghn.service';
import { Product } from '../ts/product';
import { Address } from '../ts/Address';
import { ProductService } from '../services/product.service';
import { EmployeeService } from '../services/employee.service';
import { OrderService } from '../services/order.service';
import { Order } from '../ts/Order';
import { PaymentService } from '../services/payment.service';
import { TransactionService } from '../services/transaction.service';
import { Users } from '../ts/Users';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscountServiceService } from '../discount-service.service';
import { Discount } from '../ts/Discount';

@Component({
  selector: 'app-check-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-cart.component.html',
  styleUrls: ['./check-cart.component.scss']
})
export class CheckCartComponent implements OnInit {
  orderID: string = '';
  amount: number = 0;
  userID!: number;
  selectedItems: CartItem[] = [];
  userInfo: Users = new Users();
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
  order: Order[] = [];
  selectedPaymentMethod: number = 1;
  deliveryDate: Date | null = null;
  discounts: Discount[] = [];  // Danh sách các discount còn hạn
  errorMessage = '';
  selectedDiscountCode: string | null = null;
  discountId: string | null = null;
  constructor(
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ghnService: GhnService,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private payment: PaymentService,
    private transactionService: TransactionService,
    private webSocketService: WebsocketService,
    private httpClient: HttpClient,
    private discountService: DiscountServiceService) { }

  ngOnInit(): void {
    this.loadSelectedItems();
    this.loadProducts()
      .then(() => this.processSelectedItems())
      .catch(error => console.error('Error processing selected items:', error));
    this.loadUserInfo(this.userID);
    this.loadValidDiscounts();
  }

  loadSelectedItems() {
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
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedItems: CartItem[] };
    if (state?.selectedItems) {
      this.selectedItems = state.selectedItems;
    } else {
      const storedItems = localStorage.getItem('selectedItems');
      this.selectedItems = storedItems ? JSON.parse(storedItems) : [];
    }
  }

  calculateTotalPrice(shippingFee: number, discountAmount: number): number {
    const total = this.selectedItems.reduce((acc, item) => {
      const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      return acc + (price * item.quantity);
    }, 0);
    const hasInsurance = this.selectedItems.some(item => item.insuranceSelected);
    const insuranceFee = hasInsurance ? 1300 : 0;
    let finalDiscountAmount = discountAmount || 0;
    return total + insuranceFee + shippingFee - finalDiscountAmount;
  }

  applyDiscount(): void {
    if (this.selectedDiscountCode) {
      const selectedDiscount = this.discounts.find(discount => discount.discountCode === this.selectedDiscountCode);

      if (selectedDiscount) {
        if (this.selectedDiscountCode === 'FREESHIP') {
          this.shippingFee = 0; // Trừ phí vận chuyển
          this.discountAmount = 0; // Không áp dụng giảm giá trực tiếp
          this.discountId = selectedDiscount.discountId; // Gửi discountId tới backend
        } else {
          this.discountAmount = selectedDiscount.amount; // Giảm giá thông thường
          this.discountId = selectedDiscount.discountId; // Gửi discountId tới backend
        }
      } else {
        console.error('Mã giảm giá không tồn tại');
        alert('Mã giảm giá không tồn tại');
        this.discountAmount = 0;
        this.discountId = null;
      }
    } else {
      this.discountAmount = 0;
      this.discountId = null;
    }
  }

  loadProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getAllProducts().subscribe(
        data => {
          this.products = data;
          console.log('Available Products:', this.products); // Kiểm tra danh sách sản phẩm đã tải
          resolve();
        },
        error => {
          console.error('Error loading products:', error);
          reject(error);
        }
      );
    });
  }

  processSelectedItems() {
    const selectedItem = this.selectedItems[0];
    if (!selectedItem) return;

    const product = this.products.find(prod => prod.productId === selectedItem.productId);
    if (!product) {
      console.warn('Không tìm thấy sản phẩm cho productId:', selectedItem.productId);
    } else {
      console.log('Sản phẩm tìm thấy:', product);
    }
  }
  toggleShippingForm() {
    this.showShippingForm = !this.showShippingForm; // Đảo ngược giá trị của biến
  }
  countUniqueProducts(): number {
    const uniqueProductIds = new Set(this.selectedItems.map(item => item.productId));
    return uniqueProductIds.size; // Vẫn trả về kiểu số
  }

  loadUserInfo(userID: number) {
    this.userService.getUserById(userID).subscribe(
      data => {
        this.userInfo = data;

        // Kiểm tra userInfo và addresses
        if (!this.userInfo || !this.userInfo.addresses || this.userInfo.addresses.length === 0) {
          this.userInfo.addresses = [new Address()];
        }

        this.userAddresses = this.userInfo.addresses; // Gán mảng địa chỉ vào biến userAddresses

        const addr = this.userInfo.addresses[0]; // Lấy địa chỉ đầu tiên
        this.selectedProvince = addr.city;
        this.selectedDistrict = addr.district;
        this.selectedWard = addr.ward;

        // Tải thông tin địa lý
        this.loadProvinces()
          .then(() => this.loadDistrictsForSelectedProvince(addr))
          .then(() => this.loadWardsForSelectedDistrict(addr))
          .then(() => {
            // Gọi tính phí vận chuyển và thời gian giao hàng dự kiến
            this.selectedItems.forEach(product => {
              this.calculateShippingFee(addr, product);
            });
            this.calculateLeadTime(addr); // Gọi tính thời gian giao hàng dự kiến
          })
          .catch(error => {
            console.error('Lỗi khi tải thông tin địa lý:', error);
            alert('Có lỗi xảy ra khi tải thông tin địa lý. Vui lòng thử lại.');
          });
      },
      error => {
        console.error('Lỗi khi tải nhân viên:', error);
        alert('Không thể tải thông tin nhân viên. Vui lòng kiểm tra lại thông tin.');
      }
    );
  }
  calculateShippingFee(addr: Address, product: CartItem) {
    const missingInfo = [];
    const weightString = product.weight.replace(/g$/, '').trim();
    const weight = parseFloat(weightString);

    if (isNaN(weight) || weight <= 0 || weight > 3000) {
      console.warn(`Trọng lượng sản phẩm không hợp lệ: ${weight}`);
      return;
    }


    if (!addr.city) missingInfo.push('thành phố');
    if (!addr.district) missingInfo.push('quận/huyện');
    if (!addr.ward) missingInfo.push('phường/xã');

    if (missingInfo.length > 0) {
      console.warn(`Không thể tính phí giao hàng do thiếu thông tin: ${missingInfo.join(', ')}`);
      return;
    }

    const selectedDistrict = this.districts.find(dis => dis.DistrictName === addr.district);
    if (!selectedDistrict) {
      console.warn(`Không tìm thấy ID cho quận: ${addr.district}`);
      return;
    }

    const selectedWard = this.wards.find(ward => ward.WardName === addr.ward);
    if (!selectedWard) {
      console.warn(`Không tìm thấy ID cho phường: ${addr.ward}`);
      return;
    }

    const requestData = {
      service_type_id: 2,
      insurance_value: 0,
      coupon: null,
      from_district_id: 1454,
      to_district_id: selectedDistrict.DistrictID,
      to_ward_code: selectedWard.WardCode,
      weight: weight,
      height: 10,
      length: 10,
      width: 10
    };

    console.log('Request Data:', requestData);
    this.ghnService.getShippingFee(requestData).subscribe(
      fee => {
        console.log(`Phí vận chuyển là ${fee.data.total} VND`);
        this.shippingFee = fee.data.total;
      },
      error => {
        console.error('Lỗi khi tính phí giao hàng:', error);
        if (error.status === 400) {
          console.warn('Kiểm tra lại thông tin địa chỉ và trọng lượng gửi đi.');
          if (error.error) {
            console.error('Chi tiết lỗi:', error.error);
          }
        } else {
          console.error('Lỗi không xác định:', error);
        }
      }
    );
  }

  calculateLeadTime(addr: Address) {
    const selectedDistrict = this.districts.find(dis => dis.DistrictName === addr.district);
    if (!selectedDistrict) {
      console.warn(`Không tìm thấy ID cho quận: ${addr.district}`);
      return;
    }

    const selectedWard = this.wards.find(ward => ward.WardName === addr.ward);
    if (!selectedWard) {
      console.warn(`Không tìm thấy ID cho phường: ${addr.ward}`);
      return;
    }

    const requestBody = {
      from_district_id: 1454, // ID quận gửi
      from_ward_code: "21211", // Mã phường gửi
      to_district_id: selectedDistrict.DistrictID, // ID quận nhận
      to_ward_code: selectedWard.WardCode, // Mã phường nhận
      service_id: 53321 // ID dịch vụ
    };

    this.ghnService.calculateLeadTime(requestBody).subscribe(
      response => {
        if (response && response.data) {
          const leadTimeEpoch = response.data.leadtime * 1000; // Chuyển leadtime từ giây thành milliseconds
          this.deliveryDate = new Date(leadTimeEpoch); // Lưu ngày giao hàng dự kiến vào deliveryDate
        } else {
        }
      },
      error => {
        console.error("Lỗi khi tính toán thời gian giao hàng:", error);
      }
    );
  }

  loadProvinces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ghnService.getProvinces().subscribe(
        data => {
          this.provinces = data.data;
          console.log("Provinces: ", this.provinces);
          resolve();
        },
        error => {
          console.error('Error loading provinces', error);
          reject(error); // Gọi reject khi xảy ra lỗi
        }
      );
    });
  }

  loadDistrictsForSelectedProvince(addr: Address): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedProvince = this.provinces.find(province => province.ProvinceName === addr.city);
      if (!selectedProvince) {
        console.warn(`Không tìm thấy tỉnh: ${addr.city}`);
        reject(new Error(`Province not found: ${addr.city}`));
        return;
      }

      this.ghnService.getDistricts(selectedProvince.ProvinceID).subscribe(
        data => {
          this.districts = data.data;
          console.log("Districts: ", this.districts);
          this.selectedDistrict = this.districts.find(district => district.DistrictName === addr.district) || null; // Lưu trữ quận đã chọn
          resolve();
        },
        error => {
          console.error('Error loading districts', error);
          reject(error);
        }
      );
    });
  }

  loadWardsForSelectedDistrict(addr: Address): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedDistrict = this.districts.find(district => district.DistrictName === addr.district);
      if (!selectedDistrict) {
        console.warn(`Không tìm thấy quận: ${addr.district}`);
        reject(new Error(`District not found: ${addr.district}`));
        return;
      }

      this.ghnService.getWards(selectedDistrict.DistrictID).subscribe(
        data => {
          this.wards = data.data;
          console.log("Wards: ", this.wards);
          this.selectedWard = this.wards.find(ward => ward.WardName === addr.ward) || null; // Lưu trữ phường đã chọn
          resolve();
        },
        error => {
          console.error('Error loading wards', error);
          reject(error);
        }
      );
    });
  }
  onPaymentMethodChange() {

    if (this.selectedPaymentMethod === 2) {
    }
  }
  createOrder() {
    const orderData = {
      userId: this.userID,
      paymentMethod: this.selectedPaymentMethod,
      shippingAddress: this.userAddresses?.[0]?.specificAddress || '',
      shippingFee: this.shippingFee,
      discountId: this.selectedDiscountCode ? this.selectedDiscountCode : null,
      orderDetails: this.selectedItems.map(item => ({
        productSizeID: item.productSizeId,
        quantity: item.quantity,
        price: item.price,
      })),
      status: 'Chờ xác nhận'
    };

    this.orderService.createOrder(orderData).subscribe(
      (response: any) => {
        console.log('Response:', response);
        const savedOrders = response.orders;
        const paymentUrl = response.paymentUrl;

        if (savedOrders && savedOrders.length > 0) {
          this.selectedItems.forEach(item => {
            const cartId = item.cartId ?? -1;
            if (cartId !== -1) {
              this.cartService.removeCartItem(cartId).subscribe({
                next: (removeResponse: any) => {
                  console.log(`Item with ID ${cartId} removed from cart.`);
                },
                error: (err: any) => {
                  console.error('Error removing item:', err);
                }
              });
            } else {
              console.error('Invalid cartId for item:', item);
            }
          });

          if (this.selectedPaymentMethod === 2 && paymentUrl) {
            console.log('Redirecting to payment URL:', paymentUrl);
            window.location.href = paymentUrl;
          } else if (this.selectedPaymentMethod === 1) {
            alert('Order created successfully with COD payment!');
          }
          this.router.navigate(['/pay']);
        } else {
          alert('Could not retrieve orderID. Please check.');
        }
      },
      error => {
        console.error('Error creating order:', error);
        alert('Could not create order. Please check the details.');
      }
    );
  }


  loadValidDiscounts(): void {
    this.discountService.getDiscounts().subscribe(
      (discounts) => {
        this.discounts = discounts;
      },
      (error) => {
        this.errorMessage = 'Không thể tải danh sách giảm giá.';
        console.error('Error fetching discounts:', error);
      }
    );
  }
  isValidDiscount(discount: Discount): boolean {
    const currentDate = new Date();
    return discount.startDate <= currentDate && discount.endDate >= currentDate && discount.isActive;
  }

}

