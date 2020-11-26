import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {RegisterService} from '../../services/register.service';
import swal from 'sweetalert2';
import {LoginAndregisterService} from '../../services/login-andregister.service';
import {GlobalServiceService} from '../global-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  termsConditionmodalRef: BsModalRef;
  refundPolicymodalRef: BsModalRef;
  firstName : string;
  lastName : string;
  email : string;

  code: string;
  title = 'mylogin';
  mobile: number;
  mobilenumber: string;
  otp: number;
  ipAddress = 'http://api.oyespace.com/';
  inpt: any;
  public countrydata: object;
  // @ViewChild('myButton1') myButton1: any;
  modalRef: BsModalRef;
  terms:boolean;
  terms2: any;

  constructor(private modalService: BsModalService,
    private requestService: RegisterService,
    private loginandregisterservice:LoginAndregisterService,
    private router:Router,
    public globalservice:GlobalServiceService) {
      this.terms=false;
      this.terms2='';
     }

  ngOnInit() {
  }

  telInputObject(telinputobj) {
    this.code = '+' + telinputobj['b'].getAttribute('data-dial-code');
    //console.log(this.code);
  }
  hasError(errorobj) {
    //console.log(errorobj);
  }
  getNumber(numberobj) {
    //console.log(numberobj);
  }
  onCountryChange(countryobj) {
    this.code = countryobj['dialCode']
    //console.log(countryobj);
  }

  validateCheckBox(event){
    console.log('event',event.target.value);
    this.terms2=event.target.value;
    let termsChkbox = <HTMLInputElement>document.getElementById("terms1");
    console.log(termsChkbox.checked);
    if(!termsChkbox.checked){
      this.terms2='';
      console.log(this.terms2);
    }
    //console.log('event.target.validity.valueMissing',event.target.validity.valueMissing);
    event.target.setCustomValidity(event.target.validity.valueMissing ? "" : "");
  }

  firstNameCtrl:boolean;
  lastNameCtrl:boolean;
  emailCtrl:boolean;
  notValidDetails:boolean;

  _keyPressfirstname(event: any,param) {
    this.firstNameCtrl=false;
    this.notValidDetails=false;
    if(param=='first_name'){
      const pattern = /^[A-Za-z]+$/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
          //event.preventDefault();
          console.log(event.charCode);
          this.firstNameCtrl=true;
          this.notValidDetails=true;
      }
    }
  }
  _keyPresslastname(event: any,param) {
    this.lastNameCtrl=false;
    this.notValidDetails=false;

    if(param=='last_name'){
      const pattern = /^[A-Za-z]+$/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
          //event.preventDefault();
          console.log(event.charCode);
          this.lastNameCtrl=true;
          this.notValidDetails=true;
      }
    }
  }

  _keyUp1(event:any,param){
    this.emailCtrl=false;
    this.notValidDetails=false;
    if(param=='user_email'){
      //const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      //let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(this.email)) {
          //event.preventDefault();
          console.log(this.emailCtrl);
          console.log(this.email);
          this.emailCtrl=true;
          this.notValidDetails=true;
      }
    }
  }

  getCountryData() {
    //alert('test')
  }


  termsConditionModel(termsCondition: TemplateRef<any>) {
    this.termsConditionmodalRef = this.modalService.show(termsCondition, Object.assign({}, { class: 'gray modal-lg' }));
  }

  privacyPolicyModel(privacyPolicy: TemplateRef<any>) {
    this.refundPolicymodalRef = this.modalService.show(privacyPolicy, Object.assign({}, { class: 'gray modal-lg' }));
  }

  register() {
    var elemntterms1 = <HTMLInputElement>document.getElementById("terms1");
    //console.log('register-event',elemntterms1.validity.valueMissing);
    elemntterms1.setCustomValidity(elemntterms1.validity.valueMissing ? "Please indicate that you accept the Terms and Conditions" : "");

    if (!elemntterms1.validity.valueMissing) {
      let requestData = {
        'ACFName': this.firstName,
        'ACLName': this.lastName,
        'ACEmail': this.email,
        'ACMobile': this.globalservice.saveMobileNumberforRegister//this.mobilenumber
      }
      console.log('requestData', JSON.stringify(requestData));


      this.requestService.register(requestData)
        .subscribe((response) => {
          console.log('response', response);
          this.globalservice.setAccountID(response['data']['account']['acAccntID']);
          swal.fire({
            title: "Registered Successfully",
            text: "",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {

              this.firstName = '';
              this.lastName = '';
              this.email = '';
              this.mobilenumber = '';
              this.globalservice.toggleregister=false;
              this.router.navigate(['home']);
            }
          });
        },
          () => {
            swal.fire('Error', 'Something went wrong!', 'error');

          })
    }
    
   
   }


   _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

}
