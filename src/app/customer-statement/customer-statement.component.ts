import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.css']
})
export class CustomerStatementComponent implements OnInit {

  custpanel:boolean;
  custtable:boolean;

  constructor() {

   }

  ngOnInit() {
    this.custpanel=false;
    this.custtable=true;
  }

viewCustDetail(){
  this.custpanel=true;
  this.custtable=false; 
}

}
