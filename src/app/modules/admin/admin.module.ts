import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { CategoryComponent } from './component/category/category.component';
import { EmployeeManagerComponent } from './component/employee-manager/employee-manager.component';
import { OrderComponent } from './component/order/order.component';
import { OrderAbortComponent } from './component/order/order-abort/order-abort.component';
import { OrderConfirmationComponent } from './component/order/order-confirmation/order-confirmation.component';
import { OrderConfiredComponent } from './component/order/order-confired/order-confired.component';
import { OrderDetailsComponent } from './component/order/order-details/order-details.component';
import { ProductComponent } from './component/product/product.component';
import { ProductionComponent } from './component/production/production.component';
import { ProfileComponent } from './component/profile/profile.component';
import { WarehouseComponent } from './component/warehouse/warehouse.component';
import { CreateCategoryComponent } from './component/category/create-category/create-category.component';
import { EditCategoryComponent } from './component/category/edit-category/edit-category.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CreateProductionComponent } from './component/production/create-production/create-production.component';
import { EditProductionComponent } from './component/production/edit-production/edit-production.component';
import { CreateProductComponent } from './component/product/create-product/create-product.component';
import { EditProductComponent } from './component/product/edit-product/edit-product.component';
import { DetailsProductComponent } from './component/product/details-product/details-product.component';
import { UploadExampleComponent } from './component/upload-example/upload-example.component';
import { SaleComponent } from './component/sale/sale.component';
import { MyProfileComponent } from './component/profile/my-profile/my-profile.component';
import { CreateProfileComponent } from './component/profile/create-profile/create-profile.component';
import { VoucherComponent } from './component/voucher/voucher.component';
import { VoucherEditComponent } from './component/voucher/voucher-edit/voucher-edit.component';
import { VoucherCreateComponent } from './component/voucher/voucher-create/voucher-create.component';
import { NgChartsModule } from 'ng2-charts';
import { CreateSaleComponent } from './component/sale/create-sale/create-sale.component';
import { UpdateSaleComponent } from './component/sale/update-sale/update-sale.component';
import { WarrantyComponent } from './component/warranty/warranty.component';
import { ImportProductComponent } from './component/import-product/import-product.component';


@NgModule({
  declarations: [
    NavBarComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CategoryComponent,
    EmployeeManagerComponent,
    OrderComponent,
    OrderAbortComponent,
    OrderConfirmationComponent,
    OrderConfiredComponent,
    OrderDetailsComponent,
    ProductComponent,
    ProductionComponent,
    ProfileComponent,
    WarehouseComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    DashboardComponent,
    CreateProductionComponent,
    EditProductionComponent,
    CreateProductComponent,
    EditProductComponent,
    DetailsProductComponent,
    UploadExampleComponent,
    SaleComponent,
    MyProfileComponent,
    CreateProfileComponent,
    VoucherComponent,
    VoucherEditComponent,
    VoucherCreateComponent,
    CreateSaleComponent,
    UpdateSaleComponent,
    WarrantyComponent,
    ImportProductComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule

  ],
  bootstrap: [AdminModule]
})
export class AdminModule { }
