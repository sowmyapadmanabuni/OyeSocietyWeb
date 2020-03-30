import { Component, OnInit } from '@angular/core';
import {DashBoardService} from '../../services/dash-board.service';
import {GlobalServiceService} from '../global-service.service';
import {Router, NavigationEnd} from '@angular/router';
import {ViewBlockService} from '../../services/view-block.service';
import { Subscription } from 'rxjs';


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
  availableNoOfBlocks:any[];
  value:any;
  max:any;
  CurrentAssociationIdForLeftBarComponent:Subscription;
  displayValue:any;

  constructor(public globalService: GlobalServiceService,
    private dashboardservice: DashBoardService,
    public viewBlkService: ViewBlockService,
    private router: Router) {
    this.acAccntID = this.globalService.getacAccntID();
    this.value = 66;
    this.max=100;
    this.CurrentAssociationIdForLeftBarComponent = this.globalService.getCurrentAssociationIdForLeftBarComponent()
      .subscribe(msg => {
        this.globalService.setCurrentAssociationId(msg['msg']);
        console.log(msg);
        this.getBlockDetails();
      })
  }

  ngOnInit() {
    this.getAccountFirstName();
    this.availableNoOfBlocks=[];
    this.getBlockDetails();
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
  public pieChartLabels:string[] = ['Add maitainance & Bank details', 'Safari'];
  public pieChartData:number[] = [70,30];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  getBlockDetails() {
    this.max=100;
    this.value=66;
    this.displayValue='66%';
    this.viewBlkService.getBlockDetails(this.globalService.getCurrentAssociationId()).subscribe(data => {
      this.availableNoOfBlocks = data['data'].blocksByAssoc;
      if(this.availableNoOfBlocks[0]['asUniMsmt']){
        this.value=100;
        this.max=100;
        this.displayValue='100%';
      }
      console.log('allBlocksLists', this.availableNoOfBlocks);
      //asbGnDate
    },
      err => {
        console.log(err);
      });
  }
}
