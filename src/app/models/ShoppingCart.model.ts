import { Product } from "./Product.model";

export class ShoppingCart{
  product: Product = new Product();
  quantity: number = 0;
  price: number = 0;
}
