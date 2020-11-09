import { Component } from '@angular/core';
import {GlobalServiceService} from './global-service.service';
import {Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import {DashBoardService} from '../services/dash-board.service';
import * as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';
import { UnitlistForAssociation } from './models/unitlist-for-association';
import { ConnectionService } from 'ng-connection-service';
import swal from 'sweetalert2';
import { UserIdleService } from 'angular-user-idle';
import {NotificationListArray} from '../app/models/notification-list-array';
import {ResidentNotificationListArray} from '../app/models/resident-notification-list-array';

declare var $:any;

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
  id: NodeJS.Timer;
  sbMemID:any;
  accountID:number;
  associations:any= [];
  uniqueAssociations :any[];
  associationName:any;
  subscription: Subscription;
  associationListForReload: Subscription;
  getAssociationListSubscription: Subscription;
  unitlistForAssociation:any[];
  hideTitle:boolean;
  title = 'internet-connection-check';
  status = 'ONLINE'; //initializing as online by default
  isConnected = true;
  notificationListArray:NotificationListArray[];
  ResidentNotificationListArray:ResidentNotificationListArray[];
  notificationCount:number;
  paginatedvalue:number;
  maxvalue:number;
  NotificationListCountByAccntID: unknown[];

  constructor(public globalService:GlobalServiceService,public router:Router,
    public dashBoardService: DashBoardService,
    private http: HttpClient,private utilsService:UtilsService,
    private connectionService: ConnectionService,
    private userIdle: UserIdleService,
    private route: ActivatedRoute){
      this.NotificationListCountByAccntID=[];
      this.paginatedvalue=1;
      this.maxvalue=23;
      this.notificationCount=0;
    this.globalService.IsEnrollAssociationStarted=false;
    this.globalService.toggleregister=false;
    this.notificationListArray=[];
    this.ResidentNotificationListArray=[];
   // console.log(this.isAuthenticated());
    this.accountID=this.globalService.getacAccntID();
    this.globalService.toggledashboard=false;
    this.hideTitle=true;
    this.notificationList=[];
    this.uniqueAssociations=[];
    this.toggleName='';
    this.ntType='';
    this.VLApprStat='';
    this.subscription=this.globalService.getUnitListForAssociation()
    .subscribe(msg=>{
      console.log(msg);
      // this.unitlistForAssociation = msg['msg'].filter(item=>{
      //   return item['unUniName'] != '';
      // })
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
        this.globalService.setUnitDropDownHiddenByDefault('true'); 
      }
    },
    err=>{
      console.log(err);
    })
  //
  this.associationListForReload=this.globalService.GetAssociationListForReload()
  .subscribe(msg=>{
    console.log(JSON.parse(localStorage.getItem("assnList")));
    console.log(msg);
    console.log(this.globalService.getCurrentAssociationName());
    console.log(this.unitlistForAssociation);
    //this.unitlistForAssociation=[];
   /* JSON.parse(localStorage.getItem("assnList")).forEach(item => {
      if(item['asAsnName'] == this.globalService.getCurrentAssociationName()){
        console.log('test');
        const found = this.unitlistForAssociation.some(el => el['unUnitID'] === item['unUnitID'] && el['unUniName'] === item['unUniName'] && el['mrmRoleID'] === item['mrmRoleID']);
        if (!found) {
          //if (item['unUniName'] != '' && item['unUnitID'] != 0) {
            this.unitlistForAssociation.push(new UnitlistForAssociation(item['unUniName'], item['unUnitID'], item['mrmRoleID']));
          //}
        }
      }
    }); */
    console.log(this.unitlistForAssociation);
    if(JSON.parse(localStorage.getItem("assnList"))==null){
      this.uniqueAssociations=[];
    }
    else{
      this.uniqueAssociations=JSON.parse(localStorage.getItem("assnList"));
      console.log(this.uniqueAssociations);
      
    }
    this.hideTitle=true;
    this.globalService.setAssnDropDownHiddenByDefault('false');
  })
  //
 this.getAssociationListSubscription = this.globalService.getMessage()
    .subscribe(msg => {
      console.log(msg);
      // console.log(asnName);
      // console.log(typeof asnName);
      this.uniqueAssociations = msg['msg'];
      console.log(this.uniqueAssociations);
      this.GetFamilyMemberVehicleCountByAssocAcntUnitID();
      //this.globalService.setCurrentAssociationName(msg['msg'][0]['asAsnName']);
      this.hideTitle = true;
      this.globalService.setAssnDropDownHiddenByDefault('false');
    },
      err => {
        console.log(err);
      })
      //
      if(JSON.parse(localStorage.getItem("assnList"))==null){
        this.uniqueAssociations=[];
      }
      else{
        this.uniqueAssociations=JSON.parse(localStorage.getItem("assnList"));
        console.log(this.uniqueAssociations);
      }
        //

        this.connectionService.monitor().subscribe(isConnected => {
          this.isConnected = isConnected;
          if(this.isConnected){
          this.status = "ONLINE";
          this.router.navigate(['home']);
          } else {
          this.status = "INTERNET CONNECTION ERROR"
          this.router.navigate(['error']);
          }
          alert(this.status);
          });
          





  }
  ngOnInit() {
    if(this.globalService.getacAccntID()){
      //this.GetNotificationListByAccntID();   
      //this.getNotification();
      //this.getAssociation();
      this.HideOrShowNotification=false;
    }
    this.id = setInterval(() => {
      this.GetFamilyMemberVehicleCountByAssocAcntUnitID();
    },10000);
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => 
     {
       //console.log(count)
      let eventList= ['click', 'mouseover','keydown','DOMMouseScroll','mousewheel',
        'mousedown','touchstart','touchmove','scroll','keyup'];
        for(let event of eventList) {
        document.body.addEventListener(event, () =>this.userIdle.resetTimer());
        }
      });
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      //console.log('Time is up!');
      console.log(document.getElementById('LogOutID'));
      document.getElementById('LogOutID').click();
      alert("Your session has expired Kindly Login Again");
    }); 
    //
    //this.GetNotificationListCountByAccntID();
    this.GetFamilyMemberVehicleCountByAssocAcntUnitID();
  }
  ngAfterViewInit(){
  
    
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  myFunction() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  toggleNotificationPanel(e) {
    e.preventDefault();
    document.getElementById('panel').style.display = 'block';
  }
  toggleNotificationPanel1(e) {
    e.preventDefault();
    document.getElementById('panel1').style.display = 'block';
  }
  toggleDashboard() {
    //console.log('inside toggleDashboard');
    //console.log(localStorage.getItem('IsEnrollAssociationStarted'))
    console.log(this.globalService.IsEnrollAssociationStarted);
    this.globalService.IsEnrollAssociationStarted=true;
    //if(this.globalService.IsEnrollAssociationStarted==true){
      if(localStorage.getItem('Component')=='AssociationManagent'){
        let status = confirm('Changes you have made not saved');
        console.log(status)
        if(status){
          this.globalService.toggledashboard = true;
          this.router.navigate(['home']);
        }
        else{
          localStorage.setItem('Component','AssociationManagent');
        }
      }
    //}
    else{
      this.globalService.toggledashboard = true;
      this.router.navigate(['home']);
    }
  }
  toggleAsnDropDwn(){
    console.log('test');
    this.globalService.setAssnDropDownHiddenByDefault(true); //yes
    this.globalService.setUnitDropDownHiddenByDefault(true); //yes
    console.log(typeof this.globalService.getAssnDropDownHiddenByDefaultValue());
    console.log(this.globalService.getAssnDropDownHiddenByDefaultValue());
    this.hideTitle=false;
  }
  toggleUnitDropDwn(){
    this.globalService.MoreThanOneUnit=true;
    this.globalService.HideUnitDropDwn=true; //No
    this.globalService.NotMoreThanOneUnit=false;
  }
  isAuthenticated(){
    if(this.globalService.getacAccntID()){
      return true
    } 
    else {
      return false;
    }
  }
  GetNotificationListByAccntID(){
    console.log(this.paginatedvalue);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();

    let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${this.paginatedvalue}`
      this.http.get(url, { headers: headers })
        .subscribe(data => {
          if (data['data']['notificationListByAcctID'].length == 0) {
            console.log(data);
            this.getNotification();
          }
          else {
            this.paginatedvalue += 1;
            this.GetNotificationListByAccntID();
            console.log(data);
          }
        })
  }
  getNotification() {
    this.paginatedvalue -= 1;
    console.log(this.paginatedvalue);
    this.notificationListArray = [];
    this.ResidentNotificationListArray = [];
    // http://apiuat.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAccntID/11511/1
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();

    /* for (let pageIndex = 1; pageIndex < this.paginatedvalue; pageIndex++) {
      let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${pageIndex}`
      this.http.get(url, { headers: headers })
        .subscribe(data => {
          console.log(data);
          Array.from(data['data']['notificationListByAcctID']).forEach((item, index) => {
            ((index) => {
              setTimeout(() => {
                if (item['ntType'] == "Join") {
                  //this.notificationListArray.push(new NotificationListArray(item['ntid'], item['ntType'], item['asAsnName'], item['ntDesc'], item['sbMemID']));
                }
                else {
                  //this.ResidentNotificationListArray.push(new ResidentNotificationListArray(item['ntid'], item['ntType'], item['asAsnName'], item['ntDesc'], item['sbMemID']));
                }
              }, 3000 * index)
            })(index)
          })
        },
          err => {
            console.log(err);
          })
    } */
  }
  getAssociation(){
    this.uniqueAssociations=[];
    console.log('this.accountID',this.accountID);
    this.dashBoardService.getAssociation(this.accountID).subscribe(res => {
      console.log(res);
      var data:any = res;
      console.log(data);
      this.associations = data.data.memberListByAccount;
      this.associations = _.sortBy(this.associations, e => e.asAsnName);
      console.log('associations',this.associations);
      for (let i = 0; i < this.associations.length; i++) {
        //console.log( this.uniqueAssociations);
        //console.log( this.associations[i]['asAsnName']);
        const found = this.uniqueAssociations.some(el => el['asAsnName'] === this.associations[i]['asAsnName']);
        if (!found) {
          this.uniqueAssociations.push(this.associations[i]);
        }
      }
      console.log(this.uniqueAssociations);
      console.log(this.uniqueAssociations[0]['asAsnName']);
      this.globalService.setCurrentAssociationName(this.uniqueAssociations[0]['asAsnName']);
      console.log(this.globalService.currentAssociationName);
        this.loadAssociation(this.uniqueAssociations[0]['asAsnName'],'id');
      },
      res=>{
        //console.log('Error in getting Associations',res);
      });
  }
  loadAssociation(associationName: string, param: any) {
    console.log(associationName, param);
    let params={
      "associationName":associationName,
      "param":param //id
    }
    console.log(params);
    this.globalService.setSelectedAssociation(params);
    this.globalService.setCurrentAssociationName(associationName);
    this.hideTitle=true;
    this.globalService.setAssnDropDownHiddenByDefault('false');
  }
  GetNotificationListCountByAccntID(){
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${1}`
    this.http.get(url, { headers: headers })
      .subscribe(data => {
        console.log(data);
        this.NotificationListCountByAccntID = Array.from(data['data']['notificationListByAcctID']).filter(item => {
          return item['ntIsActive'] == true
            })
            console.log(this.NotificationListCountByAccntID);
            this.globalService.AdminResidentActiveNotification=this.NotificationListCountByAccntID.length;
      },
      err=>{
        console.log(err);
      })
  }
  GetFamilyMemberVehicleCountByAssocAcntUnitID() {
    console.log(this.globalService.getCurrentAssociationId(),this.globalService.getacAccntID(),this.globalService.getCurrentUnitId());
    let scopeIP = this.utilsService.getIPaddress();
    let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');
    this.http.get(scopeIP + `oyesafe/api/v1/GetFamilyMemberVehicleCountByAssocAcntUnitID/${Number(this.globalService.getCurrentAssociationId())}/${this.globalService.getacAccntID()}/${this.globalService.getCurrentUnitId()}`, { headers: headers })
    .subscribe(data=>{
      console.log(data);
      this.globalService.AdminResidentActiveNotification=data['data']['totalBellCount'];
      this.globalService.BellNotification=data['data']['totalBellCount'];
      this.globalService.AdminActiveNotification=data['data']['adminNotificationCount'];
      this.globalService.ResidentActiveNotification=data['data']['myUnitNotificationCount'];
      console.log(this.globalService.AdminResidentActiveNotification, this.globalService.AdminActiveNotification, this.globalService.ResidentActiveNotification);
    },
    err=>{
      console.log(err);
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
  loadUnit(unUniName,unUnitID){
    console.log(unUniName, unUnitID);
    let params={
      "unUniName":unUniName,
      "unUnitID":unUnitID
    }
    this.globalService.setCurrentUnitName(unUniName);
    this.globalService.getCurrentUnitName();
    this.globalService.setUnit(params);
    this.globalService.HideUnitDropDwn=false;
    this.globalService.NotMoreThanOneUnit=true;
    this.globalService.CallgetVisitorList('');
  }
  logOut() {
    console.log(navigator.onLine);
   if(navigator.onLine){
    this.globalService.clear();
    this.router.navigate(['root']);
    window.scrollTo(0, 0);
    }
    else{
      swal.fire({
        title: "",
        text: "Please Check Internet Connection and try Again",
        showCancelButton: false,
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
      })
    } 
  }
  goToNotification(e){
    e.preventDefault();
    this.router.navigate(['notifications']);
  }
}

