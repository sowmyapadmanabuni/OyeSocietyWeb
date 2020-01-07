import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BlocksByAssoc } from '.././app/models/blocks-by-assoc';
import { AssociationDetails } from '.././app/models/association-details';
import {UtilsService} from '../app/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViewInvoiceService {

  ipAddress: string;
  url: string;
  invoiceBlock:any;
  invoiceBlockId:any;
  expid:any;

  constructor(private http: HttpClient,private utilsService:UtilsService) {
    // this.ipAddress = 'http://apidev.oyespace.com';
    this.invoiceBlock='';

  }

  /*----------------------Block List By association ID -----------------*/
  GetBlockListByAssocID(currentAssociationID) {
    //console.log('currentAssociationID',currentAssociationID);
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.GetBlockListByAssocID();
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

  getCurrentBlockDetails(blockId,currentAssociationID) {
    //console.log('getCurrentBlockDetails', blockId);
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.getCurrentBlockDetails();
    this.url = `${ipAddress}oyeliving/api/v1/invoice/view/${currentAssociationID}/${blockId}`;
    return this.http.get(this.url, { headers: headers });
  }

  viewInvoice(blockid,currentAssociationID) {
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.viewInvoice();
    this.url = `${ipAddress}oyeliving/api/v1/invoice/view/${currentAssociationID}/${blockid}`;
    

    return this.http.get(this.url, { headers: headers });
  }
  invoicelistByUnitID(UnitID){
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.getIPaddress();
    this.url = `${ipAddress}oyeliving/api/v1/Invoice/invoicelistByUnitID/${UnitID}`;
    return this.http.get(this.url, { headers: headers });
  }
  generateInvoiceReceipt(genReceipt){
    //console.log('InvoiceReceipt'+JSON.stringify(genReceipt));
    //http://apidev.oyespace.com/oyeliving/api/v1/payment/add
      let headers = this.getHttpheaders();
      let ipAddress=this.utilsService.getIPaddress();
      this.url = `${ipAddress}oyeliving/api/v1/payment/add`;
      return this.http.post(this.url, JSON.stringify(genReceipt), { headers: headers });
  }
  invoiceDetails(InvoiceId,UnitID){
    //console.log('InvoiceId-',InvoiceId);
    //console.log('UnitID-',UnitID);
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.invoiceDetails();
    this.url = `${ipAddress}oyeliving/api/v1/invoice/details/${InvoiceId}/${UnitID}`;
   return this.http.get(this.url, { headers: headers });

//http://apidev.oyespace.com/oyeliving/api/v1/invoice/details/{InvoiceId}/{UnitID}
  }
  InvoiceListByInvoiceID(inid){
    let headers = this.getHttpheaders();
    this.url = `${this.ipAddress}oyeliving/api/v1/Invoice/InvoiceListByInvoiceID/${inid}`;
    return this.http.get(this.url, { headers: headers });
  }

  GetUnitListByUnitID(unitID) {
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.GetUnitListByUnitID();
    this.url = `${ipAddress}oyeliving/api/v1/Unit/GetUnitListByUnitID/${unitID}`;
    return this.http.get(this.url, { headers: headers });
  }

  GetAmountBalance(unUnitID) {
    //console.log('GetAmountBalance', unUnitID);
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.GetAmountBalance();
    this.url = `${ipAddress}oyeliving/api/v1/Payment/GetAmountBalance/${unUnitID}`;
    return this.http.get(this.url, { headers: headers });
  }

  springAppConfigPostAmount(iciciData) {
    let headers = this.getHttpheaders();
    this.url = `https://dev.oyespace.com:8443/springAppConfig/postAmount`;
    return this.http.post(this.url, JSON.stringify(iciciData), { headers: headers });
  }

  getassociationlist(asdPyDate, blMgrMobile,currentAssociationID) {
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.getassociationlist();
    this.url = `${ipAddress}oyeliving/api/v1/association/getassociationlist/${currentAssociationID}`;
    return this.http.get(this.url, { headers: headers })
      .pipe(map(data => {
        return new AssociationDetails(
          data['data']['association'].asAsnLogo,
          data['data']['association'].asAsnName,
          data['data']['association'].asAddress,
          data['data']['association'].asCountry,
          data['data']['association'].asPinCode,
          blMgrMobile,
          data['data']['association'].asWebURL,
          data['data']['association'].asAsnEmail,
          asdPyDate)
      }))
  }

  UpdateInvoiceDiscountValueAndInsert(discountData) {
    //console.log(discountData);
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.UpdateInvoiceDiscountValueAndInsert();
    this.url = `${ipAddress}oyeliving/api/v1/UpdateInvoiceDiscountValueAndInsert`;
    return this.http.post(this.url, JSON.stringify(discountData), { headers: headers });
  }

  GetInvoiceOwnerListByInvoiceId(inid) {
    let invoiceID = {
      "INID": inid
    };
    //console.log('json.stringify', JSON.stringify(invoiceID));
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.GetInvoiceOwnerListByInvoiceId();
    this.url = `${ipAddress}oyeliving/api/v1/GetInvoiceOwnerListByInvoiceId`
    return this.http.post(this.url, JSON.stringify(invoiceID), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

}
