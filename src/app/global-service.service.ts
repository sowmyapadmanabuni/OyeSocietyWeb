import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {

   currentAssociationId:string;
   currentUnitId:string;
   currentAssociationName:string;
   acAccntID:number;
   mobileNumber:number;
   toggledashboard:boolean;
   currentUnitName:any;
   enableLogin: boolean;
   enableHomeView: boolean; 
   mrmroleId:any;
   mrmroleId1:any;
   private subject1 = new Subject<any>();
   private subject2 = new Subject<any>();
   private subject3 = new Subject<any>();
   private CurrentAssociationIdForExpense = new Subject<any>();
   private CurrentAssociationIdForInvoice = new Subject<any>();
   private selectedAssociation = new Subject<any>();
   private CurrentAssociationIdForUnit = new Subject<any>();
   AssnDropDownHiddenByDefault:any;
   UnitDropDownHiddenByDefault:any;
   IsUnitCountOne;
   IsNoUnitExist:any;
   NotMoreThanOneUnit:any;
   MoreThanOneUnit:any;
   HideUnitDropDwn:any;

  constructor() {
    this.currentAssociationName = '';
    this.currentUnitName = '';
    this.enableLogin = true;
    this.enableHomeView = false;
    localStorage.setItem("AssnDropDownHiddenByDefault", 'false');
    localStorage.setItem("UnitDropDownHiddenByDefault", 'false');
  }


public getCurrentAssociationId(){

  //return this.currentAssociationId;
  return localStorage.getItem("currentAssociationId");

}
public getCurrentUnitId(){

  //return this.currentUnitId;
  return localStorage.getItem("currentUnitId");

}

public setCurrentAssociationId(associationId:string)
{
  this.currentAssociationId = associationId;
  localStorage.setItem("currentAssociationId", associationId);
}
public setAssnDropDownHiddenByDefault(AssnDropDownHiddenByDefault:any)
{
  this.AssnDropDownHiddenByDefault=AssnDropDownHiddenByDefault;
  localStorage.setItem("AssnDropDownHiddenByDefault", AssnDropDownHiddenByDefault);
}
public setUnitDropDownHiddenByDefault(UnitDropDownHiddenByDefault:any)
{
  this.UnitDropDownHiddenByDefault=UnitDropDownHiddenByDefault;
  localStorage.setItem("UnitDropDownHiddenByDefault", UnitDropDownHiddenByDefault);
}
public getUnitDropDownHiddenByDefault()
{
  return localStorage.getItem("UnitDropDownHiddenByDefault");
}
public getAssnDropDownHiddenByDefaultValue()
{
 return localStorage.getItem("AssnDropDownHiddenByDefault");
}
public setCurrentUnitId(unitId)
{
  this.currentUnitId = unitId;
  localStorage.setItem("currentUnitId", unitId);
}
public setCurrentUnitName(unitName)
{
  this.currentUnitName=unitName;
  localStorage.setItem("currentUnitName", unitName);
}
public getCurrentUnitName(){

  return localStorage.getItem("currentUnitName");

}
public setAccountID(acAccntID){
  this.acAccntID=acAccntID;
  console.log(this.acAccntID);
  localStorage.setItem("login-status", acAccntID);
}

public getacAccntID() :number{
  // return this.acAccntID;
  return Number(localStorage.getItem("login-status"));
}
public clear(){
  localStorage.clear();
}

public getCurrentAssociationName(){
    //return this.currentAssociationName;
    return localStorage.getItem("currentAssociationName");
}

public setCurrentAssociationName(associationName:string){
   this.currentAssociationName=associationName;
   localStorage.setItem("currentAssociationName", associationName);
}

public setMrmRoleID(MrmRoleID){
  this.mrmroleId=MrmRoleID;
  console.log(typeof this.mrmroleId);
  localStorage.setItem("MrmRoleID", MrmRoleID);
  }
  
  public getMrmRoleID() {
    localStorage.getItem("MrmRoleID");
  }

  sendMessage(message: any) {
    console.log("sendMessage", message)
    this.subject1.next({ msg: message });
  }
  setCurrentAssociationIdForExpense(message: any) {
    console.log("setCurrentAssociationIdForExpense", message)
    this.CurrentAssociationIdForExpense.next({ msg: message });
  }
  getCurrentAssociationIdForExpense(): Observable<any> {
    console.log("getCurrentAssociationIdForExpense");
    return this.CurrentAssociationIdForExpense.asObservable();
  }
  setCurrentAssociationIdForInvoice(message: any) {
    console.log("setCurrentAssociationIdForInvoice", message)
    this.CurrentAssociationIdForInvoice.next({ msg: message });
  }
  getCurrentAssociationIdForInvoice(): Observable<any> {
   return this.CurrentAssociationIdForInvoice.asObservable();
  }
  setCurrentAssociationIdForUnit(message: any){
    console.log("setCurrentAssociationIdForUnit", message)
    this.CurrentAssociationIdForUnit.next({ msg: message });
  }
  getCurrentAssociationIdForUnit(): Observable<any>{
   return this.CurrentAssociationIdForUnit.asObservable();
  }
  sendUnitListForAssociation(message: any){
    console.log(message);
    this.subject2.next({ msg: message });
  }

  clearMessages() {
    this.subject1.next();
  }

  getMessage(): Observable<any> {
    return this.subject1.asObservable();
  }
  setUnit(message: any){
    this.subject3.next({ msg: message });
  }
  getUnit(): Observable<any> {
    return this.subject3.asObservable();
  }
  getUnitListForAssociation(): Observable<any> {
    return this.subject2.asObservable();
  }
  setSelectedAssociation(message: any){
    console.log("selectedAssociation", message);
    this.selectedAssociation.next({ msg: message });
  }
  getSelectedAssociation(): Observable<any>{
    console.log("getSelectedAssociation");
    return this.selectedAssociation.asObservable();
  }
}
