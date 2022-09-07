import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voucher } from 'src/app/models/Voucher.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';


@Component({
  selector: 'app-voucher-create',
  templateUrl: './voucher-create.component.html',
  styleUrls: ['./voucher-create.component.css']
})
export class VoucherCreateComponent implements OnInit {

  constructor(
    private api: ApiVoucherService,
    private route: Router,
    private toastsService: ToastService
  ) { }

  ngOnInit(): void {
  }

  voucher = new Voucher();
  numberValidate = "^[0-9]*$";
  onshow: boolean | null = null;
  onSubmit(){
    if(this.voucher.isPercent == true){
      if(this.voucher.name != "" && this.voucher.key != "" && this.voucher.percentage!= null && this.voucher.quantity!= null && this.voucher.minPrice!= null){
        this.voucher.key.toUpperCase();
        if(this.voucher.startDate > this.voucher.endDate){
          // alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!")
          this.toastsService.alert('Thông báo !!!', 'Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!','bg-warning');
        }
        // else if(!(this.voucher.quantity +'').match(this.numberValidate) || this.voucher.quantity < 0){
        //   // alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!")
        //   this.toastsService.alert('Thông báo !!!', 'Số lượng không hợp lệ !!!!','bg-warning');
        // } else if(!(this.voucher.minPrice +'').match(this.numberValidate) || this.voucher.minPrice < 0){
        //   // alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!")
        //   this.toastsService.alert('Thông báo !!!', 'Giá trị áp dụng không hợp lệ không hợp lệ !!!!','bg-warning');
        // }
        else {
          this.api.createVoucher(this.voucher).subscribe(res => {
            this.route.navigate(["admin/voucher"])
          },
          (err:ErrorEvent) => {
            this.toastsService.alert('Thông báo !!!', 'Mã giảm giá đã được sử dụng !!!!','bg-warning');
          })
        }
      }else {
        // alert("Vui lòng điền đầy đủ các trường thông tin !!!")
        this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đầy đủ các trường thông tin !!!','bg-warning');
      }
    }
    if (this.voucher.isPercent == false){
      if(this.voucher.name != "" && this.voucher.key != "" && this.voucher.discountPrice!= null ){
        this.voucher.key.toUpperCase();
        if(this.voucher.startDate > this.voucher.endDate){
          // alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!")
          this.toastsService.alert('Thông báo !!!', 'Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!','bg-warning');
        } else {
          this.api.createVoucher(this.voucher).subscribe(res => {
            this.toastsService.alert('Thông báo !!!', 'Tạo Voucher thành công !!!!','bg-success');
            this.route.navigate(["admin/voucher"])
          },
          (err:ErrorEvent) => {
            this.toastsService.alert('Thông báo !!!', 'Mã giảm giá đã được sử dụng !!!!','bg-warning');
          })
        }
      }else {
        // alert("Vui lòng điền đầy đủ các trường thông tin !!!")
        this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đầy đủ các trường thông tin !!!','bg-warning');
      }
    }


  }
  onChange(event: any){
    if(event.target.value === "TRUE"){
      this.voucher.discountPrice = null;
      this.voucher.isPercent = true;
      this.onshow = true;
    }  else if(event.target.value === "FALSE") {
      this.voucher.percentage = null;
      this.voucher.isPercent = false;
      this.onshow = false;
    } else {
      this.voucher.isPercent = false;
      this.onshow = null;
    }

  }


}
