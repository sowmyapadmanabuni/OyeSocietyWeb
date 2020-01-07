import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { ViewDeliveryService } from '../../services/view-delivery.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  deliveryList: any[];
  deliveryListLength: boolean;
  EndDate: any;
  StartDate: any;
  searchTxt:any;
  todayDate:any;

  constructor(private globalService: GlobalServiceService, private deliveryService: ViewDeliveryService,
    private modalService: BsModalService,
    private router: Router) {
    this.deliveryList = [];
    this.deliveryListLength = false;
    this.EndDate = '';
    this.StartDate = ''
  }

  ngOnInit() {
    let e='';
    this.getVisitorList(e);
  }
  goToStaffs() {
    this.router.navigate(['staffs']);
  }
  goToGuests() {
    this.router.navigate(['visitors']);
  }
  goToDelivery() {
    this.router.navigate(['deliveries']);
  }
  getVisitorList(e:any) {
    //console.log(e);
    this.EndDate=e;
    let date = {
      "StartDate": this.StartDate,
      "EndDate": this.EndDate
    }
    //console.log(date);
    this.deliveryService.getVisitorList(date)
      .subscribe(data => {
        //console.log(data);
        this.deliveryList = data['data']['visitorlog'];
        //console.log(this.deliveryList);
        if (this.deliveryList.length > 0) {
          this.deliveryListLength = true;
        }
      },
        err => {
          //console.log(err);
        }
      )
  }

}
