import { Component } from '@angular/core';
import {GlobalServiceService} from './global-service.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private globalService:GlobalServiceService,private router:Router){
    this.globalService.toggledashboard=false;
  }

  myFunction() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  toggleDashboard() {
    console.log('inside toggleDashboard');
    this.globalService.toggledashboard = true;
    this.router.navigate(['home']);
  }
  isAuthenticated(){
    if(this.globalService.getacAccntID()){
      return true
    } else {
      return false;
    }
  }
}

