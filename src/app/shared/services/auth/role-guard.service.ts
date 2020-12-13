import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Get the role that this route is expected to have
    // which is set on the data property in the route
    // definitions
    const expectedRole = route.data.expectedRole;

    if (!this.auth.isAuthenticated() || !this.auth.userHasRole(expectedRole)) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
