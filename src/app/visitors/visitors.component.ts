// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { GuestService } from '../../services/guest.service';
import { AddVisitorService } from '../../services/add-visitor.service'
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { ViewDeliveryService } from 'src/services/view-delivery.service';
import { DomSanitizer } from '@angular/platform-browser';


declare var $: any;

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})

export class VisitorsComponent implements OnInit {
public searchTxt: any;
guestList:boolean;
hideGuestInvitation:boolean;
hideGuestInvitation1:boolean;
addGuest:boolean;
mytime: Date = new Date();
totime: Date = new Date();
modalRef: BsModalRef;
invitationList: any[];
invitationListLength: boolean;
ToDate: any;
StartDate: any;
INInvVis: any;
AssociationName:any;
PurposeOfVisit:any;
InvitedDate:any;
TotalGuest:any;
MultipleVisitors:boolean;
// ADD VISITOR DATA/*/*/*/*/*/*
INFName: any;
INLName: any;
INMobile: any;
INVchlNo: any;
INEmail: any;
INPOfInv: any;
INVisCnt: any;
INSDate: any;
INEDate: any;
todayDate: Date;
bsConfig:any;
currentAssociationIdForUnit:Subscription;
  isDateFieldEmpty: boolean;
  EndDate:any;
  deliveryListTmp:any[];
  deliveryList:any[];
// ADD VISITOR DATA/*/*/*/*/*/*

  constructor(private globalService: GlobalServiceService, private guestService: GuestService,
    private modalService: BsModalService, private router:Router, 
    private deliveryService: ViewDeliveryService,private addvisitorservice: AddVisitorService,
    private domSanitizer:DomSanitizer) 
    {
      this.EndDate = '';
      this.deliveryListTmp=[];
      this.deliveryList = [];
      this.isDateFieldEmpty=false;
      this.toggleVisitor='InvitationDetails';
      this.invitationList = [];
      this.invitationListLength=false;
      this.MultipleVisitors=false;
      this.ToDate = '';
      this.StartDate = ''

      this.INFName = '';
      this.INLName = '';
      this.INMobile = '';
      this.INVchlNo = '';
      this.INEmail = '';
      this.INPOfInv = '';
      this.INVisCnt = '';
      this.INSDate = '';
      this.INEDate = '';
      this.todayDate=new Date();
      this.bsConfig = Object.assign({}, {
        // containerClass: 'theme-orange',
        dateInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        isAnimated: true
        });
      this.globalService.SetgetVisitorList()
      .subscribe(data=>{
        console.log('invoking getVisitorList');
        this.getVisitorList('');
      })
      localStorage.setItem('Component','Visitors');
     }

