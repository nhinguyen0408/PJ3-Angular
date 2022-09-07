import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
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
  @Input() listBillIMEI: any[];
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
    private apiBill: ApiBillService,
    private toastsService: ToastService

    ) {
    this.shopping_Cart = [];
    this.listBillIMEI = []
    this.totalItem = 0;
    this.totalPrice = 0;
    this.discount = 0;
    this.totalPay = 0;
  }

  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  ngOnInit(): void {
    // setTimeout( () => {
    // },200)

  }
  bill = new Bill();
  billDetail: any[] = [];
  voucherName: string | null = null;
  isVoucher: boolean = false;
  voucherData: any;


  onChangeVoucher(event: any){
    this.voucherName = event.target.value;
  }
  applyVoucher(){
    if(this.voucherName != null && this.shopping_Cart.length > 0){
      this.api.getVoucherByKey(this.voucherName).subscribe(res =>{
          this.voucherData = res;
          if(this.voucherData && this.voucherData.quantity > 0){
            if(this.totalPrice > this.voucherData.minPrice){
              this.isVoucher = true;
              this.toastsService.alert('Thông báo !!!', "Áp dụng mã Voucher: " + this.voucherData.name,'bg-info');
              let now = new Date();
              let startDate = new Date(this.voucherData.startDate);
              let endDate = new Date( this.voucherData.endDate);
              if(now.getTime() > startDate.getTime() && now.getTime() < endDate.getTime()){
                this.bill.voucherId = this.voucherData.id
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
                this.toastsService.alert('Thông báo !!!', "Voucher đã hết hoặc chưa đến hạn áp dụng !!!!",'bg-warning');
                this.voucherData = null;
              }
            } else {
              this.toastsService.alert('Thông báo !!!', "Đơn hàng chưa đạt tới giá trị tối thiểu là "+ this.voucherData.minPrice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) + " để áp dụng voucher này !!!!",'bg-warning');
              this.voucherData = null;
            }

          } else {
            this.toastsService.alert('Thông báo !!!', "Voucher đã hết số lượng áp dụng !!!!",'bg-warning');
              this.voucherData = null;
          }

      },(err:ErrorEvent) =>{
        this.toastsService.alert('Thông báo !!!', "Không tồn tại Mã giảm giá này !!!!!",'bg-warning');
        this.voucherData = null;
        this.totalPay = this.totalPrice;
        this.discount = 0;
        this.bill.discountPrice = 0;
      })

    } else {
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
      let flagCheckImeiNull = true
      this.shopping_Cart.map((x: any, index: number) => {
        const dataImei : string[] = []
        if(this.listBillIMEI[index] && this.listBillIMEI[index].imei && this.listBillIMEI[index].imei.length > 0){
          this.listBillIMEI[index].imei.map((e: any, idxChild: number) => {
            if(e.data.trim() == ''){
              flagCheckImeiNull = false
              this.listBillIMEI[index].imei[idxChild].isNotImei = true;
            }
            dataImei.push(e.data)
          })
        }
        const data =  {'productId': x.product.id, 'quantity': x.quantity, 'price': x.price, imei: dataImei}
        this.billDetail.push(data)
      })
      if(flagCheckImeiNull){
        this.showModal = false
        document.getElementsByClassName('modal-backdrop')[0].classList.remove("show")
        this.bill.billDetail = this.billDetail;
        this.bill.totalPrice = this.totalPrice;
        this.bill.profileId = Number(localStorage.getItem('employeeId'));
        this.billClone = this.bill
        this.shoppingCartClone = this.shopping_Cart
        console.log('this.billClone',this.billClone);

        this.payment.emit(this.bill);
        this.orderSuccess = true;
        this.discount = 0;
        this.voucherData = null;
        this.voucherName = "";
        this.bill = new Bill()
      }
    } else {
      // alert("Vui lòng điền đầy đủ thông tin khách hàng !!!!")
      this.toastsService.alert('Thông báo !!!', "Vui lòng điền đầy đủ thông tin khách hàng !!!!",'bg-warning');
    }

  }
  checkPaymentCart(){
    // localStorage.removeItem("shopping-cart")
    this.showModal = true;
    this.onCheckPayment.emit()
  }
  onChangeQuantity(e: any, quantityOld: number, index: number, productId: number){
    const newQuantity = e.target.value;
    const quantityUpdate = newQuantity - quantityOld;
    if(quantityUpdate > 0){
      this.onUpdateQuantity.emit({'newQuantity': newQuantity, 'quantityUpdate': quantityUpdate, 'action': '-' , 'shoppingCartIndex': index, 'productId': productId})
    } else {
      this.onUpdateQuantity.emit({'newQuantity': newQuantity, 'quantityUpdate': - quantityUpdate, 'action': '+' , 'shoppingCartIndex': index, 'productId': productId})
    }

  }
  onPrint(id: string){
    var x = (function ($) {
      var divContents = document.getElementById(id)?.innerHTML;
            var a = window.open('', '', 'height=1000, width=1000');
            a?.document.write('<html>');
            a?.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" type="text/css" />');
            a?.document.write('<body >');
            a?.document.write(divContents ? divContents : '');
            a?.document.write('</body></html>');
            a?.document.close();
            setTimeout(()=>{
              a?.print();
            },500)

    })(jQuery);
  }
  checkImei = "^[0-9]*$"
  showModal: boolean = false
  onBlurIMEI= (idxParent: number, idxChild: number, e: any) => {
    // this.listBillIMEI[idxParent].imei[idxChild].data = e.target.value;
    const data = e.target.value.trim()
    if(data.match(this.checkImei) && data.length == 15){
      this.apiBill.checkImei(data).subscribe((res: any) => {
        if(res == false){
          this.listBillIMEI[idxParent].imei[idxChild].isError = false;
          this.listBillIMEI[idxParent].imei[idxChild].data = e.target.value;
          this.listBillIMEI[idxParent].imei[idxChild].isNotImei = false;
        } else {
          this.listBillIMEI[idxParent].imei[idxChild].isError = true;
          // this.isErrorImei = true
          this.toastsService.alert('Thông báo !!!', "Imei đã tồn tại, vui lòng kiểm tra lại !!!!",'bg-warning');
        }
      })
    } else {
      this.listBillIMEI[idxParent].imei[idxChild].isNotImei = true;
      this.toastsService.alert('Thông báo !!!', "Sai định dạng IMEI !!!!",'bg-warning');
    }

  }
  orderSuccess: boolean = false
  billClone: any;
  shoppingCartClone: any;
  closeModalOrderSuccess = () => {
    document.getElementsByClassName('modal-backdrop')[0].classList.remove("show", "modal-backdrop")
    this.orderSuccess = false;
    this.billClone = undefined
    this.shoppingCartClone = undefined
  }
  closeModalSuccess = () => {
    document.getElementsByClassName('modal-backdrop')[0].classList.remove("show", "modal-backdrop")
    this.orderSuccess = false;
  }
}
