import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {NotificationListArray} from '../../app/models/notification-list-array';
import {ResidentNotificationListArray} from '../../app/models/resident-notification-list-array';
import { UtilsService } from '../utils/utils.service';
import { GlobalServiceService } from '../global-service.service';
import {DomSanitizer} from '@angular/platform-browser';
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
  ResidentNotificationListArrayTemp:any[];

  constructor(private utilsService:UtilsService,
    public globalService:GlobalServiceService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer) {
      this.searchVisitorText='';
    this.paginatedvalue=1; 
    this.role='admin';
    this.notificationListArray=[];
    this.ResidentNotificationListArray=[];
    this.ResidentNotificationListArrayTemp=[];
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

     for (let pageIndex = 1; pageIndex < this.paginatedvalue; pageIndex++) {
      let url = `${ipAddress}oyesafe/api/v1/Notification/GetNotificationListByAccntID/${this.globalService.getacAccntID()}/${pageIndex}`
      this.http.get(url, { headers: headers })
        .subscribe(data => {
          console.log(data);
          Array.from(data['data']['notificationListByAcctID']).forEach((item, index) => {
            ((index) => {
              setTimeout(() => {
                if (item['ntType'] == "Join") {
                  console.log(item);
                  this.notificationListArray.push(new NotificationListArray(item['unit']['unUniName'], 
                  item['asAsnName'], 
                  item['unit']['ntMobile'], 
                  (item['unit']['owner'].length == 0?item['unit']['tenant']['utfName']:item['unit']['owner']['uofName']),
                  (item['visitorlog'].length == 0 ? '' : this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg'])),
                  item['unit']['unOcStat'],
                  (item['unit']['owner'].length == 0?'Tenant':'Owner'),
                  (item['unit']['owner'].length == 0?item['unit']['tenant']['utfName']:item['unit']['owner']['uofName']),
                  (item['unit']['owner'].length == 0?item['unit']['tenant']['utMobile']:item['unit']['owner']['uoMobile']), 
                  'admincollapse'+new Date().getTime()
                  ));
                  console.log(this.notificationListArray);
                }
                else {
                  //console.log(item['visitorlog'].length == 0 ? '' : (item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1 ? '' : 'data:image/png;base64,' + item['visitorlog'][0]['vlEntryImg']));
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlApprdBy']);
                  //console.log(item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]);
                  //console.log(item['ntType']);
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
                    (item['visitorlog'].length == 0 ? '' : item['visitorlog'][0]['vlexgName'])));
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
}
