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
  countDown: any
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
      this.productLatest = res;
      this.getCountDown()
    })
  }
  getCountProdSold(){
    this.api.countProdSold().subscribe(res =>{
      this.countProductSold = res
    })
  }
  getAllProduct(){
    this.apiProduct.getProduct().subscribe((res: any)=> {
      this.productList = res;

      this.getOutOfStockSoon()
      for(let i = 0; i<= this.productList.length; i++){
        this.sumPr += this.productList[i].quantity;
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
              backgroundColor: '#696969',
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
  getCountDown(){
    if(this.productLatest){

      var x = setInterval(() =>{
        this.countDown = [];
        for(let i =0; i<=4; i++){
          let data = {'days': '', 'hours': '', 'minutes': '', 'seconds': '','idPr': 0};
          if(this.productLatest[i]?.saleEntity){
            const endTime = new Date(this.productLatest[i].saleEntity.endDate).getTime();
            var now = new Date().getTime();
            var distance = endTime - now;
            data.days = (distance / (1000 * 60 * 60 * 24)).toFixed();
            data.hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) >10 ?((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed() : '0' + ((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed();
            data.minutes = ((distance % (1000 * 60 * 60)) / (1000 * 60)) > 10 ? ((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed() : '0' +((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed();
            data.seconds = ((distance % (1000 * 60)) / 1000) > 10 ? ((distance % (1000 * 60)) / 1000).toFixed() : '0' + ((distance % (1000 * 60)) / 1000).toFixed();
            data.idPr = this.productLatest[i].id
          }
          this.countDown.push(data);
          // console.log("data",data)
        }

      }, 1000)

    }
  }
  productOutOfStockSoonList: Product [] = [];
  getOutOfStockSoon(){
    console.log("productList",this.productList)
    this.productList.forEach( (element: any) => {
      if(element.quantity < 5){
        this.productOutOfStockSoonList.push(element);
        console.log("element",element)
      }
    });
  }



}
