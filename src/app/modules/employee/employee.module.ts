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


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ProductComponent,
    ShoppingCartComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
