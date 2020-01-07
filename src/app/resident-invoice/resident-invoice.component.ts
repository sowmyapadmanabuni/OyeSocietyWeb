import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ViewInvoiceService } from '../../services/view-invoice.service';
import { BlocksByAssoc } from '../models/blocks-by-assoc';
import { AssociationDetails } from '../models/association-details';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import { Router } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { GenerateReceiptService } from '../../services/generate-receipt.service';
import { PaymentService } from '../../services/payment.service';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-resident-invoice',
  templateUrl: './resident-invoice.component.html',
  styleUrls: ['./resident-invoice.component.css']
})
export class ResidentInvoiceComponent implements OnInit {

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
  chequeNo: string;
  ravValFinal:any;
  iciciPay:any;
  paymentmethod:any;
  methodArray:any;
  showMethod:any;
  chequeDate:any;
  blkBlockID:any;
  pyid:any;
  paymentDescription:any;
  bankname:any;
  checkField:any;
  resetForm:any;
  searchTxt:any;

  constructor(private viewinvoiceservice: ViewInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private globalservice: GlobalServiceService,
    private router: Router,
    private orderpipe: OrderPipe,
    private generatereceiptservice: GenerateReceiptService,
    private paymentService: PaymentService) {
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
  }

  goToExpense() {
    this.router.navigate(['expense']);
  }
  goToInvoice() {
    this.router.navigate(['invoice']);
  }
  goToReceipts() {
    this.router.navigate(['receipts']);
  }
  goToVehicles() {
    this.router.navigate(['vehicles']);
  }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.payopt = false;

