import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViewBlockService {
   
  url:string;

  scopeIP:string;
  scriptIP:string;
  headers:HttpHeaders;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'X-Champ-APIKey': this.scriptIP,
      'Access-Control-Allow-Origin': "*"
    })
  };

  constructor(private http:HttpClient,private utilsService:UtilsService) { 
      
      this.scriptIP="1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1";
      this.headers= new HttpHeaders().append('Content-Type',  'application/json')
                                     .append('X-Champ-APIKey', this.scriptIP,)
                                     .append('Access-Control-Allow-Origin', "*");
  }//constructor ends

  getBlockDetails(currentAssociationID){
    let scopeIP=this.utilsService.getBlockDetails();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Block/GetBlockListByAssocID/' +currentAssociationID ,  {headers:this.headers});
  }

  getassociationlist(currentAssociationID){
    let scopeIP=this.utilsService.getassociationlist();
    return this.http.get(scopeIP + '/oyeliving/api/v1/association/getassociationlist/' +currentAssociationID ,  {headers:this.headers});
  }

  createBlock(createBlockData:any)
  {
    let scopeIP=this.utilsService.createBlock();
    return this.http.post(scopeIP + 'oyeliving/api/v1/Block/create', createBlockData,  {headers:this.headers});
  }

  UpdateBlock(editblockdata:any)
 {
   let headers = this.getHttpheaders();
   let scopeIP=this.utilsService.UpdateBlock();
   this.url = scopeIP + 'oyeliving/api/v1/Block/BlockDetailsUpdate';
   return this.http.post(this.url, JSON.stringify(editblockdata), { headers: headers });
 }
 getHttpheaders(): HttpHeaders {
   const headers = new HttpHeaders()
     .set('Authorization', 'my-auth-token')
     .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
     .set('Content-Type', 'application/json');
   return headers;
 }
}

