
export class Productsize {
    productSizeID: number;        // ID sản phẩm
    quantity: number;             // Số lượng sản phẩm
    price: number;                // Giá sản phẩm
    variant: string;
    constructor(
        productSizeID: number = 0,
        quantity: number = 0,
        price: number = 0,
        variant: string = '',
    ) {
        this.productSizeID = productSizeID;
        this.quantity = quantity;
        this.price = price;
        this.variant = variant;
    }
}
