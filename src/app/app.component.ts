import { Component } from '@angular/core';
import {GlobalServiceService} from './global-service.service';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import {DashBoardService} from '../services/dash-board.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';


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
  accountID:number;
  associations:any= [];
  uniqueAssociations :any[];
  associationName:any;
  subscription: Subscription;
  unitlistForAssociation:any[];

  constructor(public globalService:GlobalServiceService,public router:Router,
    public dashBoardService: DashBoardService,
    private http: HttpClient,private utilsService:UtilsService){
      this.accountID=this.globalService.getacAccntID();
    this.globalService.toggledashboard=false;
    this.notificationList=[];
    this.uniqueAssociations=[];
    this.toggleName='';
    this.ntType='';
    this.VLApprStat='';
    this.subscription=this.globalService.getUnitListForAssociation()
    .subscribe(msg=>{
      console.log(msg);
      this.unitlistForAssociation=msg['msg'];
      if(this.unitlistForAssociation.length == 0){
        console.log('inside unit length 0');
        this.globalService.currentUnitName='NoUnit';
        this.globalService.MoreThanOneUnit=false;
      }
      else if(this.unitlistForAssociation.length == 1){
        console.log('inside unit length 1');
        this.globalService.currentUnitName=this.unitlistForAssociation[0]['unUniName'];
        this.globalService.NotMoreThanOneUnit=true;
        this.globalService.MoreThanOneUnit=false;
        this.globalService.HideUnitDropDwn=false; //yes
      }
      else if(this.unitlistForAssociation.length > 1){
        console.log('inside unit length > 1');
        this.globalService.currentUnitName=this.unitlistForAssociation[0]['unUniName'];
        this.globalService.NotMoreThanOneUnit=true;
        this.globalService.MoreThanOneUnit=true;
        this.globalService.HideUnitDropDwn=false; //yes
      }
    },
    err=>{
      console.log(err);
    })
  }
  ngOnInit() {
    this.getNotification();
    this.getAssociation();
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
  toggleAsnDropDwn(){
    console.log('test');
    this.globalService.setAssnDropDownHiddenByDefault(true); //yes
    this.globalService.setUnitDropDownHiddenByDefault(true); //yes
    console.log(typeof this.globalService.getAssnDropDownHiddenByDefaultValue());
    console.log(this.globalService.getAssnDropDownHiddenByDefaultValue());
  }
  toggleUnitDropDwn(){
    this.globalService.MoreThanOneUnit=true;
    this.globalService.HideUnitDropDwn=true; //No
    this.globalService.NotMoreThanOneUnit=false;
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
  getAssociation(){
    //console.log('this.accountID',this.accountID);
    this.dashBoardService.getAssociation(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data:any = res;
      //console.log(data);
      this.associations = data.data.memberListByAccount;
      this.associations = _.sortBy(this.associations, e => e.asAsnName);
      //console.log('associations',this.associations);
      for (let i = 0; i < this.associations.length; i++) {
        //console.log( this.uniqueAssociations);
        //console.log( this.associations[i]['asAsnName']);
        const found = this.uniqueAssociations.some(el => el['asAsnName'] === this.associations[i]['asAsnName']);
        if (!found) {
          this.uniqueAssociations.push(this.associations[i]);
        }
      }
      console.log(this.uniqueAssociations[0]['asAsnName']);
      this.globalService.setCurrentAssociationName(this.uniqueAssociations[0]['asAsnName']);
      console.log(this.globalService.currentAssociationName);
        this.loadAssociation(this.uniqueAssociations[0]['asAsnName'],'');
      },
      res=>{
        //console.log('Error in getting Associations',res);
      });
  }
  loadAssociation(associationName: string, param: any) {
    console.log(associationName, param);
    let params={
      "associationName":associationName,
      "param":param
    }
    console.log(params);
    this.globalService.sendMessage(params);
    this.globalService.setCurrentAssociationName(associationName);
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
  loadUnit(unUniName,unUnitID){
    console.log(unUniName, unUnitID);
    let params={
      "unUniName":unUniName,
      "unUnitID":unUnitID
    }
    this.globalService.setUnit(params);
  }
}

