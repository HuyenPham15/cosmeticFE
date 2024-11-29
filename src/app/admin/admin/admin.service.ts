import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { Brand } from '../brand/brand';
import { Skintype } from '../skin-type/skin-type';
import { Subcategory } from '../subcategory/subcategory';
import { Productsize } from '../producsize/productsize';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseURL = "http://localhost:8080/api/ad/admin";
  private topBrandsURL = "http://localhost:8080/api/ad/top-brands"; // URL dành cho top brands


  constructor(private httpClient: HttpClient) { }




  getProduct(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}`);
  }

  deleteProduct(productID: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${productID}`, { responseType: 'text' });
  }

  // Hiển thị thông tin sản phẩm ra trang chỉnh sửa
  getProductID(productID: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseURL}/${productID}`);
  }

  // Cập nhật sản phẩm
  updateProduct(productID: string, product: Product): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${productID}`, product);
  }


  // Lấy danh sách thương hiệu
  getBrands(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>('http://localhost:8080/api/ad/brand');
  }

  // Lấy danh sách loại da
  getSkinTypes(): Observable<Skintype[]> {
    return this.httpClient.get<Skintype[]>('http://localhost:8080/api/ad/skin_type');
  }

  // Lấy danh sách danh mục phụ
  getSubcategories(): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>('http://localhost:8080/api/ad/subcategory');
  }

  getProductSize(productID: string): Observable<Productsize[]> {
    return this.httpClient.get<Productsize[]>('http://localhost:8080/api/ad/product_size');
  }


  // Lấy danh sách kích thước sản phẩm theo productID
  getProductSizes(productID: string): Observable<Productsize[]> {
    return this.httpClient.get<Productsize[]>(`${this.baseURL}/product_sizes/${productID}`);
  }


  // Phương thức lấy tất cả sản phẩm theo brandId
  getProductsByBrandId(brandId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/byBrand/${brandId}`);
  }

  private searchUrl = "http://localhost:8080/api/user/search"
  searchProducts(keyword: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.searchUrl}?keyword=${keyword}`);
  }


  private CURL = "http://localhost:8080/api/user/category";
  getProductsByCategory(categoryID: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.CURL}/${categoryID}`);
  }

  private Suburl = "http://localhost:8080/api/user/subcategory"
  getProductsBySubcategory(subcategoryID: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.Suburl}/${subcategoryID}`)
  }


  createProduct(productDTO: any): Observable<any> {

    return this.httpClient.post(this.baseURL, productDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    });
  }
  // Phương thức để lấy danh sách thương hiệu nổi bật
  getFeaturedBrands(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(this.topBrandsURL);
  }

  updateDiscount(productID: string, discountsp_id: string | null): Observable<any> {
    const url = `${this.baseURL}/${productID}/discount`; // URL API
    const payload = { discountsp_id }; // Tạo payload chứa discountsp_id
    return this.httpClient.put(url, payload); // Gửi payload trong body
  }


  removeDiscount(productID: string): Observable<any> {
    const url = `http://localhost:8080/api/ad/admin/${productID}/remove-discount`;
    return this.httpClient.put(url, null); // Không cần payload
  }


}
