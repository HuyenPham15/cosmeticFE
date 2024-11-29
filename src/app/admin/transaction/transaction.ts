
export class Transaction {
    transactionID: number;
    amount: number;
    transactionType:  string;
    transactionMethod:  string;
    paymentMethod   :  string;
    order_detail_id:  string;
    transactionDate:  Date;
    status:  string;
    referenceCode:  string;
    createdAt:  Date;


    constructor(
       transactionID: number = 0,
       amount: number = 0,
       transactionType: string  = '',
       transactionMethod: string   = '',
       paymentMethod: string  = '',
       order_detail_id: string   = '',
       transactionDate: Date  = new Date(),
       status: string   = '',
       referenceCode: string   = '',
       createdAt: Date   = new Date(),


    ) {
       
        this.transactionID = transactionID;
        this.amount = amount;
        this.transactionType = transactionType;
        this.transactionMethod=  transactionMethod;
        this.paymentMethod =  paymentMethod;
        this.order_detail_id =  order_detail_id;
        this.transactionDate =  transactionDate;
        this.status = status;
        this.referenceCode =   referenceCode;
        this.createdAt = createdAt;

    }
}
