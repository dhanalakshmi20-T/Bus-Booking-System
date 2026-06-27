import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(_route: unknown, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (this.authService.isAdmin) {
      return true;
    }

    return this.router.createUrlTree(['/home']);
  }
}
