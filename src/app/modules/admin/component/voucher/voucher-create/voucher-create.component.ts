import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voucher } from 'src/app/models/Voucher.model';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';


@Component({
  selector: 'app-voucher-create',
  templateUrl: './voucher-create.component.html',
  styleUrls: ['./voucher-create.component.css']
})
export class VoucherCreateComponent implements OnInit {

  constructor(
    private api: ApiVoucherService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  voucher = new Voucher();
  numberValidate = "^[0-9]*$";
  onshow: boolean | null = null;
  onSubmit(){
    console.log("Voucher:::::::", this.voucher)
    if(this.voucher.isPercent == true){
      if(this.voucher.name != "" && this.voucher.key != "" && this.voucher.percentage!= null ){
        this.voucher.key.toUpperCase();
        this.api.createVoucher(this.voucher).subscribe(res => {
          this.route.navigate(["admin/voucher"])
        })
      }else {
        alert("Vui lòng điền đầy đủ các trường thông tin !!!")
      }
    }
    if (this.voucher.isPercent == false){
      if(this.voucher.name != "" && this.voucher.key != "" && this.voucher.discountPrice!= null ){
        this.voucher.key.toUpperCase();
        this.api.createVoucher(this.voucher).subscribe(res => {
          this.route.navigate(["admin/voucher"])
        })
      }else {
        alert("Vui lòng điền đầy đủ các trường thông tin !!!")
      }
    }


  }
  onChange(event: any){
    console.log("event:::::::", event.target.value)
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

    console.log("this.onshow:::::::",this.onshow);
  }


}
