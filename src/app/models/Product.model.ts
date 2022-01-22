import { ProductInformation } from "./ProductInformation.model";

export class Product{
  id: number = 0;
  name: string = "";
  code: string = "";
  description: string = "";
  categoryId: number = 0;
  productionId: number = 0;
  price: number = 0;
  quantity: number = 0;
  status: string = "";
  avatarUrl: string = "";
  category: string = "";
  production: string = "";
  listInformation: ProductInformation [] = []  ;
  createdDate: Date = new Date();
  modifiedDate: Date = new Date();
}
