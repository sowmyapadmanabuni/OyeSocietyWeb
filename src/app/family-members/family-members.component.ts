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
import { EditprofileService } from 'src/services/editprofile.service';
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
  ShowRecords: any;
  config: any;

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
  rowsToDisplay: any[];
  setnoofrows:any;
  PaginatedValue:any;
  FamilyMemberList:FamilyMemberList[];
  FamilyImgUploadForm:FormGroup;
  thumbnailFamilyLogo: string | ArrayBuffer;
  FamilyMemImgForPopUp: any;
  blockidForAddFamilyMember:any;
  page: number;
  p: number = 1;
  bsConfig: any;
  Account:any[];
  
  constructor(private http: HttpClient, private router: Router,
    private modalService: BsModalService,private utilsService:UtilsService,
    private globalService:GlobalServiceService,
    private formBuilder: FormBuilder,
    private editprofileservice:EditprofileService) {
      this.Account=[];
    this.FamilyMemberList=[];
    this.unitID='';
    this.PaginatedValue=10;
    this.rowsToDisplay = [{ 'Display': '5', 'Row': 5 },
    { 'Display': '10', 'Row': 10 },
    { 'Display': '15', 'Row': 15 },
    { 'Display': '50', 'Row': 50 },
    { 'Display': '100', 'Row': 100 },
    { 'Display': 'Show All Records', 'Row': 'All' }];
    this.setnoofrows = 10;
    this.ShowRecords = 'Show Records';
    this.AccountID='';
    this.asAssnID='';
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };
    this.loadchangedforassociation = false;
    this.ToggleGurdian = 'xyz';
    this.RelationsArray=['Parents', 'Childern', 'Siblings', 'Relatives', 'Spouse', 'Cousin'];
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
    this.FamilyImgUploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.GetUnitListByUnitID();
    this.editprofileservice.getProfileDetails(this.globalService.getacAccntID())
    .subscribe(res=>{
      console.log(res);
      var data: any = res;
      this.Account = data.data.account;
      console.log('account', this.Account);
      this.getFamilyMember();
    })
  }
  setRows(RowNum) {
    this.ShowRecords = 'abc';
    this.setnoofrows = (RowNum == 'All' ?'All Records': RowNum);
    $(document).ready(()=> {
      let element=document.querySelector('.page-item.active');
      console.log(element);
      console.log(element);
      if(element != null){
      (element.children[0] as HTMLElement).click();
      console.log(element.children[0]['text']);
      }
      else if (element == null) {
        this.PaginatedValue=0;
      }
    });
  }
  onPageChange(event) {
    //console.log(event);
    //console.log(this.p);
    //console.log(event['srcElement']['text']);
    if (event['srcElement']['text'] == '1') {
      this.p = 1;
    }
    if ((event['srcElement']['text'] != undefined) && (event['srcElement']['text'] != '»') && (event['srcElement']['text'] != '1') && (Number(event['srcElement']['text']) == NaN)) {
      //console.log('test');
      //console.log(Number(event['srcElement']['text']) == NaN);
      //console.log(Number(event['srcElement']['text']));
      let element = document.querySelector('.page-item.active');
      //console.log(element.children[0]['text']);
      this.p = Number(element.children[0]['text']);
      //console.log(this.p);
    }
    if (event['srcElement']['text'] == '«') {
      //console.log(this.p);
      this.p = 1;
    }
    //console.log(this.p);
    let element = document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
    if(element != null){
      this.p=Number(element.children[0]['text']);
      console.log(this.p);
      if (this.ShowRecords != 'Show Records') {
        console.log('testtt');
        //let PminusOne=this.p-1;
        //console.log(PminusOne);
        //console.log((this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //console.log(PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //this.PaginatedValue=PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows);
        console.log(this.p);
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.FamilyMemberList.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }
  pageChanged(event: any): void {
    this.page = event.page;
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
    this.PaginatedValue=10;
    this.p=1;
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
              this.FamilyMemberList.push(new FamilyMemberList(item['fmName'],item['fmRltn'],item['fmMobile'],item['fmImgName'],item['asAssnID'],item['unUnitID'],item['fmid'],true,item['pAccntID']))
            })
            this.loadchangedforassociation = true;
            this.FamilyMemberList.forEach(item=>{
              if(item['pAccntID']==this.Account[0]['acAccntID']){
                console.log('NotsameAccID-',item['NotsameAccID'])
                item['NotsameAccID']=false;
                console.log('NotsameAccID--',item['NotsameAccID'])
              }
            })
            console.log(this.FamilyMemberList);
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

_keyPress1(event1: any) {
  const pattern1 = /^[A-Za-z]+$/;
  let inputChar1 = String.fromCharCode(event1.charCode);
  if (!pattern1.test(inputChar1)) {
      event.preventDefault();
  }
}

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
        this.ToggleGurdian="xyz"; 
        this.Relation="Select Relation";
              this.FirstName='';
              this.MobileNumber='';
              this.LastName='';          
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
              this.LastName='';
              this.ToggleGurdian="xyz";           
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
  this.ToggleGurdian="xyz";           
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
            this.PaginatedValue=10;
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
      this.AsImage=this.FMImgName;
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
