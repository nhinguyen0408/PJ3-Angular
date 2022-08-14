import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { WarrantyService } from 'src/app/services/admin/warranty/warranty.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  constructor(
    private apiBill: ApiBillService,
    private apiWarranty: WarrantyService,
    private toastsService: ToastService
  ) { }

  ngOnInit(): void {
  }
  now: Date = new Date()
  listWarranty: any = [];
  bill:  any | null;
  onShow: boolean = false;
  textSearch: string = '';
  textBtn: string = 'Tìm kiếm'
  isPhone: boolean = false
  isShowData: boolean = false
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  listBill: any = []
  owner: any;
  product: any;
  testWarranty: boolean = false
  searchWarranty(textSearch: string){
    if(textSearch.trim() == ""){
      this.textSearch = ''
      this.toastsService.alert("Thông báo !!!", "Vui lòng nhập số điện thoại hoặc IMEI !!!", "bg-warning");
    } else if(this.isPhone == true){
      this.apiWarranty.getWarrantyByPhone(textSearch).subscribe((data: any) => {
        this.isShowData = true
        this.listWarranty = data;

        console.log("res", this.listWarranty)
        if(this.listWarranty.length == 0){
          this.toastsService.alert("Thông báo !!!", "Số điện thoại chưa từng thực hiện bảo hành !!!", "bg-warning");
        }
      })
    } else {
      this.apiWarranty.getBillByImei(textSearch).subscribe((data: any) => {
        if(data){
          this.isShowData = true;
          this.listBill = data;
          if(this.listBill.length == 0){
            this.toastsService.alert("Thông báo !!!", "Không tìm thấy sản phẩm có IMEI trên, Vui lòng thử lại !!!", "bg-warning");
          } else if(this.listBill.length > 0){
            this.owner = {
              userPhone: data[0].phone,
              userName: data[0].ownerName,
              userAddress: data[0].address,
              productCondition: '',
              imei: textSearch,
              surcharge: 0,
              status: ''
            }
            this.listBill.map((element: any, idx: number) => {
              this.apiBill.getBillById(element.id).subscribe((res : any) => {
                if(res){
                  this.listBill[idx] = {...element, billDetail: res}
                  if(res && res.billDetail && res.billDetail.length > 0){
                    this.product = res.billDetail.filter((e: any) => e.imei == textSearch)
                    this.product[0] = {...this.product[0], warrantyEndDate: new Date(this.product[0].warrantyEndDate)}
                    this.testWarranty = this.product[0].warrantyEndDate.getTime() > this.now.getTime()
                    this.owner = {...this.owner, productId: this.product[0].productId}
                    console.log("this.product",this.product);
                    console.log("this.owner",this.owner);
                  }
                }
              })
            })
          }
          console.log("res", this.listBill)
        }

      })
      // this.toastsService.alert("Thông báo !!!", "Vui lòng nhập đúng định dạng số điện thoại !!!", "bg-warning");
    }
  }
  // getDataDetail(id: number){
  //   this.api.getBillById(id).subscribe((res: Bill) =>{
  //     this.bill = res;
  //     this.onShow = true;
  //   })
  // }
  creatWarranty = () => {
    console.log("this.owner", this.owner)
    if(window.confirm("Xác nhận lưu lịch sử bảo hành ???")){
      this.apiWarranty.createWarranty(this.owner).subscribe((res: any) => {
        if(res){
          this.owner = undefined;
        }
      })
    }
  }

  onBlurSearch(event : any){
    const value = event.target.value
    this.textSearch = value
    if(value.trim() == ''){
      this.textSearch = ''
    } else
    if(value.match(this.phoneValidate)){
      this.textBtn = "Tìm kiếm theo số điện thoại"
      this.isPhone = true
    } else {
      this.textBtn = "Tìm kiếm theo số IMEI"
      this.isPhone = false
    }
  }
  dataWarrantyHistory: any
  setDataWarranty = (idx: number) => {
    this.dataWarrantyHistory = this.listWarranty[idx];
  }
  onEditProductCondition = (idx: number) => {
    this.dataWarrantyHistory.data[idx].isEdit = true
  }
  onAbortEditProductCondition = (idx: number) => {
    this.dataWarrantyHistory.data[idx].isEdit = false
  }
  dataEditProductCondition: {productCondition: string} = {productCondition: ''}
  onInputEditCondition = (e: any) => {
    const value = e.target.value
    if(value.trim() != ''){
      this.dataEditProductCondition.productCondition = value
    }
  }
  onSubmitEditProductCondition = (id: number, idx: number) => {
    if(window.confirm("Xác nhận thay đổi dữ liệu bảo hành?")){
      if(this.dataEditProductCondition.productCondition.trim() != ''){
        this.apiWarranty.updateWarranty(id, this.dataEditProductCondition).subscribe((res: any) => {
          if(res){
            this.dataWarrantyHistory.data[idx].isEdit = false;
            this.dataWarrantyHistory.data[idx].productCondition = this.dataEditProductCondition.productCondition
            this.dataEditProductCondition.productCondition = ''
          }
        })
      } else {
        this.toastsService.alert("Thông báo !!!", "Nội dung bảo hành không được để trống !!!", "bg-warning");
      }

    }
  }
  onClose(){
    this.onShow = false;
    this.bill = null;
  }

}
