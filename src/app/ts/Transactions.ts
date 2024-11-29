export class Transaction {
    transactionID: string;
    orderID: string;
    amount: number;
    transactionDate: Date;
    status: string;
    createAt: Date;

    constructor(
        transactionID: string,
        orderID: string,
        amount: number,
        transactionDate: Date,
        status: string,
        createAt: Date
    ) {
        this.transactionID = transactionID;
        this.orderID = orderID;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.status = status;
        this.createAt = createAt
    }
}