import { Component, OnInit } from '@angular/core';
import {DashBoardService} from '../../services/dash-board.service';
import {GlobalServiceService} from '../global-service.service';
import {Router, NavigationEnd} from '@angular/router';


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

  constructor(public globalService: GlobalServiceService,
    private dashboardservice: DashBoardService,
    private router:Router) {
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
     //console.log( this.acfName);
      });
  }
  logOut() {
    this.globalService.clear();
    this.router.navigate(['root']);
  }
}
