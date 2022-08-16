import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
// import { ChartDataset, ChartOptions, Chart } from 'chart.js';
// import { baseColors, Labels } from 'ng2-charts';
import { Bill } from 'src/app/models/Bill.model';
import { Product } from 'src/app/models/Product.model';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ApiDashboardService } from 'src/app/services/admin/dashboard/api-dashboard.service';
import { ApiProductService } from 'src/app/services/admin/product/api-product.service';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
import * as XLSX from 'xlsx';

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
    private apiProduct: ApiProductService,
    private apiProfile: ApiProfileService
    ) { }

  ngOnInit(): void {
    this.getCountNewProfile()
    this.getTurnOver()
    this.getCountNewEmployee()
    this.getProductSold()
    this.getAllBill()
    this.getLatestProduct()
    this.getCountProdSold()
    this.getAllProduct()
    this.getChart()
    this.getBestEmp()
    this.getCountNewBill()
    this.getChartMonth();
    this.getAllUser();
    (function ($) {
      $("#chart-year").click(function() {
        $("#div-sales-chart").addClass("active");
        $("#div-sales-chart-month").removeClass("active");
      });
      $("#chart-month").click(function() {
        $("#div-sales-chart").removeClass("active");
        $("#div-sales-chart-month").addClass("active");
      });
    })(jQuery);

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
  listUser: any = []

  getProuctSold(){

  }

  getAllUser(){
    this.apiProfile.getProfile('USER').subscribe((data: any)=>{
      this.listUser = data
    })
  }

  getCountNewBill(){
    this.api.countNewBill().subscribe(res =>{
      this.countNewBill = res
      this.countDataBillsType()
    })
  }
  getCountNewProfile(){
    this.api.countNewProfile('USER').subscribe(res =>{
      this.countNewProfile = res
    })
  }
  countNewEmployee: any
  getCountNewEmployee(){
    this.api.countNewProfile('EMPLOYEE').subscribe(res =>{
      this.countNewEmployee = res
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
      console.log("productSold", res);

    })
  }
  listBill: Bill[] = []
  getAllBill(){
    this.apiBill.getBill().subscribe((res: any) =>{
      this.listBill = res.filter((e:any) => e.status == 'COMPLETED');
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
      for(let i = 0; i< this.productList.length; i++){
        this.sumPr += Number(this.productList[i]?.quantity);
      }
    })

  }
  getChart(){
    this.api.getChart().subscribe((res: any) => {
      this.chartData = res;
      for(let i = 0; i <= 11; i++){
        this.chartImportTotal[i] = this.chartData[i].importTotal;
        this.chartSoldTotal[i] = this.chartData[i].soldTotal;
        this.chartMonth[i] = this.chartData[i].month;
      };
      // console.log("this.chartImportTotal==",this.chartImportTotal)
      // console.log("this.chartSoldTotal==",this.chartSoldTotal)
      // console.log("this.chartMonth==",this.chartMonth)
      this.createChart(this.chartImportTotal, this.chartSoldTotal, this.chartMonth)

    })
  }
  dataDay: number [] = []
  dataBill: number [] = []
  dataTotalSale: number[] =[]
  getChartMonth(){
    this.api.getChartMonth().subscribe((res:any) => {
      if(res && res.length > 0){
        // let dataDay = [];
        // let dataBill = [];
        res.forEach((element: any) =>{
          this.dataDay.push(element.day);
          this.dataBill.push(element.billCount);
          this.dataTotalSale.push(element.totalSale);
        })

        this.createChartMonth(this.dataDay, this.dataBill, this.dataTotalSale)
        // console.log("dataDay==",this.dataDay);
      }
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
              backgroundColor: '#46696F',
              borderColor    : '#007bff',
              data           : dataPrice
            },
            {
              label: 'Tổng Bán',
              backgroundColor: '#1DA8BD',
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
  createChartMonth(dataDay: number[], dataBill: number[], dataTotalSale: number[] ){
    (function ($) {
      'use strict'

      var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
      }
      var mode      = 'index';
      var data      = 'index';
      var intersect = true;
      var $salesChart = $('#sales-chart-month')
      var salesChart  = new Chart($salesChart, {
        type   : 'bar',
        data   : {
          labels  : dataDay,
          datasets: [
            // {
            //   label: 'Tổng đơn hàng',
            //   backgroundColor: '#188EDC',
            //   borderColor    : '#007bff',
            //   data           : dataBill
            // },
            {
              label: 'Tổng Bán',
              backgroundColor: '#1DA8BD',
              borderColor    : '#ced4da',
              data           : dataBill
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
    this.productList.forEach( (element: any) => {
      if(element.quantity < 5){
        this.productOutOfStockSoonList.push(element);
      }
    });
  }
  dataBestEmp: any;
  getBestEmp(){
    this.api.getBestEmployee().subscribe((res:any)=>{
      this.dataBestEmp = res;
    })
  }
  countBillByType: {type: string, data: any}[] = []
  countDataBillsType = () => {
    if(this.listBill && this.listBill.length > 0){
      console.log('listBill', this.listBill)
      this.countBillByType[0] = {type: 'VERIFYING', data: this.countNewBill.data.filter((e: any) => e.status == 'VERIFYING').length}
      this.countBillByType[1] = {type: 'VERIFIED', data: this.countNewBill.data.filter((e: any) => e.status == 'VERIFIED').length}
      this.countBillByType[2] = {type: 'INPROGRESS ', data: this.countNewBill.data.filter((e: any) => e.status == 'INPROGRESS ').length}
      this.countBillByType[3] = {type: 'COMPLETED', data: this.countNewBill.data.filter((e: any) => e.status == 'COMPLETED').length}
      this.countBillByType[4] = {type: 'CANCELED', data: this.countNewBill.data.filter((e: any) => e.status == 'CANCELED').length}
      this.countBillByType[5] = {type: 'CANCELED_REQUEST', data: this.countNewBill.data.filter((e: any) => e.status == 'CANCELED_REQUEST').length}
    }
    const dataPushChart: any = [];
    this.countBillByType.map(e => {
      dataPushChart.push(e.data)
    })
    this.createChartOrder(dataPushChart)
  }

  createChartOrder(data: number[]){
    (function ($) {
      'use strict'

      var donutChartCanvas = $('#donutChart').get(0).getContext('2d')
      var donutData        = {
        labels: [
            'Chờ xác nhận',
            'Chờ lấy hàng',
            'Đang Vận chuyển',
            'Thành công',
            'Đã hủy',
            'Đang  yêu cầu hủy',
        ],
        datasets: [
          {
            data: data,
            backgroundColor : ['#dce309', '#a2e309', '#09e3c2', '#229c22', '#9c2622', '#b36868'],
          }
        ]
      }
      var donutOptions     = {
        maintainAspectRatio : false,
        responsive : true,
      }
      //Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      var donutChart = new Chart(donutChartCanvas, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
      })
    })(jQuery);
  }

  exportexcel(name: string, idHTML: string): void
  {
    const fileName= name + '_' + (new Date().toISOString()) +'.xlsx';
    let element = document.getElementById(idHTML);
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);

  }


}
