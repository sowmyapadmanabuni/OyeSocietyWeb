import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewreportService } from '../../services/viewreport.service';
import { GlobalServiceService } from '../global-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DashBoardService } from '../../services/dash-board.service';
import { Subscription } from 'rxjs';


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

  constructor(private viewreportservice: ViewreportService,
    public dashBrdService: DashBoardService,
    public globalservice: GlobalServiceService,private modalService: BsModalService) {
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
    this.getMembers();
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
  viewCustDetail() {
    this.custpanel = true;
    this.custtable = false;
  }
  OpenCustomerModel(customertemplate: TemplateRef<any>,pyDate,acAccntID,pyBal){
    console.log(pyDate);
    console.log(acAccntID);
    console.log(pyBal);
    this.pyDate=pyDate;
    this.acAccntID=acAccntID;
    this.pyBal=pyBal;
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
    this.UnitNameForDisplay=unUniName;
    this.displaypaymentdetails=this.allpaymentdetails;
    this.displaypaymentdetails = this.displaypaymentdetails.filter(item => {
      return item['unUnitID'] == unUnitID;
    })
    console.log(this.displaypaymentdetails)
  }
}
