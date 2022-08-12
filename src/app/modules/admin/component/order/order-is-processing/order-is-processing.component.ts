import { Component, OnInit } from '@angular/core';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any
@Component({
  selector: 'app-order-is-processing',
  templateUrl: './order-is-processing.component.html',
  styleUrls: ['./order-is-processing.component.css']
})
export class OrderIsProcessingComponent implements OnInit {

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
              // this.bill.billDetail[index].imei = dataImei

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
        this.listBill = res.filter((e: any) => e.status == 'INPROGRESS');
      }
    })
  }

  onClose = () => {
    this.bill = null;
  }

}
