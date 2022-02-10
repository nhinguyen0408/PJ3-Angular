import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  @Input() shopping_Cart: ShoppingCart[];
  @Input() totalItem: number;
  @Input() totalPrice: number;
  @Input() discount: number;
  @Input() totalPay: number;
  @Output()remove = new EventEmitter();
  @Output()payment = new EventEmitter();
  constructor() {
    this.shopping_Cart = [];
    this.totalItem = 0;
    this.totalPrice = 0;
    this.discount = 0;
    this.totalPay = 0;
   }

  ngOnInit(): void {

  }

  removeProduct(productId:number){
    this.remove.emit(productId);
  }

  paymentCart(){
    // localStorage.removeItem("shopping-cart")
    this.payment.emit()
  }
}
