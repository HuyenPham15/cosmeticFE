import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './employee/update-employee/update-employee.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth.guard';
import { DetailEmployeeComponent } from './employee/detail-employee/detail-employee.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ConfirmRegisterComponent } from './components/confirm-register/confirm-register.component';
import { UserComponent } from './user/user.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './home/profile/profile.component';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckCartComponent } from './check-cart/check-cart.component';
import { PaymentComponent } from './payment/payment.component';
import { FailComponent } from './fail/fail.component';
import { OrderComponent } from './order/order.component';
import { DetailComponent } from './home/detail/detail.component';
import { CategoryComponent } from './home/category/category.component';
import { AdminComponent } from './admin/admin/admin.component';
import { WishlistComponent } from './admin/wishlist/wishlist.component';
import { UpdateDiscountspComponent } from './admin/update-discountsp/update-discountsp.component';
import { QldiscountSpComponent } from './admin/qldiscount-sp/qldiscount-sp.component';
import { DiscountSpComponent } from './admin/discount-sp/discount-sp.component';
import { UpdateDiscountComponent } from './admin/update-discount/update-discount.component';
import { BrandComponent } from './admin/brand/brand.component';
import { EditComponent } from './admin/edit/edit.component';
import { CreateProductComponent } from './admin/create-product/create-product.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { BrandspComponent } from './admin/brandsp/brandsp.component';
import { AsideComponent } from './admin/aside/aside.component';
import { CreateDiscountComponent } from './admin/create-discount/create-discount.component';
import { DiscountComponent } from './admin/discount/discount.component';


export const routes: Routes = [
  { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'create-employee', component: CreateEmployeeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'update-employee/:userID', component: UpdateEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'detail-employee/:userID', component: DetailEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'confirm-register', component: ConfirmRegisterComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userID', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'navbar', component: NavbarComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/:id', component: AdminComponent },
  { path: 'cart', component: CartComponent },
  { path: 'check-carts', component: CheckCartComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent },
  { path: 'pay', component: PaymentComponent },
  { path: 'error', component: FailComponent },
  { path: 'detail/:productId', component: DetailComponent },
  { path: 'category/:categoryID', component: CategoryComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'category/:id', component: CategoryComponent }, // Trang danh mục sản phẩm  
  { path: 'update-discountsp/:id', component: UpdateDiscountspComponent }, // Thêm route cho trang cập nhật mã giảm giá
  { path: 'qldiscount-sp', component: QldiscountSpComponent },
  { path: 'discount-sp', component: DiscountSpComponent },
  { path: 'update-discount/:id', component: UpdateDiscountComponent },
  { path: 'edit', component: EditComponent },  // Route chỉnh sửa mà không có ID sản phẩm
  { path: 'edit/:productID', component: EditComponent },  // Route chỉnh sửa với ID sản phẩm\
  { path: 'create', component: CreateProductComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'detail/:productID', component: DetailComponent },
  { path: 'brand', component: BrandComponent },
  { path: 'brand/:brandId', component: BrandspComponent }, // Định tuyến đến brandsp với tham số brandId
  { path: 'discount', component: DiscountComponent },
  { path: 'aside', component: AsideComponent },  // Component Aside
  { path: 'create-discount', component: CreateDiscountComponent },
];

