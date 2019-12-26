import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class UsageReportService {
  scopeIP:string;
  ipAddress:string;
  scriptIP:string;
  headers:HttpHeaders;

  constructor(private http: HttpClient,private utilsService:UtilsService) {
    this.scopeIP = "https://api.oyespace.com/";
    this.ipAddress = 'http://api.oyespace.com/';
    this.scriptIP = "7470AD35-D51C-42AC-BC21-F45685805BBE";
    this.headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-OYE247-APIKey', this.scriptIP)
      .append('Access-Control-Allow-Origin', "*");
   }

  GetVisitorLogList() {
    //http://api.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogList
    let ipAddress = this.utilsService.getIPaddress();
    return this.http.get(ipAddress + 'oyesafe/api/v1/VisitorLog/GetVisitorLogList', { headers: this.headers });
  }
}
