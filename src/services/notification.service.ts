import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import {GlobalServiceService} from '../app/global-service.service'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient,private utilsService:UtilsService, public globalService:GlobalServiceService) { }

  NotificationDataRefresh() {
    console.log(this.globalService.getCurrentAssociationId(),this.globalService.getacAccntID(),this.globalService.getCurrentUnitId());
    let scopeIP = this.utilsService.getIPaddress();
    let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');
    this.http.get(scopeIP + `oyesafe/api/v1/GetFamilyMemberVehicleCountByAssocAcntUnitID/${Number(this.globalService.getCurrentAssociationId())}/${this.globalService.getacAccntID()}/${this.globalService.getCurrentUnitId()}`, { headers: headers })
    .subscribe(data=>{
      console.log(data);
      this.globalService.AdminResidentActiveNotification=data['data']['notificationCount'];
      this.globalService.AdminActiveNotification=data['data']['adminNotificationCount'];
      this.globalService.ResidentActiveNotification=data['data']['myUnitNotificationCount'];
      console.log(this.globalService.AdminResidentActiveNotification);
    },
    err=>{
      console.log(err);
    })
  }
}