  ngOnInit() {
    this.guestList=true;
    this.hideGuestInvitation=true;
    this.hideGuestInvitation1=false;
    this.addGuest=false;
    this.getVisitorList('');
    this.AssociationName = this.globalService.getCurrentAssociationName();
    console.log(this.AssociationName);
  }
  // 
  getVisitorList(event){
    console.log(event);
    let date = {
      "StartDate": this.StartDate,
      "Todate": (event==null?'':event)
    }
    console.log(date);
    this.guestService.getVisitorList(date,"Invited")
    .subscribe(data=>{
      console.log(data);
      this.invitationList = data['data']['invitation'];
      console.log(this.invitationList);
      if(this.invitationList.length>0){
        this.invitationListLength=true;
        // this.invitationList = this.invitationList.filter(item=>{
        //   return item['infName'] != '';
        // })
        this.invitationList = _.sortBy(this.invitationList, e => e['insDate']);
      }
    },
    err=>{
      console.log(err);
    }
    )
  }
  toggleVisitor: any = '';
  GetInvitationDetails(visitorparam) {
    this.toggleVisitor = visitorparam;
    this.guestList=true;
    this.hideGuestInvitation1=false;
    this.hideGuestInvitation=true;
    this.addGuest=false;
  }
  GetVisitedDetails(visitorparam) {
    this.toggleVisitor = visitorparam;
    this.guestList=false;
    this.addGuest=false;
    this.hideGuestInvitation1=true;
    this.hideGuestInvitation=false;
    let e = '';
    this.getVisitorList1(e);
  }
  validateDate(event, StartDate, EndDate) {
    this.isDateFieldEmpty=false;
    console.log(StartDate.value, EndDate.value);
    if (event.keyCode == 8) {
      if ((StartDate.value == '' || StartDate.value == null) && (EndDate.value == '' || EndDate.value == null)) {
        console.log('test');
        this.isDateFieldEmpty=true;
        this.getVisitorList1('');
      }
    }
  }
  GetDeleveriesList(){
    if(this.isDateFieldEmpty==true){
      this.getVisitorList1('');
    }
  }
  getVisitorList1(e:any) {
    //console.log(e);
    this.EndDate=e;
    let date = {
      "StartDate": this.StartDate,
      "EndDate": this.EndDate
    }
    //console.log(date);
    this.deliveryService.getVisitorList(date)
      .subscribe(data => {
        console.log(data);
        this.deliveryList = data['data']['visitorlog'];
        this.deliveryList = this.deliveryList.filter(item=>{
          return item['vlVisType']=="Guest with Invitation";
        })
        console.log(this.deliveryList);
        this.deliveryListTmp = this.deliveryList;
      },
        err => {
          console.log(err);
        }
      )
  }
  getDeleveriesListByDateRange(ExpenseEndDate) {
    console.log(this.deliveryListTmp);
    this.deliveryList = this.deliveryListTmp;
    console.log(formatDate(new Date(this.StartDate),'dd/MM/yyyy','en'));
    console.log(new Date(new Date(this.StartDate).getFullYear(),new Date(this.StartDate).getMonth()+1,new Date(this.StartDate).getDate()).getTime());
    //console.log(formatDate(this.ExpenseEndDate, 'dd/MM/yyyy', 'en'));
    //console.log(formatDate(new Date(ExpenseEndDate),'dd/MM/yyyy','en'));
    console.log(new Date(new Date(ExpenseEndDate).getFullYear(),new Date(ExpenseEndDate).getMonth()+1,new Date(ExpenseEndDate).getDate()).getTime());
    console.log(ExpenseEndDate);
    this.deliveryList = this.deliveryList.filter(item=>{
      console.log(new Date(item['vldCreated']),new Date(new Date(item['vldCreated']).getFullYear(),new Date(item['vldCreated']).getMonth()+1,new Date(item['vldCreated']).getDate()).getTime());
      console.log(new Date(formatDate(this.StartDate,'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(item['vldCreated'],'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(this.StartDate,'MM/dd/yyyy','en')).getTime() <= new Date(formatDate(item['vldCreated'],'MM/dd/yyyy','en')).getTime() && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime() >= new Date(formatDate(item['vldCreated'],'MM/dd/yyyy','en')).getTime())
      //return new Date(formatDate(this.ExpenseStartDate,'MM/dd/yyyy','en')).getTime() <= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime() && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime() >= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime();
      return new Date(formatDate(this.StartDate,'MM/dd/yyyy','en')) <= new Date(formatDate(item['vldCreated'],'MM/dd/yyyy','en')) && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')) >= new Date(formatDate(item['vldCreated'],'MM/dd/yyyy','en'));
    })
    console.log(this.deliveryList);
  }
  GuestImgForPopUp:any;
  showGuestImgInPopUp(PersonWithoutInvitationImagetemplate, guestImgName) {
    this.GuestImgForPopUp = guestImgName;
    this.modalRef = this.modalService.show(PersonWithoutInvitationImagetemplate, Object.assign({}, { class: 'gray modal-lg' }));
  }
  getSafeUrl(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + url);
  }
  // ADD VISITOR START HERE
  addVisitor() {
    console.log( this.INFName ,
    this.INLName ,
    this.INMobile ,
    this.INVchlNo ,
    this.INEmail ,
    this.INPOfInv ,
    this.INVisCnt ,
    this.INSDate ,
    this.INEDate ,
    'mytime-',this.mytime,
    'totime-',this.totime,
    formatDate(this.INSDate,'MM/dd/yyyy','en')+' '+formatDate(this.mytime,'HH:mm','en'),
    formatDate(this.INEDate,'MM/dd/yyyy','en')+' '+formatDate(this.totime,'HH:mm','en'))
    let visitorData = {
      "MeMemID": 1,
      "UnUnitID": this.globalService.getCurrentUnitId(),
      "INFName": this.INFName,
      "INLName": this.INLName,
      "INMobile": this.INMobile,
      "INEmail": this.INEmail,
      "INVchlNo": this.INVchlNo,
      "INVisCnt": this.INVisCnt,
      "INPhoto": "SD",
      "INSDate": formatDate(this.INSDate,'MM/dd/yyyy','en')+' '+formatDate(this.mytime,'HH:mm','en'),
      "INEDate": formatDate(this.INEDate,'MM/dd/yyyy','en')+' '+formatDate(this.totime,'HH:mm','en'),
      "INPOfInv": this.INPOfInv,
      "INMultiEy": this.MultipleVisitors,
      "ASAssnID": this.globalService.getCurrentAssociationId(),
      "INQRCode": "True",
      "ACAccntID": this.globalService.getacAccntID()
    };
    console.log(visitorData);
     this.addvisitorservice.addVisitor(visitorData)
    .subscribe(data=>{
      console.log(data);
      this.getVisitorList('');
      swal.fire({
        title: "Visitor Added Successfully",
        text: "",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
      }).then(
        (result) => {

          if (result.value) {
            this.INFName='';
            this.INLName='';
            this.INMobile='';
            this.INVchlNo='';
            this.INEmail='';
            this.INPOfInv='';
            this.INSDate='';
            this.INEDate='';
            this.INVisCnt='';
            this.guestList=true;
            this.addGuest=false;
          } else if (result.dismiss === swal.DismissReason.cancel) {
            this.router.navigate(['']);
          }
        })
    },
    err=>{
      console.log(err);
    }) 
  }
  // ADD VISITOR END HERE

