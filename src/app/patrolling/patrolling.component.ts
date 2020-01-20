import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {UtilsService} from '../utils/utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GlobalServiceService} from '../global-service.service';
import { formatDate } from '@angular/common';

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
  patrolingStartdate:any;
  patrolingEnddate:any;

  constructor(private utilsService:UtilsService,private http: HttpClient,
    public globalService:GlobalServiceService) {
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
      "FromDate" : formatDate(this.patrolingStartdate, 'yyyy/MM/dd', 'en'),
      "ToDate"   : formatDate(this.patrolingEnddate, 'yyyy/MM/dd', 'en'),
      "ASAssnID" : this.globalService.getCurrentAssociationId(),
      "PSPtrlSID": 1
  }
  console.log(patrolingRequest);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    this.url = `${ipAddress}oye247/api/v1/GetPatrollingReportByDates`
    this.http.post(this.url, JSON.stringify(patrolingRequest), { headers: headers })
    .subscribe(data=>{
      console.log(data);
    },
    err=>{
      console.log(err);
    })
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }

}
