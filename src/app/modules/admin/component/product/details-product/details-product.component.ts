import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiProductService } from 'src/app/services/product/api-product.service';

declare var jQuery: any;

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {

  constructor(private api: ApiProductService, private actRoute: ActivatedRoute) { }
  id = this.actRoute.snapshot.params['id']
  ngOnInit(): void {
    this.getDetailsPr();
    // (function ($) {
    //   $(document).ready(function(){
    //     $('.product-image-thumb').click(function() {
    //       alert("asdaf");
    //       $('.product-image-thumb').removeClass('active');
    //       $().addClass('active')
    //     });
    //   });
    // })(jQuery);
  }
  product: any;
  $: any;
  getDetailsPr(){
    this.api.getById(this.id).subscribe((res: any) => {
      this.product = res
    })
    console.log(this.product);

  }

  //product-desc
}
