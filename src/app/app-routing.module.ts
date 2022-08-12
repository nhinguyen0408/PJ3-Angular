import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { EmployeeGuardGuard } from './guards/employee/employee-guard.guard';
import { ManagerGuard } from './guards/manager.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/login', component: LoginUserComponent },
  { path : 'user/register', component: RegisterUserComponent },
  { path: '', redirectTo:'/user/product', pathMatch:'full' },

  { path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import ('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  { path: 'employee',
    canActivate: [EmployeeGuardGuard],
    loadChildren: () => import ('./modules/employee/employee.module').then(m => m.EmployeeModule)
  },
  { path: 'user',
    // canActivate: [UserGuard],
    loadChildren: () => import ('./modules/user/user.module').then(m => m.UserModule)
  },


  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
