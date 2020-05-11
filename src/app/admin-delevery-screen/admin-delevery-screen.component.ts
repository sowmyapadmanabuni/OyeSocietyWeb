import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { ViewDeliveryService } from '../../services/view-delivery.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { UsageReportService } from 'src/services/usage-report.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-delevery-screen',
  templateUrl: './admin-delevery-screen.component.html',
  styleUrls: ['./admin-delevery-screen.component.css']
})
export class AdminDeleveryScreenComponent implements OnInit {

  deliveryList: any[];
  deliveryListTmp:any[];
  deliveryListLength: boolean;
  EndDate: any;
  StartDate: any;
  searchTxt:any;
  todayDate:any;
  bsConfig:any;
  p: number = 1;
  ShowRecords: any;
  PaginatedValue: number;
  setnoofrows: any;
  rowsToDisplay: any[];
  isDateFieldEmpty:boolean;
  maxDate: Date;
  CurrentAssociationIdForVisitorLogByDates:Subscription;
  deliveryVisitorLog:any[];

  constructor(private globalService: GlobalServiceService, private deliveryService: ViewDeliveryService,
    private modalService: BsModalService,private UsageReportService:UsageReportService,
    private router: Router) {
      //$(".se-pre-con").show();
      this.maxDate = new Date();
      this.isDateFieldEmpty=false;
      this.deliveryListTmp=[];
      this.deliveryVisitorLog=[];
      this.rowsToDisplay = [{ 'Display': '5', 'Row': 5 },
      { 'Display': '10', 'Row': 10 },
      { 'Display': '15', 'Row': 15 },
      { 'Display': '50', 'Row': 50 },
      { 'Display': '100', 'Row': 100 },
      { 'Display': 'Show All Records', 'Row': 'All' }];
      this.PaginatedValue=10;
      this.ShowRecords = 'Show Records';
      this.setnoofrows = 10;
    this.deliveryList = [];
    this.deliveryListLength = false;
    this.EndDate = '';
    this.StartDate = ''
    this.bsConfig = Object.assign({}, {
      // containerClass: 'theme-orange',
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
      });
      this.deliveryVisitorLog=[];
  }

  ngOnInit() {
    this.deliveryVisitorLog=[];
    let e = '';
    //this.getVisitorList(e);
    //
    this.UsageReportService.GetVisitorLogList()
      .subscribe(data => {
        console.log(data);
      },
        err => {
          console.log(err);
        }) 
    //
    let usagereportrequestbody = {
      "StartDate": (this.StartDate == '')?'2019-04-01':this.StartDate,
      "EndDate": (this.EndDate == '')?formatDate(new Date(), 'yyyy-MM-dd', 'en'):this.EndDate,
      "ASAssnID": 377 // this.globalService.getCurrentAssociationId()
    }
    console.log(usagereportrequestbody);
    this.UsageReportService.GetVisitorLogByDates(usagereportrequestbody)
      .subscribe(data => {
        console.log(data);
        this.deliveryVisitorLog= data['data']['visitorlog'];
        this.deliveryVisitorLog = this.deliveryVisitorLog.filter(item=>{
          return item['vlVisType'] == "Delivery";
        })
        console.log(this.deliveryVisitorLog);
      },
        err => {
          console.log(err);
        })
    //
    this.CurrentAssociationIdForVisitorLogByDates = this.globalService.getCurrentAssociationIdForVisitorLogByDates()
      .subscribe(res => {
        console.log(res);
        let usagereportrequestbody = {
          "StartDate": (this.StartDate == '') ? '2019-04-01' : this.StartDate,
          "EndDate": (this.EndDate == '') ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : this.EndDate,
          "ASAssnID": 377 // this.globalService.getCurrentAssociationId()
        }
        console.log(usagereportrequestbody);
        this.UsageReportService.GetVisitorLogByDates(usagereportrequestbody)
          .subscribe(data => {
            console.log(data);
          },
            err => {
              console.log(err);
            })
      })
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
  getVisitorList(e:any) {
    //console.log(e);
    this.EndDate=e;
    let date = {
      "StartDate": this.StartDate,
      "EndDate": this.EndDate
    }
    //console.log(date);
    this.deliveryService.getVisitorList(date)
      .subscribe(data => {
        $(".se-pre-con").fadeOut("slow");
        console.log(data);
        this.deliveryList = data['data']['visitorlog'];
        this.deliveryListTmp = data['data']['visitorlog'];
        //console.log(this.deliveryList);
        if (this.deliveryList.length > 0) {
          $(".se-pre-con").fadeOut("slow");
          this.deliveryListLength = true;
        }
      },
        err => {
          console.log(err);
        }
      )
  }
  validateDate(event, StartDate, EndDate) {
    this.isDateFieldEmpty=false;
    console.log(StartDate.value, EndDate.value);
    if (event.keyCode == 8) {
      if ((StartDate.value == '' || StartDate.value == null) && (EndDate.value == '' || EndDate.value == null)) {
        console.log('test');
        this.isDateFieldEmpty=true;
        this.getVisitorList('');
      }
    }
  }
  GetDeleveriesList(){
    if(this.isDateFieldEmpty==true){
      this.getVisitorList('');
    }
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
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.deliveryList.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }

}
