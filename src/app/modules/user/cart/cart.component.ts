import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/user/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private apiCart: CartService,
  ) { }

  ngOnInit(): void {
    this.getDataCart()
  }

  shopping_Cart: any = []
  totalCart: number = 0;
  totalPay: number = 0
  discount: number = 0
  totalPrice: number = 0
  totalItem: number = 0

  voucherData: any
  voucherName: string = ''

  getDataCart = () => {
    this.apiCart.getDataCart().subscribe((res: any) => {
      if(res){
        let total = 0;
        this.shopping_Cart = res;
        console.log(res)
        this.shopping_Cart?.products.map((element: any)=> {
          total += element.price
        })
        this.totalCart = total
      }
    })
  }
  checkPaymentCart = () => {

  }
  removeProduct = (productId: number) => {

  }
  onChangeQuantity = (event: any, productId: number) => {

  }
  onChangeVoucher = (event: any) => {

  }
  applyVoucher = () => {

  }
}
