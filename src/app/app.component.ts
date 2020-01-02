import { Component } from '@angular/core';
import {GlobalServiceService} from './global-service.service';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  notificationList:any[];
  HideOrShowNotification:boolean;
  toggleName:any;

  constructor(private globalService:GlobalServiceService,private router:Router,
    private http: HttpClient,private utilsService:UtilsService){
    this.globalService.toggledashboard=false;
    this.notificationList=[];
    this.toggleName='';
  }
  ngOnInit() {
    this.getNotification();
    this.HideOrShowNotification=false;
  }
  ngAfterViewInit(){
    $(document).ready(function(){
      $("#flip").click(function(){
        $("#panel").slideToggle("slow");
      });
    });
   
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
  getNotification(){
    // http://apiuat.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAccntID/11511/1
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${1}`
    this.http.get(url, { headers: headers })
   .subscribe(data=>{
     console.log(data['data']['notificationListByAcctID']);
     this.notificationList=data['data']['notificationListByAcctID'];
   },
   err=>{
     console.log(err);
   })

  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }
  NotificationDropDown(toggleName){
    this.toggleName=toggleName;
  }
}

