import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      // {path: 'order-confirmation', component: OrderConfirmationComponent},
      // {path: 'order/details', component: OrderDetailsComponent},
      // {path: 'order/confirmed', component: OrderConfirmedComponent},
      {path: 'myprofile', component: MyProfileComponent},
      {path: 'product', component: ProductComponent},
      {path: '', redirectTo:'./home', pathMatch:'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
