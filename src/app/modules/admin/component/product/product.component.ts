import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category.model';
import { CountDown } from 'src/app/models/CountDown.model';
import { Product } from 'src/app/models/Product.model';
import { Production } from 'src/app/models/Production.model';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';
import { ApiProductionService } from 'src/app/services/production/api-production.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
declare var Swal: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  constructor(
    private api: ApiProductService,
    private apiCate: ApiCategoryService,
    private apiProduction: ApiProductionService,
    private toastsService: ToastService
    ) { }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }

  ngOnInit(): void {
    this.getAll();
    this.getCate();
    this.getProduction();
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
        $('.select2bs4').select2({
          theme: 'bootstrap4'
        });

      });

    })(jQuery);

  }
  productList: Product[] = [];
  categoryList: Category[] = [];
  productionList: Production[] = [];
  categoryId: number | null = 0;
  productionId: number | null = 0;
  productCode: string  = '';
  productName: string  = '';
  status: string = '';
  checkSearch: boolean = false;
  getAll(){
    this.api.getProduct().subscribe((res: any) => {
      this.productList = res;
      this.getCountDown()
    })

  }
  getCate(){
    this.apiCate.getCategory().subscribe((res: any) =>{
      this.categoryList = res;
    })
  }
  getProduction(){
    this.apiProduction.getProduction().subscribe((res: any)=>{
      this.productionList = res;
    })
  }
  // delete(id: number){
  //   if(window.confirm("Are u sure????")){
  //     this.api.deleteProduct(id).subscribe(data => {
  //       this.getAll()
  //     })
  //   }
  // }
  updateStatus(product:Product){
    if(product.status === "ACTIVE"){
      product.status = "INACTIVE";
      console.log(product)
      this.api.editProduct(product).subscribe(res =>{
        console.log(res)

        this.getAll()
      })
      this.toastsService.alert("Thông báo!!!","Vô hiệu hóa sản phẩm thành công!!!","bg-success")
    } else if(product.status === "INACTIVE"){
      product.status = "ACTIVE";
      console.log(product)
      this.api.editProduct(product).subscribe(res =>{
        console.log(res)

        this.getAll()
      })
      this.toastsService.alert("Thông báo!!!","Kích hoạt sản phẩm thành công!!!","bg-success")
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
  onSearch(){
    let categoryId = (function ($) {
      let se = $('#category').select2('data')[0]
      // console.log("selected category: ", se.id)
      return se.id
    })(jQuery);
    let productionId = (function ($) {
        let se = $('#production').select2('data')[0]
        // console.log("selected category: ", se.id)
        return se.id
    })(jQuery);

    // console.log("categoryId",categoryId)
    // console.log("productionId",productionId)
    // console.log("productCode",this.productCode)
    if(productionId == 0){
      productionId = '';
    }
    if(categoryId == 0){
      categoryId = '';
    }
    if(categoryId=== 0 && productionId=== 0 && this.productCode === '' && this.productName===''){

    } else{
      this.api.searchProduct(this.productCode, categoryId, productionId, this.productName, this.status).subscribe((res: any)=>{
        this.productList = res;
        this.checkSearch = true;
      })
    }
  }
  onAbortSearch(){
    this.checkSearch = false;
    this.productCode = '';
    this.productName = '';
    this.status = '';
    this.categoryId = 0;
    this.productionId = 0;
    this.getAll()
  }

  countDown: CountDown [] = [];
  getCountDown(){
    if(this.productList){

      var x = setInterval(() =>{
        this.countDown = [];
        for(let i =0; i<=this.productList.length; i++){
          let data = {'days': '', 'hours': '', 'minutes': '', 'seconds': '','idPr': 0};
          if(this.productList[i]?.saleEntity){
            const endTime = new Date(this.productList[i]?.saleEntity.endDate).getTime();
            var now = new Date().getTime();
            var distance = endTime - now;
            data.days = (distance / (1000 * 60 * 60 * 24)).toFixed();
            data.hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) >9 ?((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed() : '0' + ((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed();
            data.minutes = ((distance % (1000 * 60 * 60)) / (1000 * 60)) > 9 ? ((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed() : '0' +((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed();
            data.seconds = ((distance % (1000 * 60)) / 1000) > 9 ? ((distance % (1000 * 60)) / 1000).toFixed() : '0' + ((distance % (1000 * 60)) / 1000).toFixed();
            data.idPr = this.productList[i].id
          }
          this.countDown.push(data);
          // console.log("data",data)
        }

      }, 1000)

    }
  }
}
