import { Productsize } from "../producsize/productsize";

export class Product {
    productId: string;
    productName: string;
    images: string | string[];
    description: string;
    specifications: string;
    ingredients: string;
    benefits: string;
    usage: string;
    review: string;
    skinID: string;
    skinName: string;
    brandId: string;
    brandName: string;
    categoryName: string;
    subcategoryName: string;
    variant: string;
    price: number;
    quantity: number;
    subcategoryID: string;
    productSizeID: number;
    discountsp_id: string;

    // Thêm thuộc tính productSizes để lưu trữ các kích thước sản phẩm
    productSizes: Productsize[]; // Đổi tên thuộc tính sizes thành productSizes

    constructor(
        productId: string = '',
        productName: string = '',
        images: string = '',
        description: string = '',
        specifications: string = '',
        ingredients: string = '',
        benefits: string = '',
        usage: string = '',
        review: string = '',
        skinID: string = '',
        skinName: string = '',
        brandId: string = '',
        brandName: string = '',
        categoryName: string = '',
        subcategoryName: string = '',
        subcategoryID: string = '',
        variant: string = '',
        price: number = 0,
        quantity: number = 0,
        productSizeID: number = 0,
        discountsp_id: string = '',
        productSizes: Productsize[] = []
    ) {
        this.productId = productId;
        this.productName = productName;
        this.images = images;
        this.description = description;
        this.specifications = specifications;
        this.ingredients = ingredients;
        this.benefits = benefits;
        this.usage = usage;
        this.review = review;
        this.skinID = skinID;
        this.skinName = skinName;
        this.brandId = brandId;
        this.brandName = brandName;
        this.categoryName = categoryName;
        this.subcategoryName = subcategoryName;
        this.subcategoryID = subcategoryID;
        this.variant = variant;
        this.price = price;
        this.quantity = quantity;
        this.productSizeID = productSizeID;
        this.discountsp_id = discountsp_id;
        this.productSizes = productSizes; // Gán giá trị cho productSizes
    }

    firstImage?: string;
}
