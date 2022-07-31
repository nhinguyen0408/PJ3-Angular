import { Component, OnInit } from '@angular/core';
import { CartUser } from 'src/app/models/CartUser.model';
import { Product } from 'src/app/models/Product.model';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { CategoryService } from 'src/app/services/user/category/category.service';
import { ProductService } from 'src/app/services/user/product/product.service';
import { ProfileService } from 'src/app/services/user/profile/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private cate: CategoryService,
    private cart: CartService,
    private api: ProfileService,
    private apiProduct: ProductService,
    ) { }
  name: string | null = '';
  ngOnInit(): void {
    this.name = localStorage.getItem('username')
    this.getAllCate()
    this.getDataCart()
    this.getDataUser()
  }

  category: any = []
  cartDetail: any;
  user: any;
  userAvt: string | null = '';
  textSearch: string = ''
  productList: Product[] = []

  logoutUser = () => {
    this.auth.logoutUser()
  }

  getDataUser(){
    this.name = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    this.api.getProfileById(Number(id)).subscribe((res:any)=>{
      // this.profile = res;
      console.log("data profile", res)
      this.user = res
      this.userAvt = this.user.imageUrl
    })
  }

  getAllCate = () => {
    this.cate.getCategoryEnable().subscribe((res) => {
      this.category = res
    })
  }
  getDataCart = () => {
    var x = setInterval(() => {
      this.cart.getDataCart().subscribe((res: any) => {
        if(res){
          this.cartDetail = res;
        }
      })
    }, 1000)

  }

  searchProduct = () => {
    setTimeout(() => {
      if(this.textSearch.trim() !== ''){
        this.apiProduct.searchProductByName(this.textSearch).subscribe((res: any) => {
          this.productList = res
        })
      } else {
        this.productList = []
      }
    }, 200)
  }
}
