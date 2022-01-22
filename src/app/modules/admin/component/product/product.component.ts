import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ApiProductService } from 'src/app/services/product/api-product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private api: ApiProductService) { }

  ngOnInit(): void {
    this.getAll();
  }
  productList: Product[] = [];
  getAll(){
    this.api.getProduct().subscribe((res: any) => {
      this.productList = res
    })
    console.log(this.productList)
  }
  delete(id: number){
    if(window.confirm("Are u sure????")){
      this.api.deleteProduct(id).subscribe(data => {
        this.getAll()
      })
    }
  }

}