    // ALL ABOUT OQ CODE--------------$%$%
    qrcodename : any;
    title = 'generate-qrcode';
    elementType: 'url' | 'canvas' | 'img' = 'url';
    value: any;
    display = false;
    href : string;
    generateQRCode(){
      if(this.qrcodename == ''){
        this.display = false;
        alert("Please enter the name");
        return;
      }
      else{
        this.value = this.qrcodename;
        this.display = true;
      }
    }
    downloadImage(){
      console.log(Array.from(document.getElementsByClassName('qrcode')[0].children)[0]['currentSrc'] );
      this.href = Array.from(document.getElementsByClassName('qrcode')[0].children)[0]['currentSrc'];
        }
  
    //  ------POPUP for QR CODE-----//
    OpenModalForQRcode(QRtemplate: TemplateRef<any>, infName,inMobile,inInvtID,unUnitID,insDate,inpOfInv,ineDate,inVisCnt,asAssnID,inVchlNo,inIsActive) {
      this.PurposeOfVisit = inpOfInv;
      this.InvitedDate = insDate;
      this.TotalGuest = inVisCnt;
      console.log(infName,inMobile,inInvtID,unUnitID,inpOfInv,insDate,ineDate,inVisCnt,asAssnID,inIsActive);
      let qrCodeData={
        'infName':infName,
        'inMobile':inMobile,
        'inInvtID':inInvtID,
        'unUnitID':unUnitID,
        'insDate':insDate,
        'ineDate':ineDate,
        'inVisCnt':inVisCnt,
        'asAssnID':asAssnID,
        'inIsActive':inIsActive,
        'inVchlNo': inVchlNo,
        'inpOfInv': inpOfInv
      }
      this.display = true;
      this.value=JSON.stringify(qrCodeData);
      this.modalRef = this.modalService.show(QRtemplate,Object.assign({}, { class: 'gray modal-md' }));
  
    }
  // 
  addGuestShow(){
    this.toggleStepWizard();
    this.guestList=false;
    this.addGuest=true;
  }
  goToStaffs(){
    this.router.navigate(['staffs']);
  }
  goToGuests(){
    this.router.navigate(['visitors']);
  }
  goToDelivery(){
    this.router.navigate(['deliveries']);
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  // Multiple visitor toggle switch
  toggleEditable(event) {
    console.log(event.target.checked);
        this.MultipleVisitors = event.target.checked;
        //this.MultipleVisitors = true;
}
  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
    // Time Picker Initialization
// $('#input_starttime').pickatime({});
  }


  toggleStepWizard() {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  
    $(document).ready(function () {
  
      var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');
  
      allWells.hide();
  
      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this);
  
        if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      });
  
      allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
          curInputs = curStep.find("input[type='text'],input[type='url']"),
          isValid = true;
  
        $(".form-group").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
          if (!curInputs[i].validity.valid) {
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
        }
  
        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
      });
  
      $('div.setup-panel div a.btn-success').trigger('click');
    });
  }
}
