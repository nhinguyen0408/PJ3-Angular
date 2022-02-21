export class Voucher{
  id: number = 0;
  name: string = "";
  key: string = "";
  percentage: number | null = null;
  discountPrice: number | null = null;
  isPercent: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
}
