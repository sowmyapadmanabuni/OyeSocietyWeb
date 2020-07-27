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
import {IStarRatingOnClickEvent, IStarRatingOnRatingChangeEven} from "angular-star-rating/src/star-rating-struct";

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
  comment:any;
  filterStaff:any;
  staffs1:any[];
  wkrating:any;
  condition:any;
  condition1:any;
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
  wkidtype:any;
  wkidimage:any;
  otherStaff: any[];
  searchTxt: any;
  addGuest: any;
  baseUrl: any;
  enableviewDocuments:any;
  currentAssociationIdForStaffList: Subscription

  constructor(private router: Router, private domSanitizer: DomSanitizer,
    private http: HttpClient, private globalServiceService: GlobalServiceService, private UtilsService: UtilsService, private modalService: BsModalService, private viewStaffService: ViewStaffService) {
    this.EndDate = '';
    this.StartDate = '';
    this.WorkerNameList = [];
    this.workerImg = [];
    this.otherStaff = [];
    this.condition=true;
    this.condition1=false;
this.enableviewDocuments=false;
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
    this.condition=true;
    this.condition1=false;

  }

  getStaffList() {
    this.condition=true;
    this.condition1=false;
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


  selectStaff(param, wkstaf, wkimage, wkstatus, wkid,wkidtype,wkidimage,wkrating) {
    this.enableviewDocuments=false;
    this.wkidtype=wkidtype;
    this.wkidimage=wkidimage;
    this.wkrating=wkrating;
    console.log(wkidtype);
    console.log(wkidimage);
    if (wkimage != "") {
      this.stafimage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + wkimage);

    } 
    else {
      this.stafimage = "";
    }
    
    this.wkstaf = wkstaf;
    console.log(this.stafimage);
    console.log(this.staffs);
    this.displayStaff = param;
    this.wkStatus = wkstatus;
    this.wkid = wkid;


  }

  getDoc(){
    this.condition=true;
    this.condition1=false;
    this.enableviewDocuments=true;
    if(this.wkidimage!=""){
      console.log(this.wkidimage);
      this.wkidimage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.wkidimage);

    }
    else{
        this.wkidimage="";

    }
    this.wkidtype=this.wkidtype;
    console.log(this.wkidimage);
    console.log(this.wkidtype);
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
    this.condition1=true;
    this.condition=false;

    this.workerImg = [];
    //alert("hai");
    let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
    this.http.get('http://devapi.scuarex.com/oye247/api/v1/WorkerTypes/GetWorkerTypes', { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.otherStaff = response['data']['workerTypes'];
         // this.otherStaff.forEach(item => {
            // console.log(item['wkEntryImg']);
            // console.log(typeof item['wkEntryImg']);

            //this.workerImg.push({ name: item['wkfName'], image: this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item['wkEntryImg']) })
         // })
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
  onClickResult:IStarRatingOnClickEvent;
   
    onRatingChangeResult:IStarRatingOnRatingChangeEven;

    onClick = ($event:IStarRatingOnClickEvent) => {
        console.log('onClick $event: ', $event);
        this.onClickResult = $event;
        this.wkrating=this.onClickResult.rating
    };

    onRatingChange = ($event:IStarRatingOnRatingChangeEven) => {
        console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    };

   
  updateReview(param,coment){
    this.wkrating
     console.log(param);
    console.log(this.wkrating);
     console.log(coment);

     let ipAddress = this.UtilsService.getIPaddress()
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .set('Content-Type', 'application/json');
      let upreview =
      {
        "ASAssnID"  : 108,
        "UNUnitID"  : 156,
        "WKWorkID"  : param,
        "ACAccntID" : 72,
        "WKRating"  : this.wkrating,
        "WKReview"  : coment,
        "WKSmlyCnt" : "4"
    }
    console.log(upreview);
    this.http.post('http://devapi.scuarex.com/oye247/api/v1/WorkerReviewRatingUpdate',upreview, { headers: headers })
      .subscribe(
        (response) => {
          console.log(response);
        

        },
        (error) => {
          console.log(error);
        }
      );
  }
  
  OpeneditReview(editReview: TemplateRef<any>,wid){
    console.log(this.wkid);
    this.modalRef = this.modalService.show(editReview, Object.assign({}, { class: 'gray modal-md' }));
    this.staffs1=this.staffs;
    this.staffs1=this.staffs1.filter(item=>{
      return item['wkWorkID']==this.wkid;
    })
    console.log(this.staffs1);

    // this.wkidimage;
    // this.wkrating;
   
  }
  goToStaffs() {
    this.condition=true;
    this.condition1=false;
    this.router.navigate(['staffs']);
  }
  goToGuests() {
    this.router.navigate(['visitors']);
  }
  goToDelivery() {
    this.router.navigate(['deliveries']);
  }
}
