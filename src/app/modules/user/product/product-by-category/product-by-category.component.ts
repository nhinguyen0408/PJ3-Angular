import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/Category.model';
import { Product } from 'src/app/models/Product.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { CategoryService } from 'src/app/services/user/category/category.service';
import { ProductService } from 'src/app/services/user/product/product.service';
import { ProductionService } from 'src/app/services/user/production/production.service';

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.css']
})
export class ProductByCategoryComponent implements OnInit {

  constructor(
    private apiProduct: ProductService,
    private apiProduction: ProductionService,
    private apiCate: CategoryService,
    private actRoute: ActivatedRoute ,
    private apiCart: CartService,
    private toastsService: ToastService,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.getProductByCate()
    this.getDetailsCate()
    this.getProduction()
    setTimeout(() => {
      this.fillFilterProduction()
    }, 500)

  }


  id = this.actRoute.snapshot.params['id']
  productList : Product[] = []
  cateDetails: any;
  production: any;

  searchFilter: string = ''
  isFilter: boolean = false
  productionChosed: any;
  isChoseProduction: boolean = false

  page = 1;
  count = 0;
  tableSize = 12;
  tableSizesArr = [4, 8, 12];
  tabSize(event: any){
    this.page = event;
    this.getProductByCate();
  }
  tableData(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getProductByCate();
  }

  getProductByCate = () => {
    return this.apiProduct.getProductByCate(this.id).subscribe((res: any) => {
      this.productList = res
      console.log('this.productList',this.productList)
    })
  }

  getDetailsCate = () => {
    return this.apiCate.getById(this.id).subscribe((res: any) => {
      this.cateDetails = res
      console.log(res)
    })
  }

  getProduction = () => {
    return this.apiProduction.getProductionEnable() .subscribe((res : any) => {
      this.production = res
    })
  }

  fillFilterProduction = () => {
    if(this.production && this.production.length > 0){
      this.production.map((item: any, index: number) => {
        const productChild: any[] = []
        if(this.productList?.length > 0){
          this.productList.map((prod: any) => {
            if(prod.productionId == item.id){
              productChild.push(prod)

            }
          })
          this.production[index] = {...item, childProduct: productChild}
        }
      })
    }
  }

  filterProduct = () => {
    if(this.searchFilter.trim() != ''){
      this.apiProduct.searchProductFilter(this.id, this.searchFilter).subscribe((res: any) => {
        this.productList = res
        this.isFilter = true
        this.fillFilterProduction()
      })

    } else {
      this.getProductByCate()
    }
  }
  cancelFilterProduct = () => {
    this.getProductByCate()
    setTimeout(()=> { this.fillFilterProduction() }, 500)
    this.isFilter = false
    this.searchFilter = ''
    this.isChoseProduction = false;
  }
  setProductByProduction = (index: number) => {
    this.productList = this.production[index]?.childProduct;
    this.isFilter = true;
    this.productionChosed = this.production[index]?.name
  }

  addShoppingCart = (productId: number) => {
    if(window.confirm("Thêm sản phẩm này vào giỏ hàng ???"))
    this.apiCart.addToCart(productId, 1).subscribe((res: any) => {
      // this.getShoppingCart()
      this.toastsService.alert('Thông báo !!!', "Đã thêm sản phẩm vào giỏ hàng !!!!!!",'bg-success');
    })
  }


}
