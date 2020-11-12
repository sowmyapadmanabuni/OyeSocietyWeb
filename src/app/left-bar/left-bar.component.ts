import { Component, OnInit } from '@angular/core';
import {DashBoardService} from '../../services/dash-board.service';
import {GlobalServiceService} from '../global-service.service';
import {Router, NavigationEnd} from '@angular/router';
import {ViewBlockService} from '../../services/view-block.service';
import { Subscription } from 'rxjs';
import { EditprofileService } from 'src/services/editprofile.service';
import { ViewUnitService } from 'src/services/view-unit.service';


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
  subscription:Subscription;
  displayValue:any;
  allAccount: any;
  profileImg: string;

  constructor(public globalService: GlobalServiceService,
    private dashboardservice: DashBoardService,
    public viewBlkService: ViewBlockService,
    private router: Router,
    private editprofileservice:EditprofileService,
    private viewUnitService:ViewUnitService) {
    this.acAccntID = this.globalService.getacAccntID();
    this.value = 66;
    this.max=100;
    this.CurrentAssociationIdForLeftBarComponent = this.globalService.getCurrentAssociationIdForLeftBarComponent()
      .subscribe(msg => {
        this.globalService.setCurrentAssociationId(msg['msg']);
        console.log(msg);
        this.getProfileDetails();
        this.getBlockDetails();
      })
      this.subscription = this.globalService.getUnit()
      .subscribe(msg => {
        console.log(msg);
        this.getProfileDetails();
      },
        err => {
          console.log(err);
        })
  }

  ngOnInit() {
    this.getAccountFirstName();
    this.availableNoOfBlocks=[];
    this.getBlockDetails();
    this.getProfileDetails();
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
      console.log(data);
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
  myRole:any;
  occupiedby:string='';
  getProfileDetails() {
    this.editprofileservice.getProfileDetails(this.globalService.getacAccntID()).subscribe(res => {
      console.log(res);
      var data: any = res;
      this.allAccount = data.data.account;
      console.log('account', this.allAccount);
      console.log('CurrentUnitId-',this.globalService.getCurrentUnitId());
      this.profileImg = 'data:image/jpeg;base64,' + this.allAccount[0]['acImgName'];
      this.viewUnitService.getUnitDetails(this.globalService.getCurrentAssociationId())
      .subscribe(data => {
        console.log(data);
        data['data']['unit'].forEach(item => {
          if (item['unUnitID'] == this.globalService.getCurrentUnitId()) {
            console.log(item);
            if (item['owner'].length !== 0) {
              if (item['owner'][0].acAccntID == this.allAccount[0].acAccntID) {
                this.myRole = item['owner'][0].uoRoleID
              }
            }
            if (item['tenant'].length !== 0) {
              if (item['tenant'][0].acAccntID == this.allAccount[0].acAccntID) {
                this.myRole = 3
              }
            }
          }
        })
        switch(this.myRole){
          case 2:
            this.occupiedby = 'Owner';
            break;
          case 3:
            this.occupiedby = 'Tenant';
            break;
            default:
              this.occupiedby = 'Family';
        }
      }, err => {
        console.log(err);
      })
    });
  }
}
