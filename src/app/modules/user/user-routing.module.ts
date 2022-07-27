import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'cart', component: CartComponent},
      // {path: 'order/confirmed', component: OrderConfirmedComponent},
      // {path: 'myprofile', component: MyProfileComponent},
      {path: 'product', component: ProductComponent},
      // {path: 'warranty', component: WarrantyComponent},
      {path: '', redirectTo:'./product', pathMatch:'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
