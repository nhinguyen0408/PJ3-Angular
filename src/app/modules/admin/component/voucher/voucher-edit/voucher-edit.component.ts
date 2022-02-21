import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Voucher } from 'src/app/models/Voucher.model';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';

@Component({
  selector: 'app-voucher-edit',
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-edit.component.css']
})
export class VoucherEditComponent implements OnInit {

  constructor(private api: ApiVoucherService, private route: Router, private actRoute: ActivatedRoute) { }
  id = this.actRoute.snapshot.params['id']
  voucher: any;
  numberValidate = "^[0-9]*$";
  onshow: boolean | null = null;
  ngOnInit(): void {
    this.getdata(this.id)
  }
  getdata(id: number){
    this.api.getVoucherById(id).subscribe( (res:Voucher) =>{
      this.voucher = res;
      if(res.isPercent === true){
        this.onshow = true
      } else if(res.isPercent === false) {
        this.onshow = false
      }
    })
  }
  onSubmit(){
    console.log("voucher:::::::", this.voucher)
    if(window.confirm("Bạn chắc chắn muốn thực hiện thay đổi !!!!")){
      this.api.updateVoucher(this.voucher).subscribe(res => {
        this.route.navigate(['admin/voucher'])
      })
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
