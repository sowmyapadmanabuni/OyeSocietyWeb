import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {NotificationListArray} from '../../app/models/notification-list-array';
import {ResidentNotificationListArray} from '../../app/models/resident-notification-list-array';
import { UtilsService } from '../utils/utils.service';
import { GlobalServiceService } from '../global-service.service';
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

  constructor(private utilsService:UtilsService,
    public globalService:GlobalServiceService,
    private http: HttpClient) {
    this.paginatedvalue=1; 
    this.role='admin';
    this.notificationListArray=[];
    this.ResidentNotificationListArray=[];
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
                  this.notificationListArray.push(new NotificationListArray(item['ntid'], item['ntType'], item['asAsnName'], item['ntDesc'], item['sbMemID']));
                }
                else {
                  console.log(item['visitorlog'].length==0?'':(item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1?'':item['visitorlog'][0]['vlEntryImg']));
                  this.ResidentNotificationListArray.push(new ResidentNotificationListArray((item['visitorlog'].length==0?'':item['visitorlog'][0]['vlComName']),
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['vlVisType']),
                  item['asAsnName'], 
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['vlApprdBy']),
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['vlMobile']),
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['unUniName']),
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['vldCreated']),
                  (item['visitorlog'].length==0?'':item['visitorlog'][0]['vlengName']),
                  (item['visitorlog'].length==0?'':(item['visitorlog'][0]['vlEntryImg'].indexOf('.jpg') != -1?'':'data:image/png;base64,'+item['visitorlog'][0]['vlEntryImg'])),
                  'collapse'));
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
}
