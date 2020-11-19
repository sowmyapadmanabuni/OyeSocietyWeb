import { Injectable } from '@angular/core';
import {GlobalServiceService} from '../app/global-service.service';
import { from } from 'rxjs';
import {UtilsService} from '../app/utils/utils.service';
import {HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewUnitService {
  scopeIP:string;
  scriptIP:string;
  headers:HttpHeaders;
  blockIDforUnitCreation: any;
  blockidselectedone:any;
  /* public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'X-Champ-APIKey': this.scriptIP,
      'Access-Control-Allow-Origin': "*"
    })
  }; */
  addUnits:boolean;
  unitList:boolean;

  constructor(private globalServiceService: GlobalServiceService,
              private utilsService: UtilsService,private http:HttpClient) {
                this.scopeIP="https://apidev.oyespace.com/";
                this.scriptIP="1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1";
                this.headers= new HttpHeaders().append('Content-Type',  'application/json')
                                               .append('X-Champ-APIKey', this.scriptIP,)
                                               .append('Access-Control-Allow-Origin', "*");
               }
               getUnitDetails(currentAssociationID:string){
                let scopeIP=this.utilsService.getUnitDetails();
                  return this.http.get(scopeIP + 'oyeliving/api/v1/Unit/GetUnitListByAssocID/'+ currentAssociationID , {headers:this.headers});
              }
              
              getBlocks(currentAssociationID:string){
                let scopeIP=this.utilsService.getBlocks();
                   return this.http.get(scopeIP + 'oyeliving/api/v1/Block/GetBlockListByAssocID/'+ currentAssociationID, {headers:this.headers} );
              }
              
              createUnit(createUnitData:any){
                //console.log('createUnitData *',JSON.stringify(createUnitData));
                let scopeIP=this.utilsService.createUnit();
                   return this.http.post(scopeIP + 'oyeliving/api/v1/unit/create' ,  createUnitData, {headers:this.headers});
              }
              
              GetBlockListByAssocID(currentAssociationID:string){
                let scopeIP=this.utilsService.GetBlockListByAssocID();
                return this.http.get(scopeIP + 'oyeliving/api/v1/Block/GetBlockListByAssocID/'+ currentAssociationID , {headers:this.headers});
              }
              
              // GetUnitListByBlockID(blockId){
              //   //console.log('blockId',blockId);
              //   this.blockIDforUnitCreation = blockId;
              //   let scopeIP=this.utilsService.GetUnitListByBlockID();
              //   return this.http.get(scopeIP + 'oyeliving/api/v1/Unit/GetUnitListByBlockID/'+ blockId , {headers:this.headers});
              // }
              GetUnitListByBlockID(blockId){
                //console.log('blockId',blockId);
                this.blockIDforUnitCreation = blockId;
                let scopeIP=this.utilsService.GetUnitListByBlockID();
                return this.http.get(scopeIP + 'oyeliving/api/v1/Unit/GetUnitListByBlockID/'+ blockId +"/"+"resident", {headers:this.headers});
              }
              UpdateUnitInfo(updateUnitData:any){
                //console.log('updateUnitData *',JSON.stringify(updateUnitData));
                let scopeIP=this.utilsService.createUnit();
                return this.http.post(scopeIP + 'oyeliving/api/v1/Unit/UpdateUnitOwnerTenantDetails' ,  updateUnitData, {headers:this.headers});
              }
              AssociationCompletionStatusUpdate(AssociationId){
                //http://localhost:54400/oyeliving/api/v1/AssociationCompletionStatusUpdate/%7BAssociationID%7D
                let scopeIP=this.utilsService.getIPaddress();
                return this.http.get(scopeIP + 'oyeliving/api/v1/AssociationCompletionStatusUpdate/'+ AssociationId , {headers:this.headers});
              }
}
