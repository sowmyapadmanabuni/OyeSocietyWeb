import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobopeningsService {
jobOpeningsList:any[];
  constructor() { 
    this.jobOpeningsList=[];
  }
  getJobLists(){
    return this.jobOpeningsList = [{jobId:1,jobTitle:"Java Developer",jobExp:1,department: "Web Development", location: "Bengaluru", employeeType: "Full Time", postDate: "Oct 20, 2019"},
    {jobId:2,jobTitle:"Angular Developer", jobExp:2, department: "Mobile Development", location: "Mangalore", employeeType: "Part Time", postDate: "Sep 22, 2019"},
    {jobId:3,jobTitle:"Php Developer", jobExp:3, department: "Tab Development", location: "Mumbai", employeeType: "Half Time", postDate: "Nov 23, 2019"},
    {jobId:4,jobTitle:"React Developer", jobExp:4, department: "System Development", location: "Belgaum", employeeType: "Excess Time", postDate: "Oct 24, 2019"},
    {jobId:5,jobTitle:"System Engineer", jobExp:4, department: "Business analyst", location: "Gadag", employeeType: "Full Time", postDate: "Mar 24, 2019"},
    {jobId:6,jobTitle:"Human Resource", jobExp:2, department: "Support", location: "Mysore", employeeType: "Part Time", postDate: "Apr 24, 2019"},
    {jobId:7,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"},
    {jobId:8,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"},
    {jobId:9,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"},
    {jobId:10,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"},
    {jobId:11,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"},
    {jobId:12,jobTitle:"Ui Developer", jobExp:2, department: "Front End Development", location: "Yelhanka", employeeType: "Half Time", postDate: "Apr 24, 2019"}
  ]

  }

}
