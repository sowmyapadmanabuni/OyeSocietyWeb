import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToStaffs(){
    this.router.navigate(['staffs']);
  }
  goToGuests(){
    this.router.navigate(['visitors']);
  }
  goToDelivery(){
    this.router.navigate(['deliveries']);
  }

}
