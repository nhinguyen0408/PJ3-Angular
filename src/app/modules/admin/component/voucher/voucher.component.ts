import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voucher } from 'src/app/models/Voucher.model';
import { ApiVoucherService } from 'src/app/services/voucher/api-voucher.service';

declare var jQuery: any;
@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  constructor(
    private api: ApiVoucherService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getAllVoucher()
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }
  voucherList: Voucher [] = []
  getAllVoucher(){
    this.api.getVoucher().subscribe((res: any)=>{
      this.voucherList = res
    })
  }
  onDelete(id: number){
    const x = this.voucherList.find(x => x.id === id)
    if(window.confirm("Xác nhận xóa Voucher: "+ "'"+ x?.name +"'")){
      this.api.deleteVoucher(id).subscribe(res => {
        this.getAllVoucher()
      })
    }
  }

}
