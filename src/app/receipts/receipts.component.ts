import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {GlobalServiceService} from '../global-service.service';
import {ViewReceiptService} from '../../services/view-receipt.service';
import { GenerateReceiptService } from '../../services/generate-receipt.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

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
  allBlocksByAssnID: any[];
  unpaidUnits: any[];
  p: number=1;
  searchTxt:any;

  constructor(private modalService: BsModalService,
    private globalservice:GlobalServiceService,
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
    }

  ngOnInit() {
    this.viewreceiptservice.getpaymentlist(this.currentAssociationID)
    .subscribe(data=>{
      //console.log(data['data']['payments']);
      this.viewPayments=data['data']['payments']
    });
    this.generatereceiptservice.GetBlockListByAssocID(this.currentAssociationID)
    .subscribe(data => {
      this.allBlocksByAssnID = data['data'].blocksByAssoc;
      //console.log('allBlocksByAssnID', this.allBlocksByAssnID);
    });
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
  OpenViewReceiptModal(Receipts: TemplateRef<any>,unUnitID,inNumber,pyDate,pyAmtPaid){
    this.modalRef = this.modalService.show(Receipts,Object.assign({}, { class: 'gray modal-md' }));
  }

  viewReceipt(unitIdentifier, invoiceNumber, pymtDate, amountPaid) {
    //console.log(unitIdentifier, invoiceNumber, pymtDate, amountPaid);
    this.unitIdentifier = unitIdentifier;
    this.invoiceNumber = invoiceNumber;
    this.pymtDate = pymtDate;
    this.amountPaid = amountPaid;
  }
  onPageChange(event) {
    //console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if(event['srcElement']['text'] != '1'){
      this.p= Number(event['srcElement']['text'])-1;
      //console.log(this.p);
      if(this.p == 1){
        this.p =2;
      }
    } 
    if(event['srcElement']['text'] == '«'){
      this.p= 1;
    }
  }
}
