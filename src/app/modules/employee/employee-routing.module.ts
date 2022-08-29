import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { WarrantyComponent } from './warranty/warranty.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      // {path: 'order-confirmation', component: OrderConfirmationComponent},
      // {path: 'order/details', component: OrderDetailsComponent},
      {path: 'order', component: OrderComponent},
      {path: 'myprofile', component: MyProfileComponent},
      {path: 'product', component: ProductComponent},
      {path: 'warranty', component: WarrantyComponent},
      {path: '', redirectTo:'./home', pathMatch:'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
