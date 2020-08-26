
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service'
import { ViewStaffService } from '../../services/view-staff.service'
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from '../utils/utils.service';
import swal from 'sweetalert2';
import {Staffbydesigantion } from '../models/staffbydesigantion';
 import {IStarRatingOnClickEvent, IStarRatingOnRatingChangeEven} from "angular-star-rating/src/star-rating-struct";
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  modalRef: BsModalRef;
  StartDate: any;
  EndDate: any;
  wkid: any;
  comment:any;
  filterStaff:any;
  staffs1:any[];
  wkrating:any;
  wkrating1:any;
  staffByDesignation:any;
  Staffbydesigantion:any[];
  showOtherstaff:any;
  showstaffBydesignation:any;
  condition:any;
  condition1:any;
  wkimage: any;
  staffReports:any[];
  wkstaf: any;
  wkStatus: any;
  stafimage: any;
  workerImg: any[];
  displayStaff: any;
  WorkerNameList: any[];
  reportlists: any[];
  WorkerID: any;
  staffs: any[];
  staffs3:any[];
  wkidtype:any;
  wkidimage:any;
  otherStaff: any[];
  searchTxt: any;
  addGuest: any;
  baseUrl: any;
  enableviewDocuments:any;
  currentAssociationIdForStaffList: Subscription;
  p: number=1;
  ShowRecords: string;
  PaginatedValue: number;
  setnoofrows: any;
  showStaffReports: boolean;
  bsConfig: {dateInputFormat: string; showWeekNumbers: boolean; isAnimated: boolean;};
  StaffStartDate:any;
  StaffEndDate:any;
  wkReview: any;
  constructor(private router: Router, private domSanitizer: DomSanitizer,
    private http: HttpClient, private globalServiceService: GlobalServiceService, private UtilsService: UtilsService, private modalService: BsModalService, private viewStaffService: ViewStaffService) {
      this.staffs3=[];
      this.Staffbydesigantion=[];
      this.wkReview='';
      this.StaffStartDate='';
      this.StaffEndDate='';
      this.bsConfig = Object.assign({}, {
        dateInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        isAnimated: true
      });
      this.ShowRecords='Show Records';
      this.setnoofrows=10;
      this.PaginatedValue=10;
    this.EndDate = '';
    this.StartDate = '';
    this.WorkerNameList = [];
    this.workerImg = [];
    this.otherStaff = [];
    this.condition=true;
    this.condition1=false;
    this.showOtherstaff=false;
  this.showstaffBydesignation=false;
this.enableviewDocuments=false;
    this.displayStaff = "Select Staff"
    this.reportlists = [];
    this.WorkerID = '';
    this.baseUrl = 'data:image/png;base64,';
    this.currentAssociationIdForStaffList = this.globalServiceService.getCurrentAssociationIdForStaffList()
      .subscribe(data => {
        console.log(data);
        //console.log(localStorage.getItem('StaffListCalledOnce'))
        //if(localStorage.getItem('StaffListCalledOnce')=='false'){
        //this.StaffList();
        this.getStaffList();
        //}
      })
  }
  ngOnInit() {
    //this.staffs3=[];
    this.StaffList();
    this.getStaffList();
    this.workerImg = [];
    this.condition=true;
    this.condition1=false;
  }
  getStaffList() {
    this.staffs3=[];
    this.condition=true;
    this.condition1=false;
    // alert("hai");
    let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    this.http.get(`${ipAddress}oye247/api/v1/GetWorkerListByAssocIDAccountIDAndUnitID/${this.globalServiceService.getCurrentAssociationId()}/${this.globalServiceService.getacAccntID()}/${this.globalServiceService.getCurrentUnitId()}`, { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.staffs = response['data']['worker'];
          this.staffs.forEach(item=>{
            if(item['workerstatuses'].length > 0){
              item['workerstatuses'].forEach(itm=>{
                if(itm['unUniName']==this.globalServiceService.getCurrentUnitName()){
                  if(itm['wkAprStat']=="Approved"){
                    this.staffs3.push(item);
                  }
                }
              })
            }
          })
          console.log(this.staffs3);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  selectStaff(param, wkstaf, wkimage, wkstatus, wkid,wkidtype,wkidimage,wkrating,workerstatuses) {
    console.log(workerstatuses);
    if(workerstatuses.length > 0){
      workerstatuses.forEach(item=>{
        console.log(item.unUniName,this.globalServiceService.getCurrentUnitId());
        if(item.unUniName == this.globalServiceService.getCurrentUnitName()){
          this.wkrating1=item.wkRating;
          this.wkrating=item.wkRating;
          this.wkReview=item['wkReview'];
          console.log(this.wkrating);
          console.log(this.wkrating1);
          console.log(this.wkReview);
        }
      })
    }
    this.enableviewDocuments=false;
    this.wkidtype=wkidtype;
    this.wkidimage=wkidimage;
    console.log(wkidtype);
    console.log(wkidimage);
    if (wkimage != "") {
      this.stafimage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + wkimage);
    } 
    else {
      this.stafimage = "";
    }
   
    this.wkstaf = wkstaf;
    console.log(this.stafimage);
    console.log(this.staffs);
    this.displayStaff = param;
    this.wkStatus = wkstatus;
    this.wkid = wkid;
  }
  getDoc(){
    this.condition=true;
    this.condition1=false;
    this.enableviewDocuments=true;
    if(this.wkidimage!=""){
      console.log(this.wkidimage);
      this.wkidimage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.wkidimage);
    }
    else{
        this.wkidimage="";
    }
    this.wkidtype=this.wkidtype;
    console.log(this.wkidimage);
    console.log(this.wkidtype);
  }
  //Get Staff Report start
    getReports(id) {
      this.showOtherstaff=false;
      this.condition=true;
      this.condition1=false;
      this.showStaffReports=true;
    console.log(id);
    let todayDate = formatDate(new Date(),'MM-dd-yyyy','en');
        let input = {
          "ASAssnID": this.globalServiceService.getCurrentAssociationId(),
          "WKWorkID": id,
          "FromDate": this.StaffStartDate==''?'07-01-2020':formatDate(this.StaffStartDate,'MM-dd-yyyy','en'),
          "ToDate": this.StaffEndDate==''?todayDate:formatDate(this.StaffEndDate,'MM-dd-yyyy','en'),
          "ACAccntID": this.globalServiceService.getacAccntID(),
          "UNUnitID": this.globalServiceService.getCurrentUnitId()
          };
          let ipAddress = this.UtilsService.getIPaddress()
          console.log(input);
          console.log(todayDate);
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
          this.http.post(`${ipAddress}oye247/api/v1/Worker/GetWorkerListByDatesAssocAndUnitID`,input, { headers: headers })
          .subscribe(
            (response) => {
              console.log(response);
             this.staffReports = response['data']['worker'];
              // console.log(this.staffs);
            },
            (error) => {
              console.log(error);
            }
          );
  }
  //Get Staff Report start
//get staff details based on designation
getotherStaffbyDesignation(desgid,wtDesgn){
  this.Staffbydesigantion=[];
  this.showOtherstaff=false;
  this.showstaffBydesignation=true;
  console.log(desgid);
  console.log(wtDesgn);
  let ipAddress = this.UtilsService.getIPaddress()
  const headers = new HttpHeaders()
    .set('Authorization', 'my-auth-token')
    .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
    .set('Content-Type', 'application/json');
        this.http.get(`${ipAddress}oye247/api/v1/GetWorkersListByDesignationAndAssocID/${this.globalServiceService.getCurrentAssociationId()}/${wtDesgn}`, { headers: headers })
        .subscribe(
          (response) => {
            console.log(response);
            this.staffByDesignation=response['data']['workers'];
            console.log(this.staffByDesignation);

            this.staffByDesignation.forEach(item=>{
              if(item['workerstatuses'].length>0){
                console.log("in");
                item['workerstatuses'].forEach(item1=>{
                  if(this.globalServiceService.getCurrentUnitName()==item1['unUniName']){
                    this.Staffbydesigantion.push(new Staffbydesigantion(this.domSanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+item['idPrfImg']),item['wkfName'],item['wkDesgn'],item['wkStatus'],item1['wkRating']))
                  }
                })
                
              }
            })
            console.log(this.Staffbydesigantion);
           // this.staffByDesignation=this.staffByDesignation.filter(item=>{
            //  return item['wkWorkID']==desgid;
          },
          (error) => {
            console.log(error);
          }
        );
 
 
}
goToStaff(){
  this.staffReports=[];
  this.showStaffReports=true;
  this.showOtherstaff=false;
    this.showstaffBydesignation=false;
    this.condition1=false;
    this.condition=true;   
}
  getOtherStaffs() {
    this.showOtherstaff=true;
    this.showstaffBydesignation=false;
this.showStaffReports=false;
    this.condition1=true;
    this.condition=false;
    this.workerImg = [];
    //alert("hai");
    let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    //this.http.get('http://devapi.scuarex.com/oye247/api/v1/WorkerTypes/GetWorkerTypes', { headers: headers })
    this.http.get(`${ipAddress}oye247/api/v1/WorkerTypes/GetWorkerTypes`, { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.otherStaff = response['data']['workerTypes'];
         // this.otherStaff.forEach(item => {
            // console.log(item['wkEntryImg']);
            // console.log(typeof item['wkEntryImg']);
            //this.workerImg.push({ name: item['wkfName'], image: this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['wkEntryImg']) })
         // })
          // console.log(this.staffs);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  StaffList() {
    //localStorage.setItem('StaffListCalledOnce','true')      
    this.viewStaffService.GetStaffList()
      .subscribe(data => {
        console.log(data);
        if (data['data']['errorResponse']) {
          if (data['data']['errorResponse']['message']) {
            swal.fire({
              title: "",
              text: `${data['data']['errorResponse']['message']}`,
              type: "info",
              confirmButtonColor: "#f69321"
            })
          }
        }
        this.WorkerNameList = data['data']['worker'];
        // console.log(this.WorkerNameList);
        this.WorkerNameList = _.sortBy(this.WorkerNameList, e => e['wkfName']);
        console.log(this.WorkerNameList);
      },
        err => {
          console.log(err);
        })
  }
  onClickResult:IStarRatingOnClickEvent;
   
    onRatingChangeResult:IStarRatingOnRatingChangeEven;
    onClick = ($event:IStarRatingOnClickEvent) => {
        console.log('onClick $event: ', $event);
        this.onClickResult = $event;
        this.wkrating1=this.onClickResult.rating
    };
    onRatingChange = ($event:IStarRatingOnRatingChangeEven) => {
        console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    };
   
  updateReview(param,coment){
    this.wkrating1;
     console.log(param);
    console.log(this.wkrating1);
     console.log(coment);
     let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
      let upreview =
      {
        "ASAssnID"  : Number(this.globalServiceService.getCurrentAssociationId()),
        "UNUnitID"  : Number(this.globalServiceService.getCurrentUnitId()),
        "WKWorkID"  : param,
        "ACAccntID" : this.globalServiceService.getacAccntID(),
        "WKRating"  : this.wkrating1,
        "WKReview"  : coment,
        "WKSmlyCnt" : "4"
    }
    console.log(upreview);
    //this.http.post('http://devapi.scuarex.com/oye247/api/v1/WorkerReviewRatingUpdate',upreview, { headers: headers })
    this.http.post(`${ipAddress}oye247/api/v1/WorkerReviewRatingUpdate`,upreview, { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.modalRef.hide();
          swal.fire({
            title: "Review Updated Successfully",
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        },
        (error) => {
          console.log(error);
        }
      );
  }
 
  OpeneditReview(editReview: TemplateRef<any>,wid){
    console.log(this.wkid);
    this.modalRef = this.modalService.show(editReview, Object.assign({}, { class: 'gray modal-md' }));
    this.staffs1=this.staffs;
    this.staffs1=this.staffs1.filter(item=>{
      return item['wkWorkID']==this.wkid;
    })
    console.log(this.staffs1);
    // this.wkidimage;
    // this.wkrating;
   
  }
  goToStaffs() {
    this.condition=true;
    this.condition1=false;
    this.router.navigate(['staffs']);
  // this.staffReports=[];
  }
  goToGuests() {
    this.router.navigate(['visitors']);
  }
  goToDelivery() {
    this.router.navigate(['deliveries']);
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
    if (element != null) {
      this.p = Number(element.children[0]['text']);
      console.log(this.p);
      if (this.ShowRecords != 'Show Records') {
        console.log('testtt');
        console.log(this.p);
        this.PaginatedValue = (this.setnoofrows == 'All Records' ? this.staffByDesignation.length : this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }
}