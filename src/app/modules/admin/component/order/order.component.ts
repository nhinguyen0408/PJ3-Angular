import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { Profile } from 'src/app/models/Profile.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private api: ApiBillService,
    private toastsService: ToastService,
    private apiProfile: ApiProfileService
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  ngOnInit(): void {
    this.getAllBill();
    this.getAllProfile();
  }
  listBill: any
  bill:  any | null;
  listEmployee: Profile[] = [];
  employee: number = 0;
  onShow: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  getAllBill(){
    this.api.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
    })
  }
  getAllProfile(){
    this.apiProfile.getProfile().subscribe((res: any) =>{
      console.log(res);
      if(res.length > 0){
        res.forEach( (element: any) => {
          if(element.role === "EMPLOYEE"){
            this.listEmployee.push(element);
          }
        })
      }
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
        $('.select2bs4').select2({
          theme: 'bootstrap4'
        });
    })(jQuery);
  }
  checkSearch: boolean | null = null;
  onSearch(){
    if(this.startDate && this.endDate){
      let employeeId = (function ($) {
        let se = $('#employee').select2('data')[0]
        console.log("selected category: ", se.id)
        return se.id
      })(jQuery);
      // console.log(this.startDate + ' ' + this.endDate)
      const start = this.startDate.toString().replace(/-/g,'/')
      const end = this.endDate.toString().replace(/-/g,'/')
      if(this.startDate <= this.endDate){
        this.api.searchBill(start, end, employeeId).subscribe((res: Bill)=>{
          // alert("Tìm kiếm thành công !!!")
          this.toastsService.alert('Thông báo !!!', "Tìm kiếm thành công !!!!",'bg-success');
          this.checkSearch = true;
          this.listBill = res;
        })
      }else {
        // alert("Ngày bắt đầu không được lớn hơn ngày kết thúc !!!")
        this.toastsService.alert('Thông báo !!!', "Ngày bắt đầu không được lớn hơn ngày kết thúc !!!",'bg-warning');
      }

    } else {
      // alert("Vui lòng nhập đủ ngày bắt đầu và kết thúc !!!")
      this.toastsService.alert('Thông báo !!!', "Vui lòng nhập đủ ngày bắt đầu và kết thúc !!!",'bg-warning');
    }
  }
  onAbortSearch(){
    this.checkSearch = null;
    this.startDate = null;
    this.endDate = null;
    this.employee = 0;
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
            },400)

    })(jQuery);
  }

}
