import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ApiProductService } from 'src/app/services/admin/product/api-product.service';

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
    this.getImportPr()
  }
  importList: any;
  getImportPr(){
    this.api.getImportProduct().subscribe((data: any) => {
      this.importList = data;
      console.log(data)
    })
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
