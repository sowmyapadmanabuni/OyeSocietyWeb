import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthDashBoardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    alert('inside AuthDashBoardGuard');
    alert('trying to navigate home component...');
    //whenever dashboard component refered,call home component
    this.router.navigate(['']);
    return false;
  }

}
