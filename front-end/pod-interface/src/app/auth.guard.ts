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
    if (this.authService.isAuthenticated()) {
      console.log('Is Authenticated');
      return true;
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

  }
}
