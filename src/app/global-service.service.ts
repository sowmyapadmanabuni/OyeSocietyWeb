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
   
  constructor() { 
    this.currentAssociationName='';
    this.currentUnitName='';
    this.enableLogin= true;
    this.enableHomeView= false;
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
    this.subject1.next({ msg: message });
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
  getUnitListForAssociation(): Observable<any> {
    return this.subject2.asObservable();
  }
}
