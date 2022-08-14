import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bill } from 'src/app/models/Bill.model';
import { Category } from 'src/app/models/Category.model';
import { CountDown } from 'src/app/models/CountDown.model';
import { Product } from 'src/app/models/Product.model';
import { Production } from 'src/app/models/Production.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { CategoryService } from 'src/app/services/user/category/category.service';
import { ProductService } from 'src/app/services/user/product/product.service';
import { ProductionService } from 'src/app/services/user/production/production.service';
import { ProfileService } from 'src/app/services/user/profile/profile.service';

declare var jQuery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private api: ProductService,
    private apiCate: CategoryService,
    private apiProduction: ProductionService,
    private toastsService: ToastService,
    private apiProfile: ProfileService,
    private auth: AuthService,
    private apiCart: CartService,
    private route: Router,
    ) { }

  ngOnInit(): void {
    this.getAll();
    this.getCate();
    this.getProduction();
    setTimeout(()=>{
      if(this.auth.isUserLogedin() == true){
        this.isUserLogedin = true
        this.getShoppingCart();
      }
    }, 1000)

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  isUserLogedin: boolean = false
  productList: any[] = [];
  categoryList: Category[] = [];
  productionList: Production[] = [];
  categoryId: number | null = 0;
  productionId: number | null = 0;
  productCode: string  = '';
  productName: string  = '';
  checkSearch: boolean = false;
  getAll(){
    this.api.userGetAll().subscribe((res: any) => {
      this.productList = res;
      this.getCountDown();
    })

  }
  // "responsive": true,
  // "autoWidth": false,
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
        $('.select2bs4').select2({
          theme: 'bootstrap4'
        });
    })(jQuery);
  }
  shoppingCart: ShoppingCart [] =  [];
  dataLocal: any;
  cartDetail: any;
  getShoppingCart(){
    // if(localStorage.getItem('cart') != null && localStorage.getItem('cart') != undefined){
    //   // this.shoppingCart = JSON.parse(localStorage.getItem('cart'));
    //   this.dataLocal = localStorage.getItem('cart') ? localStorage.getItem('cart') : '' ;
    //   this.shoppingCart = JSON.parse(this.dataLocal);
    //   this.getTotal()
    //   // console.log("shoppingCart======== ",localStorage.getItem('cart') )
    // }
    this.apiCart.getDataCart().subscribe((res: any) => {
      if(res){
        this.cartDetail = res;
      }
    })
  }
  updateQuantityCart(dataUpdate: any){
    //todo
  }
  addShoppingCart(productId: number){
    //todo
    if(this.isUserLogedin == true){
      if(window.confirm("Thêm sản phẩm này vào giỏ hàng ???"))
      this.apiCart.addToCart(productId, 1).subscribe((res: any) => {
        this.getShoppingCart()
        this.toastsService.alert('Thông báo !!!', "Đã thêm sản phẩm vào giỏ hàng !!!!!!",'bg-success');
      })
    } else {
      if(window.confirm("Vui lòng đăng nhập ???")){
        this.route.navigate(['/user/login'])
      }
    }
  }
  removeProduct(productShoppingId:number){
    //todo
  }
  totalPrice: number = 0 ;
  discount: number = 0 ;
  totalPay: number = 0;
  totalItem: number = 0 ;
  getTotal(){
    //todo
  }
  payment(bill: Bill){
   //todo
  }
  checkPayment(){
    //todo
  }
  storeShoppingCart(cart: ShoppingCart[]){
    //todo
  }
  getCate(){
    this.apiCate.getCategoryEnable('NAME').subscribe((res: any) =>{
      this.categoryList = res;
    })
  }
  getProduction(){
    this.apiProduction.getProductionEnable('NAME').subscribe((res: any)=>{
      this.productionList = res;
    })
  }
  onSearch(){
    let categoryId = (function ($) {
      let se = $('#category').select2('data')[0]
      // console.log("selected category: ", se.id)
      return se.id
    })(jQuery);
    let productionId = (function ($) {
        let se = $('#production').select2('data')[0]
        return se.id
    })(jQuery);

    if(productionId == 0){
      productionId = '';
    }
    if(categoryId == 0){
      categoryId = '';
    }
    if(categoryId=== 0 && productionId=== 0 && this.productCode === '' && this.productName===''){

    } else{
      this.api.searchProduct(this.productCode.toUpperCase(), categoryId, productionId, this.productName, 'ACTIVE').subscribe((res: any)=>{
        this.productList = res;
        this.getCountDown();
        this.checkSearch = true;
      })
    }
  }
  onAbortSearch(){
    this.checkSearch = false;
    this.productCode = '';
    this.productName = '';
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
          let data = new CountDown();
          if(this.productList[i]?.saleEntity!= null){
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
  productDetails: any | null;
  onShow: boolean = false;
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  onGetProductDetails(id: number){
    this.clearEditor()
    this.api.getById(id).subscribe(res => {
      let des = '';
      des = res.description;
      this.productDetails = res;
      this.editEditor(des);
      this.getCountDownProductDetails();
      this.onShow = true;
    })
  }
  onEndShowDetails(){
    this.productDetails = null;
    this.onShow = false;
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
  }
  getCountDownProductDetails(){
    if(this.productDetails?.saleEntity){
      var x = setInterval(() =>{
        const endTime = new Date(this.productDetails?.saleEntity.endDate).getTime();
        var now = new Date().getTime();
        var distance = endTime - now;
        this.days = (distance / (1000 * 60 * 60 * 24)).toFixed();
        this.hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) >9 ?((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed() : '0' + ((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed();
        this.minutes = ((distance % (1000 * 60 * 60)) / (1000 * 60)) > 9 ? ((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed() : '0' +((distance % (1000 * 60 * 60)) / (1000 * 60)).toFixed();
        this.seconds = ((distance % (1000 * 60)) / 1000) > 9 ? ((distance % (1000 * 60)) / 1000).toFixed() : '0' + ((distance % (1000 * 60)) / 1000).toFixed();
      }, 1000)

    }
  }
  editEditor(dataa: string){
    (function ($) {
      let se = $('#textareaInput').summernote('pasteHTML',dataa)
      $('#textareaInput').summernote('destroy')
    })(jQuery);
  }
  clearEditor(){
    (function ($) {
      let se = $('#textareaInput').summernote('code', '')
    })(jQuery);
  }
  checkBlock(){
    this.apiProfile.getProfileById(Number(localStorage.getItem('employeeId'))).subscribe(res => {
      if(res.block === true){
        alert("Tài khoản của bạn đã bị khóa !!!");
        this.auth.logout();
      }
    })
  }

  // Pagination

  page = 1;
  count = 0;
  tableSize = 8;
  tableSizesArr = [4, 8, 12];
  tabSize(event: any){
    this.page = event;
    this.getAll();
  }
  tableData(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAll();
  }


}
