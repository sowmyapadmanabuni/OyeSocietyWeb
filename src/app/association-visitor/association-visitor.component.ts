import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'underscore';
import { formatDate } from '@angular/common';
import {UsageReport} from '../../app/models/usage-report';
import {GateEntryUsageReport} from '../../app/models/gate-entry-usage-report';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {UsageReportForExcel} from '../../app/models/usage-report-for-excel';
import {UsageReportService} from '../../services/usage-report.service';
import Swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import {UtilsService} from '../utils/utils.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-association-visitor',
  templateUrl: './association-visitor.component.html',
  styleUrls: ['./association-visitor.component.css']
})
export class AssociationVisitorComponent implements OnInit {
  associations:any= [];
  scopeIP:string;
  ipAddress:string;
  scriptIP:string;
  headers:HttpHeaders;
  startrangedate:string;
  endrangedate:string;
  bsConfig:object;
  usagegroup:any[];
  usagereport:UsageReport[];
  filteredusagereportlength:boolean;
  gateentryusagereport:GateEntryUsageReport[];
  associationID:any;
  visitorType:string;
  visitorloglist:any[];
  visitorloglistnew:any[];
  association_name:string;
  usagereportforexcel:UsageReportForExcel[];
  getUsageReportclicked:boolean;
  insideloadVisitorTypeforonce:boolean;
  asAsnNameforusagereport:string;
  Cities:string[];
  p: number;
  Delivery:any;
  Guest:any;
  STAFF:any;
  Staff:any;
  StaffBiometricEntry:any;
  StaffMissedcallEntry:any;
  StaffFullManualEntry:any;
  AllVisitor:any;
  imgsrc:string;
  Six_to_Eight_Morn:any;
  Eight_to_Ten_Morn:any;
  Ten_to_Twelve_Morn:any;
  Twelve_to_Two:any;
  Two_to_Four:any;
  Four_to_Six:any;
  Six_to_Eight:any;
  Eight_to_Ten_Eve:any;
  Ten_to_Twelve_Eve:any;
  searchTxt:any;
  event:any;

  constructor(private router: Router,
    private http: HttpClient,
    private usagereportservice:UsageReportService,
    private globalServiceService:GlobalServiceService,
    private utilsService:UtilsService) {
    this.scopeIP = "https://api.oyespace.com/";
    this.ipAddress = 'http://api.oyespace.com/';
    this.scriptIP = "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1";
    this.headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-Champ-APIKey', this.scriptIP)
      .append('Access-Control-Allow-Origin', "*");
      this.startrangedate='';
      this.endrangedate='';  

      this.bsConfig = Object.assign({}, {
        containerClass: 'theme-orange',
        dateInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        isAnimated: true
      }); 
    this.usagegroup=[]; 
    this.usagereport=[];  
    this.filteredusagereportlength=false;
    this.gateentryusagereport=[];
    this.visitorType="";
    this.visitorloglist=[];
    this.visitorloglistnew=[];
    this.usagereportforexcel=[];
    this.getUsageReportclicked=false;
    this.insideloadVisitorTypeforonce=false;
    this.asAsnNameforusagereport='';
    this.Cities=_.sortBy(['Bangalore','Chandigarh','Delhi-NCR','Indore','Jaipur','Kanpur','Lucknow','Mumbai','Nagpur','Allahabad','Pune','Chennai','Hyderabad','Kochi','Goa','Hubli','All City'],e=>e);
    this.p=1;
    this.Delivery=0;
    this.Guest=0;
    this.STAFF=0;
    this.Staff=0;
    this.StaffBiometricEntry=0;
    this.StaffMissedcallEntry=0;
    this.StaffFullManualEntry=0;
    this.AllVisitor=0;
    this.imgsrc='http://mediaupload.oyespace.com/Images/';
    this.Six_to_Eight_Morn=0;
    this.Eight_to_Ten_Morn=0;
    this.Ten_to_Twelve_Morn=0;
    this.Twelve_to_Two=0;
    this.Two_to_Four=0;
    this.Four_to_Six=0;
    this.Six_to_Eight=0;
    this.Eight_to_Ten_Eve=0;
    this.Ten_to_Twelve_Eve=0;
    this.associationID=this.globalServiceService.getCurrentAssociationId();
   }

