import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartUser } from 'src/app/models/CartUser.model';
import { Product } from 'src/app/models/Product.model';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { CategoryService } from 'src/app/services/user/category/category.service';
import { NotificationService } from 'src/app/services/user/notification/notification.service';
import { ProductService } from 'src/app/services/user/product/product.service';
import { ProfileService } from 'src/app/services/user/profile/profile.service';

import vn from 'javascript-time-ago/locale/vi'
import TimeAgo from 'javascript-time-ago';

TimeAgo.addDefaultLocale(vn)

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
    private router: Router,
    private apiNotification: NotificationService,
    ) { }
  name: string | null = '';
  ngOnInit(): void {
    this.name = localStorage.getItem('username')
    if(this.auth.isUserLogedin() == true)
    {
      // window.location.reload()
      this.getDataUser()
      this.getDataCart()
      this.getNotification()
    }
    this.getAllCate()

  }
  isUserLogin: boolean = this.auth.isUserLogedin()
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
      this.user = res
      this.userAvt = this.user.imageUrl
    })
  }

  getAllCate = () => {
    this.cate.getCategoryEnable('NAME').subscribe((res) => {
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
  checkUserLogined= () => {
    if(this.isUserLogin == false){
      if(window.confirm("Vui lòng đăng nhập ???")){
        this.router.navigate(['/user/login'])
      }
    }
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
  timeAgo = new TimeAgo('en-US')
  search: string | null = null
  notification: any = []
  countUnread: any
  getNotification = () => {
    setInterval(() => {
      this.apiNotification.getAllNotification().subscribe((res: any) => {
        this.notification = res
        if(this.notification && this.notification.length > 0){
          const data = this.notification.map((element: any) => {
            return {...element, createdDate: this.timeAgo.format(new Date(element.createdDate))}
          })
          this.notification = data
        }
      })
      this.apiNotification.countUnReadNotification().subscribe((res: any) => {
        this.countUnread = res
      })
    }, 1000)
  }

  readNotification = (id: number | string) => {
    this.apiNotification.readNotification(id).subscribe((res: any) => {
      if(res){
        this.getNotification()
      }
    })
  }
}
