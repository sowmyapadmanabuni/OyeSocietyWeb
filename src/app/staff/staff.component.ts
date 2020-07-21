import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service'
import { ViewStaffService } from '../../services/view-staff.service'
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from '../utils/utils.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  modalRef: BsModalRef;
  StartDate: any;
  EndDate: any;
  wkid: any;
  wkimage: any;
  staffReports:any[];
  wkstaf: any;
  wkStatus: any;
  stafimage: any;
  workerImg: any[];
  displayStaff: any;
  WorkerNameList: any[];
  reportlists: any[];
  WorkerID: any;
  staffs: any[];
  otherStaff: any[];
  searchTxt: any;
  addGuest: any;
  baseUrl: any;
  currentAssociationIdForStaffList: Subscription

  constructor(private router: Router, private domSanitizer: DomSanitizer,
    private http: HttpClient, private globalServiceService: GlobalServiceService, private UtilsService: UtilsService, private modalService: BsModalService, private viewStaffService: ViewStaffService) {
    this.EndDate = '';
    this.StartDate = '';
    this.WorkerNameList = [];
    this.workerImg = [];
    this.otherStaff = [];

    this.displayStaff = "Select Staff"
    this.reportlists = [];
    this.WorkerID = '';
    this.baseUrl = 'data:image/png;base64,';
    this.currentAssociationIdForStaffList = this.globalServiceService.getCurrentAssociationIdForStaffList()
      .subscribe(data => {
        console.log(data);
        //console.log(localStorage.getItem('StaffListCalledOnce'))
        //if(localStorage.getItem('StaffListCalledOnce')=='false'){
        this.StaffList();
        //}
      })
  }

  ngOnInit() {
    this.StaffList();
    this.getStaffList();
    this.workerImg = [];

  }

  getStaffList() {
    // alert("hai");
    let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    this.http.get('https://uatapi.scuarex.com/oye247/api/v1/GetWorkerListByAssocIDAccountIDAndUnitID/108/72/156', { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.staffs = response['data']['worker'];
          //console.log(this.staffs);
        },
        (error) => {
          console.log(error);
        }
      );
  }


  selectStaff(param, wkstaf, wkimage, wkstatus, wkid) {
    if (wkimage != "") {
      this.stafimage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + wkimage);

    } else {
      this.stafimage = "";
    }
    this.wkstaf = wkstaf;
    console.log(this.stafimage);
    console.log(this.staffs);
    this.displayStaff = param;
    this.wkStatus = wkstatus;
    this.wkid = wkid;


  }

  //Get Staff Report start
    getReports(id) {
    console.log(id);
        let input = {
          "ASAssnID": 108,
          "WKWorkID": id,
          "FromDate": "07-01-2020",
          "ToDate": "07-21-2020",
          "ACAccntID": 72,
          "UNUnitID": 156
          };
          let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
          this.http.post('https://uatapi.scuarex.com/oye247/api/v1/Worker/GetWorkerListByDatesAssocAndUnitID',input, { headers: headers })
          .subscribe(
            (response) => {
              console.log(response);
             this.staffReports = response['data']['worker'];
              // console.log(this.staffs);
            },
            (error) => {
              console.log(error);
            }
          );

  }
  //Get Staff Report start





  getOtherStaffs() {
    this.workerImg = [];
    //alert("hai");
    let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    this.http.get('https://uatapi.scuarex.com/oye247/api/v1/GetWorkerListByAssocID/108', { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.otherStaff = response['data']['worker'];
          this.otherStaff.forEach(item => {
            // console.log(item['wkEntryImg']);
            // console.log(typeof item['wkEntryImg']);

            this.workerImg.push({ name: item['wkfName'], image: this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['wkEntryImg']) })
          })
          // console.log(this.staffs);
        },
        (error) => {
          console.log(error);
        }
      );




  }





  StaffList() {
    //localStorage.setItem('StaffListCalledOnce','true')      
    this.viewStaffService.GetStaffList()
      .subscribe(data => {
        console.log(data);
        if (data['data']['errorResponse']) {
          if (data['data']['errorResponse']['message']) {
            swal.fire({
              title: "",
              text: `${data['data']['errorResponse']['message']}`,
              type: "info",
              confirmButtonColor: "#f69321"
            })
          }
        }

        this.WorkerNameList = data['data']['worker'];
        // console.log(this.WorkerNameList);

        this.WorkerNameList = _.sortBy(this.WorkerNameList, e => e['wkfName']);
        console.log(this.WorkerNameList);
      },
        err => {
          console.log(err);
        })
  }

  OpenModalForReport(Reporttemplate: TemplateRef<any>, wkWorkID) {
    //console.log(wkWorkID);
    let Data = {
      "StartDate": this.StartDate,
      "EndDate": this.EndDate,
      "wkWorkID": wkWorkID
    }
    this.viewStaffService.getStaffReport(Data)
      .subscribe(data => {
        //console.log(data);
        this.reportlists = data['data']['worker'];
        //console.log(this.reportlists);
      },
        err => {
          //console.log(err);
        })
    this.modalRef = this.modalService.show(Reporttemplate, Object.assign({}, { class: 'gray modal-lg' }));
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
}
