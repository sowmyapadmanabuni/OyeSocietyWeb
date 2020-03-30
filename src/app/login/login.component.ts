import { Component, ViewChild, ElementRef, OnInit, EventEmitter, Output,TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalServiceService} from '../global-service.service';
import {DashBoardService} from '../../services/dash-board.service';
import {UtilsService} from '../utils/utils.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  code: string;
  title = 'mylogin';
  mobile: number;
  mobilenumber: any;
  otp: string;
  ipAddress = 'http://api.oyespace.com';
  inpt: any;
  public countrydata: object;
  toggleShowClientContent:boolean;
  toggleShowPartnersContent:boolean;
  toggleLoginContent:boolean;
  toggleShowLocationsContent:boolean;
  toggleShowAboutUsContent:boolean;
  toggleShowAccountingContent:boolean;
  toggleShowSafetyContent:boolean;
  // @ViewChild('myButton1') myButton1: any;
  @Output() toggleMyMenus:EventEmitter<string>;
  returnUrl: string;
  hideShowEye: boolean;
  isOTPSent:boolean;
  disableMobileNumField:boolean;
  modalRef: any;
  hideGetInButton:boolean;

  constructor(private modalService:BsModalService,
    private http: HttpClient, public router: Router,
    private globalserviceservice: GlobalServiceService, private route: ActivatedRoute,
    private dashboardservice:DashBoardService,private utilsService:UtilsService) {
      this.otp='';
      this.mobilenumber='';
    this.toggleLoginContent=true;
    this.toggleShowClientContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
    this.isOTPSent=false;
    this.hideGetInButton=false;
      //alert('inside login component');
    // redirect to home if already logged in
    if (this.globalserviceservice.acAccntID) {
      //alert('globalserviceservice.acAccntID'+this.globalserviceservice.acAccntID);
      //alert('this.globalserviceservice.acAccntID has value'+this.globalserviceservice.acAccntID);
      //this.router.navigate(['home']);
    }
    else{
      //alert('inside else part in login component...');
      //alert('this.globalserviceservice.acAccntID'+this.globalserviceservice.acAccntID);
      //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
      //alert('returnURL-'+this.returnUrl);
      //this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
     // get return url from route parameters or default to '/'
     //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  openModal3(privacy: TemplateRef<any>) {
    this.modalRef = this.modalService.show(privacy, { class: 'modal-lg' });
  }
  openModal4(refund: TemplateRef<any>) {
    this.modalRef = this.modalService.show(refund, { class: 'modal-md' });
  }
  openModal5(termsconditions: TemplateRef<any>) {
    this.modalRef = this.modalService.show(termsconditions, { class: 'modal-lg' });
  }
  ngAfterViewInit(){
    // $("#login").on('click',function(event) {
    //   $("#login-form").slideDown();
    //   event.stopPropagation();
    // });
    // $("#login").on('focusout',function() {
    //   $("#login-form").slideUp();
    // });

    // $("body").click(function (event) {
    //   // event.stopPropagation();
    //   $("#login-form").slideUp();
    //   event.stopPropagation();
    // });
    $("#login").click(function(e){
      $("#login-form").slideDown();
      e.stopPropagation();
    });
    $("#topDiv").click(function(){
      $("#login-form").slideUp();
    });
    // $("#login-form").on('blur', function () {
    //   $("#login-form").slideUp();
    // });

    $(".se-pre-con").fadeOut("slow");
  } 
  sendOTP() {
    $("#snackbar1").show();
    //alert('inside sendOTP');
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.sendOTP();
    let url = `${ipAddress}oyeliving/api/v1/account/sendotp`
    document.getElementById("myButton1").innerHTML="Resend";
    var mobileNoData = {
      CountryCode: this.code,
      MobileNumber: this.mobilenumber
    };

    var timeLeft = 60;
    var elem = document.getElementById('some_div');
    var element = <HTMLInputElement>document.getElementById("myButton1");
    var disableInput = <HTMLInputElement>document.getElementById("mobnum");

    var timerId = setInterval(countdown, 1000);

    function countdown() {
      if (timeLeft == 0) {
        clearTimeout(timerId);
        if(element.value != null){
          element.disabled=false;
          disableInput.disabled=false;
          // element.innerHTML = "Resend";
          }
        // doSomething();
      } else {
        element.disabled=true;
        disableInput.disabled=true;
        elem.innerHTML = timeLeft - 1 + ' seconds to resend';
        timeLeft--;
        if (timeLeft == 0) {
          console.log('timeLeft == 0',timeLeft);
          clearTimeout(timerId);
          if(element.value != null){
            element.disabled=false;
            disableInput.disabled=false;
            // element.innerHTML = "Resend";
            }
        }
      }
    } 

    //console.log(mobileNoData);
    return this.http.post(url, JSON.stringify(mobileNoData), { headers: headers })
      .subscribe(data => { 
        console.log(data) 
        this.isOTPSent=true;
        // var x = document.getElementById("snackbar1");
        // console.log(x);
        // if(x != null){
        //   console.log('test');
        //   setTimeout(function(){ x.className = "showOTPSent" }, 3000);
        // }
        setTimeout(function(){$("#snackbar1").hide();},3000);
      },
      err=>{
        console.log(err);
        if (err['statusText'] == "Unknown Error") {
          Swal.fire({
            title: "Error",
            text: "Check your Internet",
            type: "error",
            confirmButtonColor: "#f69321"
          })
        }
        else{
          Swal.fire({
            title: "Error",
            text: "Error while login",
            type: "error",
            confirmButtonColor: "#f69321"
          })
        }
      })
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

  verifyOtp() {
    if(this.hideGetInButton==false){
        this.VerifyOTPonce();
      } 
  }

  VerifyOTPonce(){
    this.globalserviceservice.saveMobileNumberforRegister='';
  let headers = this.getHttpheaders();
  let ipAddress=this.utilsService.verifyOtp();
  let url = `${ipAddress}oyeliving/api/v1/account/verifyotp`
  var otpdata = {
    CountryCode: this.code,
    MobileNumber: this.mobilenumber,
    OTPnumber: this.otp
  };
  //console.log(otpdata);
  this.http.post(url, JSON.stringify(otpdata), { headers: headers })
    .subscribe(data => {
      console.log(data)
      if (data['data'] == null) {
        Swal.fire({
          // type: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          text: 'Number not registered continue with registration',
        }).then((result) => {
          if (result.value) {
            this.globalserviceservice.saveMobileNumberforRegister= this.mobilenumber;
            this.globalserviceservice.toggleregister=true;
            console.log(this.globalserviceservice.toggleregister);
           //this.router.navigate(['home']);
           //this.router.navigate(['register']);
           //this.router.navigate(['login']);
          }
        })
      }
     else if (data['data'] != null){
      //console.log('acAccntID',data['data']['account']['acAccntID']);
      // this.globalserviceservice.acAccntID=data['data']['account']['acAccntID'];
      this.globalserviceservice.setAccountID(data['data']['account']['acAccntID']);
      //console.log(this.globalserviceservice.acAccntID);
      //alert('assigned accountid to globalserviceservice.acAccntID');
      //alert('displaying globalserviceservice.acAccntID'+this.globalserviceservice.acAccntID);
      this.dashboardservice.getMembers(this.globalserviceservice.acAccntID).subscribe(res => {
        //alert('assigning mrmRoleID...');
        //console.log('memberListByAccount',res['data'].memberListByAccount);
        //this.dashboardservice.mrmRoleID = res['data'].memberListByAccount[0]['mrmRoleID'];
        //console.log(this.dashboardservice.mrmRoleID);
        //alert('displaying dashboardservice.mrmRoleID..'+this.dashboardservice.mrmRoleID);
        this.globalserviceservice.toggleregister=false;
        this.router.navigate(['home']);
        //this.globalserviceservice.enableHomeView = true;
        //this.globalserviceservice.enableLogin = false;
      },
      res=>{
        //alert('dashboardservice.mrmRoleID'+this.dashboardservice.mrmRoleID);
        //console.log(res);
       /* Swal.fire({
          title: "Error",
          text: res['error']['message'],
          type: "error",
          confirmButtonColor: "#f69321"
        }).then(
          (result) => {
            if (result.value) { */
              this.router.navigate(['home']);
            //}});
        
      });
      //this.router.navigate(['home']);
      //alert('navigate to home component...');
      }
    },
    err=>{
      this.otp='';
      console.log(err);
      Swal.fire({
        // title: "Error",
        text: "Invalid OTP",
        type: "error",
        confirmButtonColor: "#f69321"
      })
    })
    this.hideGetInButton=true;
}




  verifyOtp1() {

    //this.globalserviceservice.acAccntID = 9539; 
    this.globalserviceservice.setAccountID(9539); //11511 9539 160
    //console.log(this.globalserviceservice.acAccntID);
    this.dashboardservice.getMembers(this.globalserviceservice.acAccntID).subscribe(res => {
      //console.log('memberListByAccount', res['data'].memberListByAccount);
      this.dashboardservice.mrmRoleID = res['data'].memberListByAccount[0]['mrmRoleID'];
      //console.log(this.dashboardservice.mrmRoleID);
      // this.globalserviceservice.enableHomeView=true;
      // this.globalserviceservice.enableLogin=false;
      this.router.navigate(['home']);
      //this.router.navigate(['OyeSocietydashboard']);
    },
      res => {
        //console.log(res);
        Swal.fire({
          title: "Error",
          text: res['error']['message'],
          type: "error",
          confirmButtonColor: "#f69321"
        }).then(
          (result) => {
            if (result.value) {
              this.router.navigate(['home']);
            }
          });

      });
  }

  
  otpCall(e) {
    e.preventDefault();
    let headers = this.getHttpheaders();
    var reSendOtpData = {
      CountryCode: this.code,
      MobileNumber: this.mobilenumber,
      OTPnumber: this.otp
    };
    let url = `http://control.msg91.com/api/retryotp.php?authkey=261622AtznpKYJ5c5ab60e&mobile=${this.code}${this.mobilenumber}&retrytype=voice`;
    //http://control.msg91.com/api/retryotp.php?authkey=261622AtznpKYJ5c5ab60e&mobile=917975536425&retrytype=voice
    console.log(url);
    console.log('reSendOtpData', reSendOtpData);
    this.http.get(url)
      .subscribe(data => {
        //console.log(data)
      })
  }
  showHidePassword() {
    var x = document.getElementById("OTPInput") as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
      this.hideShowEye=true;
    } else {
      x.type = "password";
      this.hideShowEye=false;
    }
  }

  resendOtp(e) {
    e.preventDefault();
    let headers = this.getHttpheaders();
    let ipAddress=this.utilsService.resendOtp();
    let url = `${ipAddress}oyeliving/api/v1/account/resendotp`
    var reSendOtpData = {
      CountryCode: this.code,
      MobileNumber: this.mobilenumber,
      OTPnumber: this.otp
    };
    //console.log('reSendOtpData', reSendOtpData);
    this.http.post(url, JSON.stringify(reSendOtpData), { headers: headers })
      .subscribe(data => {
        //console.log(data)
      })
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
    console.log(this.code);
  }

  getCountryData() {
    //alert('test')
  }
  _keyPress(event) {
    if(event.keyCode == 13) {
      this.sendOTP();
     }
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  _keyPress1(event) {
    //console.log(event.target.value);
    if(event.keyCode == 13) {
      this.verifyOtp();
     }
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  countMobileNumberLength(event){
    console.log(event.target.value);
    console.log(event.target.value.length);
    console.log(this.mobilenumber.length);
    if(event.target.value.length ==10){

    }
  }

  keyPressToDashboard(event){
    if(event.keyCode == 13) {
      this.verifyOtp();
     }
  }
  showClientContent() {
    this.toggleShowClientContent = true;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
  }

  showPartnersContent(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=true;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
  }

  showLocationContent(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=true;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
  }


  showAboutUsContent(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=true;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
  }
  GoToHome(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=true;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=false;
  }

  GoToSafety(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=true;
    this.toggleShowAccountingContent=false;
    
  }


  GoToAccounting(){
    this.toggleShowClientContent = false;
    this.toggleLoginContent=false;
    this.toggleShowPartnersContent=false;
    this.toggleShowLocationsContent=false;
    this.toggleShowAboutUsContent=false;
    this.toggleShowSafetyContent=false;
    this.toggleShowAccountingContent=true;
  }

  myFunctionlowery() {
    var popup = document.getElementById("lowery");
    popup.classList.toggle("show");
}

}

