import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { UnitListForRoleChange } from '../unit-list-for-role-change';
import { Observable, of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {UtilsService} from '../utils/utils.service';
import {GlobalServiceService} from '../global-service.service';
import swal from 'sweetalert2';
import { FamilyMemberList } from '../models/family-member-list';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  LastName:any;
  MobileNumber: any;
  Relation: any;
  EditFirstName:any
  EditMobileNumber:any;
  EditRelation:any;
  fmid:any;
  AsImage:any;
  loadchangedforassociation: boolean;
  ToggleGurdian: any;
  searchTxt:any;
  joinassociation:any;
  RelationsArray:any[];
  getFamilyMemberSubscription:Subscription;
  FMImgName:any;
  FamilyMemberList:FamilyMemberList[];
  FamilyImgUploadForm:FormGroup;
  thumbnailFamilyLogo: string | ArrayBuffer;
  FamilyMemImgForPopUp: any;
  blockidForAddFamilyMember:any;

  constructor(private http: HttpClient, private router: Router,
    private modalService: BsModalService,private utilsService:UtilsService,
    private globalService:GlobalServiceService,
    private formBuilder: FormBuilder) {
    this.FamilyMemberList=[];
    this.unitID='';
    this.AccountID='';
    this.asAssnID='';
    this.loadchangedforassociation = false;
    this.ToggleGurdian = 'xyz';
    this.RelationsArray=['Parent', 'Childern', 'Siblings', 'Relatives', 'Spouse', 'Cousin'];
    this.Relation='Select Relation';
    this.getFamilyMemberSubscription = this.globalService.SetgetFamilyMember()
    .subscribe(data=>{
      this.getFamilyMember();
    })
    localStorage.setItem('Component','FamilyMembers');
    
   }

  ngOnInit() {
    this.memberList=true;
    this.addMember=false;
    this.Relation="Select Relation"
    this.getFamilyMember();
    this.FamilyImgUploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.GetUnitListByUnitID();
  }
  ngAfterViewInit() {
    $(".se-pre-con").fadeOut("slow");
  // $(document).ready(function () {
  //   $('#example').DataTable();
  // });
  }

  addMemberShow(){
    this.FMImgName='';
    this.memberList=false;
    this.addMember=true;
  }

  getFamilyMember(){
    this.FamilyMemberList=[];
    this.familymemberarray = [];
    this.asAssnID = this.globalService.getCurrentAssociationId();
    this.AccountID = this.globalService.getacAccntID();
    this.unitID = this.globalService.getCurrentUnitId();
    console.log('unitID', this.unitID);
    console.log('AccountID', this.AccountID);
    console.log('asAssnID', this.asAssnID);
    let scopeIP=this.utilsService.loadUnitForAssociation();
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
        .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
        .append('Access-Control-Allow-Origin', "*");
    this.http.get(scopeIP + `oyesafe/api/v1/GetFamilyMemberListByAssocAndUnitID/${this.unitID}/${this.asAssnID}/${this.AccountID}`, { headers: headers })
        .subscribe(data => {
          console.log(data);
          this.familymemberarray = data['data']['familyMembers'];
          if (this.familymemberarray.length > 0) {
            this.familymemberarray.forEach(item=>{
              this.FamilyMemberList.push(new FamilyMemberList(item['fmName'],item['fmRltn'],item['fmMobile'],item['fmImgName'],item['asAssnID'],item['unUnitID'],item['fmid']))
            })
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

  GetUnitListByUnitID() {
    let scopeIP = this.utilsService.getIPaddress();
    let headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .append('Access-Control-Allow-Origin', "*");
    this.http.get(scopeIP + `oyeliving/api/v1/Unit/GetUnitListByUnitID/${this.globalService.getCurrentUnitId()}`, { headers: headers })
      .subscribe(data => {
        //console.log(data);
       this.blockidForAddFamilyMember = data['data']['unit']['blBlockID'];
       console.log(this.blockidForAddFamilyMember);
      },
      err=>{
        console.log(err);
      })
  }

// EDIT FAMILY MEMBER MODEL POPUP
OpenEditFamilyMemberModal(EditFamilyMemberModal: TemplateRef<any>,fmName,fmRltn,fmMobile,asAssnID,fmImgName,unUnitID,fmid){
  console.log(fmName,fmRltn,fmMobile,asAssnID,unUnitID,fmid);
  this.EditFirstName=fmName;
  this.EditMobileNumber=fmMobile;
  this.EditRelation=fmRltn;
  this.fmid=fmid;
  this.AsImage=fmImgName;
  this.asAssnID=asAssnID;
  this.unitID=unUnitID;
  this.modalRef = this.modalService.show(EditFamilyMemberModal, Object.assign({}, { class: 'gray modal-md' }));
}
// EDIT FAMILY MEMBER MODEL POPUP END

// UPDATE FAMILY MEMBER API CALL
updatefamilymember() {
  console.log(this.EditMobileNumber.split('+91'));
  let mobileNumberWithRemovedCountryCode=this.EditMobileNumber.split('+91');
 let filteredMobNumber = mobileNumberWithRemovedCountryCode.filter(item => {
    return item != '';
  });
  console.log(filteredMobNumber[0]);
  let updateFmailyMember = {
    "FMName": this.EditFirstName,
    "FMMobile": filteredMobNumber[0],
    "MEMemID": "1",
    "UNUnitID": this.unitID,
    "ASAssnID": this.asAssnID,
    "FMISDCode": "+91",
    "FMImgName": this.FMImgName,
    "FMRltn": this.EditRelation,
    "FMLName": "M",
    "FMMinor": this.ToggleGurdian == "xyz"? false : true,
    "FMGurName": "som",
    "FMID": this.fmid
  }

  let headers = new HttpHeaders().append('Content-Type', 'application/json')
    .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');

  let scopeIP = this.utilsService.updatefamilymember();
  console.log(updateFmailyMember);
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
    console.log(err);
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
    "FMImgName": this.FMImgName,
    "FMMinor": this.ToggleGurdian == "xyz"? false : true,
    "FMLName": this.LastName,
    "FMGurName": "somu",
    "PAccntID": this.AccountID,
    "BLBlockID" : this.blockidForAddFamilyMember
  }
  console.log(familymember);
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
              this.Relation="Select Relation";
              this.FirstName='';
              this.MobileNumber='';
              // this.ToggleGurdian='';           
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
  this.Relation='Select Relation';
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

  setRelationType(relation) {
    this.Relation = relation;
  }
  OpenFileUpload() {
    let _uploadFileinput = <HTMLInputElement>document.getElementById("uploadFileinput");
    _uploadFileinput.click();
  }
  onFileSelected(event) {

    let selectedFile = <File>event.target.files[0];
    console.log(selectedFile);
    console.log(<File>event.target.files);
    const fd = new FormData();
    fd.append('image', selectedFile);
    this.FMImgName=fd;
    console.log(this.FMImgName);

    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
    console.log(imgthumbnailelement);
    let reader  = new FileReader();

    reader.onloadend =  ()=> {
      console.log(reader.result as string);
      //console.log(this);
      this.FMImgName=reader.result as string;
      this.FMImgName=this.FMImgName.substring(this.FMImgName.indexOf('64') + 3);
      console.log(this.FMImgName);
      imgthumbnailelement.src  = reader.result as string;
    }
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    } else {
      imgthumbnailelement.src = "";
    }
    console.log(reader);
  }
  processFile() {
    console.log(this.FamilyImgUploadForm.get('profile').value);
    var reader = new FileReader();
    reader.readAsDataURL(this.FamilyImgUploadForm.get('profile').value);
    reader.onload = () => {
      console.log(reader.result);
      this.FMImgName = reader.result;
      this.thumbnailFamilyLogo = reader.result;
      this.FMImgName = this.FMImgName.substring(this.FMImgName.indexOf('64') + 3);
      //console.log(this.ASAsnLogo.indexOf('64')+1);
      //console.log((this.ASAsnLogo.substring(this.ASAsnLogo.indexOf('64')+3)));
      console.log(this.FMImgName);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.FamilyImgUploadForm.get('profile').setValue(file);
    }
  }
  showFamilyMemImgInPopUp(FamilyMemberImagetemplate,fmImgName){
    this.FamilyMemImgForPopUp=fmImgName;
    this.modalRef = this.modalService.show(FamilyMemberImagetemplate,Object.assign({}, { class: 'gray modal-lg' }));
  }
}
