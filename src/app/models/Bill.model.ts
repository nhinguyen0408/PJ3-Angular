import { ShoppingCart } from "./ShoppingCart.model";
export class Bill{
  id: number|null = null
  profileId: number = 0;
  voucherId: number| null = null;
  description: string = "";
  totalPrice: number = 0;
  discountPrice: number = 0;
  ownerName: string = "";
  phone: string = "";
  email: string = "";
  address: string = "";
  status: string = "";
  type: string = "";
  code: string| null = ''
  billDetail: any [] = []
  createdDate: Date = new Date();
  modifiedDate: Date = new Date();
}
