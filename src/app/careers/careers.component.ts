import { Component,OnInit, TemplateRef } from '@angular/core';
import { JobopeningsService } from '../../services/jobopenings.service';
import { JobList } from '../job-list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
declare var $: any;

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})

export class CareersComponent implements OnInit {
  jobDetailslist: JobList[];
  jobTitle: string;
  jobDepartment: string;
  jobLocation: string;
  jobExperience: string;
  jobType: string;
  modalRef: BsModalRef;
  filteredPopJob:any;
  filteredPopJoblegth:boolean;
  formJobTitle:any;
  userName:any;
  userEmail:any;
  userPhone:any;
  constructor(private jobListservice: JobopeningsService,private modalService: BsModalService) { 
    this.jobDetailslist = [];
    this.jobTitle = '';
    this.jobDepartment = '';
    this.jobLocation = '';
    this.jobExperience = '';
    this.jobType = '';
    this.filteredPopJob='';
    this.formJobTitle='';
    this.userName='';
    this.userEmail='';
    this.userPhone='';
    this.filteredPopJoblegth=false;
  }

  openModal(applyjob: TemplateRef<any>,jobId) {

    console.log(jobId);
    this.filteredPopJob=this.jobDetailslist.filter(data=>{
      return data['jobId']==jobId;
 })
      if(this.filteredPopJob.length>0){
        this.filteredPopJoblegth=true;
      }

   
    this.formJobTitle=this.filteredPopJob[0].jobTitle;
    console.log(this.filteredPopJob);
    this.modalRef = this.modalService.show(applyjob, { class: 'modal-md' });
  }
  openModelnewJob(applyjob: TemplateRef<any>) {
    this.filteredPopJoblegth=false;
    this.modalRef = this.modalService.show(applyjob, { class: 'modal-md' });
  }
  openModeljobDesc(jobdesc: TemplateRef<any>) {
   this.filteredPopJoblegth=false;
    this.modalRef = this.modalService.show(jobdesc, { class: 'modal-md' });
  }
  ngOnInit() {
    this.jobDetailslist = this.jobListservice.getJobLists();
    console.log(this.jobDetailslist);

  }
  ApplyJob() {
         
         console.log(this.userName);
         console.log(this.userEmail);
         console.log(this.userPhone);
         console.log(this.formJobTitle);
    }
  Searchjobs() {
    let jobTitleArray = this.jobDetailslist.filter(item => {
      return item['jobTitle'].toLowerCase().includes(this.jobTitle.toLowerCase()) || item['department'].toLowerCase().includes(this.jobDepartment.toLowerCase()) || item['location'].toLowerCase().includes(this.jobLocation.toLowerCase()) || item['jobExp'].toString()==this.jobExperience || item['employeeType'].toLowerCase().includes(this.jobType.toLowerCase());

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
    this.jobDetailslist=jobTitleArray;
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
  ngAfterViewInit() {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }
}
