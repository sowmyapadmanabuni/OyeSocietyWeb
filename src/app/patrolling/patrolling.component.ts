import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {UtilsService} from '../utils/utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-patrolling',
  templateUrl: './patrolling.component.html',
  styleUrls: ['./patrolling.component.css']
})
export class PatrollingComponent implements OnInit {
  reportlists:any[];
  modalRef: BsModalRef;
  WorkerNameList:any[];
  searchTxt:any;
  addGuest:any;
  url:any;
  bsConfig: object;

  constructor(private utilsService:UtilsService,private http: HttpClient) {
    this.url='';
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
    });
   }

  ngOnInit() {
  }
  getPatrolingReportByDate(){
    let patrolingRequest={
      "FromDate" : "2019-08-22",
      "ToDate"   : "2019-012-16",
      "ASAssnID" : 14954,
      "PSPtrlSID": 1
  }
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    this.url = `${ipAddress}oye247/api/v1/GetPatrollingReportByDates`
    this.http.post(this.url, JSON.stringify(''), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }

}
