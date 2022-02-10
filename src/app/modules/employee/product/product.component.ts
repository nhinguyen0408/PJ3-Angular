import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { ApiProductService } from 'src/app/services/product/api-product.service';

declare var jQuery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private api: ApiProductService) { }

  ngOnInit(): void {
    this.getAll();

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  productList: Product[] = [];
  getAll(){
    this.api.getProduct().subscribe((res: any) => {
      this.productList = res
    })

  }
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }
  shoppingCart: ShoppingCart [] = []
  addShoppingCart(id: number){
    const product = this.productList.find(x => x.id === id);
    console.log("product",product)
    if(product){
      if(!this.shoppingCart.find(x => x.product.id === id)){
        const productShopping = new ShoppingCart()
        productShopping.product = product;
        productShopping.price = product.salePrice;
        productShopping.quantity = 1
        this.shoppingCart.push(productShopping)
        this.getTotal();
        // localStorage.setItem("shopping-cart", JSON.stringify(this.shoppingCart));
      } else {
        const productShopping = this.shoppingCart.find(x => x.product.id === id);
        // console.log("productShopping else",productShopping);
        if(productShopping){
          if(productShopping.quantity < product.quantity){
            productShopping.quantity ++;
            productShopping.price = product.salePrice * productShopping.quantity;
            this.getTotal();
          }else{
            alert("Số lượng đã vượt quá số sản phẩm trong kho!!!!!!")
          }

        }
      }

    }
    console.log("shoppingCart",this.shoppingCart)
  }
  removeProduct(productShoppingId:number){
    if(window.confirm("Are u sure??" + productShoppingId)){
      const index = this.shoppingCart.findIndex(x=> x.product.id === productShoppingId);
      this.shoppingCart.splice(index,1);
      this.getTotal()
    }
  }
  totalPrice: number = 0 ;
  discount: number = 0 ;
  totalPay: number = 0;
  totalItem: number = 0 ;
  getTotal(){
    this.totalPrice = 0 ;
    this.totalItem = 0 ;
    for(const productShopping of this.shoppingCart){
      this.totalItem += productShopping.quantity;
      console.log("productShopping.price",productShopping.price)
      this.totalPrice = this.totalPrice +  productShopping.price;
    }
    this.totalPay = this.totalPrice - this.discount;
    console.log("totalPrice",this.totalPrice)
    console.log("totalPay",this.totalPay)

    console.log("asdlaksldk")
  }
  payment(){
    if(window.confirm("Xác nhận thanh toán !!!!!!!")){
      this.shoppingCart = []
      this.totalItem = 0; 
      this.totalPay = 0;
      this.totalPrice = 0;
    }

  }

}
