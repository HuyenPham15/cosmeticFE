import { OrderDetail } from "./OrderDetail";
import { UserPoint } from "./Userpoint";
import { Transaction } from "./Transactions";
import { Discount } from "./Discount";
import { Status } from "./Status";
import { Users } from "./Users";

export class Order {
    orderID?: string;
    orderDate?: Date;
    paymentMethod: string;
    shippingAddress: string;
    shippingFee: number;
    createAt?: Date;
    updateAt?: Date;
    userPoint?: number;
    totalPrice?: number;
    userId?: number;
    firstName?: string;
    lastName?: string;
    orderDetails: OrderDetail[];
    point?: UserPoint[];
    transaction?: Transaction[];
    discount?: Discount[];
    status?: Status[];
    user?: Users[];
    constructor(
        paymentMethod: string,
        shippingAddress: string,
        shippingFee: number,
        totalPrice: number,
        userID: number,
        firstName: string,
        lastName: string,
        orderDetails: OrderDetail[] = [],
        point: UserPoint[] = [],
        orderID?: string,
        orderDate?: Date,
        createAt?: Date,
        updateAt?: Date,
        transaction?: Transaction[]
    ) {
        this.paymentMethod = paymentMethod;
        this.shippingAddress = shippingAddress;
        this.shippingFee = shippingFee;
        this.totalPrice = totalPrice;
        this.userId = userID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.orderDetails = orderDetails;
        this.point = point;
        this.orderID = orderID;
        this.orderDate = orderDate;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.transaction = transaction;
    }
}
