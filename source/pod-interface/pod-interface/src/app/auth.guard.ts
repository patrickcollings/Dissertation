import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first, map, catchError, take } from 'rxjs/operators';
import { empty } from 'rxjs';
import { AuthorizeService } from './services/authorize.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthorizeService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // If not authenticated redirect user to login page.
      // If directed from the request page then as soon as user is logged in take them back to the same request.
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

  }
}
