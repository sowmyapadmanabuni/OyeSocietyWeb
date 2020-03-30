import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { UtilsService } from '../app/utils/utils.service'
import { GlobalServiceService } from '../app/global-service.service';
// import {DashBoardService} from '../dash-board/dash-board.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddVisitorService {

  constructor(private http: HttpClient, private utilsService: UtilsService, private globalService: GlobalServiceService) { }

  addVisitor(visitorData): Observable<any> {
    
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.getIPaddress();
    let url = `${ipAddress}oye247/api/v1/Invitation/create`
    
    //console.log(visitorData);
    return this.http.post(url, JSON.stringify(visitorData), { headers: headers })
  }


  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
