import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViewReceiptService {
  ipAddress: string;
  url: string;

  constructor(private http: HttpClient,private utilsService:UtilsService) { 
    this.ipAddress = 'http://apidev.oyespace.com/';
  }

  getpaymentlist(currentAssociationID){
    //console.log('currentAssociationID-'+currentAssociationID);
    //url: scopeIP+'/oyeliving/api/v1/payment/getpaymentlist/' + $scope.curAssociationID,
    //http://apidev.oyespace.com/oyeliving/api/v1/GetPaymentsListByAssocID/%7BAssociationID%7D
    //http://apidev.oyespace.com/oyeliving/api/v1/GetPaymentsListByAssocID/4217
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.getpaymentlist();
    this.url = `${ipAddress}oyeliving/api/v1/GetPaymentsListByAssocID/${currentAssociationID}`
    return this.http.get(this.url, { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
  getAssociationAddress(currentAssociationID){
    console.log(currentAssociationID);
     
     let headers = this.getHttpheaders();
     let ipAddress=this.utilsService.getpaymentlist();
     this.url = `${ipAddress}oyeliving/api/v1/association/getAssociationList/${currentAssociationID}`
     return this.http.get(this.url, { headers: headers });
     }
  
}
