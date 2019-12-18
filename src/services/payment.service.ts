import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { UtilsService } from '../app/utils/utils.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  postToICICIPG(paymentDetails) {
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    return this.http.post(ipAddress + `oyeliving/api/v1/PaymentICICI/Create`, paymentDetails, { headers: headers });
  }


  postToKotakPaymenGateway(paymentDetails) {
    return this.http.get(`https://68ebd2f4.ngrok.io/api/payment/ccavenue/kotak`, { params: paymentDetails });
  }
  postToAxisPaymentGateway(paymentDetails) {
    return this.http.get(`https://68ebd2f4.ngrok.io/api/payment/juspay`, { params: paymentDetails });
  }
  postToHDFCPaymentGateway(paymentDetails) {
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    return this.http.post(ipAddress + `oyeliving/api/v1/PaymentHDFCCreate`, paymentDetails, { headers: headers });

  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
