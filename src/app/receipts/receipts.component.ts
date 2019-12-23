import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {GlobalServiceService} from '../global-service.service';
import {ViewReceiptService} from '../../services/view-receipt.service';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
  viewPayments: object[];
  modalRef: BsModalRef;
  currentAssociationID: string;
  unitIdentifier:any;
  invoiceNumber:any;
  pymtDate:any;
  amountPaid:any;

  constructor(private modalService: BsModalService,
    private globalservice:GlobalServiceService,
    private viewreceiptservice:ViewReceiptService,
    private router:Router) 
    { 
      this.currentAssociationID=this.globalservice.getCurrentAssociationId();
      this.unitIdentifier='';
      this.invoiceNumber='';
      this.pymtDate='';
      this.amountPaid='';
    }

  ngOnInit() {
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
    .subscribe(data=>{
      console.log(data['data']['payments']);
      this.viewPayments=data['data']['payments']
    })
  }
  goToExpense(){
    this.router.navigate(['expense']);
  }
  goToInvoice(){
    this.router.navigate(['invoice']);
  }
  goToReceipts(){
    this.router.navigate(['receipts']);
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
  OpenViewReceiptModal(Receipts: TemplateRef<any>,unUnitID,inNumber,pyDate,pyAmtPaid){
    this.modalRef = this.modalService.show(Receipts,Object.assign({}, { class: 'gray modal-md' }));
  }
  viewReceipt(unitIdentifier, invoiceNumber, pymtDate, amountPaid) {
    console.log(unitIdentifier, invoiceNumber, pymtDate, amountPaid);
    this.unitIdentifier = unitIdentifier;
    this.invoiceNumber = invoiceNumber;
    this.pymtDate = pymtDate;
    this.amountPaid = amountPaid;
  }
}
