import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { ProductByCategoryComponent } from './product/product-by-category/product-by-category.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductSearchComponent } from './product/product-search/product-search.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'cart', component: CartComponent},
      {path: 'order', component: OrderComponent},
      // {path: 'myprofile', component: MyProfileComponent},
      {path: 'product', component: ProductComponent},
      {path: 'product/details/:id', component: ProductDetailsComponent},
      {path: 'product/search', component: ProductSearchComponent},
      {path: 'cate/:id', component: ProductByCategoryComponent},
      {path: '', redirectTo:'/user/product', pathMatch:'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
