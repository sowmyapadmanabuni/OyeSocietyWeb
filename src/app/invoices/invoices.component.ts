import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ViewInvoiceService } from '../../services/view-invoice.service';
import { BlocksByAssoc } from '../models/blocks-by-assoc';
import { AssociationDetails } from '../models/association-details';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { GenerateReceiptService } from '../../services/generate-receipt.service';
import { PaymentService } from '../../services/payment.service';
import { HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import {ViewReceiptService} from '../../services/view-receipt.service';
declare var $: any;
import { Subscription } from 'rxjs';
import { ViewUnitService } from '../../services/view-unit.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as _ from 'lodash';
import {InvoiceDescriptionListOne} from '../models/invoice-description-list-one';
import {InvoiceDescriptionListTwo} from '../models/invoice-description-list-two';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  allBlocksByAssnID: BlocksByAssoc[];
  allblocksbyassnid: BlocksByAssoc[];
  currentPage: number;
  pageSize: number;
  invoiceLists: any[];
  associationDetails: AssociationDetails;
  invoiceID: string;
  invoiceDate: Date;
  invoiceNumber: string;
  discountedValue: number;
  unitID: number;
  singleUnitDetails: object;
  OwnerFirstName: string;
  OwnerLastName: string;
  OwnerEmail: string;
  paymentDueDate: Date;
  previousDue: number;
  amountInWords: number;
  hasnumber: boolean;
  showGateWay: boolean;
  invValFinal: any;
  mainAmt: number;
  currentAssociationID: string;
  UnitName:any;
  storeId: string;
  sharedSecret: string;
  charge: string;
  currency: string;
  timezone: Date;
  strPayOnly: string;
  strLanguage: string;
  strMerchantTransactionId: string;
  responseSuccessURL: string;
  responseFailURL: string;
  strTxntype: string;
  calculatedIPGUtilHash: string;
  blBlockID: string;
  modalRef: BsModalRef;
  modalRefForGenerateRecipt: BsModalRef;
  asdPyDate: string;
  blMgrMobile: string;
  allLineItem: any[];
  subTotal: number;
  totals: number;
  dscntInvinvoiceID: number;
  dscntInvinvoiceNumber: number;
  dscntInvdescription: string;
  dscntInvdiscountedAmount: number;
  totalAmountForValidation: number;
  validationResult: boolean;
  blockid: number;
  p: number;
  isChecked: boolean;
  checkAll: boolean;
  description: string;

  securityfee: number;
  housekeepingfee: number;
  generatorfee: number;
  corpusfee: number;
  commonareafee: number;
  fixedmaintenancefee: number;
  watermeterfee: number;
  unsoldrentalfees: number;
  onetimemembershipfee: number;
  onetimeoccupancyfees: number;
  rentingfees: number;
  OneTimeOnBoardingFees: number;
  InvoiceValue: number;
  iciciPayForm: any = {};
  kotakPayForm: any = {};

  invoiceDetails: object[];
  paymentmethod:any;
  blkBlockID:any;
  bankname:any;
  minPaymentDateDate:Date;
  maxPaymentDateDate:Date;
  paymentDate:any;

  currentassociationname: string;
  @ViewChild('template', { static: true }) private template: TemplateRef<any>;
  @ViewChild('generateinvoicemodal', { static: true }) private generateinvoicemodal: TemplateRef<any>;
  @ViewChild('iciciform', { read: ElementRef, static: true }) iciciform: ElementRef;
  @ViewChild('kotakform', { read: ElementRef, static: true }) kotakform: ElementRef;

  _unOcStat: string;
  _ineSent: boolean;

  order: string = 'unUnitID';
  reverse: boolean = false;
  sortedCollection: any[];
  unpaidUnits: any[];
  payopt: boolean;
  CurrentBlockName: any;
  invoice: any;
  amountDue: any;
  amountPaid: number;
  MEMemID: string;
  PYRefNo: string;
  PMID: string;
  unUnitID: any;
  BankName: any;
  bankList: string[];
  voucherNo: string;
  PymtRefNo: string;
  ddNo: string;
  allUnitBYBlockID:any[];
  chequeNo: string;
  PaidUnpaidinvoiceLists:any[];
  PaidUnpaidinvoiceListsTemp:any[];
  residentInvoiceList:any[];
  toggle:any;
  invoicenumber:any;
  totalAmountDue:any;
  totalamountPaid:any;
  paymentMethodType:any;
  methodArray: object[];
  expensedataPMID:any;
  checkField: string;
  expensedataBABName:any;
  receiptUnitID:any;
  ravValFinal:any;
  chequeDate:any;
  pyid:any;
  paymentDescription:any;
  receiptVoucherNo:any;
  receiptddNo:any;
  bsConfig:any;
  minDemandDraftDate:any;
  receiptEXDDDate:any;
  receiptChequeNo:any;
  receiptChequeDate:any;
  searchTxt:any;
  viewPayments: object[];
  CurrentAssociationIdForInvoice:Subscription;
  GetResidentLevelInvoiceSubject:Subscription;
  localMrmRoleId: string;
  InvoiceStartDate:any;
  InvoiceEndDate:any;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords: string;
  columnName: any;
  toggleDrpdown: boolean;
  toggleUL: boolean;
  ValidateAmountPaid: boolean;
  ValidateReceiptModal:boolean;
  _discountedValue:number;
  UnitNameForViewReceipt: any;
  InvoiceNumForViewReceipt: any;
  paymentTypeInViewReceipt: any;
  AmountDueForViewReceipt: any;
  paymentDateForViewReceipt: any;
  isPaidForViewReceipt: any;
  isInValidZeroAmount: boolean;
  ValidateInvdescription:boolean;
  isDateFieldEmpty: boolean;
  PaginatedValue: number;
  disableGenerateReceipt:boolean;
  unUniName: any;
  associationAddress:any;
  moreDiscountedAmount: boolean;
  OwnerNameToShowOnInvoice: any;
  CreditOrDebit:any;
  InvoiceDescriptionListOne:InvoiceDescriptionListOne[];
  InvoiceDescriptionListTwo:InvoiceDescriptionListTwo[];

  constructor(public viewinvoiceservice: ViewInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public globalservice: GlobalServiceService,
    private router: Router,
    private orderpipe: OrderPipe,
    public viewUniService: ViewUnitService,
    private generatereceiptservice: GenerateReceiptService,
    private paymentService: PaymentService,
    private viewreceiptservice:ViewReceiptService,
    private route: ActivatedRoute,
    private ViewUnitService:ViewUnitService) {
    this.InvoiceDescriptionListOne=[];
    this.InvoiceDescriptionListTwo=[];
      this.CreditOrDebit='Credit';
      this.OwnerNameToShowOnInvoice='';
      this.moreDiscountedAmount=false;
    this.associationAddress='';
    this.unUniName = '';
    this.PaginatedValue = 10;
      this.isDateFieldEmpty=false;
      this.ValidateInvdescription=true;
      this.isInValidZeroAmount=true;
      this._discountedValue=0;
      this.ValidateAmountPaid=false;
      this.ValidateReceiptModal=true;
      this.toggleUL=false;
      this.allUnitBYBlockID=[];
      this.globalservice.IsEnrollAssociationStarted==false;
      this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='Show Records';
      this.receiptVoucherNo='';
      this.receiptChequeNo='';
      this.receiptChequeDate='';
      this.receiptddNo='';
      this.receiptEXDDDate='';
    // this.localMrmRoleId = this.route.snapshot.queryParamMap.get('mrmroleId');
    this.route.params.subscribe(data => {
      console.log(data);
      this.localMrmRoleId=data['mrmroleId'];
    });
    this.UnitName="";
    this.globalservice.getCurrentUnitName(),
    this.globalservice.getCurrentUnitId(),
    console.log(this.globalservice.getCurrentUnitName());
    console.log(this.globalservice.getCurrentUnitId());

    this.currentPage = 1;
    this.pageSize = 10;
    this.previousDue = 0.00;
    this.amountInWords = 0;
    this.hasnumber = false;
    this.showGateWay = false;
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    this.currentassociationname = this.globalservice.getCurrentAssociationName();
    this.blBlockID = '';
    this.validationResult = true;
    this.p = 1;
    this.isChecked = false;
    this._unOcStat = '';
    this._ineSent = false;
    this.CurrentBlockName = 'Blocks';
    this.unUnitID = 'Units';
    this.BankName = 'Bank';
    this.viewinvoiceservice.invoiceBlock = '';
    this.PaidUnpaidinvoiceLists=[];
    this.PaidUnpaidinvoiceListsTemp=[];
    this.residentInvoiceList=[];
    this.toggle='All';
    this.paymentMethodType='Select Payment Method';
    this.disableGenerateReceipt=true;
    this.expensedataBABName='Bank';
    this.viewPayments = [];
    this.minPaymentDateDate = new Date();
    this.maxPaymentDateDate = new Date();
    this.minPaymentDateDate.setFullYear(2000);
    this.maxPaymentDateDate.setFullYear(2040);
    this.bankList = [
      'Allahabad Bank',
      'Andhra Bank',
      'Bank of Baroda',
      'Bank of India',
      'Bank of Maharashtra',
      'Canara Bank',
      'Central Bank of India',
      'Corporation Bank',
      'Indian Bank',
      'Indian Overseas Bank',
      'Oriental Bank of Commerce',
      'Punjab and Sind Bank',
      'Punjab National Bank',
      'State Bank of India',
      'Syndicate Bank',
      'UCO Bank',
      'Union Bank of India',
      'United Bank of India',
      'Catholic Syrian Bank',
      'City Union Bank',
      'DCB Bank',
      'Dhanlaxmi Bank',
      'Federal Bank',
      'HDFC Bank',
      'ICICI Bank',
      'IDFC First Bank',
      'IndusInd Bank',
      'Jammu & Kashmir Bank',
      'Karnataka Bank',
      'Karur Vysya Bank',
      'Kotak Mahindra Bank',
      'Lakshmi Vilas Bank',
      'Nainital Bank',
      'RBL Bank',
      'South Indian Bank',
      'Tamilnad Mercantile Bank Limited',
      'Yes Bank',
      'IDBI Bank'
    ]

    this.methodArray = [{ 'name': 'Cash', 'displayName': 'Cash', 'id': 1 },
    { 'name': 'Cheque', 'displayName': 'Cheque', 'id': 2 },
    { 'name': 'DemandDraft', 'displayName': 'DemandDraft', 'id': 3 },
    { 'name': 'OnlinePay', 'displayName': 'OnlinePay', 'id': 4 }]
    //
    this.CurrentAssociationIdForInvoice=this.globalservice.getCurrentAssociationIdForInvoice()
    .subscribe(msg=>{
      console.log(msg);
      this.globalservice.setCurrentAssociationId(msg['msg']);
      this.initialiseInvoice()
    })
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
      });
    this.GetResidentLevelInvoiceSubject = this.globalservice.getResidentLevelInvoice()
      .subscribe(data => {
        this.DisplayResidentLevelInvoice();
      })
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
  setResidentRows(RowNum) {
    this.ShowRecords='abc';
    this.setnoofrows = (RowNum=='All'?'All Records':RowNum);
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  goToExpense() {
    this.router.navigate(['expense']);
  }
  NavigateToBulkUpload(){
    this.router.navigate(['excelreceipt'])
  }
  goToInvoice() {
    this.router.navigate(['invoice']);
  }
  goToReceipts() {
    this.router.navigate(['receipts']);
  }
  goToResidentReceipts() {
    this.router.navigate(['receipts',2]);
  }
  goToVehicles() {
    this.router.navigate(['vehicles']);
  }
  ngAfterViewInit() {
    $('#pay').click(function () {
      $(this).toggleClass('.pay');
      $(this).toggleClass('.pay1');
    });
    //
    // if (this.viewinvoiceservice.invoiceBlock == '') {
    //   alert('test');
    //   this.toggleDrpdown = true;
    // }
    $(".se-pre-con").fadeOut("slow");
  }
  ngOnInit() {
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
      .subscribe(data => {
        console.log(data['data']['payments']);
        this.viewPayments = data['data']['payments']
      });
    //
    this.payopt = false;
    console.log('this.currentAssociationID', this.currentAssociationID);
    this.viewinvoiceservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        this.allBlocksByAssnID = data;
        this.asdPyDate = this.allBlocksByAssnID[0]['asdPyDate'];
        this.blMgrMobile = this.allBlocksByAssnID[0]['blMgrMobile'];
        console.log('allBlocksByAssnID', this.allBlocksByAssnID);
        if (this.viewinvoiceservice.invoiceBlock != '') {
          this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId, this.viewinvoiceservice.invoiceBlock);
        }
      })
    //
    if (this.globalservice.mrmroleId != 1 || this.localMrmRoleId == '2') {
      this.ViewUnitService.getUnitDetails(this.globalservice.getCurrentAssociationId())
        .subscribe(data => {
          console.log(this.globalservice.getCurrentUnitId());
          console.log(data);
          data['data']['unit'].forEach(item => {
            if (item['unUnitID'] == this.globalservice.getCurrentUnitId()) {
              this.viewinvoiceservice.getCurrentBlockDetails(item['blBlockID'], this.globalservice.getCurrentAssociationId())
                .subscribe(data => {
                  console.log(data);
                  this.residentInvoiceList = data['data']['invoices'];
                  this.PaidUnpaidinvoiceLists = this.residentInvoiceList;
                  this.PaidUnpaidinvoiceLists = _.sortBy(this.PaidUnpaidinvoiceLists, 'inGenDate').reverse();
                },
                  err => {
                    console.log(err);
                  })
            }
          })
        }, err => {
          console.log(err);
        })
    }
    //
    this.GetAssnAddress();
  }
  DisplayResidentLevelInvoice(){
    this.residentInvoiceList=[];
    this.PaidUnpaidinvoiceLists = [];
    this.viewinvoiceservice.invoicelistByUnitID(this.globalservice.getCurrentUnitId())
    .subscribe(data => {
      console.log(data);
      this.residentInvoiceList=data['data']['invoices'];
      this.PaidUnpaidinvoiceLists = this.residentInvoiceList;
    },
      err => {
        this.residentInvoiceList=[];
      this.PaidUnpaidinvoiceLists = [];
        console.log(err);
        /* swal.fire({
          title: "An error has occurred",
          text: `${err['error']['error']['message']}`,
          type: "error",
          confirmButtonColor: "#f69321"
        }); */
      })
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  getAmountPaid(event) {
    console.log(event.target.value);
    if(Number(event.target.value)>this.totalAmountDue){
      console.log('inside');
      this.ValidateAmountPaid=true;
      this.ValidateReceiptModal=true;
    }
    else{
      this.ValidateAmountPaid=false;
      if(Number(event.target.value)<=this.totalAmountDue){
        this.ValidateReceiptModal=false;
      }
    }
  }
  validateZeroAmount(){
    if(this.totalamountPaid==0){
      this.ValidateAmountPaid=true;
    }else{
      this.ValidateAmountPaid=false;
    }
  }
  OpenViewReceiptModal(ViewReceiptTemplate:TemplateRef<any>,unUnitID, inid, inNumber, inTotVal, inPaid, inDisType,indCreated){
    this.UnitNameForViewReceipt=unUnitID;
    this.InvoiceNumForViewReceipt=inNumber;
    this.paymentDateForViewReceipt=indCreated;
    //this.InvoiceNumForViewReceipt=inid;
    this.AmountDueForViewReceipt=inTotVal;
    this.paymentTypeInViewReceipt=inDisType;
    this.isPaidForViewReceipt=inPaid;

    this.modalRef = this.modalService.show(ViewReceiptTemplate,Object.assign({}, { class: 'gray modal-md' }));
  }
  getexpensedataBABName(bank) {
    this.expensedataBABName = bank;
  }
  iciciPay(e){

  }
  chkUnitLength(){
    //alert('test1');
    if(this.viewinvoiceservice.invoiceBlock == ''){
      alert('testt');
      this.toggleDrpdown=false;
      return true;
    }
    else{
      return false;
    }
  }
  onPaidUnpaidinvoiceListsKeypressd(){
    let element=null;
    console.log(this.searchTxt);
    if(this.searchTxt == ''){
      this.p=1;
      element = document.querySelector('.page-item.active');
      element.click();
    }
    this.PaidUnpaidinvoiceLists.forEach(item=>{
      if(item['unUniName'].toLowerCase()==this.searchTxt.toLowerCase()){
        element = document.querySelector('.page-item.active');
        console.log(element);
        console.log(typeof element);
        if(element == null){
          this.p=1;
        }
      }
    })
    if(element != null){
      console.log(element);
      element.click();
    }
  }
  onPaidUnpaidinvoiceListsKeypressdForResident(){
    let element=null;
    console.log(this.searchTxt);
    if(this.searchTxt == ''){
      this.p=1;
      element = document.querySelector('.page-item.active');
      element.click();
    }
    this.PaidUnpaidinvoiceLists.forEach(item=>{
      if(item['inNumber'].toLowerCase()==this.searchTxt.toLowerCase()){
        element = document.querySelector('.page-item.active');
        console.log(element);
        console.log(typeof element);
        if(element == null){
          this.p=1;
        }
      }
    })
    if(element != null){
      console.log(element);
      element.click();
    }
  }
  getCurrentBlockDetails(blBlockID, blBlkName) {
    this.p=1;
    this.toggleDrpdown=false;
    this.PaidUnpaidinvoiceLists=[];
    this.PaidUnpaidinvoiceListsTemp=[];
    this.UnitName='';
    this.viewinvoiceservice.invoiceBlock = blBlkName;
    this.viewinvoiceservice.invoiceBlockId = blBlockID;
    this.invoiceLists = [];
    this.blockid = blBlockID;
    console.log('blBlockID-' + blBlockID);
    this.viewinvoiceservice.getCurrentBlockDetails(blBlockID,this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        this.invoiceLists = data['data'].invoices;
        this.invoiceLists = _.sortBy(this.invoiceLists, 'inGenDate').reverse();
        //this.PaidUnpaidinvoiceLists=this.invoiceLists;
        this.invoiceLists.forEach(item=>{
          this.PaidUnpaidinvoiceLists.push({
            'unUnitID':item['unUnitID'], 
            'inNumber':item['inNumber'],
             'inGenDate':item['inGenDate'],
             'inTotVal':item['inTotVal'],
             'unUniName':item['unit']['unUniName'],
             'inid':item['inid'],
             'inDsCVal':item['inDsCVal'],
             'ineSent':item['ineSent'],
             'blBlockID':item['blBlockID'],
             'inAmtPaid':item['inAmtPaid'],
             'inPaid':item['inPaid']
          })
        })
        console.log('invoiceLists?', this.invoiceLists);
        this.PaidUnpaidinvoiceListsTemp = this.PaidUnpaidinvoiceLists;
        this.generatereceiptservice.ReceiptListArrayForComapreWithExcel=this.invoiceLists;
        //
        // this.sortedCollection = this.orderpipe.transform(this.invoiceLists, 'unUnitID');
        // console.log(this.sortedCollection);
        this.toggleUL=true;
      },
        err => {
          console.log(err);
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
        })
    this.isChecked = false;
    this.checkAll = false;
    this.getAllUnitDetailsByBlockID();
    this.chkUnitLength();
  }
  convert(){

    let doc = new jsPDF();
    let head = ["Invoice Number","Unit Name","Invoice Date","Amount"];
    let body = [];

    /* The following array of object as response from the API req  */

  /*  var itemNew = [
      { id: 'Case Number', name: '101111111' },
      { id: 'Patient Name', name: 'UAT DR' },
      { id: 'Hospital Name', name: 'Dr Abcd' }
    ] */


    this.invoiceLists.forEach(element => {
      let temp = [element['inNumber'],element['unit']['unUniName'], formatDate(element['inGenDate'], 'dd/MM/yyyy', 'en') , 'Rs.'+element['inTotVal']];
      body.push(temp);
    });
    console.log(body);
    doc.autoTable({ head: [head], body: body });
    doc.save('Invoice.pdf');
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  createReceipt() {

    if (this.voucherNo != '' || this.voucherNo != undefined) {
      this.PymtRefNo = this.voucherNo;
    } else if (this.ddNo != '' || this.ddNo != undefined) {
      this.PymtRefNo = this.ddNo;
    } else if (this.chequeNo != '' || this.chequeNo != undefined) {
      this.PymtRefNo = this.chequeNo;
    } else {
      this.PymtRefNo = '';
    }

    let newReceipt = {
      "MEMemID": "1",//this.MEMemID,
      "PYRefNo": this.PYRefNo,
      "PYBkDet": this.BankName,
      "PYAmtPaid": this.amountPaid,
      "INNumber": this.invoice,
      "UNUnitID": this.unitID,
      "PYTax": "12.6",
      "ASAssnID": this.currentAssociationID,
      "PMID": 1,//this.PMID,
      "PYDesc": "PaymentMade"
    }

    this.generatereceiptservice.addPayment(newReceipt)
      .subscribe(data => {
        console.log(data);
        swal.fire({
          title: "Receipt Generated Successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })

      },
        (err) => {
          console.log(err);
          swal.fire({
            title: `${err['error']['error']['message']}`,
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        })

  }

  viewInvoice1(event, invoicePop: TemplateRef<any>, inid, inGenDate, inNumber, inDsCVal, unUnitID,unUniName) {
    event.preventDefault();
    //alert('inside viewinvoice');
    console.log('inGenDate', inGenDate);
    console.log('inNumber', inNumber);
    console.log('inid', inid);
    console.log('inDsCVal', inDsCVal);
    console.log('unUnitID', unUnitID);
    console.log('unUniName', unUniName);

    this.securityfee = 0;
    this.housekeepingfee = 0;
    this.generatorfee = 0;
    this.corpusfee = 0;
    this.commonareafee = 0;
    this.fixedmaintenancefee = 0;
    this.watermeterfee = 0; ////
    this.unsoldrentalfees = 0;
    this.onetimemembershipfee = 0;
    this.onetimeoccupancyfees = 0;
    this.rentingfees = 0;
    this.OneTimeOnBoardingFees = 0;

    this.invoiceID = inid;
    this.invoiceDate = inGenDate;
    this.invoiceNumber = inNumber;
    this.discountedValue = inDsCVal;
    this.unitID = unUnitID;
    this.unUniName=unUniName;
    this.InvoiceDescriptionListOne=[];
    this.InvoiceDescriptionListTwo=[];

    this.viewinvoiceservice.GetUnitListByUnitID(this.unitID)
      .subscribe(data => {
        console.log('GetUnitListByUnitID', data);
        this.singleUnitDetails = data['data'].unit;
        if(data['data']['unit']['owner'].length>0){
          this.OwnerNameToShowOnInvoice = data['data']['unit'].owner[0].uofName;
          }
          else if(data['data']['unit']['tenant'].length>0){
          this.OwnerNameToShowOnInvoice = data['data']['unit'].tenant[0].utfName;
          }
          else{
          this.OwnerNameToShowOnInvoice = "Owner name is not updated";
          }

        if (data['data'].unit.owner.length > 0) {
          this.OwnerFirstName = data['data']['unit'].owner[0].uofName;
          this.OwnerLastName = data['data']['unit'].owner[0].uolName;
          this.OwnerEmail = data['data']['unit'].owner[0].uoEmail;
        }

      })

    this.viewinvoiceservice.viewInvoice(this.blockid, this.currentAssociationID)
      .subscribe(data => {
        console.log('InvoiceDetails+', data);
        //this.allLineItem = data['data'].invoiceDetails;
        console.log(data['data'].invoiceDetails);
      },
        data => {
          console.log('InvoiceDetails', data);
        })

    this.viewinvoiceservice.GetAmountBalance(unUnitID)
      .subscribe(data => {
        console.log('GetAmountBalance', data);
        //$scope.previousDue = response.data.data.balanceDue;
      },
        data => {
          console.log('GetAmountBalance', data);
          //previousDue=parseFloat(0.00);
        })

    this.viewinvoiceservice.invoiceDetails(inid, unUnitID)
      .subscribe(data => {
        this.InvoiceValue = 0;
        this._discountedValue=0;
        console.log('data--', data);
        console.log('invoiceDetails--', data['data']['invoice'][0]['invoiceDetails']);
        this.InvoiceValue = data['data']['invoice'][0]['inTotVal'];
        data['data']['invoice'][0]['invoiceDetails'].forEach(item => {
          if (item['idDesc'] != 'Discount Value') {
            this.InvoiceDescriptionListOne.push(new InvoiceDescriptionListOne(item['idDesc'], '-', item['idValue']))
          }
          if (item['idDesc'] == 'Discount Value') {
            this.InvoiceDescriptionListTwo.push(new InvoiceDescriptionListTwo(item['idDesc'], '-', item['idValue'],(data['data']['invoice'][0]['inDisType']=='Debit'?'+':'-')))
          }
        })
        this.invoiceDetails = data['data']['invoiceDetails'];
        data['data']['invoice'][0]['invoiceDetails'].forEach(item => {

          /* if (item['idDesc'] == "Common Area Electric Bill") {
            this.commonareafee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Fixed Maintenance") {
            this.fixedmaintenancefee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Generator") {
            this.generatorfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "xc") {
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Security Fees") {
            this.securityfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Unsold Rental Fees") {
            this.unsoldrentalfees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Corpus") {
            this.corpusfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "HouseKeeping") {
            this.housekeepingfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Water Meter") {
            this.watermeterfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "One Time Membership fee") {
            this.onetimemembershipfee = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "One Time OnBoarding Fees") {
            this.OneTimeOnBoardingFees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "One Time Occupancy Fees") {
            this.onetimeoccupancyfees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Renting Fees") {
            this.rentingfees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "bill") {
            //this.rentingfees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Cleaning") {
            //this.rentingfees = item['idValue'];
            this.InvoiceValue += item['idValue'];
          }
          else if (item['idDesc'] == "Discount Value") { 
            this._discountedValue += Number(item['idValue']);
            //this.InvoiceValue -= item['idValue'];
            console.log(this._discountedValue);
          } */
           if (item['idDesc'] == "Discount Value") { 
            this._discountedValue += Number(item['idValue']);
            //this.InvoiceValue -= item['idValue'];
            console.log(this._discountedValue);
          }
          else{
            //this.InvoiceValue += item['idValue'];
          }
        })
        console.log(this._discountedValue);
        console.log(this.InvoiceValue - this._discountedValue);
        //this.InvoiceValue = (this.InvoiceValue - this._discountedValue);
       //let finalValueWithDiscount = this.InvoiceValue - this._discountedValue;
        //console.log(finalValueWithDiscount);
        this.modalRef = this.modalService.show(invoicePop,Object.assign({}, { class: 'gray modal-lg' }));
      },
        err => {
          console.log(err);
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
        })

    this.viewinvoiceservice.getassociationlist(this.asdPyDate, this.blMgrMobile, this.currentAssociationID)
      .subscribe(data => {
        console.log('associationDetails', data);
        this.associationDetails = data
      },
        err => {
          console.log(err);
        })

  }
  raiseAlert() {
    //alert('test');
  }
  printTemplate() {
    //this.printerService.printAngular(this.template);
    window.print();
  }
  printDiv() {
    var printContents = document.getElementById("printableArea").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }
  totalAmountPaid(e?) {

    if (e != undefined) {
      e.preventDefault();
    }

    var total = this.previousDue;
    if (this.allLineItem != undefined) {
      for (var i = 0; i < this.allLineItem.length; i++) {
        var as = this.allLineItem[i].idValue;

        if (as == '' || as == null) {
          total;
          this.subTotal = total;
        } else {
          total += parseFloat(as);
          this.subTotal = total;

        }

      }
    }

    this.totals = total;
    total = total - this.discountedValue;
    this.amountInWords = Math.round(total);
    console.log('amountInWords', this.amountInWords);
    return total;
  }

  onButtonClick(amount) {
    this.mainAmt = amount;
    console.log(this.mainAmt);
    let flatCharges = this.mainAmt * 0.0189;
    console.log('Flat Charge', flatCharges);
    let gst = flatCharges * 0.18;
    console.log('gst', gst);
    let ravVal = this.mainAmt + flatCharges + gst + 1;//razorpay
    let invVal = this.mainAmt + flatCharges + gst + 0.04;//instamojo
    this.invValFinal = invVal.toFixed(2);//instamojo
    let ravValFinal = ravVal;//razorpay

    this.showGateWay = true;
  }

  iciciBank(e, iciciModal: TemplateRef<any>, invValFinal) {
    e.preventDefault();
    this.modalRef = this.modalService.show(iciciModal,
      Object.assign({}, { class: 'gray modal-lg' }));

    let iciciData = {
      "storeId": "3396020566",
      "strTxntype": "sale",
      "strPayOnly": "payonly",
      "strLanguage": "en_EN",
      "currency": "356",
      "sharedSecret": "Gq16esLoVw",
      "strMerchantTransactionId": "330995001_1",
      "charge": invValFinal,
      "responseSuccessURL": "https://demo.oyespace.com:8443/springAppConfig/success.jsp?param1=" + this.mainAmt + "&param2=" + this.invoiceNumber + "&param3=" + this.unitID + "&param4=" + this.currentAssociationID + "&param5=" + invValFinal,
      "responseFailURL": "http://demo.oyespace.com/response_fail.jsp"
    }


    this.viewinvoiceservice.springAppConfigPostAmount(iciciData)
      .subscribe(data => {
        // success
        console.log('success', data);
        this.storeId = data['storeId'];
        this.sharedSecret = data['sharedSecret'];
        this.charge = data['charge'];
        this.currency = data['currency'];
        this.timezone = data['timezone'];
        this.strPayOnly = data['strPayOnly'];
        this.strLanguage = data['strLanguage'];
        this.strMerchantTransactionId = data['strMerchantTransactionId'];
        this.responseSuccessURL = data['responseSuccessURL'];
        this.responseFailURL = data['responseFailURL'];
        this.strTxntype = data['strTxntype'];
        this.calculatedIPGUtilHash = data['calculatedIPGUtilHash'];
      });

  }
  payThroughICICIPG(e) {
    let paymentDetails = {
      "chargetotal": this.InvoiceValue + '.00',
      "customerID": 9539 //set customer Id
    }

    e.preventDefault();
    this.paymentService.postToICICIPG(paymentDetails)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res));
        let response = res.data.paymentICICI;
        this.iciciPayForm = {
          txntype: response.txntype, //'sale'
          timezone: response.timezone, //'Asia/Calcutta',
          txndatetime: response.txndatetime, //this.utilService.getDateTime(),//,
          hash_algorithm: response.hash_algorithm,
          hash: response.response_hash,
          storename: response.storename, //'3300002052',
          mode: response.mode, // "payonly" ,
          currency: response.currency,
          responseSuccessURL: response.pgStatURL,
          responseFailURL: response.pgStatURL,
          language: response.language, //"en_US",
          chargetotal: response.chargetotal,
          oid: response.oid
        }
        console.log(JSON.stringify(this.iciciPayForm));
        setTimeout(_ => this.iciciform.nativeElement.submit(), 1000)
      },
        err => {
          console.log(err);
        })
  }
  payThroughICICIPGtest(e,inid,unUnitID){
    e.preventDefault();
    console.log(inid,unUnitID);
    this.viewinvoiceservice.invoiceDetails(inid, unUnitID)
    .subscribe(data => {
      this.InvoiceValue = 0;
      console.log('invoiceDetails--', data['data']['invoiceDetails']);
      this.invoiceDetails = data['data']['invoiceDetails'];
      data['data']['invoiceDetails'].forEach(item => {

        if (item['idDesc'] == "Common Area Electric Bill") {
          this.commonareafee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "xc") {
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Fixed Maintenance") {
          this.fixedmaintenancefee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Generator") {
          this.generatorfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Security Fees") {
          this.securityfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Unsold Rental Fees") {
          this.unsoldrentalfees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Corpus") {
          this.corpusfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "HouseKeeping") {
          this.housekeepingfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Water Meter") {
          this.watermeterfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "One Time Membership fee") {
          this.onetimemembershipfee = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "One Time OnBoarding Fees") {
          this.OneTimeOnBoardingFees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "One Time Occupancy Fees") {
          this.onetimeoccupancyfees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Renting Fees") {
          this.rentingfees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "bill") {
          //this.rentingfees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
        else if (item['idDesc'] == "Cleaning") {
          //this.rentingfees = item['idValue'];
          this.InvoiceValue += item['idValue'];
        }
      })
      let paymentDetails = {
        "chargetotal": this.InvoiceValue + '.00',
        "customerID": 9539 //set customer Id
      }
  
      this.paymentService.postToICICIPG(paymentDetails)
        .subscribe((res: any) => {
          console.log(JSON.stringify(res));
          let response = res.data.paymentICICI;
          this.iciciPayForm = {
            txntype: response.txntype, //'sale'
            timezone: response.timezone, //'Asia/Calcutta',
            txndatetime: response.txndatetime, //this.utilService.getDateTime(),//,
            hash_algorithm: response.hash_algorithm,
            hash: response.response_hash,
            storename: response.storename, //'3300002052',
            mode: response.mode, // "payonly" ,
            currency: response.currency,
            responseSuccessURL: response.pgStatURL,
            responseFailURL: response.pgStatURL,
            language: response.language, //"en_US",
            chargetotal: response.chargetotal,
            oid: response.oid
          }
          console.log(JSON.stringify(this.iciciPayForm));
          setTimeout(_ => this.iciciform.nativeElement.submit(), 1000)
        },
          err => {
            console.log(err);
          })
    },
      err => {
        console.log(err);
        swal.fire({
          title: "Error",
          text: `${err['error']['error']['message']}`,
          type: "error",
          confirmButtonColor: "#f69321"
        });
      }) 
  }
  kotakPay(e) {
    let paymentDetails = {
      "chargetotal": this.InvoiceValue + '.00',
      "customerID": "" //set customer Id
    }
    e.preventDefault();
    this.paymentService.postToKotakPaymenGateway(paymentDetails).subscribe(res => {
      if (res) {
        this.kotakPayForm = res;
        console.log("this.kotakPayForm ", this.kotakPayForm);
        setTimeout(_ => this.kotakform.nativeElement.submit(), 100)
      }
    }, error => {
      console.log(error);
    }
    )
  }
  axisPay(e) {
    let paymentDetails = {
      "chargetotal": this.InvoiceValue + '.00',
      "customerID": "" //set customer Id
    }
    e.preventDefault();
    let InvoiceValue = { chargetotal: this.InvoiceValue + '.00' };
    console.log(InvoiceValue);
    this.paymentService.postToAxisPaymentGateway(paymentDetails).subscribe((res: any) => {
      console.log(res, typeof (res))
      if (res && res.payment_links) {
        window.location.href = res.payment_links.web;
      }
    }, error => {
      console.log(error);
    }
    )
  }
  hdfcPay(e) {
    let paymentDetails = {
      "amount": this.InvoiceValue + '.00',
      "customerID": "" //set customer Id
    }
    e.preventDefault();
    this.paymentService.postToHDFCPaymentGateway(paymentDetails).subscribe((res: any) => {
      if (res && res.success) {
        this.kotakPayForm = res.data;
        console.log("this.kotakPayForm ", this.kotakPayForm);
        setTimeout(_ => this.kotakform.nativeElement.submit(), 100)
      }
    }, error => {
      console.log(error);
    }
    )
  }
  addZeroes(num) {
    console.log(num);
    // let value = Number(num);
    // let res = num.split(".");
    // if (res.length == 1 || (res[1].length < 3)) {
    //   return value.toFixed(2);
    // }
    // return value.toString(10)
  }
  discount(discount: TemplateRef<any>, inid, inNumber, inTotVal) {
    this.CreditOrDebit='Credit';
    this.isInValidZeroAmount=true;
    this.ValidateInvdescription=true;
    this.modalRef = this.modalService.show(discount,
      Object.assign({}, { class: 'gray modal-lg' }));

    console.log(inid, inNumber, inTotVal);
    this.dscntInvinvoiceID = inid;
    this.dscntInvinvoiceNumber = inNumber;
    this.dscntInvdescription = "Type Reason Here";
    // this.dscntInvdiscountedAmount = inTotVal;
    this.dscntInvdiscountedAmount = 0;
    this.totalAmountForValidation = inTotVal;
  }
  emptyDisplaytext() {
    this.dscntInvdescription = "";
  }
  checkDiscountedAmount(dscntInvdiscountedAmount) {
    console.log(dscntInvdiscountedAmount);
    var totalAmount = this.totalAmountForValidation;
    var discountedAmount = dscntInvdiscountedAmount;
    console.log('totalAmount',totalAmount);
    if (totalAmount < Number(discountedAmount)) {
      console.log('Discounted Amount Cannot more than Total Amount');
      this.moreDiscountedAmount=true;
    } else {
      this.validationResult = false;
      this.moreDiscountedAmount=false;
    }
    if(dscntInvdiscountedAmount == 0){
      this.isInValidZeroAmount=true;
    }
    else{
      this.isInValidZeroAmount=false;
    }
  }
  ValidateAmount(event){
    if(event.target.value > 0){
      this.isInValidZeroAmount=false;
    }
    else{
      this.isInValidZeroAmount=true;
    }
  }
  discountInvoice(dscntInvinvoiceNumber, dscntInvdiscountedAmount, dscntInvdescription) {
    console.log(dscntInvinvoiceNumber, dscntInvdiscountedAmount, dscntInvdescription);
    console.log(this.CreditOrDebit);
    var discountData = {
      "INID": dscntInvinvoiceNumber,
      // "IDDesc": dscntInvdescription,
      "INDisType"  : this.CreditOrDebit,
      "INDsCVal": dscntInvdiscountedAmount
    }
    console.log(discountData);

    this.viewinvoiceservice.UpdateInvoiceDiscountValueAndInsert(discountData)
      .subscribe(data => {
        this.modalRef.hide();
        console.log(data);
        swal.fire({
          title: "",
          text: "Discount Applied Successfully",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {
              this.CreditOrDebit='Credit';
              this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId, this.viewinvoiceservice.invoiceBlock);
            } else if (result.dismiss === swal.DismissReason.cancel) {
            }
          }
        )
      },
        err => {
          this.modalRef.hide();
          console.log(err);
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
        }) 
  }
  openModal1(generateReceipt: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(generateReceipt, Object.assign({}, { class: 'gray modal-lg' }));
  }
  sendInvoiceInMail(inid, unUnitID, ineSent, blBlockID) {
    console.log('inid', inid);
    console.log('unUnitID', unUnitID);
    console.log('ineSent', ineSent);
    console.log('blBlockID', blBlockID);
    //
    this.viewinvoiceservice.GetUnitListByUnitID(unUnitID)
      .subscribe(data => {
        console.log(data);
        this._unOcStat = data['data']['unit']['unOcStat'];
        console.log(this._unOcStat);
        if (data['data']['unit']['unOcStat'] == "UnSold Vacant Unit") {
          swal.fire({
            title: "No Email Address to Send!",
            text: "UnSold Vacant Unit",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        }
        else {
          this.viewinvoiceservice.GetInvoiceOwnerListByInvoiceId(inid)
            .subscribe((res) => {
              console.log(res);
              swal.fire({
                title: "Mail Sent Successful",
                text: "",
                type: "success",
                confirmButtonColor: "#f69321",
                confirmButtonText: "OK"
              }).then(
                (result) => {
                  if (result.value) {
                    this.getCurrentBlockDetails(blBlockID, this.viewinvoiceservice.invoiceBlock);
                  }
                })
               console.log(res);
            },
              (res) => {
                console.log(res);
                swal.fire('Error', `${res['error']['exceptionMessage']}`, 'error')
              })
        }
        //
        //http://localhost:54400/oyeliving/api/v1/Invoice/InvoiceListByInvoiceID/%7BInvoiceID%7D
        /*this.viewinvoiceservice.InvoiceListByInvoiceID(inid)
        .subscribe(data=>{
          console.log(data);
         this._ineSent= data['data']['invoices']['ineSent'];
         console.log(this._ineSent);
        })*/
        //

      })
    //

  }

  toggleIsChecked(event) {
    if (event.target.checked) {
      this.isChecked = true;
    }
    else {
      this.isChecked = false;
    }

    let chkboxs = document.querySelectorAll('.chkBox');
    chkboxs.forEach((item) => {
      if (item['checked'] == true) {
        this.isChecked = true;
      }
    })
  }
  getPaymentmode(expensedataPMID){
    switch(expensedataPMID){
      case 1:
        this.receiptChequeDate='';
        this.receiptEXDDDate='';
        return 'Cash';
      case 2:
        this.receiptEXDDDate='';
        return 'Cheque';
      case 3:
        this.receiptChequeDate='';
        return 'DemandDraft';
      case 4:
        this.receiptChequeDate='';
        this.receiptEXDDDate='';
        return 'Online';
    }
  }
  generateInvoiceReceipt(){
    let paymentDesc;
    let paymentRefNo;
    switch(this.expensedataPMID){
      case 1:
        paymentDesc= 'Cash Payment';
        paymentRefNo=this.receiptVoucherNo;
        break;
      case 2:
        paymentDesc= 'Cheque Payment';
        paymentRefNo=this.receiptChequeNo;
        break;
      case 3:
        paymentDesc= 'Demand Draft Payment';
        paymentRefNo=this.receiptddNo;
        break;
      case 4:
        paymentDesc= 'Online Payment';
        paymentRefNo='Online';
        break;
    }
    this.disableGenerateReceipt=true;
    let genReceipt = {
      "PYAmtPaid":this.totalamountPaid,
      "INNumber": this.invoicenumber,
      "UNUnitID": this.receiptUnitID,
      "ASAssnID": Number(this.currentAssociationID),
      "PYDate":formatDate(new Date(), 'yyyy/MM/dd', 'en'),
      "MEMemID"  : "1",
      "PYRefNo"  : paymentRefNo,
      "PYBkDet"  : this.expensedataBABName,
      "PYTax"    : "0",
      "PMID"     : this.getPaymentmode(this.expensedataPMID),//1,
      //"PYAmtDue" : this.totalAmountDue,
      "PYDesc"   :"PaymentMade",
      "PYVoucherNo" : this.receiptVoucherNo,
      "PYChqNo" : this.receiptChequeNo,
      "PYChqDate" :(this.receiptChequeDate !=''?formatDate(this.receiptChequeDate,'yyyy/MM/dd', 'en'):''),
      "PYDDNo"   :this.receiptddNo,
      "PYDDDate":(this.receiptEXDDDate != ''?formatDate(this.receiptEXDDDate,'yyyy/MM/dd', 'en'):''),
      "BLBlockID" : this.blockid
  }
 
    console.log(genReceipt);
    this.viewinvoiceservice.generateInvoiceReceipt(genReceipt)
    .subscribe(data=>{
      console.log(data);
      this.modalRef.hide();
      swal.fire({
        title: "Receipt Generated Successfully",
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {
            this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId,this.viewinvoiceservice.invoiceBlock);
          } else if (result.dismiss === swal.DismissReason.cancel) {

          }
        })

    },
    err=>{
      this.modalRef.hide();
      this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId,this.viewinvoiceservice.invoiceBlock);
      console.log(err);
      swal.fire({
        title: "",
        text: `${err['error']['exceptionMessage']}`,
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }) 

  }
  getInvoiceListByDateRange(InvoiceEndDate){
    console.log(InvoiceEndDate);
    if (InvoiceEndDate != null) {
      console.log(this.invoiceLists);
      //this.PaidUnpaidinvoiceLists = this.invoiceLists;
      this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceListsTemp;
      console.log(new Date(this.InvoiceStartDate).getTime());
      //console.log(formatDate(this.ExpenseEndDate, 'dd/MM/yyyy', 'en'));
      console.log(new Date(InvoiceEndDate).getTime());
      this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceLists.filter(item => {
        if (new Date(this.InvoiceStartDate).getTime() <= new Date(item['inGenDate']).getTime() && new Date(InvoiceEndDate).getTime() >= new Date(item['inGenDate']).getTime()) {
          console.log(new Date(item['inGenDate']).getTime());
        }
        // return (new Date(this.InvoiceStartDate).getTime() <= new Date(item['inGenDate']).getTime() && new Date(InvoiceEndDate).getTime() >= new Date(item['inGenDate']).getTime());
        return new Date(formatDate(this.InvoiceStartDate,'MM/dd/yyyy','en')) <= new Date(formatDate(item['inGenDate'],'MM/dd/yyyy','en')) && new Date(formatDate(InvoiceEndDate,'MM/dd/yyyy','en')) >= new Date(formatDate(item['inGenDate'],'MM/dd/yyyy','en'));
      })
      console.log(this.PaidUnpaidinvoiceLists);
    }
  }
  toggleAllCheck(event) {
    //alert('toggleAllCheck');
    if (event.target.checked) {
      this.isChecked = true;
      this.checkAll = true;
    } else {
      //alert('toggleunAllCheck')
      this.isChecked = false;
      this.checkAll = false;
    }
  }

  sendEmailToAll() {
    let chkboxs = document.querySelectorAll('.chkBox');

    console.log(chkboxs);
    let inids = [];
    this.invoiceLists.forEach((item) => {
      inids.push(item['inid']);
    })
    //inids=inids.substring(0,inids.length-1);
    console.log(inids);
    this.viewinvoiceservice.GetInvoiceOwnerListByInvoiceId(inids)
      .subscribe((data) => {
        console.log(data);
        swal.fire({
          title: "Mail Sent Successful",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      },
        (err) => {
          console.log(err);
          swal.fire('Error', `${err['error']['error']['message']}`, 'error')
        })
  }

  generateReceipt(generateReceiptModal1: TemplateRef<any>) {
    this.modalRef.hide();
    this.generatereceiptservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        this.allblocksbyassnid = data['data'].blocksByAssoc;
        console.log('allBlocksByAssnID', this.allblocksbyassnid);
      },
        err => {
          console.log(err);
        });
    //
    this.modalRefForGenerateRecipt = this.modalService.show(generateReceiptModal1,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  getcurrentblockdetails(blkBlockID) {
    this.generatereceiptservice.getCurrentBlockDetails(blkBlockID, this.currentAssociationID)
      .subscribe(data => {
        console.log('unpaidUnits', data['data']['paymentsUnpaid']);
        this.unpaidUnits = data['data']['paymentsUnpaid'];
      })
  }
  getCurrentBlockDetailsForGenRecpt(blBlockID, blBlkName) {
    this.CurrentBlockName = blBlkName;
    this.generatereceiptservice.getCurrentBlockDetails(blBlockID, this.currentAssociationID)
      .subscribe(data => {
        this.unpaidUnits = data['data']['paymentsUnpaid'];
        console.log('unpaidUnits', this.unpaidUnits);
      },
        err => {
          console.log(err);
          swal.fire({
            title: `${err['error']['error']['message']}`,
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        })
  }
  openModal(invoicePop: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      invoicePop,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  GetPaidInvoiceList(IsPaid,param) {
    if (this.viewinvoiceservice.invoiceBlock == '') {
      if (this.globalservice.mrmroleId == 1 && this.localMrmRoleId != '2') {
        swal.fire({
          title: `Please Select Block`,
          text: "",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }

    }
    else{
      this.ShowRecords='abc';
      this.PaginatedValue=0;
      $(document).ready(()=> {
        let element=document.querySelector('.page-item.active');
        // console.log(element);
        // console.log(element);
        if(element != null){
        (element.children[0] as HTMLElement).click();
        //console.log(element.children[0]['text']);
        }
        else if (element == null) {
          this.PaginatedValue=0;
        }
      });

      this.p=1;
      this.toggle=param;
      console.log(IsPaid);
      let paid = '';
      if (IsPaid) {
        paid = 'Yes'; //Yes
      }
      else {
        paid = 'No';
      }
      if(paid == 'Yes' || paid == 'No'){
        //this.PaidUnpaidinvoiceLists = this.invoiceLists;
        this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceListsTemp;
        this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceLists.filter(item => {
          return item['inPaid'] == paid;
        })
      console.log(this.PaidUnpaidinvoiceLists);
      }
      if(param == 'All'){
        //this.PaidUnpaidinvoiceLists = this.invoiceLists;
        this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceListsTemp;
      }
    }

  }
  GetPaidInvoiceListResident(IsPaid,param) {
      this.toggle=param;
      console.log(IsPaid);
      let paid = '';
      if (IsPaid) {
        paid = 'Yes';
      }
      else {
        paid = 'No';
      }
      if(paid == 'Yes' || paid == 'No'){
        this.PaidUnpaidinvoiceLists = this.residentInvoiceList;
        this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceLists.filter(item => {
          return item['inPaid'] == paid;
        })
      console.log(this.PaidUnpaidinvoiceLists);
      }
      if(param == 'All'){
        this.PaidUnpaidinvoiceLists = this.residentInvoiceList;
      }
  }
  OpenReceiptModal(Receipts: TemplateRef<any>,inNumber,inTotVal,inAmtPaid,unUnitID){
    this.checkField='';
    this.invoicenumber=inNumber;
    this.totalAmountDue=inTotVal;
    this.totalamountPaid=inAmtPaid;
    this.receiptUnitID=unUnitID;
    //
    //this.totalamountPaid='';
    this.paymentMethodType='Select Payment Method';
    this.expensedataBABName='Bank';
    this.receiptVoucherNo='';
    this.paymentDate='';
    this.receiptddNo='';
    this.receiptEXDDDate='';
    this.receiptChequeNo='';
    this.receiptChequeDate='';

    this.modalRef = this.modalService.show(Receipts,Object.assign({}, { class: 'gray modal-md' }));
  }
  rowDetails(pyid, unUnitID) {
    console.log('pyid-' + pyid);
    this.unUnitID = unUnitID;
    let invobj = this.unpaidUnits.find(item => item['pyid'] == pyid);
    console.log('inNumber-' + invobj['inNumber']);
    console.log('pyAmtDue-' + invobj['pyAmtDue']);
    console.log('pyAmtPaid-' + invobj['pyAmtPaid']);
    console.log('unUnitID-' + invobj['unUnitID']);
    this.invoice = invobj['inNumber'];
    this.amountDue = invobj['pyAmtDue'];
    this.amountPaid = invobj['pyAmtPaid'];
    this.unitID = invobj['unUnitID'];
    this.MEMemID = invobj['meMemID'];
    this.PYRefNo = invobj['pyid'];
    this.PMID = invobj['pmid'];

  }
  viewPayOpt() {
    this.payopt = true;
  }
  printInvoice() {
    window.print();
  }
  getBankName(bank) {
    this.BankName = bank;
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
      console.log(this.p);
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
        //let PminusOne=this.p-1;
        //console.log(PminusOne);
        //console.log((this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //console.log(PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //this.PaginatedValue=PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows);
        console.log(this.p);
        this.PaginatedValue = (this.setnoofrows == 'All Records' ? this.PaidUnpaidinvoiceLists.length : this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }
  
  resetForm(){
    this.disableGenerateReceipt=true;
    this.checkField='';
    this.totalamountPaid='';
    this.paymentMethodType='Select Payment Method';
    this.expensedataBABName='Bank';
    this.receiptVoucherNo='';
    this.paymentDate='';
    this.receiptddNo='';
    this.receiptEXDDDate='';
    this.receiptChequeNo='';
    this.receiptChequeDate='';
    
  }
  showMethod(PMID: string,displayName) {
    console.log(displayName);
    this.disableGenerateReceipt=false;
    switch (displayName) {
      case 'Cash':
        this.expensedataPMID = 1;
        console.log(this.expensedataPMID);
        break;
      case 'Cheque':
        this.expensedataPMID = 2;
        console.log(this.expensedataPMID);
        break;
      case 'DemandDraft':
        this.expensedataPMID = 3;
        console.log(this.expensedataPMID);
        break;
      case 'OnlinePay':
        this.expensedataPMID = 4;
        console.log(this.expensedataPMID);
        break;
    }

    console.log(this.expensedataPMID);
    this.paymentMethodType = displayName;
    let paymentobj = this.methodArray.filter(item => item['id'] == PMID)
    this.checkField = paymentobj[0]['name'];
  }
  clearArea(txtArea) {
    console.log(txtArea);
  }
  initialiseInvoice(){
    this.viewinvoiceservice.invoiceBlock='';
    this.allBlocksByAssnID=[];
    this.invoiceLists = [];
    this.PaidUnpaidinvoiceLists=[];
    this.viewreceiptservice.getpaymentlist(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        console.log(data['data']['payments']);
        this.viewPayments = data['data']['payments']
      });
    //
    this.payopt = false;
    console.log('this.currentAssociationID', this.globalservice.getCurrentAssociationId());
    this.viewinvoiceservice.GetBlockListByAssocID(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        this.allBlocksByAssnID = data;
        this.asdPyDate = this.allBlocksByAssnID[0]['asdPyDate'];
        this.blMgrMobile = this.allBlocksByAssnID[0]['blMgrMobile'];
        console.log('allBlocksByAssnID', this.allBlocksByAssnID);
        if (this.viewinvoiceservice.invoiceBlock != '') {
          this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId, this.viewinvoiceservice.invoiceBlock);
        }
      })
    //
    if(this.globalservice.mrmroleId != 1){
          this.viewinvoiceservice.invoicelistByUnitID(this.globalservice.getCurrentUnitId())
      .subscribe(data => {
        console.log(data);
        this.residentInvoiceList=data['data']['invoices'];
      },
        err => {
          console.log(err);
         /* swal.fire({
            title: "An error has occurred",
            text: `${err['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          }); */
        })
    }
  }
  getAllUnitDetailsByBlockID() {
    /*-------------------Get Unit List By Block ID ------------------*/
    this.viewUniService.GetUnitListByBlockID(this.blockid)
      .subscribe(data => {
        console.log('allUnitBYBlockID',data);
        this.allUnitBYBlockID = data['data'].unitsByBlockID;
      },
      err=>{
        console.log(err);
      });
  }
  getCurrentUnitDetails(unUnitID,unUniName){
    this.p=1;
      this.UnitName=unUniName;
      //this.PaidUnpaidinvoiceLists=this.invoiceLists;
      this.PaidUnpaidinvoiceLists=this.PaidUnpaidinvoiceListsTemp;
      this.PaidUnpaidinvoiceLists = this.PaidUnpaidinvoiceLists.filter(item => {
        return item['unUnitID'] == unUnitID;
      })
      console.log(this.PaidUnpaidinvoiceLists)
  }
  _keyPress1(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  ValidateDefaultDescription(){
    if(this.dscntInvdescription == "Type Reason Here"){
      this.ValidateInvdescription=true;
    }
    else if(this.dscntInvdescription == ""){
      this.ValidateInvdescription=true;
    }
    else{
      this.ValidateInvdescription=false;
    }
  }
  ValidateDescription(event){
    if(this.dscntInvdescription != "Type Reason Here" && this.dscntInvdescription != ""){
      this.ValidateInvdescription=false;
    }
    else{
      this.ValidateInvdescription=true;
    }
  }
  validateDate(event, StartDate, EndDate) {
    this.isDateFieldEmpty=false;
    console.log(StartDate.value, EndDate.value);
    if (event.keyCode == 8) {
      if ((StartDate.value == '' || StartDate.value == null) && (EndDate.value == '' || EndDate.value == null)) {
        console.log('test');
        this.isDateFieldEmpty=true;
        this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId,this.viewinvoiceservice.invoiceBlock);
      }
    }
  }
  GetInvoiceList(){
    if(this.isDateFieldEmpty==true){
      this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId,this.viewinvoiceservice.invoiceBlock);
    }
  }
  GetAssnAddress() {
    this.viewreceiptservice.getAssociationAddress(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        this.associationAddress = data['data']['association']['asAddress'];
        console.log(this.associationAddress);
      },
        err => {
          console.log(err);
        })
  }
}
