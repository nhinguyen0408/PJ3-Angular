import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { ProfileService } from 'src/app/services/user/profile/profile.service';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';
declare var jQuery: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private apiCart: CartService,
    private toastService: ToastService,
    private apiVoucher: ApiVoucherService,
    private apiProfile: ProfileService,
  ) { }

  ngOnInit(): void {
    this.getDataCart()
    this.getDataUSer()
  }
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  shopping_Cart: any
  totalCart: number = 0;
  totalPay: number = 0
  discount: number = 0
  totalItem: number = 0
  isVoucher: boolean = false
  voucherData: any
  voucherName: string = ''
  bill = new Bill();
  userProfile: any

  getDataUSer = () => {
    const userId = localStorage.getItem('userId');
    this.apiProfile.getProfileById(Number(userId)).subscribe((res: any) => {
      this.userProfile = res
      this.bill.ownerName = this.userProfile.fistName + ' ' + this.userProfile.lastName
      this.bill.phone =  this.userProfile.phone
      this.bill.address =  this.userProfile.address
    })
  }
  getDataCart = () => {
    this.apiCart.getDataCart().subscribe((res: any) => {
      if(res){
        this.shopping_Cart = res;
        this.getTotal()
      }
    })
  }
  checkPaymentCart = () => {
    if(this.shopping_Cart.products.length === 0 || this.shopping_Cart == undefined){
      this.toastService.alert('Thông báo !!!', "Vui lòng thêm sản phẩm vào giỏ hàng để tiến hành thanh toán !!!!!!",'bg-warning');
      this.getDataCart()
    }
  }
  removeProduct = (productId: number) => {
    if(confirm("Bạn muốn xóa sản phẩm khỏi giỏ hàng ????")){
      this.apiCart.removeToCart(productId).subscribe(res => {
        this.getDataCart()
      })
    } else {
      this.getDataCart()
    }
  }
  onChangeQuantity = (event: any, productId: number, productIdx: number) => {
    if(Number(event.target.value) > this.shopping_Cart.products[productIdx].product.quantity){
      this.toastService.alert('Thông báo !!!', "Số lượng đã vượt quá số lượng cho phép !!!!!!",'bg-warning');
      this.getDataCart()
    } else if (Number(event.target.value) == 0 || event.target.value == '' || event.target.value == null){
      this.removeProduct(productId)
    } else {
      this.shopping_Cart.products[productIdx].quantity = Number(event.target.value);
      const cartUpdate = {quantity: Number(event.target.value), productId: productId}
      this.apiCart.updateCart(cartUpdate).subscribe(res => {
        this.getDataCart()
      })
    }
  }
  onChangeVoucher = (event: any) => {
    this.voucherName = event.target.value;
  }
  getTotal(){
    let total = 0;
    if(this.shopping_Cart.products && this.shopping_Cart.products.length > 0){
      this.shopping_Cart?.products.map((element: any)=> {
        total += element.price
      })
      this.totalCart = total
      this.totalPay = this.totalCart - this.discount;
    }
  }

  applyVoucher = () => {
    if(this.voucherName != null && this.shopping_Cart.products.length > 0){
      this.apiVoucher.getVoucherByKey(this.voucherName).subscribe(res =>{
        this.voucherData = res;
        this.isVoucher = true;
        this.toastService.alert('Thông báo !!!', "Áp dụng mã Voucher: " + this.voucherData.name,'bg-info');
        let now = new Date();
        let startDate = new Date(this.voucherData.startDate);
        let endDate = new Date( this.voucherData.endDate);
        if(now.getTime() > startDate.getTime() && now.getTime() < endDate.getTime()){
          this.bill.voucherId = this.voucherData.id
          console.log(this.voucherData);
          if(this.voucherData.isPercent){
            const disCountRound = this.totalCart * (this.voucherData.percentage/100);
            this.discount = Math.round(disCountRound/10000)*10000;
          } else {
            if(this.voucherData.discountPrice > this.totalCart/3){
              this.toastService.alert('Thông báo !!!', "Không thể áp dụng mã Voucher: " + this.voucherData.name + "\n Do giá trị đơn hàng chưa đạt tới giá trị áp dụng voucher !!!",'bg-warning');
            } else {
              this.discount = this.voucherData.discountPrice;
            }
          }
          this.totalPay = this.totalCart - this.discount;
          this.bill.discountPrice = this.discount;
        } else {
          this.toastService.alert('Thông báo !!!', "Voucher đã hết hoặc chưa đến hạn áp dụng !!!!",'bg-warning');
          this.voucherData = null;
        }
      },(err:ErrorEvent) =>{
        this.toastService.alert('Thông báo !!!', "Không tồn tại Mã giảm giá này !!!!!",'bg-warning');
        this.voucherData = null;
        this.totalPay = this.totalCart;
        this.discount = 0;
        this.bill.discountPrice = 0;
      })

    } else {
      this.toastService.alert('Thông báo !!!', "Vui lòng chọn sản phẩm hoặc nhập mã giảm giá !!!!!",'bg-warning');
    }
  }
  onPrint = () => {
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
  billDetail: any;
  paymentCart(){
    if(this.bill.ownerName != "" && this.bill.phone != "" && this.bill.address != ""){
      this.billDetail = []
      this.shopping_Cart.products.forEach((x: any) => {
        const data =  {'productId': x.product.id, 'quantity': x.quantity, 'price': x.price}
        this.billDetail.push(data)
      })
      this.bill.billDetail = this.billDetail;
      this.bill.totalPrice = this.totalCart;
      this.bill.profileId = Number(localStorage.getItem('userId'));
      if(window.confirm("Xác nhận đặt hàng !!!!!!!")){
        this.apiCart.createBillByUser(this.bill).subscribe(res => {
          this.toastService.alert('Thông báo !!!', "Đặt hàng thành công !!!!!!",'bg-success');
          this.shopping_Cart = undefined
          this.totalItem = 0;
          this.totalPay = 0;
          this.totalCart = 0;
          this.discount = 0;
        })
      }
      this.discount = 0;
      this.voucherData = null;
      this.voucherName = "";
      this.bill = new Bill()

    } else {
      this.toastService.alert('Thông báo !!!', "Vui lòng điền đầy đủ thông tin khách hàng !!!!",'bg-warning');
    }

  }
}