  ngOnInit() {
    //this.getAssociation();
  }

  getAssociation(pincode,AllCity) {
    // return this.http.get(this.scopeIP + 'oyeliving/api/v1/GetAssociationListByAccountID/' + this.globalserviceservice.acAccntID, { headers: this.headers })
    return this.http.get(this.scopeIP + 'oyeliving/api/v1/association/getassociationlist', { headers: this.headers })
    //http://192.168.1.254:52/oyeliving/api/v1/association/getassociationlist
      .subscribe((data) => {
        //console.log(data);
        this.associations = data['data']['associations'];
        //console.log(this.associations);
        if(AllCity == ''){
          this.associations.forEach(itm=>{
         let pin= itm['asPinCode'].slice(0,2);
         //console.log(pin);
         //console.log(typeof pin);
         //console.log(pincode);
         //console.log(typeof pincode);
          if (pin == pincode.toString()) {
            //console.log(pin);
            // this.associations.forEach(item1 => {
            //  if(item1['asPinCode'].startsWith(pincode.toString())){
            //    console.log(item1['asPinCode']);
            //  }
            // })
            this.associations= this.associations.filter(item1 => {
              return item1['asPinCode'].startsWith(pincode.toString());
             })
             //console.log(this.associations);
          }

        })
        }
        
        this.associations = _.sortBy(this.associations, e => e['asAsnName']);
        //console.log(this.associations); //acAccntID asAssnID

      })
  }

  loadAssociationforusagereport(asAsnNameforusagereport){
    //console.log(asAsnNameforusagereport);
  
    this.associations.forEach(iteam =>{
      if (iteam.asAsnName == asAsnNameforusagereport){
        //console.log(iteam.asAssnID);
        this.associationID=iteam.asAssnID;
      }
    })

  }


