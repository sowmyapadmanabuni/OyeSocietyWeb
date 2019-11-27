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
   
   
  constructor() { 
    this.currentAssociationName='';
    this.currentUnitId='';
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


}
