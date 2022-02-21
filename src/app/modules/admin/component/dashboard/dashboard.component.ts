import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
// import { ChartDataset, ChartOptions, Chart } from 'chart.js';
// import { baseColors, Labels } from 'ng2-charts';
import { Bill } from 'src/app/models/Bill.model';
import { Product } from 'src/app/models/Product.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';
import { ApiDashboardService } from 'src/app/services/dashboard/api-dashboard.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';
declare var jQuery: any;
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
    this.getCountProdSold()
    this.getAllProduct()
    this.getChart()

  }
  countNewBill: any;
  countNewProfile: any;
  countProductSold: any;
  turnOver: any;
  productSold: any;
  productLatest: any;
  productList: any;
  sumPr: number = 0;
  chartData: any;
  chartImportTotal: number [] = []
  chartSoldTotal: number [] = []
  chartMonth: number [] = []
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
  getCountProdSold(){
    this.api.countProdSold().subscribe(res =>{
      this.countProductSold = res
    })
  }
  getAllProduct(){
    this.apiProduct.getProductEnable().subscribe((res: any)=> {
      this.productList = res;
      for(let i = 0; i<= this.productList.length; i++){
        this.sumPr += this.productList[i].quantity
      }
    })
  }
  getChart(){
    this.api.getChart().subscribe((res: any) => {
      this.chartData = res;
      console.log("this.chartData==",this.chartData)
      for(let i = 0; i <= 11; i++){
        this.chartImportTotal[i] = this.chartData[i].importTotal;
        this.chartSoldTotal[i] = this.chartData[i].soldTotal;
        this.chartMonth[i] = this.chartData[i].month;
      };
      console.log("this.chartImportTotal==",this.chartImportTotal)
      console.log("this.chartSoldTotal==",this.chartSoldTotal)
      console.log("this.chartMonth==",this.chartMonth)
      this.createChart(this.chartImportTotal, this.chartSoldTotal, this.chartMonth)

    })
  }
  $: any;
  createChart(dataPrice: number[], dataSale: number[], dataMonth: number[] ){
    (function ($) {
      'use strict'

      var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
      }
      var mode      = 'index';
      var mode2      = 'index';
      var intersect = true;
      var $salesChart = $('#sales-chart')
      var salesChart  = new Chart($salesChart, {
        type   : 'bar',
        data   : {
          labels  : dataMonth,
          datasets: [
            {
              label: 'Tổng Nhập kho',
              backgroundColor: '#007bff',
              borderColor    : '#007bff',
              data           : dataPrice
            },
            {
              label: 'Tổng Bán',
              backgroundColor: '#ced4da',
              borderColor    : '#ced4da',
              data           : dataSale
            }
          ]
        },
        options: {

          maintainAspectRatio: false,

        }
      })
      })(jQuery);
  }



}
