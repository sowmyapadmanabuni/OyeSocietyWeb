import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { UnitListForRoleChange } from '../unit-list-for-role-change';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {UtilsService} from '../utils/utils.service';
import {GlobalServiceService} from '../global-service.service';
import swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.css']
})

export class FamilyMembersComponent implements OnInit {
  modalRef: BsModalRef;
  memberList: boolean;
  addMember: boolean;
  familymemberarray: any[];
  unitID: any;
  AccountID:any;
  asAssnID:any;
  FirstName: any;
  MobileNumber: any;
  Relation: any;
  EditFirstName:any
  EditMobileNumber:any;
  EditRelation:any;
  fmid:any;
  loadchangedforassociation: boolean;
  ToggleGurdian: any;
  searchTxt:any;
  joinassociation:any;

  constructor(private http: HttpClient, private router: Router,
    private modalService: BsModalService,private utilsService:UtilsService,
    private globalService:GlobalServiceService) {
    this.unitID='';
    this.AccountID='';
    this.asAssnID='';
    this.loadchangedforassociation = false;
    this.ToggleGurdian = 'xyz';
   }

  ngOnInit() {
    this.memberList=true;
    this.addMember=false;
    this.getFamilyMember();
  }
  // ngAfterViewInit() {
  // $(document).ready(function () {
  //   $('#example').DataTable();
  // });
  // }

  addMemberShow(){
    this.memberList=false;
    this.addMember=true;
  }

  getFamilyMember(){
    this.familymemberarray = [];
    this.asAssnID = this.globalService.getCurrentAssociationId();
    this.AccountID = this.globalService.getacAccntID();
    this.unitID = this.globalService.getCurrentUnitId();
    //console.log('unitID', this.unitID);
    //console.log('AccountID', this.AccountID);
    //console.log('asAssnID', this.asAssnID);
    let scopeIP=this.utilsService.loadUnitForAssociation();
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
        .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
        .append('Access-Control-Allow-Origin', "*");
    this.http.get(scopeIP + `oyesafe/api/v1/GetFamilyMemberListByAssocAndUnitID/${this.unitID}/${this.asAssnID}/${this.AccountID}`, { headers: headers })
        .subscribe(data => {
          //console.log(data);
          this.familymemberarray = data['data']['familyMembers'];
          if (this.familymemberarray.length > 0) {
            this.loadchangedforassociation = true;
          }
          else {
            //console.log(this.familymemberarray);
            this.loadchangedforassociation = false;
          }

        },
          err => {
            //console.log(err);
          })
  }

// EDIT FAMILY MEMBER MODEL POPUP
OpenEditFamilyMemberModal(EditFamilyMemberModal: TemplateRef<any>,fmName,fmRltn,fmMobile,asAssnID,unUnitID,fmid){
  //console.log(fmName,fmRltn,fmMobile,asAssnID,unUnitID,fmid);
  this.EditFirstName=fmName;
  this.EditMobileNumber=fmMobile;
  this.EditRelation=fmRltn;
  this.fmid=fmid;
  this.asAssnID=asAssnID;
  this.unitID=unUnitID;
  this.modalRef = this.modalService.show(EditFamilyMemberModal, Object.assign({}, { class: 'gray modal-md' }));
}
// EDIT FAMILY MEMBER MODEL POPUP END

// UPDATE FAMILY MEMBER API CALL
updatefamilymember() {
  let updateFmailyMember = {
    "FMName": this.EditFirstName,
    "FMMobile": this.EditMobileNumber,
    "MEMemID": "1",
    "UNUnitID": this.unitID,
    "ASAssnID": this.asAssnID,
    "FMISDCode": "+91",
    "FMImgName": "1.jpg",
    "FMRltn": this.EditRelation,
    "FMLName": "M",
    "FMMinor": this.ToggleGurdian == "xyz"? false : true,
    "FMGurName": "som",
    "FMID": this.fmid
  }

  let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');

  let scopeIP = this.utilsService.updatefamilymember();
  //console.log(updateFmailyMember);
  this.http.post(scopeIP + `oyesafe/api/v1/FamilyMemberDetails/update`, JSON.stringify(updateFmailyMember), { headers: headers })
  .subscribe(data=>{
    console.log(data);
    if(data['data'] != null){
            Swal.fire({
      title: "Error",
      text: `${data['error']['message']}`,
      type: "error",
      confirmButtonColor: "#f69321"
    })
    }
    else{
      this.modalRef.hide();
      Swal.fire({
        title: "Family Member Updated Successfully",
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {
            this.getFamilyMember();
          }
        }
      )
    }

  },
  err=>{
    //console.log(err);
  })

}
// UPDATE FAMILY MEMBER API CALL END

_keyPress(event: any) {
  const pattern = /[0-9]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
      event.preventDefault();
  }
}
// ADD FAMILY MEMBER START
addfamilymember() {
  let familymember = {
    "FMName": this.FirstName,
    "FMMobile": this.MobileNumber,
    "FMISDCode": "+91",
    "UNUnitID": this.unitID,
    "FMRltn": this.Relation,
    "ASAssnID": this.asAssnID,
    "FMImgName": "l.jpeg",
    "FMMinor": this.ToggleGurdian == "xyz"? false : true,
    "FMLName": "P",
    "FMGurName": "somu",
    "PAccntID": this.AccountID
  }
  //console.log(familymember);
  let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
    .append('Access-Control-Allow-Origin', "*");
  let scopeIP = this.utilsService.addfamilymember();
  this.http.post(scopeIP + `oyesafe/api/v1/FamilyMember/create`, JSON.stringify(familymember), { headers: headers })
    .subscribe(data => {
      console.log(data);
      this.addMember=false;
      this.memberList=true;
      this.getFamilyMember();
      if(!data['success']){
        Swal.fire({
          title: "Sorry! MobileNumber already Exists",
          text: "",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      else{
        Swal.fire({
          title: "Family Member Added Successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {
              this.Relation='';
              this.FirstName='';
              this.MobileNumber='';
              this.ToggleGurdian='';           
            } else if (result.dismiss === swal.DismissReason.cancel) {
              this.router.navigate(['']);
            }
          })
      }   
    },
      err => {
        console.log(err);
      })
}

resetFamilyMemberModal(){
  this.EditFirstName='';
  this.EditMobileNumber='';
  this.EditRelation='';
}
resetUpdateFamilyMemberModal(){
  this.EditFirstName='';
  this.EditMobileNumber='';
  this.EditRelation='';
}
// ADD FAMILY MEMBER END

// DELETE FAMILY MEMBER START
deleteFamilyMember(fmid) {
  //console.log(fmid);
  let deleteFmailyMember = {
    "FMID": fmid
  }

  let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');

  let scopeIP = this.utilsService.deleteFmailyMember();
  //console.log(deleteFmailyMember);
  this.http.post(scopeIP + `oyesafe/api/v1/FamilyMemberDetailsDelete/update`, JSON.stringify(deleteFmailyMember), { headers: headers })
    .subscribe(data => {
      //console.log(data);
      swal.fire({
        title: "Family Member Deleted Successfully",
        text: "",
        type: "success",
        confirmButtonColor: "#f69321"
      }).then(
        (result) => {
          if (result.value) {
            this.getFamilyMember();
          }
        }
      )
    },
      err => {
        //console.log(err);
      })
}
// DELETE FAMILY MEMBER END

}
