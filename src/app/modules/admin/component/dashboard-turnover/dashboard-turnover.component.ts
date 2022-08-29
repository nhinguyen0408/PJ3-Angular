import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ApiDashboardService } from 'src/app/services/admin/dashboard/api-dashboard.service';
declare var jQuery: any;
@Component({
  selector: 'app-dashboard-turnover',
  templateUrl: './dashboard-turnover.component.html',
  styleUrls: ['./dashboard-turnover.component.css']
})
export class DashboardTurnoverComponent implements OnInit {

  constructor(
    private apiDashboard: ApiDashboardService ,
    private apiBill:ApiBillService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getBillTurnOver()
    this.getBillTurnOverLastMonth()
    this.getChartMonth()
    this.getBillTurnOverExpected()
  }

  valueMonth: string = (new Date()).getMonth() + 1 + '';
  year: string = (new Date()).getFullYear() + '';
  month: string = (new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) + '-' + this.year : ((new Date()).getMonth() + 1) + '-' + this.year;
  turnOver: any;
  turnOverLastMonth: any;
  turnOverExpected: any;
  turnOverOnline: any;
  turnOverOffline: any;
  turnOverCanceled: any;
  turnOverAll: any;
  getBillTurnOver = () => {
    this.apiBill.getTurnOver(this.month).subscribe((res: any) => {
      this.turnOver = res
    })
    this.apiBill.getTurnOverAll(this.month).subscribe((res: any) => {
      this.turnOverAll = res
    })
    this.apiBill.getTurnOverByType(this.month, 'COD', '').subscribe((res: any) => {
      this.turnOverOnline = res
    })
    this.apiBill.getTurnOverByType(this.month, "OFFLINE", '').subscribe((res: any) => {
      this.turnOverOffline = res
    })
    this.apiBill.getTurnOverByType(this.month, '', "CANCELED").subscribe((res: any) => {
      this.turnOverCanceled = res
    })
  }
  getBillTurnOverExpected = () => {
    this.apiBill.getTurnOverByType(this.month, '', "VERIFYING").subscribe((res: any) => {
      this.turnOverExpected = res
    })
  }
  getBillTurnOverLastMonth = () => {
    const month: string = (new Date()).getMonth() < 10 ? '0' + ((new Date()).getMonth()) + '-' + this.year : ((new Date()).getMonth()) + '-' + this.year;
    this.apiBill.getTurnOver(month).subscribe((res: any) => {
      this.turnOverLastMonth = res
    })
  }
  getTurnOverByMonth = (month: string) => {
    const monthChose = Number(this.valueMonth) < 10 ? "0" + this.valueMonth + '-' + this.year : this.valueMonth + '-' + this.year
    if(monthChose == this.month){
      const lastMonth: string = (new Date()).getMonth() < 10 ? '0' + ((new Date()).getMonth()) + '-' + this.year : ((new Date()).getMonth()) + '-' + this.year;
      this.apiBill.getTurnOver(monthChose).subscribe((data: any) => {
        this.turnOver = data;
      })
      this.apiBill.getTurnOverByType(monthChose,'',"VERIFYING").subscribe((res: any) => {
        this.turnOverExpected = res
      })
      this.apiBill.getTurnOver(lastMonth).subscribe((data: any) => {
        this.turnOverLastMonth = data;
      })
      this.apiBill.getTurnOverByType(this.month, "COD", '').subscribe((res: any) => {
        this.turnOverOnline = res
      })
      this.apiBill.getTurnOverByType(this.month, "OFFLINE", '').subscribe((res: any) => {
        this.turnOverOffline = res
      })
      this.apiBill.getTurnOverByType(this.month, '',"CANCELED").subscribe((res: any) => {
        this.turnOverCanceled = res
      })
    }
    this.apiBill.getTurnOver(monthChose).subscribe((data: any) => {
      this.turnOver = data;
    })
    this.apiBill.getTurnOverByType(monthChose,'',"VERIFYING").subscribe((res: any) => {
      this.turnOverExpected = res
    })
    this.apiBill.getTurnOver(this.month).subscribe((data: any) => {
      this.turnOverLastMonth = data;
    })
    this.apiBill.getTurnOverByType(this.month, "COD", '').subscribe((res: any) => {
      this.turnOverOnline = res
    })
    this.apiBill.getTurnOverByType(this.month, "OFFLINE", '').subscribe((res: any) => {
      this.turnOverOffline = res
    })
    this.apiBill.getTurnOverByType(this.month, '',"CANCELED").subscribe((res: any) => {
      this.turnOverCanceled = res
    })
  }
  dataDay: number [] = []
  dataBill: number [] = []
  dataTotalSale: number[] =[]
  getChartMonth(){
    this.apiDashboard.getChartMonth().subscribe((res:any) => {
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
              label: 'Đơn hàng bán được trong ngày',
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
  navigateTo = (url: string) => {
    this.router.navigate([url])
  }

  onPrint(){
    var x = (function ($) {
      var divContents = document.getElementById("report")?.innerHTML;
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
