import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  
  scopeIP:string;
  scriptIP:string;
  headers:HttpHeaders;
  mrmRoleID:number;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'X-Champ-APIKey': this.scriptIP,
      'Access-Control-Allow-Origin': "*"
    })
  };
  acfName: any;
  aclName: any;
  acMobile: any;

  memberdoesnotexist:boolean;
  toggleViewAssociationTable:boolean;
  enrollassociationforresident:boolean;
  joinassociationforresident:boolean;
  
  constructor(private http:HttpClient,private utilsService:UtilsService) {
    
    this.scopeIP="https://apidev.oyespace.com/";
    this.scriptIP="1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1";
    this.headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-Champ-APIKey', this.scriptIP)
                                   .append('Access-Control-Allow-Origin', "*");

                  this.memberdoesnotexist=false; 
    this.toggleViewAssociationTable=false; 
    this.enrollassociationforresident=false;              
   }//Constructor Ends

   getAssociation(accountID){
     let scopeIP=this.utilsService.getAssociation();
    // return this.http.get(this.scopeIP + 'oyeliving/api/v1/GetAssociationListByAccountID/' +accountID ,  {headers:this.headers});
    // http://apidev.oyespace.com/oyeliving/api/v1/GetMemberDetailsByAccountID/14958
    // return this.http.get(scopeIP + 'oyeliving/api/v1/Member/GetMemberListByAccountID/' +accountID ,  {headers:this.headers});
    return this.http.get(scopeIP + 'oyeliving/api/v1/GetMemberDetailsByAccountID/' +accountID ,  {headers:this.headers});
  }
  getAmount(associationID:string){
    console.log(associationID);
    let headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-Champ-APIKey','1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
                                   .append('Access-Control-Allow-Origin', "*");
    let scopeIP=this.utilsService.getAmount();
     return this.http.get(scopeIP + 'oyeliving/api/v1/GetPaymentsListByAssocID/' + associationID, {headers:headers} );
  }
  GetAmountBalance(unUnitID) {
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .append('Access-Control-Allow-Origin', "*");
    let scopeIP = this.utilsService.getIPaddress();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Payment/GetAmountBalance/' + 10852, { headers: headers });
  }

  getMembers(accountID){
    let scopeIP=this.utilsService.getMembers();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Member/GetMemberListByAccountID/'+accountID,  {headers:this.headers});
    //http://api.oyespace.com/oyeliving/api/v1/Unit/GetUnitListByAssocID/8794
  }
  GetUnitListCount(associationID){
    let scopeIP=this.utilsService.getIPaddress();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Unit/GetUnitListByAssocID/'+associationID,  {headers:this.headers});

  }
  getTickets(associationId:string){
    let headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-OYE247-APIKey','7470AD35-D51C-42AC-BC21-F45685805BBE')
                                   .append('Access-Control-Allow-Origin', "*");
    let scopeIP=this.utilsService.getTickets();
    // http://apidev.oyespace.com/oye247/api/v1/GetTicketingListByAssocID/{AssociationID}
    return this.http.get(scopeIP+'oye247/api/v1/GetTicketingListByAssocID/' + associationId, {headers:headers});
  //No such API
  }

  getVehicle(unUnitID){
    //http://apidev.oyespace.com/oyeliving/api/v1/Vehicle/GetVehicleListByAssocID/{AssociationID}
    let headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-Champ-APIKey','1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
                                   .append('Access-Control-Allow-Origin', "*");
    let scopeIP =this.utilsService.getVehicle();
     //return this.http.get(scopeIP + 'oyeliving/api/v1/Vehicle/GetVehicleListByAssocID/' + associationID, {headers:headers} );
     return this.http.get(scopeIP + 'oyeliving/api/v1/Vehicle/GetVehicleListByUnitID/' + unUnitID, {headers:headers} );
  }
getStaff(associationID:string){
  let headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-OYE247-APIKey','7470AD35-D51C-42AC-BC21-F45685805BBE')
                                   .append('Access-Control-Allow-Origin', "*");
    let scopeIP=this.utilsService.getStaff();
    return this.http.get(scopeIP + 'oye247/api/v1/GetWorkerListByAssocID/' +associationID, {headers:headers});                               
}
  GetVehicleListByAssocID(associationID) {
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-Champ-APIKey','1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .append('Access-Control-Allow-Origin', "*");
    let scopeIP = this.utilsService.getIPaddress();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Vehicle/GetVehicleListByAssocID/' + associationID, { headers: headers });
  }
getVisitors(associationID:string){
  let headers= new HttpHeaders().append('Content-Type',  'application/json')
                                   .append('X-OYE247-APIKey','7470AD35-D51C-42AC-BC21-F45685805BBE')
                                   .append('Access-Control-Allow-Origin', "*");
  let scopeIP=this.utilsService.getVisitors();
   return this.http.get(scopeIP + 'oyesafe/api/v1/VisitorLog/GetVisitorLogListByAssocID/'+associationID,{headers:headers});
}
getAccountFirstName(accountID){
  let scopeIP=this.utilsService.getAccountFirstName();
  return this.http.get(scopeIP + 'oyeliving/api/v1/GetAccountListByAccountID/'+accountID,  {headers:this.headers});
}
GetVisitorLogByDatesAssocAndUnitID(visitorlog){
  let headers= new HttpHeaders().append('Content-Type',  'application/json')
  .append('X-OYE247-APIKey','7470AD35-D51C-42AC-BC21-F45685805BBE')
  .append('Access-Control-Allow-Origin', "*");
let scopeIP=this.utilsService.getIPaddress();
return this.http.post(scopeIP + 'oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID',JSON.stringify(visitorlog),{headers:headers});
}
GetWorkersListByUnitID(unUnitID){
  //console.log(unUnitID);
  let headers= new HttpHeaders().append('Content-Type',  'application/json')
  .append('X-OYE247-APIKey','7470AD35-D51C-42AC-BC21-F45685805BBE')
  .append('Access-Control-Allow-Origin', "*");
let scopeIP=this.utilsService.getIPaddress();
return this.http.get(scopeIP + 'oye247/api/v1/GetWorkersListByUnitID/'+unUnitID,{headers:headers});
}
  GetFamilyMemberVehicleCountByAssocAcntUnitID(acAccntID, AssociationId, unUnitID) {
    console.log(acAccntID, AssociationId, unUnitID);
    let scopeIP = this.utilsService.getIPaddress();
    let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');
    //http://localhost:64284/oyesafe/api/v1/GetFamilyMemberVehicleCountByAssocAcntUnitID/{AssociationID}/{AccountID}/{UnitID}
    return this.http.get(scopeIP + `oyesafe/api/v1/GetFamilyMemberVehicleCountByAssocAcntUnitID/${Number(AssociationId)}/${acAccntID}/${unUnitID}`, { headers: headers });
  }
}//DashboardService Ends
