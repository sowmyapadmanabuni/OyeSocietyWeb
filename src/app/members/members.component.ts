import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '../../services/dash-board.service';
import { GlobalServiceService } from '../global-service.service';
import { UtilsService } from '../utils/utils.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { UnitListForRoleChange } from '../models/unit-list-for-role-change';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  associationTotalMembers: any[];
  accountID: any;
  allMemberByAccount: any[];
  associationID: any;
  totalMember: string;
  role: any[];
  scopeIP: any;
  p: number = 1;
  unUnitID: any;
  NotificationMessage: any;
  searchTxt: any;
  enableAddBlocksView: any;
  ChangeRole: any;
  SelectedUnitID: any;
  toggleSetNotification: any;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords: string;
  columnName: any;
  getMembersSubscription:Subscription;
  fillMemberArray: boolean;

  constructor(public dashBrdService: DashBoardService, private http: HttpClient,
    public globalService: GlobalServiceService, public utilsService: UtilsService) {
      this.fillMemberArray=true;
      this.rowsToDisplay=[{'Display':'5','Row':5},
      {'Display':'10','Row':10},
      {'Display':'15','Row':15},
      {'Display':'50','Row':50},
      {'Display':'100','Row':100},
      {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='ShowRecords';
    this.ChangeRole = 'SelectRole';
    this.associationTotalMembers = [];
    this.allMemberByAccount = [];
    this.fillMemberArray=true;
    this.accountID = this.globalService.getacAccntID();
    this.associationID = this.globalService.getCurrentAssociationId();
   this.getMembersSubscription = this.globalService.getCurrentAssociationIdForMemberComponent()
    .subscribe(data=>{
      console.log(data);
      //alert('Hi');
      this.GetMemberList(data['msg']);
    })
    console.log(this.associationID);
    this.role = [{ 'Role': 'Admin', 'RoleId': 1 }, { 'Role': 'Owner', 'RoleId': 2 }];
  }

  ngOnInit() {
    console.log('test2');
    this.GetMemberList(this.associationID);
  }

  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  GetMemberList(associationID) {
    this.allMemberByAccount = [];
    console.log(associationID);
    let IPAddress = this.utilsService.getIPaddress();
    let headers = this.getHttpheaders();
    this.http.get(IPAddress + `oyeliving/api/v1/Unit/GetUnitListByAssocID/${associationID}`, { headers: headers })
      .subscribe(data => {
        console.log(data);
        console.log(data['data']['unit']);
        this.allMemberByAccount = [];
        Array.from(data['data']['unit']).forEach(item=> {
              let headers = this.getHttpheaders();
              return this.http.get(IPAddress + 'oyeliving/api/v1/GetVehicleListByAssocUnitAndAcctID/'+item['asAssnID']+'/'+item['unUnitID']+'/'+item['acAccntID'], { headers: headers })
              // http://apidev.oyespace.com/oyeliving/api/v1/GetVehicleListByAssocUnitAndAcctID/{AssociationID}/{UnitID}/{AccountID}
                .subscribe(data => {
                  console.log(data);
                  console.log(data['data']['vehicleListByUnitID'].length);
                  this.allMemberByAccount.push(new UnitListForRoleChange(
                    item['asAssnID'],
                    item['unUnitID'],
                    ((item['block'] == null || item['block'] == undefined) ? '' : item['block']['blBlkName']),
                    item['unUniName'],
                    ((item['owner'].length == 0) ? (item['tenant'].length == 0 ? '' : item['tenant'][0]['utfName']) : item['owner'][0]['uofName']),
                    ((item['owner'].length == 0) ? ((item['tenant'].length == 0 ? '' : (item['tenant'][0]['utMobile'].includes("+91", 3)) ? item['tenant'][0]['utMobile'].slice(3) : item['tenant'][0]['utMobile'])) : ((item['owner'][0]['uoMobile'].includes("+91", 3)) ? item['owner'][0]['uoMobile'].slice(3) : item['owner'][0]['uoMobile'])),
                    ((item['owner'].length == 0) ? '' : ((item['owner'][0]['uoRoleID'] == 1) ? 'Admin' : 'Owner')),
                    this.role,
                    '',
                    item['unOcStat'],
                    item['blBlockID'],
                    data['data']['vehicleListByUnitID'].length,
                    ''));
                }, err => {
                  console.log(err);
                })
        })
        console.log(this.allMemberByAccount);
      },
        err => {
          console.log(err);
          this.allMemberByAccount=[];
          swal.fire({
            title: "Error",
            text: `${err['error']['error']['message']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          })
        })
  }


  AdminCreate(uoMobile, unUnitID, roleid, role) {
    console.log(uoMobile, unUnitID, roleid, role);
    this.ChangeRole = role;
    this.SelectedUnitID = unUnitID;
    let toOwnertoAdmin = {
      ACMobile: uoMobile,
      UNUnitID: unUnitID,
      MRMRoleID: roleid,
      ASAssnID: this.associationID
    }
    console.log(toOwnertoAdmin);
    let headers = this.getHttpheaders();
    let IPAddress = this.utilsService.getIPaddress();
    this.http.post(IPAddress + '/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate/', JSON.stringify(toOwnertoAdmin), { headers: headers })
      .subscribe(data => {
        console.log(data);

        swal.fire({
          title: "Role Changed Successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {
              this.GetMemberList(this.associationID);
            }
          });
      },
        err => {
          console.log(err);
          swal.fire({
            title: "Error",
            text: err['error']['error']['message'],
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
        })
  }

  onPageChange(event) {
    //console.log(event);
    //console.log(this.p);
    //console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if((event['srcElement']['text'] != undefined) && (event['srcElement']['text'] != '»') && (event['srcElement']['text'] != '1') && (Number(event['srcElement']['text']) == NaN)){
        //console.log('test');
        //console.log(Number(event['srcElement']['text']) == NaN);
        //console.log(Number(event['srcElement']['text']));
        let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
        this.p= Number(element.children[0]['text']);
      //console.log(this.p);
    } 
    if(event['srcElement']['text'] == '«'){
      //console.log(this.p);
      this.p= 1;
    }
    //console.log(this.p);
    let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
    this.p=Number(element.children[0]['text']);
  }
  SendNotification() {
    console.log(this.allMemberByAccount);
  }
  SetAllNotification(toggleSetNotification){
    console.log(toggleSetNotification);
    if(toggleSetNotification){
      this.allMemberByAccount.forEach(item=>{
        item['SetIndividualNotification'] = toggleSetNotification
      })
    }
    else{
      this.allMemberByAccount.forEach(item=>{
        item['SetIndividualNotification'] = toggleSetNotification
      })
    }
    console.log(this.allMemberByAccount);
  }
  setIndividualNotification(SetIndividualNotification) {
    console.log(SetIndividualNotification);
    console.log(this.allMemberByAccount);
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }

  sendNotification() {
    let MessageBody = {
      "associationID": this.associationID,
      "associationName": "MY SCHOOL",
      "ntDesc": this.NotificationMessage,
      "ntTitle": "Admin Message",
      "ntType": "gate_app",
      "sbSubID": "21695admin",
      "unitID": this.globalService.getacAccntID(),
      "userID": this.globalService.getacAccntID()
    }
    console.log(MessageBody);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    this.http.post('https://us-central1-oyespace-dc544.cloudfunctions.net/sendAdminNotificationFromKotlin', JSON.stringify(MessageBody), { headers: headers })
      .subscribe(data => {
        console.log(data);
      })
  }
  setRows(RowNum) {
    this.ShowRecords='abc';
    this.setnoofrows = (RowNum=='All'?this.allMemberByAccount.length:RowNum);
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  SendNotificationToAll(){
    this.allMemberByAccount.forEach(item=>{
      if(item['SetIndividualNotification']== true){
        let MessageBody = {
          "associationID": this.associationID,
          "associationName": "MY SCHOOL",
          "ntDesc": this.NotificationMessage,
          "ntTitle": "Admin Message",
          "ntType": "gate_app",
          "sbSubID": "21695admin",
          "unitID": this.globalService.getacAccntID(),
          "userID": this.globalService.getacAccntID()
        }
        console.log(MessageBody);
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Access-Control-Allow-Origin', '*');
        this.http.post('https://us-central1-oyespace-dc544.cloudfunctions.net/sendAdminNotificationFromKotlin', JSON.stringify(MessageBody), { headers: headers })
          .subscribe(data => {
            console.log(data);
          })
      }
       
    })
  }

}
