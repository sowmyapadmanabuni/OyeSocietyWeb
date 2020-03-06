import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportlists:any[];
  modalRef: BsModalRef;


  constructor(private router:Router) { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }

  goToCustomerStatement(){
    this.router.navigate(['customer']);
  }
  goToSupplierStatement(){
    this.router.navigate(['supplier']);
  }
  goToGeneralLedger(){
    this.router.navigate(['generalLedger']);
  }
  
  goToprofitLoss(){
    this.router.navigate(['profitloss']);
  }
  goTobalanceSheet(){
    this.router.navigate(['balancesheet']);
  }
  goTojournels(){
    this.router.navigate(['journel']);
  }
  goToVisitorLogs(){
    this.router.navigate(['visitors']);
  }
  goToPatrolling(){
    this.router.navigate(['patroling']);
  }
  
}
