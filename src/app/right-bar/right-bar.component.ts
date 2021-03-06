import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {GlobalServiceService} from '../global-service.service'
declare var $ :any;


@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {

  constructor(private router:Router, public globalService: GlobalServiceService) {
   }

  ngOnInit() {
  }
  // ngAfterViewInit(){

  //   $(document).ready(function(){
  //     var options = { direction: 'right' };

  //     $("#loginPanel1").click(function(){
  //       $("#userNav").toggle(options,1000);
  //     });
  //   });

  // }


  goToAssociation(){
    this.router.navigate(['association']);
  }
  
  goToUnitsBlocks(){
    this.router.navigate(['unitsblocks']);
  }
  goToBlocks(){
    this.router.navigate(['blocks']);
  }
  goToUnits(){
    this.router.navigate(['units']);
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
  goToFamily(){
    this.router.navigate(['family']);
  }
  goToVisitors(){
    this.router.navigate(['visitors']);
  }
  goToSubscription(){
    this.router.navigate(['subscription']);
  }
  goToReports(){
    this.router.navigate(['reports']);
  }
  goToPatrolling(){
    this.router.navigate(['patroling']);
  }
}
