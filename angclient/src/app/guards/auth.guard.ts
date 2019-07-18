import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from '../common/toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): boolean {
      return this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    // check if is logged in
    if (this.authService.isLoggedIn()) {
        return true;
    }

    this.toastr.info('Please login to access this page.');
    this.router.navigate(['login']);
    return false;
  }
}
