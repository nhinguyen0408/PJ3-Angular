import { ProductInformation } from "./ProductInformation.model";

export class ChildProduct {
  id?: number | null;
  properties: string = '';
  salePrice?: number | null;
  importPrice?: number | null;
  warranty?: number | null;
  quantity: number = 0;
  status: string = '';
  avatarUrl?: string | null;
  listInformation: ProductInformation [] = []  ;
}
