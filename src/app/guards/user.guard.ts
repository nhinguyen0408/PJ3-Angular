import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean | UrlTree {
      if(!this.auth.isUserLogedin())
      {
        this.router.navigate(['user/login']);
      }
        // true : cho phep router duoc kich hoat
      return this.auth.isUserLogedin() && localStorage.getItem('user-role') === "USER";
  }

}
