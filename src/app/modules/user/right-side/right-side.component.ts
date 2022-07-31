import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/user/cart/cart.service';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.css']
})
export class RightSideComponent implements OnInit {

  constructor(
    private apiCart: CartService,
  ) { }

  ngOnInit(): void {
    this.getDataCart()
  }

  shopping_Cart: any = []
  totalCart: number = 0;
  getDataCart = () => {
    var x = setInterval(() => {
      this.apiCart.getDataCart().subscribe((res: any) => {
        if(res){
          let total = 0;
          this.shopping_Cart = res;
          // console.log(res)
          this.shopping_Cart?.products.map((element: any)=> {
            total += element.price
          })
          this.totalCart = total
        }
      })
    }, 1000)
  }
}
