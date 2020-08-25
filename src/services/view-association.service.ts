import { Injectable,Component, TemplateRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import {BsModalService,BsModalRef} from 'ngx-bootstrap/modal';
import {UtilsService} from '../app/utils/utils.service';
import {Sendrequest} from '../app/models/sendrequest';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ViewAssociationService {
  next(result: import("sweetalert2").SweetAlertResult) {
    throw new Error("Method not implemented.");
  } 
  
  modalRef:BsModalRef;
  scopeIP:string;
  scriptIP:string;
  url:string;
  headers:HttpHeaders;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'X-Champ-APIKey': this.scriptIP,
      'Access-Control-Allow-Origin': "*"
    })
  };
  associationId:any;
  asNofBlks:any;
  asNofUnit:any;
  enrlAsnEnbled:boolean;
  vewAsnEnbled:boolean;
  joinAsnEbld:boolean;
  join_enroll:any;
  EditAssociationData:any;
  headerss: HttpHeaders;
  public dashboardredirect = new Subject();

  onUpLoad(fd: FormData) {
    //let headers = this.getHttpheaders();
    this.url = `http://mediaupload.oyespace.com/oyeliving/api/v1/association/upload`
    return this.http.post(this.url, fd, {
       reportProgress: true,
       observe: 'events'
     })
  }

  constructor(private http:HttpClient, private modalService: BsModalService,
    private utilsService:UtilsService) {
    this.scopeIP="http://apidev.oyespace.com/";
    //this.scopeIP = "https://apidemo.oyespace.com/";
    this.scriptIP="1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1";
    this.headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-Champ-APIKey', this.scriptIP)
    .append('Access-Control-Allow-Origin', '*');
    //
    this.headerss = new HttpHeaders()
 .append('Content-Type', 'application/json')
 .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
 .append('Access-Control-Allow-Origin', '*');
   }



   createAssn(createAsssociationData)
  {
    let scopeIP=this.utilsService.createAssn();
    //console.log('createAsssociationData',createAsssociationData);
    return this.http.post(scopeIP + 'oyeliving/api/v1/association/create',JSON.stringify(createAsssociationData),  {headers:this.headers});
  }


  getAssociationDetails(accountID)
  {
    //console.log(accountID);
    let scopeIP=this.utilsService.getAssociationDetail();
    return this.http.get(scopeIP + 'oyeliving/api/v1/GetAssociationListByAccountID/' + accountID,  {headers:this.headers});
  }


  privacyPolicyModel(viewreceiptmodal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(viewreceiptmodal, Object.assign({}, { class: 'gray modal-lg' }));
}
getAssociationDetail(asAssnID){
  let scopeIP=this.utilsService.getAssociationDetail();
  return this.http.get(scopeIP + 'oyeliving/api/v1/association/getAssociationList/'+ asAssnID , {headers:this.headers});
}
getAssociationDetailsByAssociationid(asAssnID:string)
{
  //console.log(asAssnID);
  let scopeIP=this.utilsService.getAssociationDetailsByAssociationid();
  return this.http.get(scopeIP + 'oyeliving/api/v1/association/getAssociationList/' +asAssnID ,  {headers:this.headers});
}
UpdateAssociation(editassndata) {
  let scopeIP=this.utilsService.UpdateAssociation();
  //http://apidev.oyespace.com/oyeliving/api/v1/association/Update
  return this.http.post(scopeIP + 'oyeliving/api/v1/association/Update', JSON.stringify(editassndata), { headers: this.headers });
}

getAssociationAllDetails()
{
  //console.log();
  let scopeIP=this.utilsService.getAssociationAllDetails();
  return this.http.get(scopeIP + 'oyeliving/api/v1/association/getAssociationList' ,  {headers:this.headers});
}

getBlockDetailsByAssociationID(currentAssociationID)
{
  //this.currentAssociationID=4217;
  //console.log(currentAssociationID);
  let scopeIP=this.utilsService.getIPaddress();
  //http://localhost:54400/oyeliving/api/v1/Block/GetBlockListByAssocID/{AssociationID}
  return this.http.get(scopeIP+'oyeliving/api/v1/Block/GetBlockListByAssocID/' +currentAssociationID ,  {headers:this.headers});
}
GetUnitListByBlockID(blockId:string){
  //this.blockId=4206;
  //console.log('blockId',blockId);
  let scopeIP=this.utilsService.GetUnitListByBlockID();
  return this.http.get(scopeIP + 'oyeliving/api/v1/Unit/GetUnitListByBlockID/'+ blockId+'/resident' , {headers:this.headers});
}
// http://localhost:54400/oyeliving/api/v1/Unit/GetUnitListByUnitID/{UnitID}
GetUnitListByUnitID(unUnitID:string){
  //this.blockId=4206;
  let scopeIP=this.utilsService.getIPaddress();

  //console.log('unitId',unUnitID);
  return this.http.get(scopeIP+ 'oyeliving/api/v1/Unit/GetUnitListByUnitID/'+ unUnitID , {headers:this.headers});
}

GetAccountListByAccountID(acAccntID){
  acAccntID=21;
  //console.log('acAccntID',acAccntID);
  let scopeIP=this.utilsService.GetAccountListByAccountID();
 // http://localhost:54400/oyeliving/api/v1/GetAccountListByAccountID/{ACAccntID}
  return this.http.get(scopeIP + 'oyeliving/api/v1/GetAccountListByAccountID/'+acAccntID, {headers:this.headers});
}

sendRequestmethod(senddata:Sendrequest)
  {
    //console.log('senddata',senddata);
    let scopeIP=this.utilsService.getIPaddress();
    return this.http.post(scopeIP+ 'oyeliving/api/v1/SendMsging', senddata, {headers:this.headers});

  }
  joinAssociation(senddataForJoinOwner){
    let scopeIP=this.utilsService.joinAssociation();
    return this.http.post(scopeIP + 'oyeliving/api/v1/association/join', senddataForJoinOwner, {headers:this.headers});
  }
  getRequestorDetails(unitID) {
    let scopeIP = this.utilsService.joinAssociation();
    return this.http.post(scopeIP + 'oyeliving/api/v1/Member/GetRequestorDetails', unitID, { headers: this.headers });
  }
  SendTheAdminNotification(sendAdminNotification){
    let scopeIP=this.utilsService.joinAssociation();
    return this.http.post('https://us-central1-oyespace-dc544.cloudfunctions.net/sendAdminNotification', sendAdminNotification, {headers:this.headers});
  }
  createInAppNotification(inAppNotification){
    let scopeIP=this.utilsService.joinAssociation();
    return this.http.post(scopeIP + 'oyesafe/api/v1/Notification/Notificationcreate', inAppNotification, {headers:this.headerss});
  }

}
