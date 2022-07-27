import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/admin/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean | UrlTree {
      if(!this.auth.isLogedin())
      {
        this.router.navigate(['login']);
      }
        // true : cho phep router duoc kich hoat
      return this.auth.isLogedin() && this.auth.getRole() === "SUPERADMIN";
  }

}
