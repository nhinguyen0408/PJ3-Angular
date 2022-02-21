import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Bill } from 'src/app/models/Bill.model';
import { Product } from 'src/app/models/Product.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';

declare var jQuery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private api: ApiProductService, private billApi: ApiBillService) { }

  ngOnInit(): void {
    this.getAll();
    this.getShoppingCart();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  productList: Product[] = [];
  getAll(){
    this.api.getProductEnable().subscribe((res: any) => {
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
  shoppingCart: ShoppingCart [] =  [];
  dataLocal: any;
  getShoppingCart(){
    if(localStorage.getItem('cart') != null && localStorage.getItem('cart') != undefined){
      // this.shoppingCart = JSON.parse(localStorage.getItem('cart'));
      this.dataLocal = localStorage.getItem('cart') ? localStorage.getItem('cart') : '' ;
      this.shoppingCart = JSON.parse(this.dataLocal);
      this.getTotal()
      // console.log("shoppingCart======== ",localStorage.getItem('cart') )
    }
  }
  updateQuantityCart(dataUpdate: any){
    console.log('dataUpdate== ',dataUpdate);
    const product = this.productList.find(x => x.id === dataUpdate.productId);
    console.log('product== ',product);
    if(product && product.quantity >= dataUpdate.quantityUpdate){
      const productShopping = this.shoppingCart[dataUpdate.shoppingCartIndex]
      productShopping.quantity = dataUpdate.newQuantity;
      productShopping.price = product.salePrice * productShopping.quantity;
      this.api.updateQuantity({'productId': dataUpdate.productId, 'action': dataUpdate.action, 'number':  dataUpdate.quantityUpdate}).subscribe(res => {
        this.getAll();
        this.storeShoppingCart(this.shoppingCart);
      })
      this.getTotal();
    }else{
      alert("Số lượng đã vượt quá số sản phẩm trong kho!!!!!!")
    }
  }
  addShoppingCart(id: number){
    const product = this.productList.find(x => x.id === id);
    console.log("product",product)
    if(product && product.quantity > 0){
      if(!this.shoppingCart.find(x => x.product.id === id)){
        const productShopping = new ShoppingCart()
        productShopping.product = product;
        productShopping.price = product.salePrice;
        productShopping.quantity = 1
        this.shoppingCart.push(productShopping)
        this.api.updateQuantity({'productId': id, 'action': '-', 'number': 1}).subscribe(res => {
          this.getAll();
          this.storeShoppingCart(this.shoppingCart);
        })
        this.getTotal();
        // localStorage.setItem("shopping-cart", JSON.stringify(this.shoppingCart));
      } else {
        const productShopping = this.shoppingCart.find(x => x.product.id === id);
        // console.log("productShopping else",productShopping);
        if(productShopping){
          if(product.quantity > 0){
            productShopping.quantity ++;
            productShopping.price = product.salePrice * productShopping.quantity;
            this.api.updateQuantity({'productId': id, 'action': '-', 'number': 1}).subscribe(res => {
              this.getAll();
              this.storeShoppingCart(this.shoppingCart);
            })
            this.getTotal();
          }else{
            alert("Số lượng đã vượt quá số sản phẩm trong kho!!!!!!")
          }

        }
      }

    } else {
      alert("Sản phẩm đã hết hàng!!!!!!")
    }
    console.log("shoppingCart",this.shoppingCart)
  }
  removeProduct(productShoppingId:number){
    if(window.confirm("Are u sure??" + productShoppingId)){
      const index = this.shoppingCart.findIndex(x=> x.product.id === productShoppingId);
      const product = this.shoppingCart.find(x=> x.product.id === productShoppingId);
      this.api.updateQuantity({'productId': productShoppingId, 'action': '+', 'number': product?.quantity}).subscribe(res => {
        this.getAll();
      })
      this.shoppingCart.splice(index,1);
      this.getTotal()
      this.storeShoppingCart(this.shoppingCart);
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
  payment(bill: Bill){
    if(window.confirm("Xác nhận thanh toán !!!!!!!")){
      console.log("bill", bill)
      this.billApi.createBill(bill).subscribe(res => {
        this.shoppingCart = []
        this.totalItem = 0;
        this.totalPay = 0;
        this.totalPrice = 0;
        this.discount = 0;
        localStorage.setItem('cart', '');
      })
      // this.shoppingCart = []
      // this.totalItem = 0;
      // this.totalPay = 0;
      // this.totalPrice = 0;
      // localStorage.setItem('cart', '');
    }
  }
  checkPayment(){
    if( this.shoppingCart.length > 0){
    } else {
      alert("Vui lòng chọn sản phẩm và thêm vào giỏ hàng trước khi thanh toán !!!!")
    }
  }
  storeShoppingCart(cart: ShoppingCart[]){
    // const subject = new Subject<any>();
    localStorage.setItem('cart', JSON.stringify(cart));
    // console.log("shoppingCart======== ",localStorage.getItem('cart') )
    // subject.next('changed'); this.shoppingCart = JSON.parse(localStorage.getItem('cart'));
  }


}
