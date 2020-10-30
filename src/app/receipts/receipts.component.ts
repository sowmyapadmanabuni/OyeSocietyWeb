import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {GlobalServiceService} from '../global-service.service';
import {ViewReceiptService} from '../../services/view-receipt.service';
import { GenerateReceiptService } from '../../services/generate-receipt.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { DashBoardService } from '../../services/dash-board.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { AddExpenseService } from '../../services/add-expense.service';
import * as _ from 'lodash';


declare var $: any;

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
  viewPayments: object[];
  viewPaymentList:any[];
  modalRef: BsModalRef;
  currentAssociationID: string;
  unitIdentifier:any;
  invoiceNumber:any;
  pymtDate:any;
  amountPaid:any;
  allBlocksByAssnID: any[];
  unpaidUnits: any[];
  p: number=1;
  UnitNameForDisplay:any;
  searchTxt:any;
  UnitName: any;
  InvoiceNum: any;
  AmountPaid: any;
  AmountDue: any;
  paymentDate: any;
  associationTotalMembers:any[];
  Balance: any;
  currentAssociationIdForReceipts:Subscription;
  ReceiptStartDate:any;
  localMrmRoleId: any;
  setnoofrows:any;
  rowsToDisplay:any[];
  allBlocksLists:any[];
  currentBlockName:any;
  ShowRecords: string;
  columnName: any;
  pyRefNo: any;
  pyVoucherNo: any;
  toggleUL:boolean;
  bsConfig:any;
  isDateFieldEmpty: boolean;
  associationAddress: any;
  PaginatedValue: number;
  PaymentInstrument: string;
  pyBkDet: any;

  constructor(private modalService: BsModalService,
    public globalservice:GlobalServiceService,
    public dashBrdService: DashBoardService,
    private viewreceiptservice:ViewReceiptService,
    public addexpenseservice:AddExpenseService,
    private router:Router,
    public generatereceiptservice: GenerateReceiptService,
    private route: ActivatedRoute) 
    { 
      this.pyBkDet='';
      this.PaginatedValue=10;
      this.isDateFieldEmpty=false;
      this.toggleUL=false;
      this.globalservice.IsEnrollAssociationStarted==true;
      this.currentBlockName="";
      this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='Show Records';
      this.route.params.subscribe(data => {
        console.log(data);
        this.localMrmRoleId=data['mrmroleId'];
      });
      
      this.currentAssociationID=this.globalservice.getCurrentAssociationId();
      this.GetAssnAddress(this.currentAssociationID);
      this.unitIdentifier='';
      this.invoiceNumber='';
      this.pymtDate='';
      this.amountPaid='';
      this.unpaidUnits=[];
      this.UnitNameForDisplay='';
      this.viewPaymentList=[];
      //
      this.currentAssociationIdForReceipts=this.globalservice.getCurrentAssociationIdForReceipts()
      .subscribe(msg=>{
        console.log(msg);
        //this.globalservice.setCurrentAssociationId(msg['msg']);
        this.initialiseReceipts();
      })
      this.bsConfig = Object.assign({}, {
        //containerClass: 'theme-orange',
        dateInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        isAnimated: true
        });
      this.PaymentInstrument='';
    }

  ngOnInit() {
    this.getMembers();
    this.viewPayments=[];
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
    .subscribe(data=>{
      console.log(data['data']['payments']);
      //this.viewPayments=data['data']['payments']
      this.viewPaymentList=data['data']['payments']
    });
    this.generatereceiptservice.GetBlockListByAssocID(this.currentAssociationID)
    .subscribe(data => {
      this.allBlocksByAssnID = data['data'].blocksByAssoc;
      console.log('allBlocksByAssnID', this.allBlocksByAssnID);
    });

    this.addexpenseservice.GetBlockListByAssocID(this.globalservice.getCurrentAssociationId())
    .subscribe(item => {
      this.allBlocksLists = item;
      console.log('allBlocksLists', this.allBlocksLists);
    });
  }
  initialiseReceipts(){
    this.viewPayments=[];
    this.allBlocksLists=[];
    this.currentBlockName='';
    this.viewreceiptservice.getpaymentlist(this.globalservice.getCurrentAssociationId())
    .subscribe(data=>{
      console.log(data['data']['payments']);
      this.viewPayments=data['data']['payments']
    },
    err=>{
      this.viewPayments=[];
      console.log(err);
    });
    //
    this.addexpenseservice.GetBlockListByAssocID(this.globalservice.getCurrentAssociationId())
    .subscribe(item => {
      this.allBlocksLists = item;
      console.log('allBlocksLists', this.allBlocksLists);
    },
    err=>{
      this.allBlocksLists=[];
      console.log(err);
    });
    //
  this.getMembers();
  }
  goToExpense(){
    this.router.navigate(['expense']);
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  goToInvoice(){
    this.router.navigate(['invoice']);
  }
  goToResidentInvoice(){
    this.router.navigate(['invoice',2]);
  }
  goToReceipts(){
    this.generatereceiptservice.enableReceiptListView=true;
    this.generatereceiptservice.enableGenerateReceiptView=false;
    //this.router.navigate(['receipts']);
  }
  goToVehicles(){
    this.router.navigate(['vehicles']);
  }
  ngAfterViewInit() {
    $(".se-pre-con").fadeOut("slow");
    // $(document).ready(function () {
    //   $('#example').DataTable();
    // });
  }
  getCurrentBlockName(blBlkName,blBlockID) {
    this.currentBlockName = blBlkName;
    this.toggleUL=true;
    this.viewPayments=[];
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
    .subscribe(data=>{
      console.log(data['data']['payments']);
      console.log(blBlockID);
      this.viewPayments=data['data']['payments']
      this.viewPayments = this.viewPayments.filter(item=>{
        //console.log(item['blBlockID']);
        return item['blBlockID'] == blBlockID;
      })
      this.viewPayments = _.sortBy(this.viewPayments,'pydCreated').reverse();
    });
  }
  gotoGenerateReceipt(){
    this.router.navigate(['home/generatereceipt']);
  }
  generateReceipt(){
    this.generatereceiptservice.enableReceiptListView=false;
    this.generatereceiptservice.enableGenerateReceiptView=true;
  }
  OpenViewReceiptModal(Receipts: TemplateRef<any>,unUnitID,inNumber,pydCreated,pyAmtPaid,unUniName,pyAmtDue,pyBal,pyRefNo,pyVoucherNo,pmid,pyBkDet){
    this.UnitName=unUniName;
    this.InvoiceNum=inNumber;
    this.paymentDate=pydCreated;
    this.AmountDue=pyAmtDue;
    this.AmountPaid=pyAmtPaid;
    this.Balance=pyBal;
    this.pyRefNo=pyRefNo;
    this.pyVoucherNo=pyVoucherNo;
    this.pyBkDet=pyBkDet;
    console.log(pmid);
   /* switch (pmid) {
      case '1':
        this.PaymentInstrument = "Cash";
        break;
      case '2':
        this.PaymentInstrument = "Cheque";
        break;
      case '3':
        this.PaymentInstrument = "Demand Draft";
        break;
    } */
    this.PaymentInstrument = pmid;
    this.modalRef = this.modalService.show(Receipts,Object.assign({}, { class: 'gray modal-md' }));
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
  viewReceipt(unitIdentifier, invoiceNumber, pymtDate, amountPaid) {
    console.log(unitIdentifier, invoiceNumber, pymtDate, amountPaid);
    this.unitIdentifier = unitIdentifier;
    this.invoiceNumber = invoiceNumber;
    this.pymtDate = pymtDate;
    this.amountPaid = amountPaid;
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
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.viewPayments.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }  }
  getMembers() {
    this.associationTotalMembers = [];
    this.UnitNameForDisplay='';
      this.dashBrdService.GetUnitListCount(this.globalservice.getCurrentAssociationId())
        .subscribe(data => {
          console.log(data['data']['unit']);
          this.associationTotalMembers = data['data']['unit'];
        },
          err => {
            console.log(err);
          })
  }
  printInvoice() {
    window.print();
  }
  getCurrentUnitDetails(unUnitID,unUniName){
    console.log(this.viewPaymentList);
    console.log(unUnitID);
    this.UnitNameForDisplay=unUniName;
    this.viewPayments=this.viewPaymentList;
    this.viewPayments = this.viewPayments.filter(item => {
      return item['unUniName'] == unUniName;
    })
    console.log(this.viewPayments)
  }
  convert(){

    let doc = new jsPDF();
    let head = ["Unit", "Invoice Number","Payment Date","Amount"];
    let body = [];

    /* The following array of object as response from the API req  */

  /*  var itemNew = [
      { id: 'Case Number', name: '101111111' },
      { id: 'Patient Name', name: 'UAT DR' },
      { id: 'Hospital Name', name: 'Dr Abcd' }
    ] */


    this.viewPayments.forEach(element => {
      let temp = [element['unUniName'], element['inNumber'], formatDate(element['pyDate'], 'dd/MM/yyyy', 'en') , 'Rs.'+ element['pyAmtPaid']];
      body.push(temp);
    });
    console.log(body);
    doc.autoTable({ head: [head], body: body });
    doc.save('Receipt.pdf');
  }
  getReceiptListByDateRange(ReceiptEndDate){
    console.log(ReceiptEndDate);
    if (ReceiptEndDate != null) {
      console.log(this.viewPayments);
      this.viewPayments = this.viewPaymentList;
      console.log(new Date(this.ReceiptStartDate).getTime());
      //console.log(formatDate(this.ExpenseEndDate, 'dd/MM/yyyy', 'en'));
      console.log(new Date(ReceiptEndDate).getTime());
      this.viewPayments = this.viewPayments.filter(item => {
        if (new Date(formatDate(this.ReceiptStartDate,'MM/dd/yyyy','en')) <= new Date(formatDate(item['pydCreated'],'MM/dd/yyyy','en')) && new Date(formatDate(ReceiptEndDate,'MM/dd/yyyy','en')) >= new Date(formatDate(item['pydCreated'],'MM/dd/yyyy','en'))) {
          console.log(new Date(item['pydCreated']).getTime());
        }
        //return (new Date(this.ReceiptStartDate).getTime() <= new Date(item['pydCreated']).getTime() && new Date(ReceiptEndDate).getTime() >= new Date(item['pydCreated']).getTime());
        return new Date(formatDate(this.ReceiptStartDate,'MM/dd/yyyy','en')) <= new Date(formatDate(item['pydCreated'],'MM/dd/yyyy','en')) && new Date(formatDate(ReceiptEndDate,'MM/dd/yyyy','en')) >= new Date(formatDate(item['pydCreated'],'MM/dd/yyyy','en'));

      })
      console.log(this.viewPayments);
    }
  }
  validateDate(event, StartDate, EndDate) {
    this.isDateFieldEmpty=false;
    console.log(StartDate.value, EndDate.value);
    if (event.keyCode == 8) {
      if ((StartDate.value == '' || StartDate.value == null) && (EndDate.value == '' || EndDate.value == null)) {
        console.log('test');
        this.isDateFieldEmpty=true;
        this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
        .subscribe(data=>{
          console.log(data['data']['payments']);
          this.viewPayments=data['data']['payments']
          this.viewPaymentList=data['data']['payments']
        });
      }
    }
  }
  GetReceiptList(){
    if(this.isDateFieldEmpty==true){
      this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
      .subscribe(data=>{
        console.log(data['data']['payments']);
        this.viewPayments=data['data']['payments']
        this.viewPaymentList=data['data']['payments']
      });
    }
  }
  GetAssnAddress(currentAssociationID){
    this.viewreceiptservice.getAssociationAddress(currentAssociationID)
    .subscribe(data=>{
    this.associationAddress=data['data']['association']['asAddress'];
    console.log(this.associationAddress);
    },
    err=>{
    console.log(err);
    })
    }
}
