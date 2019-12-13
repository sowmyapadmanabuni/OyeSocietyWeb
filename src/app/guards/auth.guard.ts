import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, CanActivateChild } from '@angular/router';
import {GlobalServiceService} from '../global-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  accountID:number;

  constructor(
      private router: Router,private globalService:GlobalServiceService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //this.accountID = this.globalService.getacAccntID();
    this.accountID = Number(this.globalService.getacAccntID());
    
    //alert('in authGaurd,accountID-'+this.accountID);
    //if (this.accountID != undefined) {
    if (this.accountID) {
      //alert('accountID != undefined'+this.accountID);
      return true;
    }

      //alert('...state.url...'+state.url);
      // not logged in so redirect to login page with the return url
      //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.canActivate(route, state)
  }
}