import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { RightSideComponent } from './right-side/right-side.component';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavComponent } from './nav/nav.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductByCategoryComponent } from './product/product-by-category/product-by-category.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductSearchComponent } from './product/product-search/product-search.component';
import { OrderComponent } from './order/order.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    RightSideComponent,
    ProductComponent,
    NavComponent,
    CartComponent,
    ProfileComponent,
    ProductByCategoryComponent,
    ProductDetailsComponent,
    ProductSearchComponent,
    OrderComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class UserModule { }
