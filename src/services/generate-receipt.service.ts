import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GlobalServiceService} from './../app/global-service.service';
import {UtilsService} from '../app/utils/utils.service';


@Injectable({
  providedIn: 'root'
})
export class GenerateReceiptService {

  ipAddress: string;
  url: string;

 constructor(private http: HttpClient,private utilsService:UtilsService) {
    this.ipAddress = 'http://apidev.oyespace.com/';
  }

  GetBlockListByAssocID(currentAssociationID){
      let headers = this.getHttpheaders();
      let ipAddress=this.utilsService.GetBlockListByAssocID();
      this.url = `${ipAddress}oyeliving/api/v1/Block/GetBlockListByAssocID/${currentAssociationID}`
     return this.http.get(this.url, { headers: headers });
  }

  getCurrentBlockDetails(blBlockID,currentAssociationID){
    console.log('blBlockID',blBlockID);

    let getInvoice = {
      "ASAssnID" : currentAssociationID,
      "BLBlockID" : blBlockID
      }
      
      let headers = this.getHttpheaders();
      let ipAddress=this.utilsService.getCurrentBlockDetails();
      this.url = `${ipAddress}oyeliving/api/v1/payment/getpaymentlistbystatusandID`;
      return this.http.post(this.url, JSON.stringify(getInvoice), { headers: headers });
  }

  addPayment(newReceipt){
    console.log('newReceipt-'+JSON.stringify(newReceipt));
    //http://apidev.oyespace.com/oyeliving/api/v1/payment/add
      let headers = this.getHttpheaders();
      let ipAddress=this.utilsService.addPayment();
      this.url = `${ipAddress}oyeliving/api/v1/payment/add`;
      return this.http.post(this.url, JSON.stringify(newReceipt), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

}
