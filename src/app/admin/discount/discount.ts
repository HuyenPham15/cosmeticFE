

export class Discount {
  discountID: string;
  discountCode: string;
  description: string;
  discountType: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  maxUsage: number;
  usageCount: number;
  
 
  
  constructor(
    discountID: string = '',
    discountCode: string = '',
    description: string = '',
    discountType: string = '',
    amount: number = 0,
    startDate: Date = new Date(),
    endDate: Date = new Date(),
    active: boolean = true,
    maxUsage: number = 0,
    usageCount: number = 0,

  ) {
    this.discountID = discountID;
    this.discountCode = discountCode;
    this.description = description;
    this.discountType = discountType;
    this.amount = amount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.active = active;
    this.maxUsage = maxUsage;
    this.usageCount = usageCount;

  }
}
