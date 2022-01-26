import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './component/category/category.component';
import { CreateCategoryComponent } from './component/category/create-category/create-category.component';
import { EditCategoryComponent } from './component/category/edit-category/edit-category.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EmployeeManagerComponent } from './component/employee-manager/employee-manager.component';
import { HomeComponent } from './component/home/home.component';
import { OrderComponent } from './component/order/order.component';
import { CreateProductComponent } from './component/product/create-product/create-product.component';
import { DetailsProductComponent } from './component/product/details-product/details-product.component';
import { EditProductComponent } from './component/product/edit-product/edit-product.component';
import { ProductComponent } from './component/product/product.component';
import { CreateProductionComponent } from './component/production/create-production/create-production.component';
import { EditProductionComponent } from './component/production/edit-production/edit-production.component';
import { ProductionComponent } from './component/production/production.component';
import { ProfileComponent } from './component/profile/profile.component';
import { SaleComponent } from './component/sale/sale.component';
import { UploadExampleComponent } from './component/upload-example/upload-example.component';
import { WarehouseComponent } from './component/warehouse/warehouse.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      {path: 'home', component: DashboardComponent},
      {path: 'warehouse', component: WarehouseComponent},
      {path: 'employee-manager', component: EmployeeManagerComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'product', component: ProductComponent},
      {path: 'product/details/:id', component: DetailsProductComponent},
      {path: 'product/create', component: CreateProductComponent},
      {path: 'product/edit/:id', component: EditProductComponent},
      {path: 'sale', component: SaleComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'category/create', component: CreateCategoryComponent},
      {path: 'category/edit/:id', component: EditCategoryComponent},
      {path: 'production', component: ProductionComponent},
      {path: 'production/create', component: CreateProductionComponent},
      {path: 'production/edit/:id', component: EditProductionComponent},
      {path: 'order', component: OrderComponent},
      {path: 'upload', component: UploadExampleComponent},
      // {path: 'order-confirmation', component: OrderConfirmationComponent},
      // {path: 'order/details', component: OrderDetailsComponent},
      // {path: 'order/confirmed', component: OrderConfirmedComponent},
      // {path: 'order/aborted', component: OrderAbortedComponent},
      {path: '', redirectTo:'./home', pathMatch:'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
