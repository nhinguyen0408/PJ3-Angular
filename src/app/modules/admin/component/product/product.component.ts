import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ApiProductService } from 'src/app/services/product/api-product.service';

declare var jQuery: any;
declare var Swal: any;
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
    (function ($) {
      $(document).ready(function(){
        $('.toastsDefaultInfo').click(function() {
          $(document).Toasts('create', {
            class: 'bg-info',
            title: 'Đang tiến hành vui lòng đợi',
            subtitle: '',
            body: 'Updating...',
            autohide: true,
            delay: 4000
          })

        });

      });

    })(jQuery);

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
