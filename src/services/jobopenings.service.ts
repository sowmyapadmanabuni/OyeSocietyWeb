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
    return this.jobOpeningsList = [{jobId:1,jobTitle:"Java Spring Boot Developer",jobExp:"2-3",department: "Software Development", location: "Bengaluru", employeeType: "Full Time", postDate: "Oct 20, 2019"},
    {jobId:2,jobTitle:"Dot net Developer", jobExp:"5-8", department: "Software Development", location: "Mangalore", employeeType: "Part Time", postDate: "Sep 22, 2019"},
    {jobId:3,jobTitle:"Business Development Officer", jobExp:"0-2", department: "OyeHomes", location: "Mumbai", employeeType: "Half Time", postDate: "Nov 23, 2019"},
    {jobId:4,jobTitle:"Customer Experience Officer", jobExp:"0-2", department: "FeedForward", location: "Belgaum", employeeType: "Excess Time", postDate: "Oct 24, 2019"},
    {jobId:5,jobTitle:"Sales Executive", jobExp:"0-2", department: "FeedForward", location: "Belgaum", employeeType: "Excess Time", postDate: "Oct 24, 2019"}
    
  ]

  }

}
