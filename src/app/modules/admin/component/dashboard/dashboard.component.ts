import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';
import { ApiDashboardService } from 'src/app/services/dashboard/api-dashboard.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private api: ApiDashboardService ,
    private apiBill:ApiBillService,
    private apiProduct: ApiProductService
    ) { }

  ngOnInit(): void {
    this.getCountNewBill()
    this.getCountNewProfile()
    this.getTurnOver()
    this.getProductSold()
    this.getAllBill()
    this.getLatestProduct()
  }
  countNewBill: any;
  countNewProfile: any;
  turnOver: any;
  productSold: any;
  productLatest: any;
  getProuctSold(){

  }
  getCountNewBill(){
    this.api.countNewBill().subscribe(res =>{
      this.countNewBill = res
    })
  }
  getCountNewProfile(){
    this.api.countNewProfile().subscribe(res =>{
      this.countNewProfile = res
    })
  }
  getTurnOver(){
    this.api.getTurnOver().subscribe(res =>{
      this.turnOver = res
    })
  }
  getProductSold(){
    this.api.getAllProductSold().subscribe(res =>{
      this.productSold = res
    })
  }
  listBill: any
  getAllBill(){
    this.apiBill.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
    })
  }
  getLatestProduct(){
    this.apiProduct.getProductEnable().subscribe(res =>{
      this.productLatest = res
    })
  }
}
