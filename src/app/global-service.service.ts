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
   BlockHrefDetail:any[];
   unitArrayList:any[];
   private subject1 = new Subject<any>();
   private subject2 = new Subject<any>();
   private subject3 = new Subject<any>();
   private CurrentAssociationIdForExpense = new Subject<any>();
   private CurrentAssociationIdForMember = new Subject<any>();
   private CurrentAssociationIdForStaffList = new Subject<any>();
   private CurrentAssociationIdForInvoice = new Subject<any>();
   private selectedAssociation = new Subject<any>();
   private CurrentAssociationIdForUnit = new Subject<any>();
   private CurrentAssociationIdForReceipts = new Subject<any>();
   private CurrentAssociationIdForBlocks = new Subject<any>();
   private CurrentAssociationIdForCustomerStatement = new Subject<any>();
   private AssociationListForReload = new Subject<any>();
   private setAssociationUnitList = new Subject<any>();
   private setAssociationList = new Subject<any>();
   private currentAssociationIdForLeftBarComponent = new Subject<any>();
   private setCreateUnitWithAssociation = new Subject<any>();
   private setCurrentUnitIDSubject = new Subject<any>();
   private CallgetVisitorListSubject = new Subject<any>();
   private CallGetFamilyMemberSubject = new Subject<any>();
   private SetResidentLevelInvoiceSubject = new Subject<any>();
   private CurrentAssociationIdForVisitorLogByDates = new Subject<any>();
   
   AssnDropDownHiddenByDefault:any;
   UnitDropDownHiddenByDefault:any;
   IsUnitCountOne;
   IsNoUnitExist:any;
   NotMoreThanOneUnit:any;
   MoreThanOneUnit:any;
   HideUnitDropDwn:any;
   assnList:any;
   blockArrayLength:any;
   progressbarValue:any;
   toggleregister:any;
   saveMobileNumberforRegister:any;
   IsEnrollAssociationStarted:any;
   BackClicked:any;
   IsUnitCreated:boolean;
   StaffListCalledOnce:boolean;
   unitslistForAssociation:any[];

  constructor() {
    this.IsUnitCreated=false;
    this.IsEnrollAssociationStarted=false;
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
setBackClicked(param){
this.BackClicked=param;
}
getBackClicked(){
  return this.BackClicked;
}
  public SetAssociationUnitList(message) {
    console.log("SetAssociationUnitList", message)
    this.setAssociationUnitList.next({ msg: message });
  }
  public GetAssociationUnitList(): Observable<any> {
    return this.setAssociationUnitList.asObservable();
  }
public SetAssociationList(message){
  console.log("setAssociationList", message)
  this.assnList=message;
  localStorage.setItem("assnList",JSON.stringify(this.assnList));
  //console.log(JSON.parse(localStorage.getItem("assnList")));
  this.setAssociationList.next({ msg: message });
}
public GetAssociationList(): Observable<any>{
 return this.setAssociationList.asObservable();
  }
  public SetAssociationListForReload() {
    console.log("SetAssociationListForReload");
    this.AssociationListForReload.next({ msg: '' });
  }
public GetAssociationListForReload(): Observable<any>{
  return this.AssociationListForReload.asObservable();
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
public setCurrentAssociationIdForReceipts(message: any){
  console.log("CurrentAssociationIdForReceipts", message)
  this.CurrentAssociationIdForReceipts.next({ msg: message });
}
public getCurrentAssociationIdForReceipts(): Observable<any>{
 return this.CurrentAssociationIdForReceipts.asObservable();
}
public setCurrentAssociationIdForBlocks(message: any){
  console.log("CurrentAssociationIdForBlocks", message)
this.CurrentAssociationIdForBlocks.next({ msg: message });
}
public getCurrentAssociationIdForBlocks(): Observable<any>{
return this.CurrentAssociationIdForBlocks.asObservable();
}
public setCurrentAssociationIdForCustomerStatement(message: any){
  console.log("CurrentAssociationIdForCustomerStatement", message)
this.CurrentAssociationIdForCustomerStatement.next({ msg: message });
}
public getCurrentAssociationIdForCustomerStatement(): Observable<any>{
return this.CurrentAssociationIdForCustomerStatement.asObservable();
}
public getAssnDropDownHiddenByDefaultValue()
{
 return localStorage.getItem("AssnDropDownHiddenByDefault");
}
public setCurrentUnitId(unitId)
{
  this.setCurrentUnitIDSubject.next({UnitID:unitId});
  this.currentUnitId = unitId;
  localStorage.setItem("currentUnitId", unitId);
}
public getCurrentUnitIdSubject(): Observable<any>
{
  return this.setCurrentUnitIDSubject.asObservable();
}
public setCurrentUnitName(unitName)
{
  this.currentUnitName=unitName;
  localStorage.setItem("currentUnitName", unitName);
}
public CallgetVisitorList(param)
{
  this.CallgetVisitorListSubject.next('Id');
}
public SetgetVisitorList(): Observable<any>
{
  return this.CallgetVisitorListSubject.asObservable();
}
public InvokeGetFamilyMember(param){
  this.CallGetFamilyMemberSubject.next('Id');
}
public SetgetFamilyMember(): Observable<any>{
  return this.CallGetFamilyMemberSubject.asObservable();
}
public setResidentLevelInvoice(param){
  this.SetResidentLevelInvoiceSubject.next('Id');
}
public getResidentLevelInvoice(): Observable<any>{
 return this.SetResidentLevelInvoiceSubject.asObservable();
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
public toggleRegister(booleanParam){
  localStorage.setItem("toggle-register",booleanParam);
}
public getToggleRegister(){
 return localStorage.getItem("toggle-register");
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
public setCurrentAssociationIdForLeftBarComponent(message){
  console.log("currentAssociationIdForLeftBarComponent", message);
this.currentAssociationIdForLeftBarComponent.next({msg:message});
}
public getCurrentAssociationIdForLeftBarComponent(){
return this.currentAssociationIdForLeftBarComponent.asObservable();
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
  setCurrentAssociationIdForMemberComponent(message: any){
    console.log("setCurrentAssociationIdForMemberComponent", message)
    this.CurrentAssociationIdForMember.next({ msg: message });
  }
  getCurrentAssociationIdForMemberComponent(): Observable<any>{
    console.log("setCurrentAssociationIdForMemberComponent")
   return this.CurrentAssociationIdForMember.asObservable();
  }
  setCurrentAssociationIdForStaffList(message:any){
   //localStorage.setItem('StaffListCalledOnce','false');
    console.log("setCurrentAssociationIdForStaffList", message)
    this.CurrentAssociationIdForStaffList.next({ msg: message });
  }
  getCurrentAssociationIdForStaffList(): Observable<any>{
    console.log("setCurrentAssociationIdForStaffList")
   return this.CurrentAssociationIdForStaffList.asObservable();
  }
  setCurrentAssociationIdForVisitorLogByDates(message:any){
    console.log("CurrentAssociationIdForVisitorLogByDates", message)
    this.CurrentAssociationIdForVisitorLogByDates.next({ msg: message });
  }
  getCurrentAssociationIdForVisitorLogByDates(): Observable<any>{
    console.log("CurrentAssociationIdForVisitorLogByDates")
   return this.CurrentAssociationIdForVisitorLogByDates.asObservable();
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
  SetCreateUnitWithAssociation(message1, message2) {
    this.BlockHrefDetail = message1;
    this.unitArrayList = message2;
  }
  GetCreateUnitWithAssociation(): Observable<any>{
    return this.setCreateUnitWithAssociation.asObservable();
  }
}
