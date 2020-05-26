import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {NotificationListArray} from '../../app/models/notification-list-array';
import {ResidentNotificationListArray} from '../../app/models/resident-notification-list-array';
import { UtilsService } from '../utils/utils.service';
import { GlobalServiceService } from '../global-service.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  role: any;
  paginatedvalue: number;
  notificationListArray:NotificationListArray[];
  ResidentNotificationListArray:ResidentNotificationListArray[];
  searchVisitorText: any;
  searchAdminVisitorText:any;
  ResidentNotificationListArrayTemp:any[];
  notificationListArrayTemp:any[];
  AdminActiveNotification: number;
  ResidentActiveNotification: number;

  constructor(private utilsService:UtilsService,
    public globalService:GlobalServiceService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer) {
      this.AdminActiveNotification=0;
      this.ResidentActiveNotification=0;
      this.searchVisitorText='';
      this.searchAdminVisitorText='';
    this.paginatedvalue=1; 
    this.role='admin';
    this.notificationListArray=[];
    this.ResidentNotificationListArray=[];
    this.ResidentNotificationListArrayTemp=[];
    this.notificationListArrayTemp=[];
  }

  ngOnInit() {
    $(function(){
      $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      })
    });
    //
    this.GetNotificationListByAccntID();
  }
  AdminsUnitShow(resident)
  {
      this.role=resident;
  }
  AdminsButtonShow(admin){
      this.role=admin;
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
            this.getNotification('id');
          }
          else {
            this.paginatedvalue += 1;
            this.GetNotificationListByAccntID();
            console.log(data);
          }
        })
  }
  getNotification(param) {
    if(param == 'id'){
      this.paginatedvalue -= 1;
    }
    console.log(this.paginatedvalue);
    this.notificationListArray = [];
    this.ResidentNotificationListArray = [];
    this.AdminActiveNotification = 0;
    this.ResidentActiveNotification = 0;
    // http://apiuat.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAccntID/11511/1
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
     for (let pageIndex = 1; pageIndex <= this.paginatedvalue; pageIndex++) {
      let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${pageIndex}`
      this.http.get(url, { headers: headers })
        .subscribe(data => {
          //console.log(data);
          Array.from(data['data']['notificationListByAcctID']).forEach((item, index) => {
            ((index) => {
              setTimeout(() => {
                console.log(item);
                console.log(item['ntIsActive']);
                if (item['ntType'] == "Join") {
                  //console.log(item['unit']['owner'].length);
                  //console.log(item['unit']['owner'].length == 0 ? item['unit']['tenant'][0]['utfName'] : item['unit']['owner'][0]['uofName']);
                  //console.log(item['unit']['owner'].length == 0 ? item['unit']['tenant'][0]['utMobile'] : item['unit']['owner'][0]['uoMobile']);
                  if(item['ntIsActive']==true){
                    this.AdminActiveNotification += 1;
                    console.log(this.AdminActiveNotification);
                  }
                  this.notificationListArray.push(new NotificationListArray(item['unit']['unUniName'], 
                  item['asAsnName'], 
                  item['ntMobile'], 
                  (item['unit']['owner'].length == 0?(item['unit']['tenant'].length==0?'':item['unit']['tenant'][0]['utfName']):item['unit']['owner'][0]['uofName']),
                  (item['visitorlog'].length == 0 ? '' : this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg'])),
                  item['unit']['unOcStat'],
                  (item['unit']['owner'].length == 0?'Tenant':'Owner'),
                  (item['unit']['owner'].length == 0?(item['unit']['tenant'].length==0?'':item['unit']['tenant'][0]['utfName']):item['unit']['owner'][0]['uofName']),
                  (item['unit']['owner'].length == 0?(item['unit']['tenant'].length==0?'':item['unit']['tenant'][0]['utMobile']):item['unit']['owner'][0]['uoMobile']), 
                  'admincollapse'+new Date().getTime(),
                  item['ntid'],
                  item['ntIsActive'],
                  (item['ntIsActive'] == true ? 'Unread' : 'Read'),
                  item['sbRoleID'],
                  item['sbMemID'],
                  item['sbUnitID'],
                  item['sbSubID'],
                  item['mrRolName'],
                  item['asAssnID'],
                  item['unSldDate'],
                  item['unOcSDate'],
                  item['acNotifyID'],
                  item['ntType']
                  ));
                  //console.log(this.notificationListArray);
                  this.notificationListArray = _.sortBy(this.notificationListArray, 'adminReadStatus').reverse();
                  this.notificationListArrayTemp = this.notificationListArray;
                }
                else {
                  if(item['ntIsActive']==true){
                  this.ResidentActiveNotification += 1;
                  }
                  //console.log(item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1 ? '' : 'data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg']));
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprdBy']);
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]);
                  console.log(item['ntType']);
                  this.ResidentNotificationListArray.push(new ResidentNotificationListArray((item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlComName']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlVisType']),
                    item['asAsnName'],
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprdBy']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlMobile']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['unUniName']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vldCreated']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlengName']),
                    (item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1 ? '' : this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg']))),
                    'collapse' + new Date().getTime(),
                    item['ntType'],
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlExAprdBy']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprStat']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlexgName']),
                    item['ntid'],
                    item['ntIsActive'],
                    (item['ntIsActive'] == true ? 'Unread' : 'Read')
                    ));
                    this.ResidentNotificationListArray = _.sortBy(this.ResidentNotificationListArray, 'residentReadStatus').reverse();
                    this.ResidentNotificationListArrayTemp = this.ResidentNotificationListArray;
                  //
                  //console.log(this.ResidentNotificationListArray);
                }
              }, 3000 * index)
            })(index)
          })
        },
          err => {
            console.log(err);
          })
    } 
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }
  searchVisitorList(event) {
    console.log(this.searchVisitorText);
    console.log(this.ResidentNotificationListArrayTemp);
    if(this.searchVisitorText == ''){
      console.log('searchVisitorText',this.searchVisitorText);
      this.ResidentNotificationListArray = this.ResidentNotificationListArrayTemp;
    }
    this.ResidentNotificationListArray = this.ResidentNotificationListArray.filter(item => {
      return (item['unUniName'].toLowerCase().indexOf(this.searchVisitorText.toLowerCase()) > -1)
    })
  }
  searchAdminVisitorList() {
    console.log(this.searchAdminVisitorText);
    console.log(this.ResidentNotificationListArrayTemp);
    if(this.searchAdminVisitorText == ''){
      console.log('searchAdminVisitorText',this.searchAdminVisitorText);
      this.notificationListArray = this.notificationListArrayTemp;
    }
    this.notificationListArray = this.notificationListArray.filter(item => {
      return (item['unUniName'].toLowerCase().indexOf(this.searchAdminVisitorText.toLowerCase()) > -1)
    })
  }
  NotificationActiveStatusUpdate(ntid,param) {
    console.log(ntid);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oyesafe/api/v1/NotificationActiveStatusUpdate/${ntid}`
    this.http.get(url, { headers: headers })
      .subscribe(data => {
        console.log(data);
        if(param == 'Join'){
          for(let i=0;i<this.notificationListArray.length;i++){
           if(this.notificationListArray[i]['adminNtid'] == ntid){
             console.log(this.notificationListArray[i]['adminReadStatus']);
             if(this.notificationListArray[i]['adminReadStatus'] == 'Unread'){
              this.AdminActiveNotification -= 1;
              console.log(this.AdminActiveNotification);
             }
            this.notificationListArray[i]['adminReadStatus']='Read';
           }
          }
        }
        else{
          for(let j=0;j<this.ResidentNotificationListArray.length;j++){
            if(this.ResidentNotificationListArray[j]['residentNtid'] == ntid){
              console.log(this.ResidentNotificationListArray[j]['residentReadStatus']);
              if(this.ResidentNotificationListArray[j]['residentReadStatus'] == 'Unread'){
                this.ResidentActiveNotification -= 1;
              }
             this.ResidentNotificationListArray[j]['residentReadStatus']='Read';
            }
           }
        }
        //this.getNotification('');
      },
        err => {
          console.log(err);
        })
  }
  //
  // Accept the join request start here
  approve(sbRoleID, sbMemID, sbUnitID, sbSubID, mrRolName, asAsnName, asAssnID, unSldDate, unOcSDate, acNotifyID, ntType, ntMobile, ntid){
    console.log('ntid',ntid)
    let roleChangeToAdminOwnerUpdate=
    {  
        MRMRoleID: sbRoleID,
        MEMemID: sbMemID,
        UNUnitID: sbUnitID
    }
    console.log('roleChangeToAdminOwnerUpdate',roleChangeToAdminOwnerUpdate);
    return this.http.post('http://apiuat.oyespace.com/oyeliving/api/v1/MemberRoleChangeToAdminOwnerUpdate',roleChangeToAdminOwnerUpdate, 
    {headers:{'X-Champ-APIKey':'1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1','Content-Type':'application/json'}})
    .subscribe(data=>{
      console.log(data);
      let roleName = data['sbRoleID'] === 2 ? 'Owner' : 'Tenant';
      // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*
      let sendAdminNotification=
      {
        sbSubID: sbSubID,
        ntTitle: 'Request Approved',
        ntDesc: 'Your request to join '+mrRolName +' '+' unit in ' +asAsnName +' association as ' +roleName +' has been approved',
        ntType: 'Join_Status',
        associationID: asAssnID
      }
      console.log('sendAdminNotification',sendAdminNotification);
      return this.http.post('https://us-central1-jabm-fd8d9.cloudfunctions.net/sendUserNotification',sendAdminNotification)
      .subscribe(data=>{
        console.log('sendUserNotification',data);
        // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*
   
        let NotificationCreate=       
         {
          ACAccntID: this.globalService.getacAccntID(),
          ASAssnID: asAssnID,
          NTType: "Join_Status",
          NTDesc: 'Your request to join ' + mrRolName +' ' +' unit in ' +asAsnName +' association as ' +roleName +' has been approved',
          SBUnitID: sbUnitID,
          SBMemID: sbMemID,
          SBSubID: sbSubID,
          SBRoleID: sbRoleID,
          ASAsnName: asAsnName,
          MRRolName: mrRolName,
          NTDCreated: unOcSDate,
          NTDUpdated: unOcSDate,
          UNOcSDate: unOcSDate,
          UNSldDate: unSldDate,
          ACNotifyID: acNotifyID,
          NTMobile :ntMobile,
          NTUsrImg:"userImage",
        
        }
        console.log('NotificationCreate',NotificationCreate);
        return this.http.post('http://apiuat.oyespace.com/oyesafe/api/v1/Notification/Notificationcreate',NotificationCreate, 
        {headers:{'X-OYE247-APIKey':'7470AD35-D51C-42AC-BC21-F45685805BBE','Content-Type':'application/json'}})
        .subscribe(data=>{
          console.log(data); 
          let NTID = data['data']['notifications']['ntid']
          let DateUnit = {
            MemberID: sbMemID,
            UnitID: sbUnitID,
            MemberRoleID: sbRoleID,
            UNSldDate: unSldDate,
            UNOcSDate: unOcSDate
          }
          console.log('DateUnit',DateUnit);
          return this.http.post('http://apiuat.oyespace.com/oyeliving/api/v1/Unit/UpdateUnitRoleStatusAndDate',DateUnit, 
          {headers:{'X-Champ-APIKey':'1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1','Content-Type':'application/json'}})
          .subscribe(data=>{
            console.log('DateUnitSuccess',data);
            let UpdateTenant = {
              MEMemID: sbMemID,
              UNUnitID: sbUnitID,
              MRMRoleID: sbRoleID
            }
            console.log('UpdateTenant',UpdateTenant);
            return this.http.post('http://apiuat.oyespace.com//oyesafe/api/v1/UpdateMemberOwnerOrTenantInActive/Update',UpdateTenant, 
            {headers:{'X-OYE247-APIKey':'7470AD35-D51C-42AC-BC21-F45685805BBE','Content-Type':'application/json'}})
            .subscribe(data=>{
              console.log('UpdateTenantSuccess',data);
              let StatusUpdate = {
                NTID      : ntid,
                NTStatDesc : "Request Sent"
            }
            console.log('StatusUpdate',StatusUpdate);
            return this.http.post('http://apiuat.oyespace.com/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate',StatusUpdate, 
            {headers:{'X-OYE247-APIKey':'7470AD35-D51C-42AC-BC21-F45685805BBE','Content-Type':'application/json'}})
            .subscribe(data=>{
              console.log('StatusUpdateSuccess',data);
              let NotificationJoinStatusUpdate= {
                NTID: ntid,
                NTJoinStat: 'Accepted'
              }
              console.log('NotificationJoinStatusUpdate',NotificationJoinStatusUpdate);
              return this.http.post('http://apiuat.oyespace.com//oyesafe/api/v1/Notification/NotificationJoinStatusUpdate',NotificationJoinStatusUpdate, 
            {headers:{'X-OYE247-APIKey':'7470AD35-D51C-42AC-BC21-F45685805BBE','Content-Type':'application/json'}})
            .subscribe(data=>{
              console.log('NotificationJoinStatusUpdate',data);
              alert("Accepted");
              
            },
            err=>{
              console.log('NotificationJoinStatusUpdate',err);
            })
            },
            err=>{
              console.log('StatusUpdateSuccess',err);
            })
            },
            err=>{
              console.log('UpdateTenantError',err);
            })

          },
          err=>{
            console.log('DateUnitError',err);
          })
        },
        err=>{
          console.log(err);
        })
      },
      // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*
      err=>{
        console.log(err);   // Error for  sendUserNotification API call
      })
      
    },
    err=>{
      console.log(err);   // Error for  MemberRoleChangeToOwnerToAdminUpdate API call
    })
      
  }
// Accept the join request stop here
}