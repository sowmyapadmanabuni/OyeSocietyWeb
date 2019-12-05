import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AddBlockService {
  ipAddress: string;
  currentAssociationID: number;
  url: string;

  constructor(private http: HttpClient,private utilsService:UtilsService) {
    this.ipAddress = 'http://apidev.oyespace.com/';
    this.currentAssociationID = 4217;
   }

  createBlock(CreateBockData){
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.createBlock();
    this.url = `${ipAddress}oyeliving/api/v1/Block/create`
   return this.http.post(this.url, JSON.stringify(CreateBockData), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
