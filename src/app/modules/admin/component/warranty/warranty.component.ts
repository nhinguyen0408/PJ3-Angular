import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  constructor(
    private api: ApiBillService,
    private toastsService: ToastService
  ) { }

  ngOnInit(): void {
  }

  listBill: any;
  bill:  any | null;
  onShow: boolean = false;
  phone: string = '';
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  searchWarranty(phone: string){
    if(phone === ""){
      this.toastsService.alert("Thông báo !!!", "Vui lòng nhập số điện thoại !!!", "bg-warning");
    } else if(phone.match(this.phoneValidate)){
      this.api.searchBillWarranty(phone).subscribe((data: any) => {
        this.listBill = data;
        if(this.listBill.length == 0){
          this.toastsService.alert("Thông báo !!!", "Số điện thoại chưa từng được sử dụng !!!", "bg-warning");
        }
      })
    } else {
      this.toastsService.alert("Thông báo !!!", "Vui lòng nhập đúng định dạng số điện thoại !!!", "bg-warning");
    }
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

}
