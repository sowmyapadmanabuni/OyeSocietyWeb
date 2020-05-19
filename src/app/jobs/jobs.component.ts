import { Component, OnInit, TemplateRef } from '@angular/core';
import { JobopeningsService } from '../../services/jobopenings.service';
import { JobList } from '../job-list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


//import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit {
  jobDetailslist: JobList[];
  jobTitle: string;
  jobDepartment: string;
  jobLocation: string;
  jobExperience: string;
  jobType: string;
  modalRef: BsModalRef;
  filteredPopJob: any;
  filteredPopJoblegth: boolean;
  formJobTitle: any;
  userName: any;
  userEmail: any;
  userPhone: any;
  userlastName: any;
  userLocation: any;
  userExp: any;
  userworkFor: any;
  userDesig: any;
  userRelocate: any;
  userComments: any;
  filename: any;
  order: any;
  ipAddress: string;

  constructor(private jobListservice: JobopeningsService, private modalService: BsModalService, private http: HttpClient) {
    this.jobDetailslist = [];
    this.jobTitle = '';
    this.jobDepartment = '';
    this.ipAddress = 'http://devapi.scuarex.com/oyeliving/api/v1/CreateJobApplication';

    this.jobLocation = '';
    this.jobExperience = '';
    this.jobType = '';
    this.filteredPopJob = '';
    this.formJobTitle = '';
    this.userName = '';
    this.userEmail = '';
    this.userPhone = '';
    this.userlastName = '';
    this.userLocation = '';
    this.userExp = '';
    this.userworkFor = '';
    this.userDesig = '';
    this.userRelocate = '';
    this.userComments = '';
    this.filename = '';
    this.filteredPopJoblegth = false;
  }
  openModal(applyjob: TemplateRef<any>, jobId) {

    console.log(jobId);
    this.filteredPopJob = this.jobDetailslist.filter(data => {
      return data['jobId'] == jobId;
    })
    if (this.filteredPopJob.length > 0) {
      this.filteredPopJoblegth = true;
    }


    this.formJobTitle = this.filteredPopJob[0].jobTitle;
    console.log(this.filteredPopJob);
    this.modalRef = this.modalService.show(applyjob, { class: 'modal-md' });
  }
  openModelnewJob(applyjob: TemplateRef<any>) {
    this.filteredPopJoblegth = false;
    this.modalRef = this.modalService.show(applyjob, { class: 'modal-md' });
  }
  ngOnInit() {
    // this.jobDetailslist = this.jobListservice.getJobLists();
    this.jobListservice.getJobLists()

      .subscribe(data => {

        console.log(data)
        this.jobDetailslist = data['data']['jobDetails'];
        console.log(this.jobDetailslist);
      },
        err => { console.log(err) });
    console.log(this.jobDetailslist);

  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
  ApplyJob() {

    console.log(this.userName);
    console.log(this.userEmail);
    console.log(this.userPhone);
    console.log(this.userlastName);
    console.log(this.userLocation);
    console.log(this.userExp);
    console.log(this.userworkFor);
    console.log(this.userDesig);
    console.log(this.userRelocate);
    console.log(this.userComments);
    console.log(this.filename);
    console.log(this.formJobTitle);
    let creatFormRequestBody =

    {
      "FirstName": this.userName,
      "LastName": this.userlastName,
      "Email": this.userEmail,
      "ContactNumber": this.userPhone,
      "CurrLocation": this.userLocation,
      "TotalExprYrs": this.userExp,
      "CurrworkingFor": this.userworkFor,
      "CurrDesignation": this.userDesig,
      "WillingToRelocate": this.userRelocate,
      "HelpComments": this.userComments,
      "ResumeName": this.filename
    }
    console.log(creatFormRequestBody);
    let headers = this.getHttpheaders();
    this.http.post('http://devapi.scuarex.com/oyeliving/api/v1/CreateJobApplication', (creatFormRequestBody), { headers: headers })
      .subscribe(data => {
        this.modalRef.hide();
        console.log(data)
        Swal.fire({
          title: "Job has been applied successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {
              this.userName = '';
              this.userEmail = '';
              this.userPhone = '';
              this.userlastName = '';
              this.userLocation = '';
              this.userExp = '';
              this.userworkFor = '';
              this.userDesig = '';
              this.userRelocate = '';
              this.userComments = '';
              this.filename = '';
              this.formJobTitle = '';
            }
          }
        )
      },
        err => { console.log(err) });
  }
  Searchjobs() {
    let jobTitleArray = this.jobDetailslist.filter(item => {
      return item['jobTitle'].toLowerCase().includes(this.jobTitle.toLowerCase()) || item['department'].toLowerCase().includes(this.jobDepartment.toLowerCase()) || item['location'].toLowerCase().includes(this.jobLocation.toLowerCase()) || item['jobExp'].toString() == this.jobExperience || item['employeeType'].toLowerCase().includes(this.jobType.toLowerCase());

    });
    // let jobDeptArray = this.jobDetailslist.filter(item => {
    //   return item['department'].toLowerCase().includes(this.jobDepartment.toLowerCase());

    // });
    // let jobLocArray = this.jobDetailslist.filter(item => {
    //   return item['location'].toLowerCase().includes(this.jobLocation.toLowerCase());

    // });
    // let jobExpArray = this.jobDetailslist.filter(item => {
    //   // console.log(typeof item['jobExp']);
    //   // console.log(typeof item['jobExp'].toString());
    //   return item['jobExp'].toString()==this.jobExperience;

    // });
    // let jobTypeArray = this.jobDetailslist.filter(item => {
    //   return item['employeeType'].toLowerCase().includes(this.jobType.toLowerCase());

    //})
    //let filteredJobResults=[...jobTitleArray,...jobDeptArray,...jobLocArray,...jobExpArray,...jobTypeArray];
    console.log(jobTitleArray);
    this.jobDetailslist = jobTitleArray;
    //console.log(filteredJobResults);
    // console.log(jobDeptArray);
    // console.log(jobLocArray);
    // console.log(jobExpArray);
    // console.log(jobTypeArray);
    // //console.log(jobTitleArray);
    // // console.log(this.jobTitle);
    // // console.log(this.jobDepartment);
    // // console.log(this.jobLocation);
    // console.log(this.jobExperience);
    // // console.log(this.jobType);

  }
  openModeljobdetails(jobdesc: TemplateRef<any>, jobs) {
    // this.filteredPopJoblegth=false;
    console.log(jobs);
    this.filteredPopJob = this.jobDetailslist.filter(data => {
      return data['jtid'] == jobs;
    })
    console.log(this.filteredPopJob);
    this.modalRef = this.modalService.show(jobdesc, { class: 'modal-lg' });
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }
}
