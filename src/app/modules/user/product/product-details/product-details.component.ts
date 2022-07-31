import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { ProductService } from 'src/app/services/user/product/product.service';
declare var jQuery: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(
    private api: ProductService,
    private actRoute: ActivatedRoute ,
    private apiCart: CartService,
    private toastsService: ToastService,
    private location: Location
    ) { }
  id = this.actRoute.snapshot.params['id']
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  ngOnInit(): void {
    this.getDetailsPr();
    setTimeout(()=> {
      this.getProductSame()
    },500)
  }
  product: any;
  $: any;
  getDetailsPr(){
    this.api.getById(this.id).subscribe((res: any) => {
      this.product = res;
      this.editEditor(this.product.description);
      this.getCountDown();
    })
    console.log(this.product);

  }
  editEditor(dataa: string){
    (function ($) {
      let se = $('#textareaInput').summernote('pasteHTML',dataa)
      $('#textareaInput').summernote('destroy')
    })(jQuery);
  }
  //product-desc

  getCountDown(){
    if(this.product.saleEntity){
      var x = setInterval(() =>{
        const endTime = new Date(this.product.saleEntity.endDate).getTime();
        var now = new Date().getTime();
        var distance = endTime - now;
        this.days = (distance / (1000 * 60 * 60 * 24)).toFixed();
        // this.hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 9 ?((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed() : '0' + ((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed();
        // this.minutes = ((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed();
        // this.seconds = ((distance % (1000 * 60)) / 1000).toFixed();
        this.hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) >9 ?((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed() : '0' + ((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed();
        this.minutes = ((distance % (1000 * 60 * 60)) / (1000 * 60)) > 9 ? ((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed() : '0' +((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed();
        this.seconds = ((distance % (1000 * 60)) / 1000) > 9 ? ((distance % (1000 * 60)) / 1000).toFixed() : '0' + ((distance % (1000 * 60)) / 1000).toFixed();
      }, 1000)

    }
  }
  back(){
    this.location.back();
  }

  addShoppingCart = (productId: number) => {
    if(window.confirm("Thêm sản phẩm này vào giỏ hàng ???"))
    this.apiCart.addToCart(productId, 1).subscribe((res: any) => {
      this.toastsService.alert('Thông báo !!!', "Đã thêm sản phẩm vào giỏ hàng !!!!!!",'bg-success');
    })
  }
  productSameList: any;
  getProductSame = () => {
    if(this.product){
      this.api.getProductByCate(this.product?.categoryId).subscribe((res: any) => {
        this.productSameList = res.filter((element: any) => element.id != this.id)

        // this.productSameList.filter((element: any) => element.id !== this.id)
      })
    }
  }

}