  getUsageReport() {
    this.Six_to_Eight_Morn = 0;
    this.Eight_to_Ten_Morn = 0;
    this.Ten_to_Twelve_Morn = 0;
    this.Twelve_to_Two = 0;
    this.Two_to_Four = 0;
    this.Four_to_Six = 0;
    this.Six_to_Eight = 0;
    this.Eight_to_Ten_Eve = 0;
    this.Ten_to_Twelve_Eve = 0;


   /* if(this.asAsnNameforusagereport == ''){
      //http://api.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogList
      this.usagereportservice.GetVisitorLogList()
      .subscribe(data=>{
        //console.log(data);
        this.filteredusagereportlength = true;
        this.visitorloglist= data['data']['visitorLog'];
        this.visitorloglist = _.sortBy(this.visitorloglist, e => e['vldCreated']);
        this.visitorloglistnew= this.visitorloglist;
      })
    }
    else{ */
      this.getUsageReportclicked=true;
    //console.log(this.startrangedate);
    //console.log(this.endrangedate);
    //console.log(this.asAsnNameforusagereport);
    //console.log(new Date(formatDate(this.startrangedate, 'yyyy/MM/dd', 'en')));
    //console.log(formatDate(this.startrangedate, 'yyyy/MM/dd', 'en'));
    //console.log(new Date(formatDate(this.endrangedate, 'yyyy/MM/dd', 'en')));
    //console.log(formatDate(this.endrangedate, 'yyyy/MM/dd', 'en'));

    let headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE')
      .append('Access-Control-Allow-Origin', "*");

      let usagereportrequestbody = {
        "StartDate": (this.startrangedate == '' || this.startrangedate == null)?'2019-04-01':formatDate(this.startrangedate,'yyyy-MM-dd','en'),
        "EndDate": (this.endrangedate == '' || this.endrangedate == null)?formatDate(new Date(), 'yyyy-MM-dd','en'):formatDate(this.endrangedate,'yyyy-MM-dd','en'),
        "ASAssnID":this.associationID
      }
    //console.log(usagereportrequestbody);
    //console.log(formatDate(new Date(), 'yyyy-MM-dd:hh:mm:ss', 'en'));
    //console.log(formatDate(this.endrangedate, 'yyyy-MM-dd', 'en'));
    let scopeIP=this.utilsService.getIPaddress();
    return this.http.post(scopeIP + 'oyesafe/api/v1/VisitorLog/GetVisitorLogByDates', JSON.stringify(usagereportrequestbody), { headers: headers })
      //http://localhost:64284/oyesafe/api/v1/VisitorLog/GetVisitorLogByDates
      .subscribe((data) => {
        this.filteredusagereportlength = true;
        //console.log(data);
        this.visitorloglist= data['data']['visitorlog'];
        this.visitorloglist = _.sortBy(this.visitorloglist, e => e['vldCreated']);
        this.visitorloglistnew= this.visitorloglist
        let visitorloglistTypeGroup = _.groupBy(this.visitorloglist, 'vlVisType');
        //console.log(visitorloglistTypeGroup);
        //console.log(Object.keys(visitorloglistTypeGroup).length);
        this.Delivery = 0;
        this.Guest = 0;
        this.StaffFullManualEntry = 0;
        this.Staff = 0;
        this.StaffBiometricEntry = 0;
        this.StaffMissedcallEntry = 0;
        this.AllVisitor = 0;

        for(let item in visitorloglistTypeGroup){
          if(item == 'Delivery'){
            this.Delivery = visitorloglistTypeGroup[item].length;
          }
          else if(item == 'Guest'){
            this.Guest = visitorloglistTypeGroup[item].length;
          }
          else if(item == 'STAFF'){
            this.StaffFullManualEntry = visitorloglistTypeGroup[item].length;
          }
          else if(item == 'Staff'){
            this.Staff = visitorloglistTypeGroup[item].length;
          }
          else if(item == 'Staff Biometric Entry'){
            this.StaffBiometricEntry = visitorloglistTypeGroup[item].length;
          }
          else if(item == 'Staff Missed call Entry'){
            this.StaffMissedcallEntry = visitorloglistTypeGroup[item].length;
          }

            this.AllVisitor = this.visitorloglist.length;
        }
        this.association_name= data['data']['visitorlog'][0]['vlGtName'];
        let result = this.visitorloglist.forEach(itm=>{
          return new Date(itm['vlEntryT']).getHours() == 14;
        })
        //console.log(result);
        this.visitorloglist.forEach(item=>{
          let _date=new Date(item['vlEntryT']);
          //console.log(item['vlEntryT']);
          //console.log(_date.getHours());
          let _hour=_date.getHours();
          if(_hour == 6 || _hour == 7 ){
            this.Six_to_Eight_Morn += 1;
          }
          if(_hour == 8 || _hour == 9 ){
            this.Eight_to_Ten_Morn += 1;
          }
          if(_hour == 10 || _hour == 11 ){
            this.Ten_to_Twelve_Morn += 1;
          }
          if(_hour == 12 || _hour == 13 ){
            this.Twelve_to_Two += 1;
          }
          if(_hour == 14 || _hour == 15 ){
            this.Two_to_Four += 1;
          }
          if(_hour == 16 || _hour == 17 ){
            this.Four_to_Six += 1;
          }
          if(_hour == 18 || _hour == 19 ){
            this.Six_to_Eight += 1;
          }
          if(_hour == 20 || _hour == 21 ){
            this.Eight_to_Ten_Eve += 1;
          }
          if(_hour == 22 || _hour == 23 ){
            this.Ten_to_Twelve_Eve += 1;
          }
        })
      },
      err=>{
        //console.log(err);
        Swal.fire({
          title: "Error",
          text: `${err['error']['message']}`,
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      })
    //}
    
  }

  backtoallsinglereportasn() {
    this.router.navigate(['usagereportchild']);
  }
  loadVisitorType(visitorType){
    //console.log(visitorType);
    this.insideloadVisitorTypeforonce=true;
    this.usagereportforexcel=[];
    this.visitorloglist=this.visitorloglistnew;
    switch(visitorType){
      case 'All Visitor':
        this.loadvisitortype(visitorType);
        break;
      case 'Delivery':
        this.loadvisitortype(visitorType);
        break;
      case 'STAFF':
        this.loadvisitortype(visitorType);
        break;
      case 'Staff Biometric Entry':
        this.loadvisitortype(visitorType);
        break;
      case 'Visitor':
        this.loadvisitortype(visitorType);
        break;
      case 'Vehicle':
        this.loadvisitortype(visitorType);
        break;
      case 'Guest':
        this.loadvisitortype(visitorType);
        break;
      case 'Staff Missed call Entry':
        this.loadvisitortype(visitorType);
        break;
      case 'Staff':
        this.loadvisitortype(visitorType);
        break;
    }

    ////console.log(this.visitorloglist);
    

  }
  exportAsXLSX(): void {
    if(this.insideloadVisitorTypeforonce){
      this.exportAsExcelFile(this.usagereportforexcel, this.association_name + "_ASSOCIATION");
    }
    else if(!this.insideloadVisitorTypeforonce){
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
      this.exportAsExcelFile(this.usagereportforexcel, this.association_name + "_ASSOCIATION");
    }

  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  loadvisitortype(visitorType){
    this.filteredusagereportlength=true;
    if (visitorType == 'Delivery') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Staff') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'All Visitor') {
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Staff Biometric Entry') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Guest') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Staff Missed call Entry') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'STAFF') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Visitor') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
    if (visitorType == 'Vehicle') {
      this.visitorloglist = this.visitorloglist.filter(filterrqst => {
        return filterrqst['vlVisType'] == visitorType;
      })
      if (this.visitorloglist.length == 0) {
        this.filteredusagereportlength=false;
        Swal.fire({
          title: "Error",
          text: "No Records Found",
          type: "error",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
      }
      this.visitorloglist.forEach(itm=>{
        this.usagereportforexcel.push(new UsageReportForExcel(itm['vlVisType'],
                                                              itm['vlfName'],
                                                              itm['unUniName'],
                                                              formatDate(itm['vldCreated'], 'dd/MM/yyyy', 'en'),
                                                              formatDate(itm['vldUpdated'], 'dd/MM/yyyy', 'en'),
                                                              itm['vlengName']));
      })
    }
  }
  loadcitieslistforusagereport(city) {
    //console.log(city);
    this.asAsnNameforusagereport='';
    this.AllVisitor=0;
    this.Delivery=0;
    this.Guest=0;
    this.STAFF=0;
    this.Staff=0;
    this.StaffBiometricEntry=0;
    this.StaffMissedcallEntry=0;
    this.StaffFullManualEntry=0;
    this.visitorType="";
    this.visitorloglist=[];

    switch(city){
      case 'Bangalore':
        this.getAssociation(56,'');
        return;
      case 'Chandigarh':
        this.getAssociation(16,'');
        return;
      case 'Delhi-NCR':
        this.getAssociation(11,'');
        return;
      case 'Indore':
        this.getAssociation(45,'');
        return;
      case 'Jaipur':
        this.getAssociation(30,'');
        return;
      case 'Kanpur':
        this.getAssociation(20,'');
        return;
      case 'Lucknow':
        this.getAssociation(22,'');
        return;
      case 'Mumbai':
        this.getAssociation(40,'');
        return;
      case 'Nagpur':
        this.getAssociation(44,'');
        return;
      case 'Allahabad':
        this.getAssociation(21,'');
        return;
      case 'Pune':
        this.getAssociation(41,'');
        return;
      case 'Chennai':
        this.getAssociation(60,'');
        return;
      case 'Hyderabad':
        this.getAssociation(50,'');
        return;
      case 'Kochi':
        this.getAssociation(68,'');
        return;
      case 'Hubli':
        this.getAssociation(58,'');
        return;
      case 'All City':
        this.getAssociation(0,'All City');
        return;
    }

  }
  onPageChange(event) {
    this.event = event;
  }
}
