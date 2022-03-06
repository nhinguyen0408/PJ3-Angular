import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';

declare var jQuery: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private api: ApiBillService
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  ngOnInit(): void {
    this.getAllBill()
  }
  listBill: any
  bill:  any | null;
  onShow: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  getAllBill(){
    this.api.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
    })
  }
  getDataDetail(id: number){
    this.api.getBillById(id).subscribe((res: Bill) =>{
      this.bill = res;
      this.onShow = true;
    })
  }
  onClose(){
    this.onShow = false;
    this.bill = null;
  }
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }
  checkSearch: boolean | null = null;
  onSearch(){
    if(this.startDate && this.endDate){
      // console.log(this.startDate + ' ' + this.endDate)
      const start = this.startDate.toString().replace(/-/g,'/')
      const end = this.endDate.toString().replace(/-/g,'/')
      if(this.startDate <= this.endDate){
        this.api.searchBill(start, end).subscribe((res: Bill)=>{
          alert("Tìm kiếm thành công !!!")
          this.checkSearch = true;
          this.listBill = res;
        })
      }else {
        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc !!!")
      }

    } else {
      alert("Vui lòng nhập đủ ngày bắt đầu và kết thúc !!!")
    }
  }
  onAbortSearch(){
    this.checkSearch = null;
    this.startDate = null;
    this.endDate = null;
    this.getAllBill();
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
