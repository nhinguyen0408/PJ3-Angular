import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';

declare var jQuery: any;
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
  @Output()onCheckPayment = new EventEmitter();
  @Output()onUpdateQuantity = new EventEmitter();
  constructor(
    private api: ApiVoucherService,
    private toastsService: ToastService

    ) {
    this.shopping_Cart = [];
    this.totalItem = 0;
    this.totalPrice = 0;
    this.discount = 0;
    this.totalPay = 0;
  }

  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  ngOnInit(): void {

  }
  bill = new Bill();
  billDetail: {'productId': number, 'quantity': number, 'price': number}[] = [];
  voucherName: string | null = null;
  isVoucher: boolean = false;
  voucherData: any;
  onChangeVoucher(event: any){
    this.voucherName = event.target.value;
    console.log(' event.target.value', event.target.value)
  }
  applyVoucher(){
    if(this.voucherName != null && this.shopping_Cart.length > 0){
      this.api.getVoucherByKey(this.voucherName).subscribe(res =>{
          this.voucherData = res;
          this.isVoucher = true;
          // alert("Áp dụng mã Voucher: " + this.voucherData.name)
          this.toastsService.alert('Thông báo !!!', "Áp dụng mã Voucher: " + this.voucherData.name,'bg-info');
          let now = new Date();
          let startDate = new Date(this.voucherData.startDate);
          let endDate = new Date( this.voucherData.endDate);
          if(now.getTime() > startDate.getTime() && now.getTime() < endDate.getTime()){
            // console.log(this.voucherData.startDate < this.voucherData.endDate)
            // console.log(now)
            // console.log(startDate)
            // console.log(endDate)
            this.bill.voucherId = this.voucherData.id
            console.log(this.voucherData);
            if(this.voucherData.isPercent){
              this.discount = this.totalPrice * (this.voucherData.percentage/100);
            } else {
              if(this.voucherData.discountPrice > this.totalPrice/3){
                this.toastsService.alert('Thông báo !!!', "Không thể áp dụng mã Voucher: " + this.voucherData.name + "\n Do giá trị đơn hàng chưa đạt tới giá trị áp dụng voucher !!!",'bg-warning');
              } else {
                this.discount = this.voucherData.discountPrice;
              }
            }
            this.totalPay = this.totalPrice - this.discount;
            this.bill.discountPrice = this.discount;
          } else {
            // alert("Voucher đã hết hoặc chưa đến hạn áp dụng !!!!")
            this.toastsService.alert('Thông báo !!!', "Voucher đã hết hoặc chưa đến hạn áp dụng !!!!",'bg-warning');
            this.voucherData = null;
          }
      },(err:ErrorEvent) =>{
        // alert('Không tồn tại Mã giảm giá này !!!!!');
        this.toastsService.alert('Thông báo !!!', "Không tồn tại Mã giảm giá này !!!!!",'bg-warning');
        this.voucherData = null;
        this.totalPay = this.totalPrice;
        this.discount = 0;
        this.bill.discountPrice = 0;
      })

      // if(this.isVoucher === false){
      //   alert('Không tồn tại Mã giảm giá này !!!!!')
      // }
    } else {
      // alert('Vui lòng chọn sản phẩm hoặc nhập mã giảm giá !!!!!')
      this.toastsService.alert('Thông báo !!!', "Vui lòng chọn sản phẩm hoặc nhập mã giảm giá !!!!!",'bg-warning');
    }
  }
  removeProduct(productId:number){
    this.remove.emit(productId);
  }

  paymentCart(){
    // localStorage.removeItem("shopping-cart")
    if(this.bill.ownerName != "" && this.bill.phone != "" && this.bill.address != ""){
      this.billDetail = []
      this.shopping_Cart.forEach(x => {
        const data =  {'productId': x.product.id, 'quantity': x.quantity, 'price': x.price}
        this.billDetail.push(data)
      })
      this.bill.billDetail = this.billDetail;
      this.bill.totalPrice = this.totalPrice;
      this.bill.profileId = Number(localStorage.getItem('employeeId'));
      console.log("localStorage.getItem('employeeId')",localStorage.getItem('employeeId'))
      this.payment.emit(this.bill);
      this.discount = 0;
      this.voucherData = null;
      this.voucherName = "";
      this.bill = new Bill()
    } else {
      // alert("Vui lòng điền đầy đủ thông tin khách hàng !!!!")
      this.toastsService.alert('Thông báo !!!', "Vui lòng điền đầy đủ thông tin khách hàng !!!!",'bg-warning');
    }

  }
  checkPaymentCart(){
    // localStorage.removeItem("shopping-cart")
    this.onCheckPayment.emit()
  }
  onChangeQuantity(e: any, quantityOld: number, index: number, productId: number){
    console.log(e.target.value);
    console.log('shopping_Cart=== ',this.shopping_Cart);
    const newQuantity = e.target.value;
    const quantityUpdate = newQuantity - quantityOld;
    if(quantityUpdate > 0){
      this.onUpdateQuantity.emit({'newQuantity': newQuantity, 'quantityUpdate': quantityUpdate, 'action': '-' , 'shoppingCartIndex': index, 'productId': productId})
    } else {
      this.onUpdateQuantity.emit({'newQuantity': newQuantity, 'quantityUpdate': - quantityUpdate, 'action': '+' , 'shoppingCartIndex': index, 'productId': productId})
    }

  }
  onPrint(){
    var x = (function ($) {
      var divContents = document.getElementById("bill")?.innerHTML;
            var a = window.open('', '', 'height=1000, width=1000');
            a?.document.write('<html>');
            a?.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" type="text/css" />');
            a?.document.write('<body >');
            a?.document.write(divContents ? divContents : '');
            a?.document.write('</body></html>');
            a?.document.close();
            setTimeout(()=>{
              a?.print();
            },200)

    })(jQuery);
  }
}
