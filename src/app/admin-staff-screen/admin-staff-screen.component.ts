import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service'
import { ViewStaffService } from '../../services/view-staff.service'
import { Subscription } from 'rxjs';
import * as _ from 'underscore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { UsageReportService } from 'src/services/usage-report.service';

@Component({
  selector: 'app-admin-staff-screen',
  templateUrl: './admin-staff-screen.component.html',
  styleUrls: ['./admin-staff-screen.component.css']
})
export class AdminStaffScreenComponent implements OnInit {

  modalRef: BsModalRef;
  StartDate: any;
  EndDate: any;
  WorkerNameList: any[];
  reportlists: any[];
  WorkerID: any;
  searchTxt:any;
  addGuest:any;
  baseUrl:any;
  currentAssociationIdForStaffList:Subscription;
  deliveryVisitorLog:any[];
  p: number = 1;
  ShowRecords: string;
  PaginatedValue: number;
  setnoofrows: any;
  rowsToDisplay: any[];
  CurrentAssociationIdForStaffVisitorLogByDates:Subscription;

  constructor(private router: Router, private globalServiceService: GlobalServiceService
    , private modalService: BsModalService, private viewStaffService: ViewStaffService,
    private UsageReportService:UsageReportService,private globalService: GlobalServiceService) {
      this.ShowRecords = 'Show Records';
      this.setnoofrows = 10;
    this.EndDate = '';
    this.StartDate = '';
    this.WorkerNameList = [];
    this.deliveryVisitorLog=[];
    this.reportlists = [];
    this.WorkerID = '';
    this.baseUrl='data:image/png;base64,';
    this.PaginatedValue=10;
    this.currentAssociationIdForStaffList = this.globalServiceService.getCurrentAssociationIdForStaffList()
    .subscribe(data=>{
      console.log(data);
      //console.log(localStorage.getItem('StaffListCalledOnce'))
      //if(localStorage.getItem('StaffListCalledOnce')=='false'){
        this.StaffList();
      //}
    })
    this.rowsToDisplay = [{ 'Display': '5', 'Row': 5 },
      { 'Display': '10', 'Row': 10 },
      { 'Display': '15', 'Row': 15 },
      { 'Display': '50', 'Row': 50 },
      { 'Display': '100', 'Row': 100 },
      { 'Display': 'Show All Records', 'Row': 'All' }];
  }

  ngOnInit() {
    //this.StaffList();
    //
    this.deliveryVisitorLog=[];
    let usagereportrequestbody = {
      "StartDate": (this.StartDate == '')?'2019-04-01':this.StartDate,
      "EndDate": (this.EndDate == '')?formatDate(new Date(), 'yyyy-MM-dd', 'en'):this.EndDate,
      "ASAssnID": this.globalService.getCurrentAssociationId() //377
    }
    console.log(usagereportrequestbody);
    this.UsageReportService.GetVisitorLogByDates(usagereportrequestbody)
      .subscribe(data => {
        console.log(data);
        this.deliveryVisitorLog= data['data']['visitorlog'];
        this.deliveryVisitorLog = this.deliveryVisitorLog.filter(item=>{
          return item['vlVisType'] == "STAFF";
        })
        console.log(this.deliveryVisitorLog);
      },
        err => {
          console.log(err);
        })
    //
    this.CurrentAssociationIdForStaffVisitorLogByDates = this.globalService.getCurrentAssociationIdForVisitorLogByDates()
      .subscribe(res => {
        console.log(res);
        let usagereportrequestbody = {
          "StartDate": (this.StartDate == '') ? '2019-04-01' : this.StartDate,
          "EndDate": (this.EndDate == '') ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : this.EndDate,
          "ASAssnID": this.globalService.getCurrentAssociationId() //377
        }
        console.log(usagereportrequestbody);
        this.UsageReportService.GetVisitorLogByDates(usagereportrequestbody)
          .subscribe(data => {
            console.log(data);
            this.deliveryVisitorLog= data['data']['visitorlog'];
            this.deliveryVisitorLog = this.deliveryVisitorLog.filter(item=>{
              return item['vlVisType'] == "Delivery";
            })
          },
            err => {
              console.log(err);
            })
      })
  }
  goToInvoice(){
    
  }
  StaffList() {
    //localStorage.setItem('StaffListCalledOnce','true')      
    this.viewStaffService.GetStaffList()
      .subscribe(data => {
        console.log(data);
        if(data['data']['errorResponse'])
        {
          if(data['data']['errorResponse']['message']){
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

  OpenModalForReport(Reporttemplate: TemplateRef<any>, wkWorkID) {
    //console.log(wkWorkID);
    let Data = {
      "StartDate": this.StartDate,
      "EndDate": this.EndDate,
      "wkWorkID": wkWorkID
    }
    this.viewStaffService.getStaffReport(Data)
      .subscribe(data => {
        //console.log(data);
        this.reportlists = data['data']['worker'];
        //console.log(this.reportlists);
      },
        err => {
          //console.log(err);
        })
    this.modalRef = this.modalService.show(Reporttemplate, Object.assign({}, { class: 'gray modal-lg' }));
  }
  goToStaffs() {
    this.router.navigate(['staffs']);
  }
  goToGuests() {
    this.router.navigate(['visitors']);
  }
  goToDelivery() {
    this.router.navigate(['deliveries']);
  }
  goToAdminDeliveryScreen(){
    this.router.navigate(['admindeleveryscreen']);
  }
  goToAdminStaffScreen(){
    this.router.navigate(['adminstaffscreen']);
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
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.deliveryVisitorLog.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }

}
