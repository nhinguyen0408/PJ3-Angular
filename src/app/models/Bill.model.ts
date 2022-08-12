import { ShoppingCart } from "./ShoppingCart.model";
export class Bill{
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
  billDetail: any [] = []
  createdDate: Date = new Date();
  modifiedDate: Date = new Date();
}
