import { Component } from '@angular/core';
import {GlobalServiceService} from './global-service.service';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import {DashBoardService} from '../services/dash-board.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  notificationList:any[];
  HideOrShowNotification:boolean;
  toggleName:any;
  ntType:any;
  VLApprStat:any;
  sbMemID:any;

  constructor(public globalService:GlobalServiceService,public router:Router,
    public dashBoardService: DashBoardService,
    private http: HttpClient,private utilsService:UtilsService){
    this.globalService.toggledashboard=false;
    this.notificationList=[];
    this.toggleName='';
    this.ntType='';
    this.VLApprStat='';
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
    //console.log('inside toggleDashboard');
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
     //console.log(err);
   })
  }

  UpdateApprovalStatus(sbMemID){
    console.log(sbMemID);
    let APIdataForStatus={
       VLApprStat: this.VLApprStat,  
       VLVisLgID: sbMemID,  
       VLApprdBy:this.dashBoardService.acfName 
      }
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oyesafe/api/v1/UpdateApprovalStatus`
    this.http.post(url,JSON.stringify(APIdataForStatus), { headers: headers })
   .subscribe(data=>{
     console.log(data); 
     
     let sendMessageData={
      "ISDCode":"+91",
      "MobileNumber":"7353204696",
      "text":"http://uatapp.oyespace.com/"
    }
    let scopeIP=this.utilsService.getIPaddress();
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-Champ-APIKey',"1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1")
    .append('Access-Control-Allow-Origin', '*');
    //  this.http.post(scopeIP+'oyeliving/api/v1/SendMsging', sendMessageData, {headers:headers})
     this.http.post('http://api.oyespace.com/oyeliving/api/v1/SendMsging', sendMessageData, {headers:headers})
     .subscribe(data=>{
       console.log(data);
     },
     err=>{
       console.log(err);
     })

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
  NotificationDropDown(toggleName,ntType){
    this.toggleName=toggleName;
    this.ntType=ntType;
  }

  EntryAprove(EntryApproved,sbMemID){
    this.VLApprStat = EntryApproved;
    this.UpdateApprovalStatus(sbMemID);
  }
  EntryRjected(ExitApproved,sbMemID){
    this.VLApprStat = ExitApproved;
    this.UpdateApprovalStatus(sbMemID);
  }
}

