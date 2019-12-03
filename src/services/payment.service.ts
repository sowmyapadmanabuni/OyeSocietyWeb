import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {UtilsService} from '../app/utils/utils.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient,private utilsService:UtilsService) { }
  postToICICIPaymentGateway(txnAmount) {
    console.log(txnAmount);
    let headers = new HttpHeaders().set('Authorization', 'my-auth-token')
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    //return this.http.get(`https://e684d2dc.ngrok.io/api/payment/icici?chargetotal=1.00`);
    return this.http.get(`https://b77f9f6a.ngrok.io/api/payment/icici`,{params:txnAmount});
  }
  CreatePayment(invoiceID,InvoiceValue) {
    console.log(invoiceID);
    let paymentOptions={
      "INID"          : invoiceID,
      "ChargeTotal" : InvoiceValue
  }
  let headers=this.getHttpheaders();
  let ipAddress=this.utilsService.getIPaddress();
   /* let paymentOptions = {
      "chargeTotal": "100",
      "paymentMethod": "Online",
      "storeID": 1496,
      "registrationID": 1419
    }
    return this.http.post(`http://devwalletapi.azurewebsites.net/wallet/api/v1/CreatePayment`,JSON.stringify(paymentOptions)); */
    return this.http.post(ipAddress+`oyeliving/api/v1/PaymentGateWay/Create`,JSON.stringify(paymentOptions),{headers:headers}); 
  }
  PaymentGateWayUpdateByOrderID(orderID,transactionID){
    console.log(orderID,transactionID);
    let paymentgatewayupdatebyorderId={
      "OrderID"       : orderID,
      "TransactionID" : transactionID
  }
  let headers=this.getHttpheaders();
  let ipAddress=this.utilsService.getIPaddress();
  return this.http.post(ipAddress+`oyeliving/api/v1/PaymentGateWayUpdateByOrderID`,JSON.stringify(paymentgatewayupdatebyorderId),{headers:headers}); 
  }
  processGateway(iciciPayForm){
    return this.http.post('https://test.ipg-online.com/connect/gateway/processing', JSON.stringify(iciciPayForm));
  }
  postToKotakPaymenGateway(txnAmount){
    console.log(txnAmount);
    return this.http.get(`https://68ebd2f4.ngrok.io/api/payment/ccavenue/kotak`,{params:txnAmount});
  }
  postToAxisPaymentGateway(InvoiceValue){
    console.log(InvoiceValue);
    return this.http.get(`https://68ebd2f4.ngrok.io/api/payment/juspay`,{params:InvoiceValue});
  }
  postToHDFCPaymentGateway(InvoiceValue){
    console.log(InvoiceValue);
    return this.http.get(`https://68ebd2f4.ngrok.io/api/payment/ccavenue/hdfc`,{params:InvoiceValue});
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
