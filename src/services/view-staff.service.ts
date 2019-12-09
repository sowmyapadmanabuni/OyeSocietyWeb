import { Injectable } from '@angular/core';
import {GlobalServiceService} from '../app/global-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewStaffService {
  constructor(private http: HttpClient, private utilsService: UtilsService, private globalServiceService: GlobalServiceService) { }
  
  getStaffReport(Data):Observable<any>{
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oye247/api/v1/Worker/GetWorkerListByDatesAssocAndUnitID`
    var StaffReport = {
      "ASAssnID" : this.globalServiceService.currentAssociationId,
      "WKWorkID" : Data['wkWorkID'],
      "FromDate" : (Data['StartDate']=='')? "2019-11-08" : Data['StartDate'],
      "ToDate"   : (Data['EndDate']=='')? "2019-11-20" : Data['EndDate'],
      "UNUnitID" : this.globalServiceService.currentUnitId,
      "ACAccntID": this.globalServiceService.getacAccntID()
    }
    console.log('StaffReport',StaffReport);
    return this.http.post(url, JSON.stringify(StaffReport), {headers: headers});
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }
  // http://apiuat.oyespace.com/oye247/api/v1/GetWorkersListByUnitID/40469
  GetStaffList(){
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oye247/api/v1/GetWorkerListByAssocIDAccountIDAndUnitID/${this.globalServiceService.getCurrentAssociationId()}/${this.globalServiceService.getacAccntID()}/${this.globalServiceService.getCurrentUnitId()}`
    return this.http.get(url,{headers: headers});
  }
}