import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductService } from 'src/app/services/product/api-product.service';
import { ApiSaleService } from 'src/app/services/sale/api-sale.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {

  constructor(
    private api: ApiSaleService,
    private apiProduct: ApiProductService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private toastsService: ToastService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getProductById();
    this.checkSaleExist()
  }

  id = this.actRoute.snapshot.params['productId'];
  salePercent: number | null = null;
  startDate: Date | null = null
  endDate: Date | null = null
  stringStart: string| null = '';
  stringEnd: string| null = '';
  product: any;
  productSaleExist: any;
  getProductById(){
    this.apiProduct.getById(Number(this.id)).subscribe(res=>{
      this.product = res
    })
  }
  checkSaleExist(){
    this.api.getById(Number(this.id)).subscribe((res: any) => {
      this.productSaleExist = res.responseData;
      this.salePercent =  this.productSaleExist.sale;
      this.stringStart = this.formatDate(this.productSaleExist.startDate);
      this.stringEnd = this.formatDate(this.productSaleExist.endDate);
      this.startDate = this.productSaleExist.startDate;
      this.endDate = this.productSaleExist.endDate;
    })
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
  editStart(){
    if(this.stringStart){
      this.stringStart= '';
    }
  }
  editEnd(){
    if(this.stringEnd){
      this.stringEnd = '';
    }
  }
  onSubmit(){
    if(this.salePercent && this.startDate && this.endDate){
      if(this.salePercent && this.salePercent > 0 && this.salePercent < 50){
        // console.log("salePercent",this.startDate)
        // console.log("salePercent",this.endDate)
        // console.log("salePercent",this.salePercent)
        if(this.startDate > this.endDate){
          // alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!")
          this.toastsService.alert('Thông báo !!!', "Ngày kết thúc không thể sớm hơn ngày bắt đầu !!!!",'bg-warning');
        } else {
          const adminId = localStorage.getItem("adminId")
          const obj = {
            "productId": this.id,
            "sale": this.salePercent,
            "createdBy": adminId,
            "startDate": this.startDate,
            "endDate": this.endDate
          }
          // console.log("obj",obj)
          this.api.upSertSale(obj).subscribe(res => {
            // alert("Tạo Sale thành công !!!");
            this.toastsService.alert('Thông báo !!!', "Tạo Sale thành công !!!",'bg-success');
            this.route.navigate(['/admin/sale'])
          })
        }

      } else {
        // alert("Số Phần trăm không hợp lệ !!! Vui lòng thử lại !!!!")
        this.toastsService.alert('Thông báo !!!', "Số Phần trăm không hợp lệ !!! Vui lòng thử lại !!!!",'bg-warning');
      }
    } else {
      // alert("Vui lòng điền đủ các trường thông tin !!!")
      this.toastsService.alert('Thông báo !!!', "Vui lòng điền đủ các trường thông tin !!!",'bg-warning');
    }


  }
  back(){
    this.location.back();
  }
}
