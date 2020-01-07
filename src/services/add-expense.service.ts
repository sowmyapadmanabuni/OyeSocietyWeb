import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlocksByAssoc } from '.././app/models/blocks-by-assoc';
import { PurchaseOrdersByAssoc } from '.././app/models/purchase-orders-by-assoc';
import { UnitsByBlockID } from '.././app/models/units-by-block-id';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {ExpenseData} from '.././app/models/expense-data';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AddExpenseService {

  ipAddress: string;
  url: string;
  availableNoOfBlocks: number;
  enableAddExpnseView:boolean;
  enableExpenseListView:boolean;

  constructor(private http: HttpClient,private utilsService:UtilsService) {
    this.ipAddress = 'http://apidev.oyespace.com/';
    this.enableAddExpnseView=false;
    this.enableExpenseListView=true;
  }

  /*----------------------Block List By association ID -----------------*/
  GetBlockListByAssocID(currentAssociationID) {
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.GetBlockListByAssocID();
    this.url = `${ipAddress}oyeliving/api/v1/Block/GetBlockListByAssocID/${currentAssociationID}`
   return this.http.get(this.url, { headers: headers })
      .pipe(map(data => {
        return data['data'].blocksByAssoc.map(item => {
          return new BlocksByAssoc(
            item.acAccntID,
            item.asAssnID,
            item.asMtDimBs,
            item.asMtFRate,
            item.asMtType,
            item.asUniMsmt,
            item.asbGnDate,
            item.asdPyDate,
            item.asiCrFreq,
            item.aslpChrg,
            item.aslpcType,
            item.aslpsDate,
            item.bankDetails,
            item.blBlkName,
            item.blBlkType,
            item.blBlockID,
            item.blIsActive,
            item.blMgrEmail,
            item.blMgrMobile,
            item.blMgrName,
            item.blNofUnit,
            item.bldCreated,
            item.bldUpdated
          )
        })
      }))
  }

  /*---------------prerequisitesAddUnit----------------*/
  prerequisitesAddUnit(blockID) {
    //$scope.blockID = $scope.allBlocksLists.blBlockID;
    //console.log('prerequisitesAddUnit',blockID);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.prerequisitesAddUnit();
    this.url = `${ipAddress}oyeliving/api/v1/Unit/GetUnitListByBlockID/${blockID}`;
    return this.http.get(this.url, { headers: headers });
  }

  /* Get All PurchaseOrder details For purchase Order UI lists */
  GetPurchaseOrderListByAssocID(currentAssociationID): Observable<PurchaseOrdersByAssoc[]> {
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.GetPurchaseOrderListByAssocID();
    this.url = `${ipAddress}oyeliving/api/v1/PurchaseOrder/GetPurchaseOrderListByAssocID/${currentAssociationID}`
    return this.http.get(this.url, { headers: headers })
      .pipe(map(data => {
        return data['data'].purchaseOrdersByAssoc.map(item => {
          return new PurchaseOrdersByAssoc(
            item.acAccntID,
            item.asAssnID,
            item.blBlockID,
            item.bpIden,
            item.poAprMEID,
            item.poAprStat,
            item.poDesc,
            item.poEstAmt,
            item.poHead,
            item.poIsActive,
            item.poPrfVen,
            item.poQnty,
            item.poUniMsmt,
            item.podCreated,
            item.podUpdated,
            item.poetDel,
            item.poid,
            item.vnid
          )
        })
      }))

  }

  /* Get All Budget projections List By BlockID */
  GetBudgetProjectionsByBlockID(blBlockID) {
    let headers = this.getHttpheaders();
    this.url = `${this.ipAddress}oyeliving/api/v1/Budget/GetBudgetProjectionsByBlockID/${blBlockID}`
    this.http.get(this.url, { headers: headers })
      .subscribe(data => {
        //console.log(data);
        //$scope.budgetProjectionsByBlock = response.data.data.budgetProjectionsByBlock;
      });
  }

  /* getAssociationList */
  getAssociationList(currentAssociationID) {
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.getAssociationList();
    this.url = `${ipAddress}oyeliving/api/v1/association/getAssociationList/${currentAssociationID}`
    this.http.get(this.url, { headers: headers })
      .subscribe(data => {
        //console.log(data);
        //$scope.banks = response.data.data.association.bankDetails;
      });
  }

  /* GetUnitListByBlockID */
  GetUnitListByBlockID(blockID): Observable<UnitsByBlockID[]> {

    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.GetUnitListByBlockID();
    this.url = `${ipAddress}oyeliving/api/v1/Unit/GetUnitListByBlockID/${blockID}`
    return this.http.get(this.url, { headers: headers })
      .pipe(map(data => {
        //console.log(data['data'].unitsByBlockID);
        return data['data'].unitsByBlockID.map(item => {
          return new UnitsByBlockID(
            item.acAccntID,
            item.asAssnID,
            item.blBlockID,
            item.owner,
            item.tenant,
            item.unCalType,
            item.unCurrBal,
            item.unDimens,
            item.unIsActive,
            item.unOcSDate,
            item.unOcStat,
            item.unOpenBal,
            item.unOwnStat,
            item.unRate,
            item.unSldDate,
            item.unUniIden,
            item.unUniName,
            item.unUniType,
            item.unUnitID,
            item.undCreated,
            item.undUpdated,
            item.unitParkingLot,
            item.unitbankaccount
          )
        })
      }))

  }
  onUpLoad(fd: FormData) {
    //let headers = this.getHttpheaders();
    this.url = `http://mediaupload.oyespace.com/oyeliving/api/v1/association/upload`
   return this.http.post(this.url, fd, {
      reportProgress: true,
      observe: 'events'
    })

  }

  createExpense(expensedata:ExpenseData){
    //console.log('expensedata',expensedata);
    let headers = this.getHttpheaders();
    let ipAddress = this.utilsService.createExpense();
    this.url = `${ipAddress}oyeliving/api/v1/Expense/Create`
   return this.http.post(this.url, JSON.stringify(expensedata), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
