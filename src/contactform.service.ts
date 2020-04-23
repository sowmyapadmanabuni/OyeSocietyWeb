import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactformService {
  ipAddress: string;

  constructor(private http: HttpClient) { 
    this.ipAddress = 'http://apidev.oyespace.com/oyeliving/api/v1/ContactUs/Create';

  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

submitContactForm(contactform){
  console.log(contactform);
  let headers = this.getHttpheaders();
   return this.http.post('http://apidev.oyespace.com/oyeliving/api/v1/ContactUs/Create',(contactform), { headers: headers });
}

}
