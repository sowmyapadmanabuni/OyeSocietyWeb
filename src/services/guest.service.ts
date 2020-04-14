import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { UtilsService } from '../app/utils/utils.service'
import { GlobalServiceService } from '../app/global-service.service';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  INInvVis:any;

  constructor(private http: HttpClient, private utilsService: UtilsService, private globalService: GlobalServiceService) { }

  getVisitorList(date,VisitorType):Observable<any> {
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated`
    var visitorData = {
      "ASAssnID": this.globalService.getCurrentAssociationId(),
      "INInvVis": VisitorType,
      "UNUnitID": this.globalService.getCurrentUnitId(),
      "ACAccntID": this.globalService.getacAccntID(),
      "StartDate":(date['StartDate']=='')? "2019-08-11" : date['StartDate'],
      "ToDate": (date['Todate']=='')? formatDate(new Date(),'yyyy-MM-dd','en') : date['Todate']
    }
    console.log(visitorData);
   return this.http.post(url, JSON.stringify(visitorData), { headers: headers })

  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
