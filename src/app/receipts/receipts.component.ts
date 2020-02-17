import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {GlobalServiceService} from '../global-service.service';
import {ViewReceiptService} from '../../services/view-receipt.service';
import { GenerateReceiptService } from '../../services/generate-receipt.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { DashBoardService } from '../../services/dash-board.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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

  constructor(private modalService: BsModalService,
    public globalservice:GlobalServiceService,
    public dashBrdService: DashBoardService,
    private viewreceiptservice:ViewReceiptService,
    private router:Router,
    public generatereceiptservice: GenerateReceiptService) 
    { 
      this.currentAssociationID=this.globalservice.getCurrentAssociationId();
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
        this.globalservice.setCurrentAssociationId(msg['msg']);
        this.initialiseReceipts();
      })
    }

  ngOnInit() {
    this.getMembers();
    this.viewPayments=[];
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
    .subscribe(data=>{
      console.log(data['data']['payments']);
      this.viewPayments=data['data']['payments']
      this.viewPaymentList=data['data']['payments']
    });
    this.generatereceiptservice.GetBlockListByAssocID(this.currentAssociationID)
    .subscribe(data => {
      this.allBlocksByAssnID = data['data'].blocksByAssoc;
      console.log('allBlocksByAssnID', this.allBlocksByAssnID);
    });
  }
  initialiseReceipts(){
    this.viewPayments=[];
    this.viewreceiptservice.getpaymentlist(this.globalservice.getCurrentAssociationId())
    .subscribe(data=>{
      console.log(data['data']['payments']);
      this.viewPayments=data['data']['payments']
    },
    err=>{
      console.log(err);
    });
  this.getMembers();
  }
  goToExpense(){
    this.router.navigate(['expense']);
  }

  goToInvoice(){
    this.router.navigate(['invoice']);
  }
  goToReceipts(){
    this.generatereceiptservice.enableReceiptListView=true;
    this.generatereceiptservice.enableGenerateReceiptView=false;
    //this.router.navigate(['receipts']);
  }
  goToVehicles(){
    this.router.navigate(['vehicles']);
  }
  // ngAfterViewInit() {
  //   $(document).ready(function () {
  //     $('#example').DataTable();
  //   });
  // }

  gotoGenerateReceipt(){
    this.router.navigate(['home/generatereceipt']);
  }
  generateReceipt(){
    this.generatereceiptservice.enableReceiptListView=false;
    this.generatereceiptservice.enableGenerateReceiptView=true;
  }
  OpenViewReceiptModal(Receipts: TemplateRef<any>,unUnitID,inNumber,pydCreated,pyAmtPaid,unUniName,pyAmtDue,pyBal){
    this.UnitName=unUniName;
    this.InvoiceNum=inNumber;
    this.paymentDate=pydCreated;
    this.AmountDue=pyAmtDue;
    this.AmountPaid=pyAmtPaid;
    this.Balance=pyBal;
    this.modalRef = this.modalService.show(Receipts,Object.assign({}, { class: 'gray modal-md' }));
  }

  viewReceipt(unitIdentifier, invoiceNumber, pymtDate, amountPaid) {
    console.log(unitIdentifier, invoiceNumber, pymtDate, amountPaid);
    this.unitIdentifier = unitIdentifier;
    this.invoiceNumber = invoiceNumber;
    this.pymtDate = pymtDate;
    this.amountPaid = amountPaid;
  }
  onPageChange(event) {
    console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if(event['srcElement']['text'] != '1'){
      this.p= Number(event['srcElement']['text'])-1;
      console.log(this.p);
      if(this.p == 1){
        this.p =2;
      }
    } 
    if(event['srcElement']['text'] == '«'){
      this.p= 1;
    }
  }
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
    let head = ["unUniName", "inNumber","pyDate","pyAmtPaid"];
    let body = [];

    /* The following array of object as response from the API req  */

  /*  var itemNew = [
      { id: 'Case Number', name: '101111111' },
      { id: 'Patient Name', name: 'UAT DR' },
      { id: 'Hospital Name', name: 'Dr Abcd' }
    ] */


    this.viewPayments.forEach(element => {
      let temp = [element['unUniName'], element['inNumber'], element['pyDate'], element['pyAmtPaid']];
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
        if (new Date(this.ReceiptStartDate).getTime() <= new Date(item['pydCreated']).getTime() && new Date(ReceiptEndDate).getTime() >= new Date(item['pydCreated']).getTime()) {
          console.log(new Date(item['pydCreated']).getTime());
        }
        return (new Date(this.ReceiptStartDate).getTime() <= new Date(item['pydCreated']).getTime() && new Date(ReceiptEndDate).getTime() >= new Date(item['pydCreated']).getTime());
      })
      console.log(this.viewPayments);
    }
  }
}
