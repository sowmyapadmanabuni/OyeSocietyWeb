import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViewreportService {
  ipaddress:string;
  url:string;

  constructor(private http:HttpClient,private utilsService:UtilsService) { 
    this.ipaddress="https://apidev.oyespace.com/";
  }

  getpaymentdetails(currentAssociationID){
    let headers = this.getHttpheaders();
    let ipaddress=this.utilsService.getpaymentdetails();
    this.url=`${ipaddress}oyeliving/api/v1/GetPaymentsListByAssocID/${currentAssociationID}`
    return this.http.get(this.url,{headers:headers});
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
