import { Productsize } from "../producsize/productsize";

export class Detail {
    productID: string;
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
    brandID: string;
    brandName: string;
    categoryName: string;
    subcategoryName: string;
    variant: string;
    price: number;
    quantity: number;
    subcategoryID: string;
    productSizeID: number;

    // Thêm thuộc tính productSizes để lưu trữ các kích thước sản phẩm
    productSizes: Productsize[] = []; // Initialize as empty array

    constructor(
        productID: string = '',
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
        brandID: string = '',
        brandName: string = '',
        categoryName: string = '',
        subcategoryName: string = '',
        subcategoryID: string = '',
        variant: string = '',
        price: number = 0,
        quantity: number = 0,
        productSizeID: number = 0,
        productSizes: Productsize[] = [] // Thêm tham số productSizes cho constructor
    ) {
        this.productID = productID;
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
        this.brandID = brandID;
        this.brandName = brandName;
        this.categoryName = categoryName;
        this.subcategoryName = subcategoryName;
        this.subcategoryID = subcategoryID;
        this.variant = variant;
        this.price = price;
        this.quantity = quantity;
        this.productSizeID = productSizeID;
        this.productSizes = productSizes; // Gán giá trị cho productSizes
    }

    firstImage?: string;
}
