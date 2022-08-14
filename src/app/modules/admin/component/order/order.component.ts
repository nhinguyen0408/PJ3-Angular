import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bill } from 'src/app/models/Bill.model';
import { Profile } from 'src/app/models/Profile.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;

interface CreateImeiType{}

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
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private api: ApiBillService,
    private toastsService: ToastService,
    private apiProfile: ApiProfileService,
    private actRoute: ActivatedRoute
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      this.billIdFromNotify = params['id'];
    });
    this.getAllBill();
    this.getAllProfile();
  }
  billIdFromNotify: string = ''
  listBill: any
  bill:  any | null;
  listEmployee: Profile[] = [];
  employee: number = 0;
  onShow: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  countBillByType: any[] = []
  getAllBill(){
    this.api.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
      if(this.billIdFromNotify && this.billIdFromNotify != ''){
        this.listBill = this.listBill.filter((e: any) => e.id == this.billIdFromNotify)
      }
      this.countDataBillsType()

    })
  }

  countDataBillsType = () => {
    if(this.listBill && this.listBill.length > 0){
      this.countBillByType[0] = {type: 'VERIFYING', data: this.listBill.filter((e: any) => e.status == 'VERIFYING')}
      this.countBillByType[1] = {type: 'VERIFIED', data: this.listBill.filter((e: any) => e.status == 'VERIFIED')}
      this.countBillByType[2] = {type: 'INPROGRESS ', data: this.listBill.filter((e: any) => e.status == 'INPROGRESS ')}
      this.countBillByType[3] = {type: 'COMPLETED', data: this.listBill.filter((e: any) => e.status == 'COMPLETED')}
      this.countBillByType[4] = {type: 'CANCELED', data: this.listBill.filter((e: any) => e.status == 'CANCELED')}
      this.countBillByType[5] = {type: 'CANCELED_REQUEST', data: this.listBill.filter((e: any) => e.status == 'CANCELED_REQUEST')}
      this.countBillByType[6] = {type: 'COD', data: this.listBill.filter((e: any) => e.type == 'COD')}
      this.countBillByType[7] = {type: 'OFFLINE', data: this.listBill.filter((e: any) => e.type == 'OFFLINE')}
    }
  }

  filtByType = (type: string) => {
    this.api.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
      if(type == 'COD' || type == 'OFFLINE'){
        const data = this.listBill.filter((e: any) => e.type == type)
        this.listBill = data
        this.checkSearch = true;
      } else {
        const data = this.listBill.filter((e: any) => e.status == type)
        this.listBill = data
        this.checkSearch = true;
      }
    })

  }

  getAllProfile(){
    this.apiProfile.getProfile().subscribe((res: any) =>{
      if(res.length > 0){
        res.forEach( (element: any) => {
          if(element.role === "EMPLOYEE"){
            this.listEmployee.push(element);
          }
        })
      }
    })
  }
  listBillIMEI : {billDetailId: number, imei: any[], isError: boolean}[] = []
  reason: string = ''
  isUserRequest: boolean = false
  resonValue: any
  isOtherReason: boolean = false;
  getDataDetail = (billId: number) => {
    this.api.getBillById(billId).subscribe((res: any) =>{
      if(res){
        this.bill = res
        if(this.bill.billDetail && this.bill.status == "VERIFYING"){
          this.bill.billDetail.map((e: any, index: number) => {
            if(e.warrantyEndDate != null){
              const dataImei: any[] = []
              for(let i = 0; i < e.quantity ; i++)
              {
                const imei = ' '
                dataImei[i] = {data: imei}
              }
              this.listBillIMEI[index] = {billDetailId: e.id, imei: dataImei, isError: false}
            }
          })
        }
        if(this.bill.reason != null && this.bill.reason != '' && this.bill.reason != undefined ){
          this.reason = this.bill.reason
          this.isUserRequest = true
        }

      }
    })
  }
  isErrorImei: boolean = false;
  onBlurIMEI= (idxParent: number, idxChild: number, e: any) => {
    const data = e.target.value.trim()
    this.api.checkImei(data).subscribe((res: any) => {
      console.log("deraefefe============================",res);
      if(res == false){
        this.listBillIMEI[idxParent].imei[idxChild].isError = false;
        this.listBillIMEI[idxParent].imei[idxChild].data = e.target.value;
      } else {
        this.listBillIMEI[idxParent].imei[idxChild].isError = true;
        this.isErrorImei = true
        this.toastsService.alert('Thông báo !!!', "Imei đã tồn tại, vui lòng kiểm tra lại !!!!",'bg-warning');
      }
    })
  }
  verifyBill = (id: number) => {
    if(window.confirm('Xác nhận đơn hàng này ???')){
      if(this.isErrorImei == true){
        this.toastsService.alert('Thông báo !!!', "Có lỗi đã xảy ra trong quá trình nhập imei !!!!",'bg-warning');
      } else {
        const data = {billId: id, status: 'VERIFIED'}
        this.api.updateStatus(data).subscribe((res: any) =>{
          if(res){
            this.createIMEI()
            this.getAllBill()
            this.listBillIMEI = []
            this.bill = null
            this.toastsService.alert('Thông báo !!!', "Xác nhận đơn hàng thành công !!!!",'bg-success');
          }
        })
      }
    }
  }
  createIMEI = () => {
    if(this.listBillIMEI && this.listBillIMEI.length > 0 ){
      this.listBillIMEI.map((e: any) => {
        const dataImei : string[] = []
        if(e.imei && e.imei.length > 0){
          e.imei.map((element: any) => {
            dataImei.push(element.data.trim())
          })
        }
        const data = {billDetailId: e.billDetailId, imei: dataImei}
        this.api.createImei(data).subscribe(res => {})
      })

      // this.listBillIMEI.map((e: any) => {
      //   this.apiBill.createImei(e).subscribe(res => {})
      // })
    }
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
  AbortBill = (id: number) => {
    if(window.confirm('Xác nhận hủy đơn hàng này ???')){
      const data = {billId: id, status: 'CANCELED', reason: this.reason}
      this.api.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getAllBill()
          this.listBillIMEI = []
          this.bill = null
          this.reason = ''
          this.resonValue = null
          this.toastsService.alert('Thông báo !!!', "Hủy đơn hàng thành công !!!!",'bg-success');
        }
      })
    }

  }
  updateStatusBill = (id: number) => {
    if(window.confirm('Xác nhận đã gửi hàng cho bên vận chuyển ???')){
      const data = {billId: id, status: 'INPROGRESS'}
      this.api.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getAllBill()
          this.listBillIMEI = []
          this.toastsService.alert('Thông báo !!!', "Xác nhận đã gửi đơn hàng " + this.bill.code + " thành công !!!!",'bg-success');
          this.bill = null
        }
      })

    }
  }
  onCloseModalAbort = () => {
    this.bill = null
    this.reason = ''
    this.resonValue = null
    this.isUserRequest = false
  }
  onClose(){
    this.onShow = false;
    this.bill = null;
    this.isUserRequest = false
    this.listBillIMEI = []
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
        return se.id
      })(jQuery);
      const start = this.startDate.toString().replace(/-/g,'/')
      const end = this.endDate.toString().replace(/-/g,'/')
      if(this.startDate <= this.endDate){
        this.api.searchBill(start, end, employeeId).subscribe((res: Bill)=>{
          this.toastsService.alert('Thông báo !!!', "Tìm kiếm thành công !!!!",'bg-success');
          this.checkSearch = true;
          this.listBill = res;
          this.countDataBillsType()
        })
      }else {
        this.toastsService.alert('Thông báo !!!', "Ngày bắt đầu không được lớn hơn ngày kết thúc !!!",'bg-warning');
      }

    } else if(this.startDate || this.endDate){
      const start = this.startDate ? this.startDate.toString().replace(/-/g,'/') : '01/01/2010'
      const end = this.endDate ? this.endDate.toString().replace(/-/g,'/') : '01/01/2095'
      this.api.searchBill(start, end , 0).subscribe((res: Bill)=>{
        this.toastsService.alert('Thông báo !!!', "Tìm kiếm thành công !!!!",'bg-success');
        this.checkSearch = true;
        this.listBill = res;
        this.countDataBillsType()
      })
    } else {
      let employeeId = (function ($) {
        let se = $('#employee').select2('data')[0]
        return se.id
      })(jQuery);
      if(employeeId){
        this.api.searchBill('01/01/2010', '01/01/2095', employeeId).subscribe((res: Bill)=>{
          this.toastsService.alert('Thông báo !!!', "Tìm kiếm thành công !!!!",'bg-success');
          this.checkSearch = true;
          this.listBill = res;
          this.countDataBillsType()
        })
      }
    }
  }
  onAbortSearch(){
    this.billIdFromNotify = ''
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
