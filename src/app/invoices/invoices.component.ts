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
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
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
  ngAfterViewInit() {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }
}
