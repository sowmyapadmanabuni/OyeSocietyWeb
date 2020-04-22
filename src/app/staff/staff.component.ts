import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service'
import { ViewStaffService } from '../../services/view-staff.service'
import { from } from 'rxjs';
import * as _ from 'underscore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
  WorkerNameList: any[];
  reportlists: any[];
  WorkerID: any;
  searchTxt:any;
  addGuest:any;
  baseUrl:any;

  constructor(private router: Router, private globalServiceService: GlobalServiceService, private modalService: BsModalService, private viewStaffService: ViewStaffService) {
    this.EndDate = '';
    this.StartDate = '';
    this.WorkerNameList = [];
    this.reportlists = [];
    this.WorkerID = '';
    this.baseUrl='data:image/png;base64,';
  }

  ngOnInit() {
    this.StaffList();
  }
  goToInvoice(){
    
  }
  StaffList() {
    this.viewStaffService.GetStaffList()
      .subscribe(data => {
        console.log(data);
        if(data['data']['errorResponse'])
        {
          if(data['data']['errorResponse']['message']){
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
