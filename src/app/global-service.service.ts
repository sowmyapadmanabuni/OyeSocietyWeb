import { Injectable } from '@angular/core';

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
  localStorage.setItem("MrmRoleID", MrmRoleID);
}
public getMrmRoleID(){
  localStorage.getItem("MrmRoleID");
}
}
