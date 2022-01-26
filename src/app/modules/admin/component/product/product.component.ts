import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ApiProductService } from 'src/app/services/product/api-product.service';

declare var jQuery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  constructor(private api: ApiProductService) { }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }

  ngOnInit(): void {
    this.getAll();

  }
  productList: Product[] = [];
  getAll(){
    this.api.getProduct().subscribe((res: any) => {
      this.productList = res
    })

  }
  delete(id: number){
    if(window.confirm("Are u sure????")){
      this.api.deleteProduct(id).subscribe(data => {
        this.getAll()
      })
    }
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
