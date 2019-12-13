import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToCustomerStatement(){
    this.router.navigate(['customer']);
  }
  goToSupplierStatement(){
    this.router.navigate(['supplier']);
  }
  
  
}
