import { Component, OnInit } from '@angular/core';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any
@Component({
  selector: 'app-order-confired',
  templateUrl: './order-confired.component.html',
  styleUrls: ['./order-confired.component.css']
})
export class OrderConfiredComponent implements OnInit {

  constructor(
    private apiBill: ApiBillService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.setDataTable()
    this.getAllBill()
  }

  listBill: any = []
  bill: any
  listBillIMEI : {billDetailId: number, imei: any[]}[] = []
  getDataDetail = (billId: number) => {
    this.apiBill.getBillById(billId).subscribe((res: any) =>{
      if(res){
        this.bill = res
        if(this.bill.billDetail){
          this.bill.billDetail.map((e: any, index: number) => {
            if(e.warrantyEndDate != null){
              const dataImei: any[] = []
              for(let i = 0; i < e.quantity ; i++)
              {
                const imei = ' '
                dataImei[i] = {data: imei}
              }
              this.listBillIMEI[index] = {billDetailId: e.id, imei: dataImei}
            }
          })
        }

      }
    })
  }
  setDataTable(){
    setTimeout(() => {
      (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
    }, 300)
  }
  getAllBill(){
    this.apiBill.getBill().subscribe((res: any) =>{
      if(res && res.length > 0){
        this.listBill = res.filter((e: any) => e.status == 'VERIFIED');
      }
    })
  }

  onClose = () => {
    this.bill = null;
  }

  updateStatusBill = (id: number) => {
    if(window.confirm('Xác nhận đã gửi hàng cho bên vận chuyển ???')){
      const data = {billId: id, status: 'INPROGRESS'}
      this.apiBill.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getAllBill()
          this.listBillIMEI = []
          this.toastService.alert('Thông báo !!!', "Xác nhận đã gửi đơn hàng " + this.bill.code + " thành công !!!!",'bg-success');
          this.bill = null
        }
      })

    }
  }

}
