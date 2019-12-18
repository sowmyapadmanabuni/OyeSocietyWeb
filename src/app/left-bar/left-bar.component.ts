import { Component, OnInit } from '@angular/core';
import {DashBoardService} from '../../services/dash-board.service';
import {GlobalServiceService} from '../global-service.service';


@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  acAccntID:number;
  acfName: any;
  aclName: any;
  account:any[];

  constructor(private globalService: GlobalServiceService,
    private dashboardservice: DashBoardService) {
      this.acAccntID = this.globalService.getacAccntID();
     }

  ngOnInit() {
    this.getAccountFirstName();
  }

  getAccountFirstName(){
    this.dashboardservice.getAccountFirstName(this.acAccntID).subscribe(res => {
      var data:any = res;
      this.account = data.data.account;
     this.acfName= this.account[0]['acfName'];
     this.aclName= this.account[0]['aclName'];
     this.dashboardservice.acfName=this.acfName;
     console.log( this.acfName);
      });
}
}
