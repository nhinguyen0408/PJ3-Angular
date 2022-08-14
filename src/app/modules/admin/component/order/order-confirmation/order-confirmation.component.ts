import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
const AbortType = [
  {
    value: 1,
    reason: 'Khách hàng yêu cầu hủy đơn'
  },
  {
    value: 2,
    reason: 'Sai địa chỉ nhận hàng'
  },
  {
    value: 3,
    reason: 'Đơn hàng bị trùng lặp'
  },
  {
    value: 4,
    reason: 'Đơn hàng không đạt yêu cầu'
  },
  {
    value: 5,
    reason: 'Không có đơn vị vận chuyển phù hợp'
  },
  {
    value: 6,
    reason: 'Hết hàng'
  },
  {
    value: 7,
    reason: 'Bộ phận giao hàng không nhận giao đơn'
  },
  {
    value: 8,
    reason: 'Khác'
  },
]


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  constructor(
    private apiBill: ApiBillService,
    private toastService: ToastService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      this.billIdFromNotify = params['id'];
    });
    this.setDataTable()
    this.getAllBill()
  }
  billIdFromNotify: string = ''
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
        if(this.bill.reason != null || this.bill.reason != '' || this.bill.reason != undefined ){
          this.reason = this.bill.reason
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
        this.listBill = res.filter((e: any) => e.status == 'VERIFYING' || e.status == 'CANCELED_REQUEST');
        if(this.billIdFromNotify && this.billIdFromNotify != ''){
          this.listBill = this.listBill.filter((e: any) => e.id == this.billIdFromNotify)
        }
      }
    })
  }

  onClose = () => {
    this.bill = null;
  }

  verifyBill = (id: number) => {
    if(window.confirm('Xác nhận đơn hàng này ???')){
      const data = {billId: id, status: 'VERIFIED'}
      this.apiBill.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.createIMEI()
          this.getAllBill()
          this.listBillIMEI = []
          this.bill = null
          this.toastService.alert('Thông báo !!!', "Xác nhận đơn hàng thành công !!!!",'bg-success');
        }
      })

    }
  }

  createIMEI = () => {
    if(this.listBillIMEI && this.listBillIMEI.length > 0 ){
      this.listBillIMEI.map((e: any) => {
        const dataImei : string[] = []
        if(e.imei && e.imei.length > 0){
          e.imei.map((element: any) => {
            dataImei.push(element.data)
          })
        }
        const data = {billDetailId: e.billDetailId, imei: dataImei}
        this.apiBill.createImei(data).subscribe(res => {})
      })

      // this.listBillIMEI.map((e: any) => {
      //   this.apiBill.createImei(e).subscribe(res => {})
      // })
    }
  }

  AbortBill = (id: number) => {
    if(window.confirm('Xác nhận hủy đơn hàng này ???')){
      const data = {billId: id, status: 'CANCELED', reason: this.reason}
      this.apiBill.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getAllBill()
          this.listBillIMEI = []
          this.bill = null
          this.reason = ''
          this.resonValue = null
          this.toastService.alert('Thông báo !!!', "Hủy đơn hàng thành công !!!!",'bg-success');
        }
      })
    }

  }

  onBlurIMEI= (idxParent: number, idxChild: number, e: any) => {
    console.log("deraefefe============================");
    this.apiBill.checkImei(e.target.value).subscribe((res: any) => {
      if(res == false){
        this.listBillIMEI[idxParent].imei[idxChild].data = e.target.value;
      } else {
        this.toastService.alert('Thông báo !!!', "Imei đã tồn tại, vui lòng kiểm tra lại !!!!",'bg-warning');
      }
    })
  }

  reason: string = ''
  resonValue: any
  isOtherReason: boolean = false;

  onCloseModalAbort = () => {
    this.bill = null
    this.reason = ''
    this.resonValue = null
  }

  onChangeReason = (e: any) => {
    this.resonValue = e.target.value
    if(this.resonValue == 8){
      this.isOtherReason = true
      this.reason = ''
    } else {
      this.isOtherReason = false
      const dataReason = AbortType.filter((e: any) => e.value == this.resonValue)
      this.reason = dataReason[0].reason
    }
  }

}
