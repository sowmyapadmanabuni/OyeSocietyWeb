import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewreportService } from '../../services/viewreport.service';
import { GlobalServiceService } from '../global-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


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

  constructor(private viewreportservice: ViewreportService,
    private globalservice: GlobalServiceService) {
    this.frequencys = [
      { "name": "Paid", "displayName": "Paid" },
      { "name": "UnPaid", "displayName": "UnPaid" }
    ];
    this.currentAssociationName = this.globalservice.getCurrentAssociationName();
    this.reportID = '';
    this.PaymentStatus='Select Payment Status';
  }

  getPaidUnpaidDetail(reportID) {
    console.log('reportID', reportID);
    this.displaypaymentdetails = this.allpaymentdetails.filter(item => {
      return item['pyStat'] == reportID;
    })
  }
  getpaymentdetails() {
    this.viewreportservice.getpaymentdetails(this.currentAssociationID).subscribe((data) => {
      this.allpaymentdetails = data['data']['payments'];
      console.log('allpaymentdetails', this.allpaymentdetails);
    })
  }

  ngOnInit() {
    this.custpanel = false;
    this.custtable = true;
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    this.getpaymentdetails();
  }

  viewCustDetail() {
    this.custpanel = true;
    this.custtable = false;
  }
  OpenCustomerModel(customertemplate: TemplateRef<any>){
    // this.modalRef = this.modalService.show(editBlocktemplate,
    //   Object.assign({}, { class: 'gray modal-lg' }));
  }

}
