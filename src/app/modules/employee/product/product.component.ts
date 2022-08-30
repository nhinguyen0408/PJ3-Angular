import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Bill } from 'src/app/models/Bill.model';
import { Category } from 'src/app/models/Category.model';
import { CountDown } from 'src/app/models/CountDown.model';
import { Product } from 'src/app/models/Product.model';
import { Production } from 'src/app/models/Production.model';
import { ShoppingCart } from 'src/app/models/ShoppingCart.model';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { ApiBillService } from 'src/app/services/admin/bill/api-bill.service';
import { ApiCategoryService } from 'src/app/services/admin/category/api-category.service';
import { ApiProductService } from 'src/app/services/admin/product/api-product.service';
import { ApiProductionService } from 'src/app/services/admin/production/api-production.service';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private api: ApiProductService,
    private billApi: ApiBillService,
    private apiCate: ApiCategoryService,
    private apiProduction: ApiProductionService,
    private toastsService: ToastService,
    private apiProfile: ApiProfileService,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.getAll();
    this.getCate();
    this.getProduction();
    this.getShoppingCart();

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  productList: Product[] = [];
  categoryList: Category[] = [];
  productionList: Production[] = [];
  categoryId: number | null = 0;
  productionId: number | null = 0;
  productCode: string  = '';
  productName: string  = '';
  checkSearch: boolean = false;
  getAll(){
    this.api.getProductEnableEmployee().subscribe((res: any) => {
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
  listBillIMEI: any[] = []

  setListIMEI = () => {
    if(this.shoppingCart && this.shoppingCart.length > 0){
      this.shoppingCart.map((elm: any, index: number) => {
        if(elm.product.warranty != null && elm.product.warranty > 0){
          const dataImei: any[] = []
          for(let i = 0; i < elm.quantity ; i++)
          {
            const imei = ''
            dataImei[i] = {data: imei}
          }
          this.listBillIMEI[index] = {imei: dataImei}
        }
      })
      console.log('listBillIMEI',this.listBillIMEI);

    }
  }
  getShoppingCart(){
    if(localStorage.getItem('cart') != null && localStorage.getItem('cart') != undefined){
      // this.shoppingCart = JSON.parse(localStorage.getItem('cart'));
      this.dataLocal = localStorage.getItem('cart') ? localStorage.getItem('cart') : '' ;
      this.shoppingCart = JSON.parse(this.dataLocal);
      this.setListIMEI()
      this.getTotal()
      // console.log("shoppingCart======== ",localStorage.getItem('cart') )
    }
  }
  updateQuantityCart(dataUpdate: any){
    console.log('dataUpdate', dataUpdate);

    const product = this.productList.find(x => x.id === dataUpdate.productId);
    console.log('product', product);
    if((product && dataUpdate.action == '+') || (product && product.quantity >= dataUpdate.quantityUpdate )){
      const productShopping = this.shoppingCart[dataUpdate.shoppingCartIndex]
      productShopping.quantity = dataUpdate.newQuantity;
      productShopping.price = product.salePrice * productShopping.quantity;
      if(dataUpdate.newQuantity == '' || dataUpdate.newQuantity == undefined || dataUpdate.newQuantity == null){
        this.shoppingCart.splice(dataUpdate.shoppingCartIndex,1)
      }
      this.api.updateQuantity({'productId': dataUpdate.productId, 'action': dataUpdate.action, 'number':  dataUpdate.quantityUpdate}).subscribe(res => {
        this.getAll();
        this.storeShoppingCart(this.shoppingCart);
        this.setListIMEI()
      })
      this.getTotal();
    }else{
      // alert("Số lượng đã vượt quá số sản phẩm trong kho!!!!!!")
      this.toastsService.alert('Thông báo !!!', "Số lượng đã vượt quá số sản phẩm trong kho!!!!!!",'bg-warning');
    }
  }
  addShoppingCart(id: number){
    const product = this.productList.find(x => x.id === id);
    if(product && product.quantity > 0){
      if(!this.shoppingCart.find(x => x.product.id === id)){
        const productShopping = new ShoppingCart()
        productShopping.product = product;
        if(product.saleEntity){
          productShopping.price = product.salePrice - product.salePrice * product.saleEntity.sale /100;
        } else {
          productShopping.price = product.salePrice;
        }
        productShopping.quantity = 1
        this.shoppingCart.push(productShopping)
        this.api.updateQuantity({'productId': id, 'action': '-', 'number': 1}).subscribe(res => {
          if(this.checkSearch === true){
            this.onSearch()
          } else {
            this.getAll();
          }
          this.storeShoppingCart(this.shoppingCart);
          this.setListIMEI()
        })
        this.getTotal();
        // localStorage.setItem("shopping-cart", JSON.stringify(this.shoppingCart));
      } else {
        const productShopping = this.shoppingCart.find(x => x.product.id === id);
        // console.log("productShopping else",productShopping);
        if(productShopping){
          if(product.quantity > 0){
            productShopping.quantity ++;
            if(product.saleEntity){
              productShopping.price = (product.salePrice - product.salePrice * product.saleEntity.sale/100)* productShopping.quantity;
            } else {
              productShopping.price = product.salePrice * productShopping.quantity;
            }

            this.api.updateQuantity({'productId': id, 'action': '-', 'number': 1}).subscribe(res => {
              if(this.checkSearch === true){
                this.onSearch()
              } else {
                this.getAll();
              }
              this.storeShoppingCart(this.shoppingCart);
              this.setListIMEI()
            })
            this.getTotal();

          }else{
            // alert("Số lượng đã vượt quá số sản phẩm trong kho!!!!!!")
            this.toastsService.alert('Thông báo !!!', "Số lượng đã vượt quá số sản phẩm trong kho!!!!!!",'bg-warning');
          }

        }
      }
      this.toastsService.alert('Thông báo !!!', "Thêm thành công sản phẩm: "+ product.name +" vào giỏ hàng !!!!!!",'bg-success');

    } else {
      // alert("Sản phẩm đã hết hàng!!!!!!")
      this.toastsService.alert('Thông báo !!!', "Sản phẩm đã hết hàng!!!!!!",'bg-warning');
    }
  }
  removeProduct(productShoppingId:number){
    if(window.confirm("Are u sure??" + productShoppingId)){
      const index = this.shoppingCart.findIndex(x=> x.product.id === productShoppingId);
      const product = this.shoppingCart.find(x=> x.product.id === productShoppingId);
      this.api.updateQuantity({'productId': productShoppingId, 'action': '+', 'number': product?.quantity}).subscribe(res => {
        this.getAll();
      })
      this.shoppingCart.splice(index,1);
      this.getTotal()
      this.storeShoppingCart(this.shoppingCart);
      this.setListIMEI()
    }
  }
  totalPrice: number = 0 ;
  discount: number = 0 ;
  totalPay: number = 0;
  totalItem: number = 0 ;
  getTotal(){
    this.totalPrice = 0 ;
    this.totalItem = 0 ;
    for(const productShopping of this.shoppingCart){
      this.totalItem += productShopping.quantity;
      this.totalPrice = this.totalPrice +  productShopping.price;
    }
    this.totalPay = this.totalPrice - this.discount;
  }
  payment(bill: Bill){
    if(window.confirm("Xác nhận thanh toán !!!!!!!")){
      this.billApi.createBill(bill).subscribe(res => {
        this.toastsService.alert('Thông báo !!!', "Thanh toán thành công !!!!!!",'bg-success');
        this.shoppingCart = []
        this.listBillIMEI = []
        this.totalItem = 0;
        this.totalPay = 0;
        this.totalPrice = 0;
        this.discount = 0;
        localStorage.setItem('cart', '');
      })
      // this.shoppingCart = []
      // this.totalItem = 0;
      // this.totalPay = 0;
      // this.totalPrice = 0;
      // localStorage.setItem('cart', '');
    }
  }
  checkPayment(){
    if( this.shoppingCart.length > 0){
    } else {
      this.toastsService.alert('Thông báo !!!', "Vui lòng chọn sản phẩm và thêm vào giỏ hàng trước khi thanh toán !!!!",'bg-warning');
    }
  }
  storeShoppingCart(cart: ShoppingCart[]){
    // const subject = new Subject<any>();
    localStorage.setItem('cart', JSON.stringify(cart));
    // console.log("shoppingCart======== ",localStorage.getItem('cart') )
    // subject.next('changed'); this.shoppingCart = JSON.parse(localStorage.getItem('cart'));
  }
  getCate(){
    this.apiCate.getCategory('DATE').subscribe((res: any) =>{
      this.categoryList = res;
    })
  }
  getProduction(){
    this.apiProduction.getProduction('DATE').subscribe((res: any)=>{
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
  }
  tableData(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

}
