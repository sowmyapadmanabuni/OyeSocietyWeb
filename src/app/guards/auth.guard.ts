import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, CanActivateChild, CanDeactivate } from '@angular/router';
import {GlobalServiceService} from '../global-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild,CanDeactivate<any> {
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
      console.log('inside auth guard');
      this.globalService.SetAssociationListForReload();
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
  canDeactivate() {
    // will prevent user from going back
    if (this.globalService.getBackClicked()) {
      this.globalService.setBackClicked(false);
      // push current state again to prevent further attempts.
      history.pushState(null, null, location.href);
      return false;
    }
    return true;
  }
}