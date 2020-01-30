import { FlatDetail } from '../flat-detail';
import { CityList } from '../city-list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HomeService } from '../../services/home.service';
import { MapService } from '../map.service';
import {ViewBlockService} from '../../services/view-block.service'
import { Component, OnInit, ElementRef, ViewChild, TemplateRef, Input } from '@angular/core';
import { DashBoardService } from '../../services/dash-board.service';
import { GlobalServiceService } from '../global-service.service';
import { AppComponent } from '../app.component';
import { LoginAndregisterService } from '../../services/login-andregister.service';
import { Router, NavigationEnd } from '@angular/router';
import { ViewAssociationService } from '../../services/view-association.service';
import { UnitlistForAssociation } from '../models/unitlist-for-association';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import {UtilsService} from '../utils/utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  associations: any = [];
  allMemberByAccount = [];
  allTicketByAssociation = [];
  allVehicleListByAssn = [];
  allStaffByAssn = [];
  account = [];
  allVisitorsByAssn = [];
  accountID: number;
  totalMember: string;
  associationID: string;
  totalTickets: string;
  totalVehicles: string;
  totalStaffs: string;
  totalUnitStaffs: string;
  totalVisitors: string;
  totalUnitVisitors: string;
  totalAssociationVehicles: string;
  amount: number;
  amountdue: number;
  AssociationAmountDue: boolean = false;
  memberDeatils: boolean = false;
  ticketDetails: boolean = false;
  vehicleDetails: boolean = false;
  currentAssociationName: string;
  association: string;
  amt: any[];
  mrmRoleID: number;
  staffDetails: boolean;
  visitorDetails: boolean;
  allvisitorByAssn: any = [];
  localMrmRoleId: any;
  associationAmountDue: any[];
  associationTotalMembers: any[];

  @ViewChild('amounts', { static: true }) public amounts: ElementRef;
  @ViewChild('member', { static: true }) public member: ElementRef;
  @ViewChild('ticket', { static: true }) public ticket: ElementRef;
  @ViewChild('vehicle', { static: true }) public vehicle: ElementRef;
  @ViewChild('staff', { static: true }) public staff: ElementRef;
  @ViewChild('visitor', { static: true }) public visitor: ElementRef;
  acfName: any;
  aclName: any;
  enrollAssociation: boolean;
  joinAssociation: boolean;
  viewAssociation_Table: boolean;
  unit: any;
  unitForAssociation: any[];
  unitlistForAssociation: UnitlistForAssociation[];
  acMobile: any;
  uniqueAssociations: any[];
  adminUnitShow: boolean;
  modalRef: BsModalRef;
  p: number;
  subscription: Subscription;
  subscription1: Subscription;
  selectedAssociationSubscription: Subscription;
  availableNoOfBlocks: any;
  availableNoOfUnits: any;

  constructor(private dashBrdService: DashBoardService, private appComponent: AppComponent,
    public globalService: GlobalServiceService,
    private loginandregisterservice: LoginAndregisterService,
    private router: Router,
    public viewBlkService: ViewBlockService,
    private viewassosiationservice: ViewAssociationService,
    private modalService: BsModalService,
    private utilsService:UtilsService,
    private http:HttpClient) {
    this.accountID = this.globalService.getacAccntID();
    console.log(this.accountID);
    //this.globalService.setAccountID('9539'); // 6457 9539
    // this.accountID=this.globalService.getacAccntID();
    this.globalService.currentUnitName = this.globalService.getCurrentUnitName();
    //console.log(this.globalService.currentUnitId);
    //this.globalService.setCurrentUnitId('Units');
    this.association = '';
    //this.unit='';
    this.unitForAssociation = [];
    this.unitlistForAssociation = [];
    this.uniqueAssociations = [];
    this.totalTickets = '0';
    this.totalStaffs = '0';
    this.totalUnitStaffs = '0';
    this.totalVisitors = '0';
    this.totalUnitVisitors = '0';
    this.totalAssociationVehicles = '0';
    this.adminUnitShow = false;
    this.amount = 0;
    this.amountdue = 0;
    this.associationAmountDue = [];
    this.associationTotalMembers = [];
    this.p = 1;
    this.globalService.currentAssociationName = '';
    //
    this.subscription1 = this.globalService.getUnit()
      .subscribe(msg => {
        console.log(msg);
        this.loadUnit(msg['msg']['unUniName'], msg['msg']['unUnitID']);
      },
        err => {
          console.log(err);
        })
    //
    this.selectedAssociationSubscription=this.globalService.getSelectedAssociation()
    .subscribe(msg=>{
      console.log(msg);
      this.loadAssociation(msg['msg']['associationName'],'','SelectedAssociation');
    },
    err=>{
      console.log(err);
    })
  }

  ngOnInit() {
    this.getAmount();
    this.getMembers();
    this.getTickets();
    //this.getVehicle();
    this.getStaff();
    this.getVistors();
    this.getAccountFirstName();
    console.log(this.globalService.currentAssociationName);
    console.log(typeof this.globalService.currentAssociationName);
    this.localMrmRoleId = this.globalService.mrmroleId;
    this.GetVehicleListByAssocID();
    this.getAssociation();
  }
  gotToResidentInvoice() {
    this.router.navigate(['resident-invoice']);
  }
  getAssociation() {
    //console.log('this.accountID',this.accountID);
    this.dashBrdService.getAssociation(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      //console.log(data);
      this.associations = data.data.memberListByAccount;
      this.associations = _.sortBy(this.associations, e => e.asAsnName);
      console.log('associations', this.associations);
      for (let i = 0; i < this.associations.length; i++) {
        //console.log( this.uniqueAssociations);
        //console.log( this.associations[i]['asAsnName']);
        const found = this.uniqueAssociations.some(el => el['asAsnName'] === this.associations[i]['asAsnName']);
        if (!found) {
          this.uniqueAssociations.push(this.associations[i]);
        }
      }
      console.log(this.uniqueAssociations);
      this.loadAssociation(this.uniqueAssociations[0]['asAsnName'],this.uniqueAssociations,'id');
    },
      res => {
        console.log('Error in getting Associations',res);
      });
  }
  getAmount() {
    this.associationAmountDue = [];
    this.amount = 0;
    this.dashBrdService.getAmount(this.associationID).subscribe(res => {
      //console.log('amount',res);
      this.associationAmountDue = res['data']['payments'];
      console.log(this.associationAmountDue);
      // if (res['data']['errorResponse']) {
      //   this.amount = "0";
      // }
      // else if (res['data']['payments'][1].pyAmtDue) {
      //   this.amount=res['data']['payments'][1].pyAmtDue;

      // }
      this.amt = res['data']['payments'].filter(item => {
        //console.log(item);
        if (item['pyStat'] == "UnPaid") {
          return item['pyAmtDue'];
        }
      })

      //console.log('amounts',this.amt[0]['pyAmtDue']);
      this.amt.forEach(item => {
        this.amount += Number(item['pyAmtDue'])
      })
      //console.log(this.amount);
    }, err => {
      this.amount = 0;
      console.log(err);
    })
  }
  OpenModalBlockDetails(viewBlockDetailsTemplate: TemplateRef<any>) {
    this.getAmount();
    this.modalRef = this.modalService.show(viewBlockDetailsTemplate, Object.assign({}, { class: 'gray modal-md' }));
  }
  GetAmountBalance(unUnitID) {
    this.amountdue = 0;
    this.dashBrdService.GetAmountBalance(unUnitID)
      .subscribe(data => {
        console.log(data);
        this.amountdue = data['data']['balanceDue'];
        console.log(this.amountdue);
      }, err => {
        console.log(err);
      })
  }
  onPageChange(event) {
    //console.log(event['srcElement']['text']);
    if (event['srcElement']['text'] == '1') {
      this.p = 1;
    }
    if (event['srcElement']['text'] != '1') {
      this.p = Number(event['srcElement']['text']) - 1;
      //console.log(this.p);
      if (this.p == 1) {
        this.p = 2;
      }
    }
    if (event['srcElement']['text'] == '«') {
      this.p = 1;
    }
  }
  // getMembers(){
  //     this.dashBrdService.getMembers(this.accountID).subscribe(res => {
  //       //console.log(JSON.stringify(res));
  //       var data:any = res;
  //       this.allMemberByAccount = data.data.memberListByAccount;
  //       console.log('allMemberByAccount',this.allMemberByAccount);
  //      this.mrmRoleID= this.allMemberByAccount[0]['mrmRoleID'];
  //      this.dashBrdService.mrmRoleID=this.mrmRoleID;
  //       this.totalMember= data.data.memberListByAccount.length;
  //       });
  // }
  getMembers() {
    this.associationTotalMembers = [];
    this.dashBrdService.getMembers(this.globalService.getacAccntID()).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      this.allMemberByAccount = data.data.memberListByAccount;
      //console.log('allMemberByAccount', this.allMemberByAccount);
      //this.mrmRoleID = this.allMemberByAccount[0]['mrmRoleID'];
      //this.dashBrdService.mrmRoleID = this.mrmRoleID;
      this.dashBrdService.GetUnitListCount(this.associationID)
        .subscribe(data => {
          console.log(data['data']['unit']);
          this.associationTotalMembers = data['data']['unit'];
          this.totalMember = data['data']['unit'].length;
        },
          err => {
            console.log(err);
            this.totalMember = '0';
          })
      //this.totalMember = data.data.memberListByAccount.length;
    },
      (res) => {
        //console.log(res);
        this.dashBrdService.memberdoesnotexist = true;
      });
  }
  getTickets() {
    this.dashBrdService.getTickets(this.associationID).subscribe(res => {
      //console.log('ticketresult-', res);
      if (res['data']['errorResponse']) {
        this.totalTickets = "0";
      }
      else if (res['data']['ticketing']) {
        this.allTicketByAssociation = res['data']['ticketing'];
        this.totalTickets = res['data']['ticketing'].length;
        //console.log('totalTickets', this.totalTickets);
      }
      // var data:any = res;
    }, err => {
      //console.log(err);
    });
  }
  enroll() {
    this.dashBrdService.toggleViewAssociationTable = true;
    this.dashBrdService.enrollassociationforresident = true;
    this.router.navigate(['home/association']);
  }
  join() {
    // this.enrollAssociation = false;
    // this.joinAssociation = true;
    // this.viewAssociation_Table = false;
    this.dashBrdService.toggleViewAssociationTable = false;
    this.router.navigate(['home/association']);
  }
  getAccountFirstName() {
    this.dashBrdService.getAccountFirstName(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      this.account = data.data.account;
      //console.log('account',this.account);
      this.acfName = this.account[0]['acfName'];
      this.aclName = this.account[0]['aclName'];
      this.acMobile = this.account[0]['acMobile'];
      this.dashBrdService.acfName = this.acfName;
      this.dashBrdService.aclName = this.aclName;
      this.dashBrdService.acMobile = this.acMobile;
    });
  }
  getVehicle(unUnitID) {
    this.dashBrdService.getVehicle(unUnitID).subscribe(res => {
      console.log('vehicle',res);
      var data: any = res;
      this.allVehicleListByAssn = data.data.vehicleListByUnitID;
      let totalVehicles = data.data.vehicleListByUnitID.filter(item => {
        return (item['veRegNo'] != '' && item['veType'] != '' && item['veMakeMdl'] != '' && item['veStickNo'] != '');
      })
      this.totalVehicles = totalVehicles.length;
      console.log(this.totalVehicles);
    },
      err => {
        console.log(err);
        this.totalVehicles = '0';
      });
  }
  getStaff() {
    this.dashBrdService.getStaff(this.associationID).subscribe(res => {
      //console.log('staff',res);
      if (res['data']['errorResponse']) {
        this.totalStaffs = "0";
      }
      else if (res['data']['worker']) {
        this.allStaffByAssn = res['data']['worker'];
        this.totalStaffs = res['data']['worker'].length;

      }
    })
  }
  getVistors() {
    this.dashBrdService.getVisitors(this.associationID).subscribe(res => {
      //console.log('visitors',res);
      if (res['data']['errorResponse']) {
        this.totalVisitors = "0";
      }
      else if (res['data']['visitorLog']) {
        this.allvisitorByAssn = res['data']['visitorLog'];
        this.totalVisitors = res['data']['visitorLog'].length;

      }
    })
  }

  loadAssociation(associationName,associationList, param: any) {
    console.log(associationName);
    console.log(param);
    // if(!this.globalService.toggledashboard){
    //   console.log('false');
    //   this.globalService.setCurrentUnitName('Units');
    // }
    this.unitlistForAssociation = [];
    //this.globalService.currentUnitId == '';
    //this.appComponent.myMenus=true;
    //console.log("AssociationName: ", associationName);
    let asnName = (associationName == 'null' ? 'Association' : associationName);
    console.log(asnName);
    console.log(this.associations);
    //console.log(typeof associationName);
    this.globalService.setCurrentAssociationName(asnName);
    this.currentAssociationName = asnName;
    // let filteredAssociations = this.associations.filter(association=>association.asAsnName==asnName);
    this.associations.forEach(association => {
      if (association.asAsnName == asnName) {
        console.log(association);
        this.dashBrdService.mrmRoleID = association['mrmRoleID'];
        //console.log( this.dashBrdService.mrmRoleID);
        this.unitForAssociation.push(association);
        //console.log(this.unitForAssociation);
        const found = this.unitlistForAssociation.some(el => el['unUnitID'] === association['unUnitID'] && el['unUniName'] === association['unUniName'] && el['mrmRoleID'] === association['mrmRoleID']);
        if (!found) {
          if (association['unUniName'] != '' && association['unUnitID'] != 0) {
            this.unitlistForAssociation.push(new UnitlistForAssociation(association['unUniName'], association['unUnitID'], association['mrmRoleID']));
          }
        }
        console.log(this.unitlistForAssociation);
        this.globalService.setCurrentAssociationId(association.asAssnID);
        this.globalService.setCurrentAssociationIdForExpense(association.asAssnID);
        this.globalService.setCurrentAssociationIdForInvoice(association.asAssnID);
        this.globalService.setCurrentAssociationIdForUnit(association.asAssnID);
        this.globalService.setCurrentAssociationIdForReceipts(association.asAssnID);
        this.globalService.setCurrentAssociationIdForBlocks(association.asAssnID);
        this.globalService.setCurrentAssociationIdForCustomerStatement(association.asAssnID);
        this.globalService.setCurrentAssociationName(asnName);
        this.associationID = this.globalService.getCurrentAssociationId();
        console.log("Selected AssociationId: " + this.globalService.getCurrentAssociationId());
      }

    });
    console.log(this.unitlistForAssociation);
    const found1 = this.unitlistForAssociation.filter(abc=>{
     return abc['mrmRoleID'] == 1
     });
     if(found1.length != 0){
       this.globalService.mrmroleId=1;
       this.localMrmRoleId=1;
       console.log(this.globalService.mrmroleId);
     }
     else{
       this.globalService.mrmroleId=2;
       this.localMrmRoleId=2;
       console.log(this.globalService.mrmroleId);
     }
    //if (param == 'id') {
      //this.globalService.setCurrentUnitName('Units');
      if (this.unitlistForAssociation.length) {
        this.globalService.setCurrentUnitName(this.unitlistForAssociation[0]['unUniName']);
        this.loadUnit(this.unitlistForAssociation[0]['unUniName'], this.unitlistForAssociation[0]['unUnitID']);
        console.log(this.unitlistForAssociation[0]['unUnitID']);
        console.log(this.unitlistForAssociation[0]['unUniName']);
        
      }
    //}
    /* if(this.unitlistForAssociation.length == 1){
       if(this.unitlistForAssociation[0]['unUniName']==''){
         this.unitlistForAssociation=[];
         this.unitlistForAssociation.push(new UnitlistForAssociation('No Unit Found',0,0));
         //console.log(this.unitlistForAssociation);
         this.globalService.setCurrentUnitName('Units');
       }
     } */
    //console.log('globalService.currentAssociationName', this.globalService.currentAssociationName);
    this.getAmount();
    this.getMembers();
    this.getTickets();
    //this.getVehicle();
    this.getStaff();
    this.getVistors();
    this.GetVehicleListByAssocID();
    this.getBlockDetails();
    this.getUnitsDetails();
    this.globalService.sendUnitListForAssociation(this.unitlistForAssociation);
    this.globalService.SetAssociationUnitList(this.unitlistForAssociation);
    if(param != 'SelectedAssociation'){
      console.log('SelectedAssociation');
      this.globalService.sendMessage(associationList);
      this.globalService.SetAssociationList(associationList);
    }
  }
  GetVehicleListByAssocID() {
    this.dashBrdService.GetVehicleListByAssocID(this.associationID)
      .subscribe(data => {
        //console.log(data);
        let totalAssociationVehicles = data['data']['vehicleListByAssocID'].filter(item => {
          return (item['veRegNo'] != '' && item['veType'] != '' && item['veMakeMdl'] != '' && item['veStickNo'] != '');
        })
        this.totalAssociationVehicles = totalAssociationVehicles.length;

      }, err => {
        //console.log(err);
      })

    /* this.dashBrdService.getVehicle(unUnitID).subscribe(res => {
       console.log('vehicle',res);
       var data:any = res;
       this.allVehicleListByAssn = data.data.vehicleListByUnitID;
       let totalVehicles = data.data.vehicleListByUnitID.filter(item => {
         return (item['veRegNo'] != '' && item['veType'] != '' && item['veMakeMdl'] != '' && item['veStickNo'] != '');
       })
       this.totalVehicles= totalVehicles.length;
       },
       err=>{
         console.log(err);
         this.totalVehicles='0';
       }); */
  }
  assnAmountDue() {
    this.AssociationAmountDue = true;
    this.memberDeatils = false;
    this.ticketDetails = false;
    this.vehicleDetails = false;
    this.staffDetails = false;
    this.visitorDetails = false;
    this.amounts.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }

  members() {
    this.AssociationAmountDue = false;
    this.memberDeatils = true;
    this.ticketDetails = false;
    this.vehicleDetails = false;
    this.staffDetails = false;
    this.visitorDetails = false;
    this.member.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });

  }

  tickets() {
    this.AssociationAmountDue = false;
    this.memberDeatils = false;
    this.ticketDetails = true;
    this.vehicleDetails = false;
    this.staffDetails = false;
    this.visitorDetails = false;
    this.ticket.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }

  vehicles() {
    this.vehicleDetails = true;
    this.AssociationAmountDue = false;
    this.memberDeatils = false;
    this.ticketDetails = false;
    this.staffDetails = false;
    this.visitorDetails = false;
    this.vehicle.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  staffs() {
    this.staffDetails = true;
    this.vehicleDetails = false;
    this.AssociationAmountDue = false;
    this.memberDeatils = false;
    this.ticketDetails = false;
    this.visitorDetails = false;
    this.staff.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  visitors() {
    this.visitorDetails = true;
    this.staffDetails = false;
    this.vehicleDetails = false;
    this.AssociationAmountDue = false;
    this.memberDeatils = false;
    this.ticketDetails = false;
    this.visitor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  GetVisitorLogByDatesAssocAndUnitID(unUnitID) {
    let visitorlog = {
      "StartDate": "2019-08-16",
      "EndDate": "2020-01-29",
      "ASAssnID": this.associationID,
      "UNUnitID": unUnitID,
      "ACAccntID": this.accountID
    }
    console.log(visitorlog);
    this.dashBrdService.GetVisitorLogByDatesAssocAndUnitID(visitorlog)
      .subscribe(data => {
        console.log(data); //totalUnitVisitors
        this.totalUnitVisitors = data['data']['visitorlog'].length;
      },
        err => {
          console.log(err);
        })
  }
  GetWorkersListByUnitID(unUnitID) {
    this.dashBrdService.GetWorkersListByUnitID(unUnitID)
      .subscribe(data => {
        console.log(data['data']);
        //console.log(data['data']['errorResponse']['message']);
        //console.log(data['data']['workersByUnit']);
        this.totalUnitStaffs = data['data'].length;
      },
        err => {
          console.log(err);
        })
  }
  loadUnit(unit, unUnitID) {
    console.log(unit);
    console.log(unUnitID);
    this.globalService.setCurrentUnitId(unUnitID);
    this.globalService.setCurrentUnitName(unit);
    console.log(this.globalService.currentUnitId);
    console.log(this.globalService.currentUnitName);
    console.log(this.globalService.getCurrentUnitName());
    console.log(this.globalService.getCurrentUnitId());
    this.getVehicle(unUnitID);
    this.GetAmountBalance(unUnitID);
    this.GetVisitorLogByDatesAssocAndUnitID(unUnitID);
    this.GetWorkersListByUnitID(unUnitID);
  }
  AdminsUnitShow() {
    this.localMrmRoleId = 2;
    console.log('2');
  }
  AdminsButtonShow() {
    this.localMrmRoleId = 1;
    console.log('1');
  }
  goToAssociation() {
    this.router.navigate(['association']);
  }
  goToBlocks() {
    this.router.navigate(['blocks']);
  }
  goToExpense() {
    this.router.navigate(['expense']);
  }
  goToResidentInvoice() {
    this.router.navigate(['invoice']);
  }
  goToFamily() {
    this.router.navigate(['family']);
  }
  goToVisitors() {
    this.router.navigate(['visitors']);
  }
  goToAssociationVisitors() {
    this.router.navigate(['AssocitionVisitors']);
  }
  goToStaffFromDashboard() {
    this.router.navigate(['staffs']);
  }
  goToVehicles() {
    this.router.navigate(['vehicles']);
  }
  goToPatrolling() {
    this.router.navigate(['patroling']);
  }
  goToReports() {
    this.router.navigate(['reports']);
  }
  goToMembers() {
    this.router.navigate(['members']);
  }
  getBlockDetails() {
    this.viewBlkService.getBlockDetails(this.globalService.getCurrentAssociationId()).subscribe(data => {
      this.availableNoOfBlocks = data['data'].blocksByAssoc.length;
      console.log(data);
      console.log('allBlocksLists', this.availableNoOfBlocks);
      //asbGnDate
    },
      err => {
        console.log(err);
      });
  }
  getUnitsDetails() {
    let IPAddress = this.utilsService.getIPaddress();
    let headers = this.getHttpheaders();
    this.http.get(IPAddress + `oyeliving/api/v1/Unit/GetUnitListByAssocID/${this.globalService.getCurrentAssociationId()}`, { headers: headers })
      .subscribe(data => {
        console.log(data['data']['unit'].length);
        this.availableNoOfUnits=data['data']['unit'].length;
      },
      err=>{
        console.log(err);
      })
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

}
