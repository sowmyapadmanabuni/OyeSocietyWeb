import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NotificationListArray } from '../../app/models/notification-list-array';
import { ResidentNotificationListArray } from '../../app/models/resident-notification-list-array';
import { UtilsService } from '../utils/utils.service';
import { GlobalServiceService } from '../global-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DashBoardService } from '../../services/dash-board.service';
import {Router,ActivatedRoute} from '@angular/router';
import * as _ from 'underscore';
declare var $: any;
import * as gateFirebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {NotificationService} from '../../services/notification.service';

let config = {
  apiKey: "AIzaSyBaS0nRRwB5wU1D3C6CjR9b6CVOC3aHay4",
  authDomain: "jabm-fd8d9.firebaseapp.com",
  databaseURL:"https://jabm-fd8d9-7adc4.firebaseio.com/",//"https://jabm-fd8d9-1ff50.firebaseio.com/",
  projectId: "jabm-fd8d9",
  storageBucket: "jabm-fd8d9.appspot.com",
  messagingSenderId: "1054539821176",
  appId: "1:1054539821176:web:5f6e4b2a4db6e64e9c3d8d",
  measurementId: "G-1K6Q5VL6WZ"


// Below is the firebase config for PROD

  // databaseURL: "https://jabm-fd8d9.firebaseio.com",
  // apiKey: "AIzaSyBaS0nRRwB5wU1D3C6CjR9b6CVOC3aHay4",
  // authDomain: "jabm-fd8d9.firebaseapp.com",
  // projectId: "jabm-fd8d9",
  // storageBucket: "jabm-fd8d9.appspot.com",
  // messagingSenderId: "1054539821176",
  // appId: "1:1054539821176:web:5f6e4b2a4db6e64e9c3d8d",
  // measurementId: "G-1K6Q5VL6WZ"
};
gateFirebase.initializeApp(config);


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  modalRef: BsModalRef;
  role: any;
  paginatedvalue: number;
  notificationListArray: NotificationListArray[];
  ResidentNotificationListArray: ResidentNotificationListArray[];
  searchVisitorText: any;
  searchAdminVisitorText: any;
  ResidentNotificationListArrayTemp: any[];
  notificationListArrayTemp: any[];
  AdminActiveNotification: number;
  ResidentActiveNotification: number;
  ntJoinStatTmp2: any;
  changeViewOfActionButton: boolean;
  image1:any;
  image2:any;
  image3:any;
  image4:any;
  image5:any;
  notificationListByAcctID:any[];
  allAdminAndResidentNotification:any[];
  allAdminAndResidentNotification1:any[];
  allAdminAndResidentNotificationTemp:any[];
  allAdminAndResidentNotificationTempresidant:any[];
  DateCurrent: any;
  id: any;
  storeNTIDforCollapsableDiv: any;
  imagesArray: any[];

  constructor(private utilsService: UtilsService,public router:Router,
    public globalService: GlobalServiceService,
    private modalService: BsModalService,
    public notificationService: NotificationService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private DashBoardService: DashBoardService) {
      // this.storeNTIDforCollapsableDiv='';
      this.notificationListByAcctID=[];
      this.allAdminAndResidentNotification=[];
       this.allAdminAndResidentNotification1 = [];

      this.allAdminAndResidentNotificationTemp=[];
      this.allAdminAndResidentNotificationTempresidant=[];
      this.imagesArray=[];
      this.changeViewOfActionButton=true;
    this.ntJoinStatTmp2 = '';
    this.AdminActiveNotification = 0;
    this.ResidentActiveNotification = 0;
    this.searchVisitorText = '';
    this.searchAdminVisitorText = '';
    this.paginatedvalue = 1;
    this.role = 'admin';
    this.notificationListArray = [];
    this.ResidentNotificationListArray = [];
    this.ResidentNotificationListArrayTemp = [];
    this.notificationListArrayTemp = [];
    this.image1 = "";
    this.image2 = "";
    this.image3 = "";
    this.image4 = "";
    this.image5 = "";
    if (this.globalService.mrmroleId != 1) {
      this.AdminsUnitShow('resident');
    }
  }
  // ngAfterViewInit(){
  //   const classArr: any = document.querySelectorAll('.panel-heading');
  //   classArr.addEventListener('click', this.NotificationActiveStatusUpdate(1,3,'Join'))
  // }




   ngOnInit() {
    $(function () {
      $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      })
    });
    //
    //this.GetNotificationListByAccntID();

   $(".se-pre-con").show();
     this.refreshNotificationArray();
    this.id = setInterval(async () => {
      $(".se-pre-con").fadeOut("slow");
      await this.refreshNotificationArray(); 
    }, 10000); 
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  async refreshNotificationArray() {
    //  $(".se-pre-con").show();
    this.notificationService.NotificationDataRefresh();
    let ipAddress = this.utilsService.getIPaddress();
    return this.http.get(`${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/1`,
    { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
    .subscribe(data=>{
      console.log('NotiRefreshData',data);
      //console.log(this.allAdminAndResidentNotification)
      //this.allAdminAndResidentNotification=data['data']['notificationListByAcctID'];
      //if(data['data']['notificationListByAcctID'].length>this.allAdminAndResidentNotification.length){
         this.allAdminAndResidentNotification=data['data']['notificationListByAcctID'];
         this.allAdminAndResidentNotification1 = data['data']['notificationListByAcctID'].filter(item=>{
           return item['ntType']=='Join';
         });
         this.allAdminAndResidentNotificationTemp=this.allAdminAndResidentNotification1
         this.allAdminAndResidentNotificationTempresidant = data['data']['notificationListByAcctID'];
        //  setTimeout(()=>{
        //   let elemnt = $('.panel-default');
        //   Array.from(elemnt).forEach(item=>{
        //     if((<HTMLElement>item).children.length == 0){
        //       (<HTMLElement>item).style.display = 'none';
        //     }
        //   })
        //   $(".se-pre-con").fadeOut("slow");
        //  },1000)
      //}
    },
    err=>{
      console.log(err);
    })
   
  }
  getSafeUrlFromVisitorlog(url) {
    if(url==''){
      return '../../assets/images/notification_icons/user-default.png';
    }
    else{
      return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + url);
    }
  }
  getSafeUrl(url) {
    if(url==''){
      return '../../assets/images/notification_icons/user-default.png';
    }
    else{
      return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + url);
    }
  }
  openModal3(privacy: TemplateRef<any>) {
    this.modalRef = this.modalService.show(privacy, { class: 'modal-lg' });
  }
  getNtDescFirstname(ntDesc) {
    //console.log('ntDesc-', ntDesc);
    let firstname = ntDesc.split(' ');
    //console.log(firstname);
    return firstname[0];
  }
  AdminsUnitShow(resident) {
    this.role = resident;
    console.log(this.allAdminAndResidentNotification);
  }
  AdminsButtonShow(admin) {
    this.role = admin;
    this.allAdminAndResidentNotification1 = this.allAdminAndResidentNotificationTemp;
    // setTimeout(()=>{
    //   let elemnt = $('.panel-default');
    //   Array.from(elemnt).forEach(item=>{
    //     if((<HTMLElement>item).children.length == 0){
    //       console.log(item);
    //       (<HTMLElement>item).style.display = 'none';
    //     }
    //   })
    //   $(".se-pre-con").fadeOut("slow");
    //  },1000)
  }
  GetNotificationListByAccntID() {
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
          this.allAdminAndResidentNotification= data['data']['notificationListByAcctID'];
          this.allAdminAndResidentNotification1 = data['data']['notificationListByAcctID'].filter(item=>{
            return item['ntType']=='Join';
          });
          this.allAdminAndResidentNotificationTemp= data['data']['notificationListByAcctID'];
          console.log(this.allAdminAndResidentNotification);
        }
      })
  }
  getNotification(param) {
    if (param == 'id') {
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
    for (let pageIndex = 1; pageIndex <= 1; pageIndex++) {
      let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${pageIndex}`
      this.http.get(url, { headers: headers })
        .subscribe(data => {
          console.log(data);
          this.notificationListByAcctID = data['data']['notificationListByAcctID'];
          console.log('REQUIRED DATA FOR UI',this.notificationListByAcctID);
          Array.from(data['data']['notificationListByAcctID']).forEach((item, index) => {
            ((index) => {
              setTimeout(() => {
                //console.log(item);
                console.log(item['ntIsActive']);
                if (item['ntType'] == "Join") {
                  console.log(item['unit']['unOcStat']);
                  console.log(item['ntid']);
                  //console.log(item['unit']['owner'].length);
                  //console.log(item['unit']['owner'].length == 0 ? item['unit']['tenant'][0]['utfName'] : item['unit']['owner'][0]['uofName']);
                  //console.log(item['unit']['owner'].length == 0 ? item['unit']['tenant'][0]['utMobile'] : item['unit']['owner'][0]['uoMobile']);
                  if (item['ntIsActive'] == true) {
                    this.AdminActiveNotification += 1;
                    console.log(this.AdminActiveNotification);
                  }
                  this.notificationListArray.push(new NotificationListArray(item['unit']['unUniName'],
                    item['asAsnName'],
                    item['ntMobile'],
                    (item['unit']['owner'].length == 0 ? (item['unit']['tenant'].length == 0 ? '' : item['unit']['tenant'][0]['utfName']) : item['unit']['owner'][0]['uofName']),
                    (item['visitorlog'].length == 0 ? '' : this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg'])),
                    item['unit']['unOcStat'],
                    (item['unit']['owner'].length == 0 ? (item['unit']['tenant'].length == 0 ? 'UnSold Vacant Unit' : 'Tenant') : 'Owner'),
                    (item['unit']['owner'].length == 0 ? (item['unit']['tenant'].length == 0 ? '' : item['unit']['tenant'][0]['utfName']) : item['unit']['owner'][0]['uofName']),
                    (item['unit']['owner'].length == 0 ? (item['unit']['tenant'].length == 0 ? '' : item['unit']['tenant'][0]['utMobile']) : item['unit']['owner'][0]['uoMobile']),
                    'admincollapse' + new Date().getTime(),
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
                    item['ntType'],
                    item['ntdCreated'],
                    item['acAccntID'],
                    item['ntJoinStat'],
                    '',
                    '',
                    item['ntUsrImg']
                  ));
                  console.log(this.notificationListArray);
                  this.notificationListArray = _.sortBy(this.notificationListArray, 'adminReadStatus').reverse();
                  this.notificationListArrayTemp = this.notificationListArray;
                }
                else {
                  if (item['ntIsActive'] == true) {
                    this.ResidentActiveNotification += 1;
                  }
                  console.log(item);
                  //console.log(item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1 ? '' : 'data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg']));
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprdBy']);
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]);
                  console.log(item['ntType']);
                  this.ResidentNotificationListArray.push(new ResidentNotificationListArray((
                    item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlComName']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlVisType']),
                    item['asAsnName'],
                    (item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlApprdBy'] == '' ? '' : item['visitorlog'][0]['vlApprdBy'])),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlMobile']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['unUniName']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vldCreated']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlengName']),
                    (item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1 ? '' : this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg']))),
                    'collapse' + new Date().getTime(),
                    item['ntType'],
                    (item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlExAprdBy'] == '' ? '' : item['visitorlog'][0]['vlExAprdBy'])),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprStat']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlexgName']),
                    item['ntid'],
                    item['ntIsActive'],
                    (item['ntIsActive'] == true ? 'Unread' : 'Read'),
                    item['ntdCreated'],
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlVisLgID']),
                    item['asAssnID'],
                    (item['visitorlog'].length == 0 ? '' :item['visitorlog'][0]['vlfName']),
                    (item['visitorlog'].length == 0 ? '' :item['visitorlog'][0]['vlExitT']),
                    (item['approvedBy'] == ''? '' : item['approvedBy']),
                    (item['ntDesc'] == ''? '' : item['ntDesc']),
                    (item['wkDesgn'] == ''? '' : item['wkDesgn']),
                    (item['wkName'] == ''? '' : item['wkName']),
                    (item['sbUnitID'] == ''? '' : item['sbUnitID']),
                    (item['ntType'] == ''? '' : item['ntType']),
                    (item['ntJoinStat'] == ''? '' : item['ntJoinStat']),
                    (item['unUniName'] == ''? '' : item['unUniName']),
                    (item['acNotifyID'] == ''? '' : item['acNotifyID']),
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlEntryT'])
                  ));
                  this.ResidentNotificationListArray = _.sortBy(this.ResidentNotificationListArray, 'residentReadStatus').reverse();
                  this.ResidentNotificationListArrayTemp = this.ResidentNotificationListArray;
                  //

                  console.log('ResidentNotification',this.ResidentNotificationListArray);
                }
              }, 600 * index)
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
  searchVisitorList() {
    console.log(this.searchVisitorText);
    console.log(this.ResidentNotificationListArrayTemp);
    console.log(this.allAdminAndResidentNotification);
    if (this.searchVisitorText == '') {
      console.log('searchVisitorText', this.searchVisitorText);
      this.ResidentNotificationListArray = this.ResidentNotificationListArrayTemp;
      this.allAdminAndResidentNotification = this.allAdminAndResidentNotificationTempresidant;
    }
    /* this.ResidentNotificationListArray = this.ResidentNotificationListArray.filter(item => {
      return (item['unUniName'].toLowerCase().indexOf(this.searchVisitorText.toLowerCase()) > -1 || item['vlVisType'].toLowerCase().indexOf(this.searchVisitorText.toLowerCase()) > -1 || item['residentNtdCreated'].toLowerCase().indexOf(this.searchVisitorText.toLowerCase()) > -1)
    }) */
    console.log(this.allAdminAndResidentNotification);
    this.allAdminAndResidentNotification = this.allAdminAndResidentNotification.filter(item => {
      if(item['visitorlog'].length!=0){
        //console.log(item);
        return (item['visitorlog'][0]['unUniName'].toLowerCase().indexOf(this.searchVisitorText.toLowerCase()) > -1)
      }
    })
    console.log(this.allAdminAndResidentNotification);
  }
  searchAdminVisitorList() {
    console.log(this.searchAdminVisitorText);
    console.log(this.ResidentNotificationListArrayTemp);
    if (this.searchAdminVisitorText == '') {
      $(".se-pre-con").show();
      console.log('searchAdminVisitorText', this.searchAdminVisitorText);
      this.notificationListArray = this.notificationListArrayTemp;
      this.allAdminAndResidentNotification1 = this.allAdminAndResidentNotificationTemp;
      // setTimeout(()=>{
      //   console.log($('.panel-default'));
      //   let elemnt = $('.panel-default');
      //   Array.from(elemnt).forEach(item=>{
      //     if((<HTMLElement>item).children.length == 0){
      //       console.log(item);
      //       (<HTMLElement>item).style.display = 'none';
      //     }
      //   })
      //   console.log('test1');
      //   $(".se-pre-con").fadeOut("slow");
      //  },2000)
    }
    this.notificationListArray = this.notificationListArray.filter(item => {
      return (item['unUniName'].toLowerCase().indexOf(this.searchAdminVisitorText.toLowerCase()) > -1)
    })
    this.allAdminAndResidentNotification1 = this.allAdminAndResidentNotification1.filter(item => {
      if(item['unit']!=null){
        return (item['unit']['unUniName'].toLowerCase().indexOf(this.searchAdminVisitorText.toLowerCase()) > -1)
      }
    })
    console.log(this.allAdminAndResidentNotification1);
  }
  NotificationActiveStatusUpdate(event, ntid, param, vlApprdBy) {
    clearInterval(this.id);
    event.preventDefault();
    console.log(ntid);
    this.storeNTIDforCollapsableDiv = ntid;
    console.log(vlApprdBy);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oyesafe/api/v1/NotificationActiveStatusUpdate/${ntid}`
    this.http.get(url, { headers: headers })
      .subscribe(data => {
        console.log(data);
        this.id = setInterval(async () => {
          await this.refreshNotificationArray(); 
        }, 15000); 

      },
        err => {
          console.log(err);
        })
        this.notificationService.NotificationDataRefresh();
        
  }
  //
  // Accept the join request start here
  approve(sbRoleID, sbMemID, sbUnitID, sbSubID, mrRolName, asAsnName, asAssnID, unSldDate, unOcSDate, acNotifyID, ntType, ntMobile, ntid) {
    let ipAddress1 = this.utilsService.getIPaddress();
    console.log('ntid', ntid)
    let roleChangeToAdminOwnerUpdate =
    {
      MRMRoleID: sbRoleID,
      MEMemID: sbMemID,
      UNUnitID: sbUnitID
    }
    console.log('roleChangeToAdminOwnerUpdate', roleChangeToAdminOwnerUpdate);
    return this.http.post(`${ipAddress1}oyeliving/api/v1/MemberRoleChangeToAdminOwnerUpdate`, roleChangeToAdminOwnerUpdate,
      { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
      .subscribe(data => {
        console.log(data);
        let roleName = data['sbRoleID'] === 2 ? 'Owner' : 'Tenant';
        // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*
        let sendAdminNotification =
        {
          sbSubID: sbSubID,
          ntTitle: 'Request Approved',
          ntDesc: 'Your request to join ' + mrRolName + ' ' + ' unit in ' + asAsnName + ' association as ' + roleName + ' has been approved',
          ntType: 'Join_Status',
          associationID: asAssnID
        }
        console.log('sendAdminNotification', sendAdminNotification);
        return this.http.post('https://us-central1-jabm-fd8d9.cloudfunctions.net/sendUserNotification', sendAdminNotification)
          .subscribe(data => {
            console.log('sendUserNotification', data);
            // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*

            let NotificationCreate =
            {
              ACAccntID: this.globalService.getacAccntID(),
              ASAssnID: asAssnID,
              NTType: "Join_Status",
              NTDesc: 'Your request to join ' + mrRolName + ' ' + ' unit in ' + asAsnName + ' association as ' + roleName + ' has been approved',
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
              NTMobile: ntMobile,
              NTUsrImg: "userImage",

            }
            console.log('NotificationCreate', NotificationCreate);
            return this.http.post(`${ipAddress1}oyesafe/api/v1/Notification/Notificationcreate`, NotificationCreate,
              { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
              .subscribe(data => {
                console.log(data);
                let NTID = data['data']['notifications']['ntid']
                let DateUnit = {
                  MemberID: sbMemID,
                  UnitID: sbUnitID,
                  MemberRoleID: sbRoleID,
                  UNSldDate: unSldDate,
                  UNOcSDate: unOcSDate
                }
                console.log('DateUnit', DateUnit);
                return this.http.post(`${ipAddress1}oyeliving/api/v1/Unit/UpdateUnitRoleStatusAndDate`, DateUnit,
                  { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
                  .subscribe(data => {
                    console.log('DateUnitSuccess', data);
                    let UpdateTenant = {
                      MEMemID: sbMemID,
                      UNUnitID: sbUnitID,
                      MRMRoleID: sbRoleID
                    }
                    console.log('UpdateTenant', UpdateTenant);
                    return this.http.post(`${ipAddress1}oyesafe/api/v1/UpdateMemberOwnerOrTenantInActive/Update`, UpdateTenant,
                      { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
                      .subscribe(data => {
                        console.log('UpdateTenantSuccess', data);
                        let StatusUpdate = {
                          NTID: ntid,
                          NTStatDesc: "Request Sent"
                        }
                        console.log('StatusUpdate', StatusUpdate);
                        return this.http.post(`${ipAddress1}oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`, StatusUpdate,
                          { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
                          .subscribe(data => {
                            console.log('StatusUpdateSuccess', data);
                            let NotificationJoinStatusUpdate = {
                              NTID: ntid,
                              NTJoinStat: 'Accepted'
                            }
                            console.log('NotificationJoinStatusUpdate', NotificationJoinStatusUpdate);
                            return this.http.post(`${ipAddress1}oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`, NotificationJoinStatusUpdate,
                              { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
                              .subscribe(data => {
                                console.log('NotificationJoinStatusUpdate', data);
                                alert("Accepted");
                                this.refreshNotificationArray();
                                for (let i = 0; i < this.notificationListArray.length; i++) {
                                  if (this.notificationListArray[i]['adminNtid'] == ntid) {
                                    this.notificationListArray[i]['ntJoinStatTmp'] = 'id';
                                    this.notificationListArray[i]['ntJoinStatTmp1'] = 'id1';
                                  }
                                }
                                this.ntJoinStatTmp2 = '';
                              },
                                err => {
                                  console.log('NotificationJoinStatusUpdate', err);
                                })
                          },
                            err => {
                              console.log('StatusUpdateSuccess', err);
                            })
                      },
                        err => {
                          console.log('UpdateTenantError', err);
                        })
                  },
                    err => {
                      console.log('DateUnitError', err);
                    })
              },
                err => {
                  console.log(err);
                })
          },
            // -*-*-*-*-*-Send the admin notification-*-*-*-*-*-*-*-*-*-*
            err => {
              console.log(err);   // Error for  sendUserNotification API call
            })

      },
        err => {
          console.log(err);   // Error for  MemberRoleChangeToOwnerToAdminUpdate API call
        })

  }
  // Accept the join request stop here

  //
  rejectJoinRequest(ntid, sbRoleID, sbSubID, asAssnID, mrRolName, asAsnName, sbUnitID, sbMemID, ntdCreated, unOcSDate, acAccntID, ACNotifyID) {
    console.log(ntid);
    let ipAddress = this.utilsService.getIPaddress();
    return this.http.get(`${ipAddress}oyesafe/api/v1/NotificationActiveStatusUpdate/${ntid}`,
      { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
      .subscribe(data => {
        console.log('NotificationActiveStatusUpdate', data);
        let roleName = sbRoleID === 1 ? 'Owner' : 'Tenant';
        return this.http.get(`${ipAddress}oyeliving/api/v1//Member/UpdateMemberStatusRejected/${sbMemID}/Rejected`,
          { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
          .subscribe(data => {
            console.log('UpdateMemberStatusRejected', data);
            let cloudNotificationBody = {
              sbSubID: sbSubID,
              ntTitle: 'Request Declined',
              ntDesc: 'Your request to join' + mrRolName + ' ' + ' unit in ' + asAsnName + ' association as ' + roleName + ' has been declined',
              ntType: 'Join_Status',
              associationID: asAssnID
            }
            return this.http.post('https://us-central1-jabm-fd8d9.cloudfunctions.net/sendUserNotification', cloudNotificationBody)
              .subscribe(data => {
                console.log('cloudNotificationBody', data);
                let ReturnRejectNotification = {
                  ACAccntID: acAccntID,
                  ASAssnID: asAssnID,
                  NTType: 'Join_Status',
                  NTDesc: 'Your request to join' + mrRolName + ' ' + ' unit in ' + asAsnName + ' association as ' + roleName + ' has been declined',
                  SBUnitID: sbUnitID,
                  SBMemID: sbMemID,
                  SBSubID: sbSubID,
                  SBRoleID: 2,
                  ASAsnName: asAsnName,
                  MRRolName: mrRolName,
                  NTDCreated: ntdCreated,
                  NTDUpdated: ntdCreated,
                  UNOcSDate: unOcSDate,
                  UNSldDate: unOcSDate,
                  ACNotifyID: ACNotifyID
                }
                return this.http.post(`${ipAddress}oyesafe/api/v1/Notification/Notificationcreate`, ReturnRejectNotification,
                  { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
                  .subscribe(data => {
                    console.log('ReturnRejectNotification', data);
                    let notificationJoinStatusUpdate = {
                      NTID: ntid,
                      NTJoinStat: 'Rejected'
                    }
                    return this.http.post(`${ipAddress}oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`, notificationJoinStatusUpdate,
                      { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
                      .subscribe(data => {
                        console.log('notificationJoinStatusUpdate', data);
                        for (let i = 0; i < this.notificationListArray.length; i++) {
                          if (this.notificationListArray[i]['adminNtid'] == ntid) {
                            this.notificationListArray[i]['ntJoinStatTmp1'] = 'id';
                            this.notificationListArray[i]['ntJoinStatTmp'] = 'id1';
                          }
                        }
                        this.ntJoinStatTmp2 = '';
                      },
                        err => {
                          console.log('notificationJoinStatusUpdate', err);
                        })
                  },
                    err => {
                      console.log('ReturnRejectNotification', err);
                    })
              },
                err => {
                  console.log('cloudNotificationBody', err);
                })
          },
            err => {
              console.log('UpdateMemberStatusRejected', err);
            })
      },
        err => {
          console.log('NotificationActiveStatusUpdate', err);
        })
  }
  //
  // *-*-*-*-*-*-*-*-*-*-Accept gate Visitors Start Here*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  acceptgateVisitor(visitorId, associationid, visitorStatus, approvedBy) {
    let ipAddress = this.utilsService.getIPaddress();
    console.log('SENDING STATUS TO ACCEPT NOTIFICATION', visitorId, associationid, visitorStatus, approvedBy);
    return this.http.get(`${ipAddress}oyesafe/api/v1/GetCurrentDateTime`,
      { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
      .subscribe(data => {
        console.log('GetCurrentDateTime', data);
        let DateOfApproval = data['data']['currentDateTime'];
        this.DateCurrent=DateOfApproval;
        let UpdateApprovalStatus = {
          VLApprStat: visitorStatus,
          VLVisLgID: visitorId,
          VLApprdBy: visitorStatus == "EntryApproved" || visitorStatus == "Entry Approved" ? this.DashBoardService.acfName : approvedBy,
          VLExAprdBy: visitorStatus == "ExitApproved" || visitorStatus == "Exit Approved" ? this.DashBoardService.acfName : "",
        }
        console.log(UpdateApprovalStatus);

        return this.http.post(`${ipAddress}oyesafe/api/v1/UpdateApprovalStatus`, UpdateApprovalStatus,
          { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
          .subscribe(data => {
            console.log(data);


            // setTimeout(()=>{  

              this.fireBaseUpdate(associationid, visitorId, visitorStatus, DateOfApproval);

            //  }, 2000);




           


            // gateFirebase
            //   .database()
            //   .ref(`NotificationSync/A_${associationid}/${visitorId}`)
            //   .set({
            //     buttonColor: visitorStatus == "Entry Approved" || visitorStatus == "Exit Approved" ? '#75be6f' : '#ff0000',
            //     opened: true,
            //     newAttachment: false,
            //     visitorlogId: visitorId,
            //     updatedTime: DateOfApproval,
            //     status: visitorStatus,
            //   });

             
            console.log(`NotificationSync/A_${associationid}/${visitorId}`);
            console.log(associationid, visitorId, DateOfApproval, visitorStatus,);
            this.changeViewOfActionButton=false;
            this.updateFirebase(associationid);
            alert('Success');
            //this.GetNotificationListByAccntID();
            this.refreshNotificationArray();
            // this.router.navigate(['home']);
          },
            err => {
              console.log(err);
              alert(err['error']['error']['message'])
            })
      },
        err => {
          console.log('GetCurrentDateTime', err);
          // alert(err)
        })
  }
 
  // *-*-*-*-*-*-*-*-*-*-Accept gate Visitors End Here*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

 // *-*-*-*-*-*-*-*-*-*-Announcement Start Here*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 announcementData(asAssnID,acNotifyID){
  let ipAddress = this.utilsService.getIPaddress();
  console.log('Announcement data', asAssnID, acNotifyID);
  return this.http.get(`${ipAddress}oyesafe/api/v1/Announcement/GetAnnouncementDetailsByAssocAndAnnouncementID/${asAssnID}/${acNotifyID}`,
    { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
    .subscribe(data=>{
      console.log(data);
      console.log(data['data']['announcements']);
      this.imagesArray=data['data']['announcements'];
      console.log('imagesorDisplay',this.imagesArray);
      console.log(data['data']['announcements'][0]);
      console.log(data['data']['announcements'][0]['anImages']);
      this.image1='data:image/png;base64,'+ data['data']['announcements'][0]['anImages'];
      // this.image1=this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + data['data']['announcements'][0]['anImages'])
      console.log('image1',this.image1);
      // this.image2='data:image/png;base64,'+data['data']['announcements'][1]['anImages'];
      // this.image3='data:image/png;base64,'+data['data']['announcements'][2]['anImages'];
      // this.image4='data:image/png;base64,'+data['data']['announcements'][3]['anImages'];
      // this.image5='data:image/png;base64,'+data['data']['announcements'][4]['anImages'];
    },
    err=>{
      console.log(err);
    })

}
// *-*-*-*-*-*-*-*-*-*-Announcement End Here*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*



  updateFirebase(assId){
    let self = this;
    let refPath = `syncdashboard/notificationPopUpRefresh/${assId}`;
    console.log('GETTHEDETAILS',refPath,assId)
    let accountId = this.globalService.getacAccntID();
   
    gateFirebase.database()
    .ref(refPath)
    .set({
    acceptedAccountId:accountId
    }).then((data) => {
    }).catch(error => {
    console.log("Error:", error);
    })
    }

    staffRegistration(NTID,Status){
      let ipAddress1 = this.utilsService.getIPaddress();
      let input = {    
        "NTID"       : NTID,    
        "NTJoinStat" : Status,
       "ApprovedBy" :this.DashBoardService.acfName
       }
       console.log('staffRegistration',input);
       return this.http.post(`${ipAddress1}oye247/api/v1/UpdateWorkerRegistrationApprovalStatus`,input,
       { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } })
       .subscribe(data=>{
         console.log(data);
         alert('Registered');
         //this.GetNotificationListByAccntID();
         this.refreshNotificationArray();
       },
       err=>{
         console.log(err);
       })

    }



    fireBaseUpdate(associationid, visitorId, visitorStatus, DateOfApproval){
              gateFirebase
              .database()
              .ref(`NotificationSync/A_${associationid}/${visitorId}`)
              .set({
                buttonColor: visitorStatus == "Entry Approved" || visitorStatus == "Exit Approved" ? '#75be6f' : '#ff0000',
                opened: true,
                newAttachment: false,
                visitorlogId: visitorId,
                updatedTime: DateOfApproval,
                status: visitorStatus,
              });
              // alert("updated");
    }




    buttonPress(){
      gateFirebase
      .database()
      .ref(`NotificationSync/A_1018/1014`)
      .set({
        buttonColor:'#75be6f',
        opened: true,
        newAttachment: false,
        visitorlogId: 929,
        updatedTime: new Date(),
        status: 'Entry Approved',
      });
      console.log(new Date());
    }
}

