import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import{EditprofileService} from '../../services/editprofile.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  accountID: number;
  currentAssociationID: string;
  allAccount=[];
  acfName: any;
  aclName: any;
  acMobile: any;
  acEmail: any;
  firstname: any;
  lastname: any;
  email: any;
  mobile: any;
  updateProfileData: any = {};
  ACFName: any;
  ACLName: any;
  ACMobile: any;
  ACEmail: any;
  modalRef: any;
  ACMobile1: any;
  ACEmail1: any;
  mobile1: any;
  email1: any;
  acEmail1: any;
  acMobile1: any;
  currentaccountid: any;
  profile: boolean;
  editprofile: boolean;
  ACImgName:any;


  constructor(private editprofileservice:EditprofileService,
    private globalservice:GlobalServiceService,
    private router:Router,
    private modalService: BsModalService
    ) {       
      
    this.accountID=this.globalservice.getacAccntID();
    this.ACImgName='';
    }

  ngOnInit() {
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    //this.accountID= this.globalService.getacAccntID();
    console.log(this.accountID);
    this.getProfileDetails();
    //this.updateEditProfile();
    this.profile = true;
    this.editprofile = false;
  }
  getProfileDetails(){
    console.log(this.accountID);
    this.editprofileservice.getProfileDetails(this.accountID).subscribe(res => {
      console.log(JSON.stringify(res));
      var data:any = res;
      this.allAccount = data.data.account;
      console.log('account',this.allAccount);
     this.ACFName= this.allAccount[0]['acfName'];
     this.ACLName= this.allAccount[0]['aclName'];
     this.ACMobile= this.allAccount[0]['acMobile'];
     this.ACEmail= this.allAccount[0]['acEmail'];
     this.acEmail1= this.allAccount[0]['acEmail1'];
     this.acMobile1= this.allAccount[0]['acMobile1'];
    this.currentaccountid=this.allAccount[0]['acAccntID'];
      });
  }


  updateEditProfile() {
console.log(this.currentaccountid);
    this.updateProfileData = {
      
        "ACFName"	: this.ACFName,
        "ACLName"	: this.ACLName,
        "ACEmail"	: this.ACEmail,
        "ACISDCode" : "+91",
        "ACMobile"	: this.ACMobile,
        "ACMobile1"	: "",
        "ACISDCode1": "",
        "ACMobile2"	: "",
        "ACISDCode2": "",
        "ACMobile3"	: "",
        "ACISDCode3": "",
        "ACMobile4" : "",
        "ACISDCode4": "",
        "ACEmail1"  : "",
        "ACEmail2"  : "",
        "ACEmail3"	: "",
        "ACEmail4"  : "",
        "ACAccntID"	: this.currentaccountid,
        "ACImgName":this.ACImgName
      
    }
  

    this.editprofileservice.updateEditProfile(this.updateProfileData).subscribe(res => {
      console.log(JSON.stringify(res));
      Swal.fire({
        title: 'Profile Updated Successfuly',
       }).then(
         (result) => {
       
           if (result.value) {
             //this.form.reset();
             this.modalRef.hide();
             this.router.navigate(['home/dashboard']);
           
           } else if (result.dismiss === Swal.DismissReason.cancel) {
             this.router.navigate(['home/dashboard']);
           }
         })
       },
       err=>{
         console.log(err);
       });

    }



  editProfile() {
    this.profile = false;
    this.editprofile = true;
  }
  resetProfile() {
      this.ACFName = '';
      this.ACLName = '';
      this.ACMobile='';
      this.ACMobile1='';
      this.ACEmail='';
      this.ACEmail1='';
  }
  ngAfterViewInit() {
  }
  OpenFileUpload(){
    let _uploadFileinput = <HTMLInputElement>document.getElementById("uploadFileinput");
    _uploadFileinput.click();
  }
  onFileSelected(event) {

    let selectedFile = <File>event.target.files[0];
    console.log(selectedFile);
    console.log(<File>event.target.files);
    const fd = new FormData();
    fd.append('image', selectedFile);
    this.ACImgName=fd;
    console.log(this.ACImgName);

    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
    console.log(imgthumbnailelement);
    let reader  = new FileReader();

    reader.onloadend =  ()=> {
      console.log(reader.result as string);
      //console.log(this);
      //this.ACImgName=reader.result as string;
      imgthumbnailelement.src  = reader.result as string;
    }
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    } else {
      imgthumbnailelement.src = "";
    }
  }
}
