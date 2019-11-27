import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  scopeIP:string;
  toggleviewassociationtable:boolean;

  constructor(private httpClient:HttpClient) { 
    this.toggleviewassociationtable=false;
    this.scopeIP = "http://apidev.oyespace.com/";
  }

  requestCall(reqAppDetails){
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-Home-APIKey', '33D88B4C-C322-4E51-9D65-5A2B828937A2')
    .append('Access-Control-Allow-Origin', "*");
    this.httpClient.post(this.scopeIP + 'oyehomes/api/RequestCall/Create ', JSON.stringify(reqAppDetails), { headers: headers })
    .subscribe(
      data=>{
        console.log(data);
      },
      err=>{
         console.log(err)
      }
      
    )
  }

  sendContactDetails(contactDetails){
    let headers1 = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
    .append('Access-Control-Allow-Origin', "*");
    this.httpClient.post(this.scopeIP + 'oyeliving/api/v1/ContactUsDetails/Create ', JSON.stringify(contactDetails), { headers: headers1 })
    .subscribe(
      data=>{
        console.log(data);
      },
      err=>{
         console.log(err)
      }
      
    )
  }


}
