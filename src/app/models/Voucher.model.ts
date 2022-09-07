export class Voucher{
  id: number = 0;
  name: string = "";
  key: string = "";
  percentage: number | null = null;
  discountPrice: number | null = null;
  isPercent: boolean = false;
  minPrice: number | string | null = null;
  quantity: number | string | null = null;
  startDate: Date = new Date();
  endDate: Date = new Date();
}