    //console.log('this.currentAssociationID', this.currentAssociationID);
    this.viewinvoiceservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        this.allBlocksByAssnID = data;
        this.asdPyDate = this.allBlocksByAssnID[0]['asdPyDate'];
        this.blMgrMobile = this.allBlocksByAssnID[0]['blMgrMobile'];
        //console.log('allBlocksByAssnID', this.allBlocksByAssnID);
        if (this.viewinvoiceservice.invoiceBlock != '') {
          this.getCurrentBlockDetails(this.viewinvoiceservice.invoiceBlockId, this.viewinvoiceservice.invoiceBlock);
        }
      })
  this.invoicelistByUnitID();
  }

  getCurrentBlockDetails(blBlockID, blBlkName) {
    this.viewinvoiceservice.invoiceBlock = blBlkName;
    this.viewinvoiceservice.invoiceBlockId = blBlockID;
    this.invoiceLists = [];
    this.blockid = blBlockID;
    //console.log('blBlockID-' + blBlockID);
    this.viewinvoiceservice.getCurrentBlockDetails(blBlockID, this.currentAssociationID)
      .subscribe(data => {
        this.invoiceLists = data['data'].invoices;
        //console.log('invoiceLists?', this.invoiceLists);
        //
        this.sortedCollection = this.orderpipe.transform(this.invoiceLists, 'unUnitID');
        //console.log(this.sortedCollection);
      },
        err => {
          //console.log(err);
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
        })
    this.isChecked = false;
    this.checkAll = false;
  }
  invoicelistByUnitID(){
    //console.log(this.globalservice.currentUnitId);
    this.viewinvoiceservice.invoicelistByUnitID(this.globalservice.currentUnitId)
    .subscribe(data=>{
      //console.log(data);
    },
    err=>{
      //console.log(err);
    })
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
        //console.log(data);
        swal.fire({
          title: "Receipt Generated Successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })

      },
        (err) => {
          //console.log(err);
          swal.fire({
            title: `${err['error']['error']['message']}`,
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        })

  }

  viewInvoice1(event, invoicePop: TemplateRef<any>, inid, inGenDate, inNumber, inDsCVal, unUnitID) {
    event.preventDefault();
    //alert('inside viewinvoice');
    //console.log('inGenDate', inGenDate);
    //console.log('inNumber', inNumber);
    //console.log('inid', inid);
    //console.log('inDsCVal', inDsCVal);
    //console.log('unUnitID', unUnitID);

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


    this.viewinvoiceservice.GetUnitListByUnitID(this.unitID)
      .subscribe(data => {
        //console.log('GetUnitListByUnitID', data);
        this.singleUnitDetails = data['data'].unit;

        if (data['data'].unit.owner.length > 0) {
          this.OwnerFirstName = data['data']['unit'].owner[0].uofName;
          this.OwnerLastName = data['data']['unit'].owner[0].uolName;
          this.OwnerEmail = data['data']['unit'].owner[0].uoEmail;
        }

      })

    this.viewinvoiceservice.viewInvoice(this.blockid, this.currentAssociationID)
      .subscribe(data => {
        //console.log('InvoiceDetails+', data);
        //this.allLineItem = data['data'].invoiceDetails;
        //console.log(data['data'].invoiceDetails);
      },
        data => {
          //console.log('InvoiceDetails', data);
        })

    this.viewinvoiceservice.GetAmountBalance(unUnitID)
      .subscribe(data => {
        //console.log('GetAmountBalance', data);
        //$scope.previousDue = response.data.data.balanceDue;
      },
        data => {
          //console.log('GetAmountBalance', data);
          //previousDue=parseFloat(0.00);
        })

    this.viewinvoiceservice.invoiceDetails(inid, unUnitID)
      .subscribe(data => {
        this.modalRef = this.modalService.show(invoicePop,
          Object.assign({}, { class: 'gray modal-lg' }));
        this.InvoiceValue = 0;
        //console.log('invoiceDetails--', data['data']['invoiceDetails']);
        this.invoiceDetails = data['data']['invoiceDetails'];
        data['data']['invoiceDetails'].forEach(item => {

          if (item['idDesc'] == "Common Area Electric Bill") {
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
          else if (item['idDesc'] == "One Time Onboarding fee") {
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
      },
        err => {
          //console.log(err);
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
        })

    this.viewinvoiceservice.getassociationlist(this.asdPyDate, this.blMgrMobile, this.currentAssociationID)
      .subscribe(data => {
        //console.log('associationDetails', data);
        this.associationDetails = data
      },
        err => {
          //console.log(err);
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
    //console.log('amountInWords', this.amountInWords);
    return total;
  }

  onButtonClick(amount) {
    this.mainAmt = amount;
    //console.log(this.mainAmt);
    let flatCharges = this.mainAmt * 0.0189;
    //console.log('Flat Charge', flatCharges);
    let gst = flatCharges * 0.18;
    //console.log('gst', gst);
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
        //console.log('success', data);
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
      "customerID": "" //set customer Id
    }

    e.preventDefault();
    this.paymentService.postToICICIPG(paymentDetails)
      .subscribe((res: any) => {
        //console.log(res);
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
        //console.log(this.iciciPayForm);
        setTimeout(_ => this.iciciform.nativeElement.submit(), 1000)
      },
        err => {
          //console.log(err);
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
        //console.log("this.kotakPayForm ", this.kotakPayForm);
        setTimeout(_ => this.kotakform.nativeElement.submit(), 100)
      }
    }, error => {
      //console.log(error);
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
    //console.log(InvoiceValue);
    this.paymentService.postToAxisPaymentGateway(paymentDetails).subscribe((res: any) => {
      //console.log(res, typeof (res))
      if (res && res.payment_links) {
        window.location.href = res.payment_links.web;
      }
    }, error => {
      //console.log(error);
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
        //console.log("this.kotakPayForm ", this.kotakPayForm);
        setTimeout(_ => this.kotakform.nativeElement.submit(), 100)
      }
    }, error => {
      //console.log(error);
    }
    )
  }
  addZeroes(num) {
    //console.log(num);
    // let value = Number(num);
    // let res = num.split(".");
    // if (res.length == 1 || (res[1].length < 3)) {
    //   return value.toFixed(2);
    // }
    // return value.toString(10)
  }
  discount(discount: TemplateRef<any>, inid, inNumber, inTotVal) {
    this.modalRef = this.modalService.show(discount,
      Object.assign({}, { class: 'gray modal-lg' }));

    //console.log(inid, inNumber, inTotVal);
    this.dscntInvinvoiceID = inid;
    this.dscntInvinvoiceNumber = inNumber;
    this.dscntInvdescription = "Type Reason Here";
    this.dscntInvdiscountedAmount = inTotVal;
    this.totalAmountForValidation = inTotVal;
  }
  emptyDisplaytext() {
    this.dscntInvdescription = "";
  }
  checkDiscountedAmount(dscntInvdiscountedAmount) {
    var totalAmount = this.totalAmountForValidation;
    var discountedAmount = dscntInvdiscountedAmount;
    if (totalAmount < discountedAmount) {
      this.toastr.error('', 'Discounted Amount Cannot more than Total Amount', {
        timeOut: 3000
      });
    } else {
      this.validationResult = false;
    }
  }
  discountInvoice(dscntInvinvoiceNumber, dscntInvdiscountedAmount, dscntInvdescription) {
    //console.log(dscntInvinvoiceNumber, dscntInvdiscountedAmount, dscntInvdescription);

    var discountData = {
      "INID": dscntInvinvoiceNumber,
      "IDDesc": dscntInvdiscountedAmount,
      "INDsCVal": dscntInvdescription
    }

    this.viewinvoiceservice.UpdateInvoiceDiscountValueAndInsert(discountData)
      .subscribe(data => {
        this.modalRef.hide();
        //console.log(data);
        swal.fire({
          title: "",
          text: "Discount Applied Successfully",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      },
        err => {
          this.modalRef.hide();
          //console.log(err);
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
    //console.log('inid', inid);
    //console.log('unUnitID', unUnitID);
    //console.log('ineSent', ineSent);
    //console.log('blBlockID', blBlockID);
    //
    this.viewinvoiceservice.GetUnitListByUnitID(unUnitID)
      .subscribe(data => {
        //console.log(data);
        this._unOcStat = data['data']['unit']['unOcStat'];
        //console.log(this._unOcStat);
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
              //console.log(res);
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
              //  console.log(res);
            },
              (res) => {
                //console.log(res);
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

    //console.log(chkboxs);
    let inids = [];
    this.invoiceLists.forEach((item) => {
      inids.push(item['inid']);
    })
    //inids=inids.substring(0,inids.length-1);
    //console.log(inids);
    this.viewinvoiceservice.GetInvoiceOwnerListByInvoiceId(inids)
      .subscribe((data) => {
        //console.log(data);
        swal.fire({
          title: "Mail Sent Successful",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      },
        (err) => {
          //console.log(err);
          swal.fire('Error', `${err['error']['error']['message']}`, 'error')
        })
  }

  generateReceipt(generateReceiptModal1: TemplateRef<any>) {
    this.modalRef.hide();
    this.generatereceiptservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        this.allblocksbyassnid = data['data'].blocksByAssoc;
        //console.log('allBlocksByAssnID', this.allblocksbyassnid);
      },
        err => {
          //console.log(err);
        });
    //
    this.modalRefForGenerateRecipt = this.modalService.show(generateReceiptModal1,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  getcurrentblockdetails(blkBlockID) {
    this.generatereceiptservice.getCurrentBlockDetails(blkBlockID, this.currentAssociationID)
      .subscribe(data => {
        //console.log('unpaidUnits', data['data']['paymentsUnpaid']);
        this.unpaidUnits = data['data']['paymentsUnpaid'];
      })
  }
  getCurrentBlockDetailsForGenRecpt(blBlockID, blBlkName) {
    this.CurrentBlockName = blBlkName;
    this.generatereceiptservice.getCurrentBlockDetails(blBlockID, this.currentAssociationID)
      .subscribe(data => {
        this.unpaidUnits = data['data']['paymentsUnpaid'];
        //console.log('unpaidUnits', this.unpaidUnits);
      },
        err => {
          //console.log(err);
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
  rowDetails(pyid, unUnitID) {
    //console.log('pyid-' + pyid);
    this.unUnitID = unUnitID;
    let invobj = this.unpaidUnits.find(item => item['pyid'] == pyid);
    //console.log('inNumber-' + invobj['inNumber']);
    //console.log('pyAmtDue-' + invobj['pyAmtDue']);
    //console.log('pyAmtPaid-' + invobj['pyAmtPaid']);
    //console.log('unUnitID-' + invobj['unUnitID']);
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


}
