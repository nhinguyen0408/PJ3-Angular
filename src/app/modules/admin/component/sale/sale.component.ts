import { Component, OnInit } from '@angular/core';
import { Sale } from 'src/app/models/Sale.model';
import { ApiSaleService } from 'src/app/services/sale/api-sale.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  constructor(private api: ApiSaleService, private toastsService: ToastService) { }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }

  ngOnInit(): void {
    this.getSale()
  }
  saleList: Sale [] = []
  getSale(){
    this.api.getSale().subscribe((res: any) => {
      this.saleList = res
      console.log(res)
    })
  }
  onDeleteSale(id: number){
    if(window.confirm("Bạn chắc chắn muốn xóa giảm giá này ???")){
      this.api.deleteSale(id).subscribe(res=>{
        // alert("Xóa sale thành công!!!!!");
        this.toastsService.alert('Thông báo !!!', 'Xóa sale thành công !!!!','bg-success');
        this.getSale();
      })
    }
  }
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
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

    return [year, month, day].join('-');
    }
    else return null;
  }
}
