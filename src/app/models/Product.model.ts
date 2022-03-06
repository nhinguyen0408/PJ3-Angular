import { Image } from "./Image.model";
import { ProductInformation } from "./ProductInformation.model";

export class Product{
  id: number = 0;
  name: string = "";
  code: string = "";
  description: string = "";
  categoryId: number = 0;
  productionId: number = 0;
  salePrice: number = 0;
  importPrice: number = 0;
  discount: number = 0;
  quantity: number = 0;
  status: string = "";
  avatarUrl: string = "";
  category: string = "";
  production: string = "";
  listInformation: ProductInformation [] = []  ;
  listImage: Image [] = [];
  saleEntity: any;
  createdBy: number = 0;
  modifiedBy: number = 0;
  createdDate: Date = new Date();
  modifiedDate: Date = new Date();
}
