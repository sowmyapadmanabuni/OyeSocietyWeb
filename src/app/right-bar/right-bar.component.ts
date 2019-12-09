import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
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
  goToVisitors(){
    this.router.navigate(['visitors']);
  }
  goToSubscription(){
    this.router.navigate(['subscription']);
  }
}
