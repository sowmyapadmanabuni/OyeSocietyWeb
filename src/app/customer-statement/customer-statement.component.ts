import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewreportService } from '../../services/viewreport.service';
import { GlobalServiceService } from '../global-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DashBoardService } from '../../services/dash-board.service';
import { Subscription } from 'rxjs';
import {ViewInvoiceService} from '../../services/view-invoice.service'


@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.css']
})
export class CustomerStatementComponent implements OnInit {

  custpanel: boolean;
  custtable: boolean;
  displaypaymentdetails: any[];
  allpaymentdetails: any[];
  reportID: string;
  currentAssociationID: string;
  frequencys: any[];
  currentAssociationName: any;
  PaymentStatus:any;
  modalRef: BsModalRef;
  p: number=1;
  searchTxt:any;
  associationTotalMembers:any[];
  newAllPaymentList:any[];
  UnitNameForDisplay:any;
  CurrentAssociationIdForCustomerStatement:Subscription;
  pyDate: any;
  acAccntID: any;
  pyBal: any;
  pyAmtDue: any;
  inNumber: any;
  pyDesc: any;
  pyAmtPaid: any;
  ResidentName: any;
  ResidentLastName: any;
  ResidentMobileNum: any;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords:any;
  columnName: any;
  PaginatedValue: number;
  allpaymentdetailsTemp:any[];

  constructor(private viewreportservice: ViewreportService,
    public dashBrdService: DashBoardService,
    public viewInvoiceService: ViewInvoiceService,
    public globalservice: GlobalServiceService,private modalService: BsModalService) {
      this.allpaymentdetailsTemp=[];
      this.PaginatedValue=10;
      this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='Show Records';
      this.acAccntID=0;
      this.pyBal=0;
    this.frequencys = [
      { "name": "Paid", "displayName": "Paid" },
      { "name": "UnPaid", "displayName": "UnPaid" }
    ];
    this.currentAssociationName = this.globalservice.getCurrentAssociationName();
    this.reportID = '';
    this.PaymentStatus='Select Payment Status';
    console.log(this.globalservice.getCurrentAssociationName());
    this.associationTotalMembers=[];
    this.newAllPaymentList=[];
    this.UnitNameForDisplay='';
    this.CurrentAssociationIdForCustomerStatement=this.globalservice.getCurrentAssociationIdForCustomerStatement()
    .subscribe(msg=>{
      this.globalservice.setCurrentAssociationId(msg['msg']);
      this.initialiseCustomerStatement();
    })
  }

  getPaidUnpaidDetail(reportID) {
    console.log('reportID', reportID);
    this.PaymentStatus=reportID;
    this.allpaymentdetails = this.allpaymentdetailsTemp;
    //this.allpaymentdetails=this.displaypaymentdetails;
    this.allpaymentdetails = this.allpaymentdetails.filter(item => {
      return item['pyStat'] == reportID;
    })
  }
  getpaymentdetails() {
    this.viewreportservice.getpaymentdetails(this.currentAssociationID).subscribe((data) => {
      this.allpaymentdetails = data['data']['payments'];
      this.displaypaymentdetails = data['data']['payments'];
      
      console.log('allpaymentdetails', this.allpaymentdetails);
    })
  }

  ngOnInit() {
    this.custpanel = false;
    this.custtable = true;
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    this.getpaymentdetails();
    this.getMembers();
  }

  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  initialiseCustomerStatement() {
    this.UnitNameForDisplay='';
    this.PaymentStatus='Select Payment Status';
    this.displaypaymentdetails=[];
    this.allpaymentdetails=[];
    this.viewreportservice.getpaymentdetails(this.globalservice.getCurrentAssociationId()).subscribe((data) => {
      this.allpaymentdetails = data['data']['payments'];
      console.log('allpaymentdetails', this.allpaymentdetails);
    })
    this.getMembers();
  }
  setRows(RowNum) {
    this.ShowRecords='abc';
    this.setnoofrows = (RowNum=='All'?'All Records':RowNum);
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
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if((event['srcElement']['text'] != undefined) && (event['srcElement']['text'] != '»') && (event['srcElement']['text'] != '1') && (Number(event['srcElement']['text']) == NaN)){
        //console.log('test');
        //console.log(Number(event['srcElement']['text']) == NaN);
        //console.log(Number(event['srcElement']['text']));
        let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
        this.p= Number(element.children[0]['text']);
      //console.log(this.p);
    } 
    if(event['srcElement']['text'] == '«'){
      //console.log(this.p);
      this.p= 1;
    }
    //console.log(this.p);
    let element=document.querySelector('.page-item.active');
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
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.allpaymentdetails.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }  }
  viewCustDetail() {
    this.custpanel = true;
    this.custtable = false;
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  OpenCustomerModel(customertemplate: TemplateRef<any>,pyDate,acAccntID,pyBal,pyAmtDue,inNumber,pyDesc,pyAmtPaid,pyStat,unUnitID){
    console.log(pyDate);
    console.log(acAccntID);
    console.log(pyBal);
    console.log(pyAmtDue);
    console.log(inNumber);
    console.log(pyDesc);
    console.log(pyAmtPaid);
    console.log(unUnitID);
    console.log(pyStat);
    this.pyDate=pyDate;
    this.acAccntID=acAccntID;
    this.pyBal=pyBal;
    this.pyAmtDue=pyAmtDue;
    this.inNumber=inNumber;
    this.pyDesc=pyDesc;
    this.pyAmtPaid=pyAmtPaid;
    // Fetch unit owner details start here
    //http://apiuat.oyespace.com/oyeliving/api/v1/Unit/GetUnitListByUnitID/40853
    this.viewInvoiceService.GetUnitListByUnitID(unUnitID)
    .subscribe(data=>{
      console.log(data);
      
      if(data['data']['unit']['owner'].length!=0){
        this.ResidentName=data['data']['unit']['owner'][0]['uofName'];
        this.ResidentLastName=data['data']['unit']['owner'][0]['uolName'];
        this.ResidentMobileNum=data['data']['unit']['owner'][0]['uoMobile']
      }
      else if(data['data']['unit']['tenant'].length!=0){
        this.ResidentName=data['data']['unit']['tenant'][0]['utfName'];
        this.ResidentLastName=data['data']['unit']['tenant'][0]['utlName'];
        this.ResidentMobileNum=data['data']['unit']['tenant'][0]['utMobile']
      }
      else{
        this.ResidentName='';
        this.ResidentMobileNum='';
      }
    },
    err=>{
      console.log(err);
    })
    // Fetch unit owner details end here
    this.modalRef = this.modalService.show(customertemplate,
      Object.assign({}, { class: 'gray modal-lg' }));
  }
  getMembers() {
    this.associationTotalMembers = [];
      this.dashBrdService.GetUnitListCount(this.globalservice.getCurrentAssociationId())
        .subscribe(data => {
          console.log(data['data']['unit']);
          this.associationTotalMembers = data['data']['unit'];
        },
          err => {
            console.log(err);
          })
  }
  getCurrentUnitDetails(unUnitID,unUniName){
    this.allpaymentdetailsTemp =[];
    this.UnitNameForDisplay=unUniName;
    console.log(this.displaypaymentdetails);
    this.allpaymentdetails=this.displaypaymentdetails;
    this.allpaymentdetails = this.allpaymentdetails.filter(item => {
      return item['unUnitID'] == unUnitID;
    })
    this.allpaymentdetailsTemp = this.allpaymentdetails;
    console.log(this.allpaymentdetails)
  }
}
