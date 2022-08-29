import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { ProductComponent } from './product/product.component';
import { ShoppingCartComponent } from './product/shopping-cart/shopping-cart.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ProductComponent,
    ShoppingCartComponent,
    MyProfileComponent,
    WarrantyComponent,
    OrderComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class EmployeeModule { }
