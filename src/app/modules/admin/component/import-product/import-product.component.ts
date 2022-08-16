import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ApiProductService } from 'src/app/services/admin/product/api-product.service';
import * as XLSX from 'xlsx';

declare var jQuery: any;
@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.css']
})
export class ImportProductComponent implements OnInit {

  constructor(
    private api: ApiProductService
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  ngOnInit(): void {
    console.log(this.month,new Date())
    this.getImportPr()
  }
  importList: any;
  totalValue: number = 0
  valueMonth: string = (new Date()).getMonth() + 1 + '';
  year: string = (new Date()).getFullYear() + '';
  month: string = (new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) + '-' + this.year : ((new Date()).getMonth() + 1) + '-' + this.year;

  getImportPr(){
    this.api.getImportProduct(this.month).subscribe((data: any) => {
      this.importList = data;
      this.countTotalImportPrice()
    })
  }
  countTotalImportPrice = () => {
    let total = 0;
    this.importList && this.importList.length > 0 && this.importList.map((elm: any) => {
      total += elm.importTotal;
    })
    this.totalValue = total
  }

  getImportPrByMonth = (month: string) => {
    const monthChose = Number(this.valueMonth) < 10 ? "0" + this.valueMonth + '-' + this.year : this.valueMonth + '-' + this.year
    this.api.getImportProduct(monthChose).subscribe((data: any) => {
      this.importList = data;
      this.countTotalImportPrice()
    })
  }

  fileName= 'Danhsachnhaphangthang'+ this.valueMonth +'_' + (new Date().toISOString()) +'.xlsx';
  exportexcel(): void
  {
    let element = document.getElementById('table-hidden');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);

  }

  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }

}
