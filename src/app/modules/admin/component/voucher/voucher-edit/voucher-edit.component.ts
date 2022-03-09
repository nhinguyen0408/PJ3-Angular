import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Voucher } from 'src/app/models/Voucher.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';

@Component({
  selector: 'app-voucher-edit',
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-edit.component.css']
})
export class VoucherEditComponent implements OnInit {

  constructor(
    private api: ApiVoucherService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private toastsService: ToastService
    ) { }
  id = this.actRoute.snapshot.params['id']
  voucher: any;
  numberValidate = "^[0-9]*$";
  onshow: boolean | null = null;
  startDate: Date | null = null
  endDate: Date | null = null
  stringStart: string| null = '';
  stringEnd: string| null = '';
  ngOnInit(): void {
    this.getdata(this.id)
  }
  getdata(id: number){
    this.api.getVoucherById(id).subscribe( (res:Voucher) =>{
      this.voucher = res;
      this.stringStart = this.formatDate(res.startDate);
      this.stringEnd = this.formatDate(res.endDate);
      this.startDate = res.startDate;
      this.endDate = res.endDate;
      if(res.isPercent === true){
        this.onshow = true
      } else if(res.isPercent === false) {
        this.onshow = false
      }
    })
  }
  editStart(){
    if(this.stringStart){
      this.stringStart= '';
    }
  }
  editEnd(){
    if(this.stringEnd){
      this.stringEnd = '';
    }
  }
  formatDate(date: Date |null){
    if(date){
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
    }
    else return null;
  }
  onSubmit(){
    console.log("voucher:::::::", this.voucher)
    if(this.startDate){
      this.voucher.startDate = this.startDate
      console.log(this.startDate)
    }
    if(this.endDate){
      this.voucher.endDate = this.endDate
      console.log(this.endDate)
    }
    if(window.confirm("Bạn chắc chắn muốn thực hiện thay đổi !!!!")){
      this.api.updateVoucher(this.voucher).subscribe(res => {
        console.log(res)
        this.toastsService.alert('Thông báo !!!', 'Sửa Voucher thành công !!!!','bg-success');
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
