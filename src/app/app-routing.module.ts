import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path : 'register', component: RegisterComponent },
  { path: '', redirectTo:'/login', pathMatch:'full' },

  { path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import ('./modules/admin/admin.module').then(m => m.AdminModule)
  },


  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
