import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
//import * as swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX from 'xlsx';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-excel-unit-upload',
  templateUrl: './excel-unit-upload.component.html',
  styleUrls: ['./excel-unit-upload.component.css']
})
export class ExcelUnitUploadComponent implements OnInit {
  excelUnitList: any[];
  ShowExcelUploadDiscription: boolean;
  ShowExcelDataList: boolean;
  blBlkName: any;
  ACAccntID: any;
  currentAssociationID: any;
  config: any;
  blocks: any[];
  currentSelectedBlockID: any;
  duplicateUnitrecordexist;
  totalUnitcount;
  unitdetailscreatejson;
  isunitdetailsempty:boolean;
  canDoUnitLogicalOrder:boolean;
  InvalidBlocknamePresent:boolean;
  indexToCheckValidBlockName:number;
  numberofunitexistence:any;
  valueExcelUnitArr:any[];
  blockTabId:any;
  ValidBlockName:any;
  duplicateUnitCount:number;
  invalidUnitCount:number;
  arraylist1:unknown[];
  calculationTypes: { name: string; displayName: string; }[];
  unitsuccesscount:number;
  unitprogressbartemplate:TemplateRef<any>;
  progressbarmodalRef: BsModalRef;
  unitprogressvaluemax:number;
  unitprogressvalue:number;
  occupancy = [
    "Sold Owner Occupied Unit",
    "Sold Tenant Occupied Unit",
    "Sold Vacant Unit",
    "UnSold Vacant Unit",
    "UnSold Tenant Occupied Unit"
  ]
  unittypedata =[
    "FLAT",
    "VILLA",
    "VACCANT PLOT"
  ]
  rowjson = {
    "blockid":"",
    "blockTmpid":"",
    "blockname": "",
    "blocktype": "",
    "duedate": "",
    "invoicedate": "",
    "invoicefrequency": "",
    "latepaymentcharge": "",
    "maintenancevalue": "",
    "manageremailid": "",
    "managermobileno": "",
    "fecilitymanagername": "",
    "measurementtype": "Sqft",
    "paymentcharge": "",
    "ratevalue": "",
    "startdate": "",
    "units": "",

    "isnotvalidblockname":false,
    "isnotvalidblocktype":false,
    "isnotvalidmanageremailid":false,
    "isnotvalidmanagermobileno":false,
    "isnotvalidfecilitymanagername":false,
    "isnotvalidunits":false,
    "isUnitsCreatedUnderBlock":false,
    "isUnitsCreatedUnderBlock1":true,
    "isblockdetailsempty1":true,
    "isNotBlockCreated":true,
    "isBlockCreated":true

  }
  constructor(private router: Router, private modalService: BsModalService,private viewUniService: ViewUnitService,private http: HttpClient,
    private globalService: GlobalServiceService) {
    this.arraylist1=[];
    this.excelUnitList = [];
    this.ShowExcelUploadDiscription = true;
    this.ShowExcelDataList = false;
    this.blBlkName = 'Select Block Name';
    this.ACAccntID = this.globalService.getacAccntID();
    //units bulkupload
    this.calculationTypes = [
      { "name": "FlatRateValue","displayName":"Flat Rate Value" },
      { "name": "dimension","displayName":"Dimension Based"  }
    ];
    this.duplicateUnitCount=0;
      this.invalidUnitCount=0;
    this.InvalidBlocknamePresent = false;
    this.numberofunitexistence=0;
    this.valueExcelUnitArr=[];
    this.canDoUnitLogicalOrder = true;
    this.blockTabId=0;
    this.iindex=0;
    this.ValidBlockName='';
    this.duplicateUnitrecordexist=false;
    this.unitrecordDuplicateUnitnameModified=false;
    this.totalUnitcount=0;
    this.unitsuccesscount=0;
    this.unitprogressvaluemax=0;
    this.unitprogressvalue=0;
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    //pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };
  }
  ngOnInit() {
    this.getBlocks();
  }
  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  unitfinalcount;
  getblockcount() {
    this.blocks.forEach(ele => {
      if (ele.blBlockID == this.currentSelectedBlockID) {
        this.unitfinalcount = ele.blNofUnit;
        console.log(this.unitfinalcount)
      }
    })
  }
  upLoad() {
    if(this.blBlkName=="Select Block Name"){
      alert("Please select the block");
    }
    else{
      document.getElementById("file_upload_id").click();
    }
  }
  cancelbulkupload(ev){
    this.router.navigate(['units']);
     }
  getBlocks() {
    this.viewUniService.getBlocks(this.currentAssociationID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      console.log('data.data.blocksByAssoc', data.data.blocksByAssoc);
      this.blocks = data.data.blocksByAssoc;
    });
  }
  getAllUnitDetailsByBlockID(blBlockID, blBlkName) {
    this.currentSelectedBlockID = blBlockID;
    this.blBlkName=blBlkName;
    console.log('Current selected BlockID', this.currentSelectedBlockID)
    this.getblockcount();
  }
  onFileChange(ev,UpdateBlockUnitCountTemplate,unitprogressbartemplate: TemplateRef<any>) {
    $(".se-pre-con")[0].innerHTML = `<span style="position: absolute;top: 67%;left: 42%;font-size: 22px;color: red;">Validating unit records</span><br>
    <span style="position: absolute;top: 74%;left: 34%;font-size: 22px;color: red;">please wait don't navigate back or reload page</span>`;
    $(".se-pre-con").show();
    this.unitsuccesscount = 0;
    this.unitprogressbartemplate = unitprogressbartemplate;
    console.log(this.finalblocknameTmp);
    let orderBlockinLogically=[];
    orderBlockinLogically = _.sortBy(this.finalblocknameTmp, "name");
    console.log(orderBlockinLogically);
    this.finalblocknameTmp = [];
    this.finalblocknameTmp = orderBlockinLogically;
    console.log(this.finalblocknameTmp);
    this.ValidBlockName = this.finalblocknameTmp[this.indexToCheckValidBlockName];
    console.log('ValidBlockName ',this.ValidBlockName);


    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //const dataString = JSON.stringify(jsonData);
      console.log(jsonData['Sheet1']);
      this.arraylist1 = jsonData['Sheet1']
      this.ShowExcelUploadDiscription = false;
      this.ShowExcelDataList = true;
      //this.createExpense(jsonData['Sheet1']);
      this.excelunitsuploaddata(this.arraylist1,UpdateBlockUnitCountTemplate)

    }
    reader.readAsBinaryString(file);
  }
  isValidUnitRecord:boolean;
  unitrecordDuplicateUnitnameModified;
  finalblockname = [];
  finalblocknameTmp = [];

  blocksArray = []
  unitlistjson = {}
  blockidtmp={};
  isExcelDataExceed:boolean;
  iindex:any;
  excelunitsuploaddata(exceldata,UpdateBlockUnitCountTemplate) {
    this.duplicateUnitCount=0;
    this.invalidUnitCount=0;
    this.unitlistuniquejsonagainfiltered = [];
    this.isunitdetailsempty = false;
    this.unitrecordDuplicateUnitnameModified = false;
    this.duplicateUnitrecordexist = false;
    console.log(exceldata.length);
    // exceldata.forEach(item => {
    //   if (item.blockname.toLowerCase() != this.ValidBlockName['name'].toLowerCase()) {
    //     console.log(item.blockname);
    //     this.InvalidBlocknamePresent = true;
    //   }
    // })
    if(exceldata.length==0){
      $(".se-pre-con").fadeOut("slow");
      Swal.fire({
        title: 'Please fill all the fields',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else if(this.InvalidBlocknamePresent){
      $(".se-pre-con").fadeOut("slow");
      Swal.fire({
        title: 'Please Check Blockname',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {
            this.InvalidBlocknamePresent = false;
          }
      })
    }
    else{
      console.log(this.blocksArray)
      // console.log(this.finalblockname);
      console.log(exceldata);
      //Below code only for excel units upload here to
      var data = JSON.parse(JSON.stringify(this.rowjson))
      data.Id =1;
      data.blockname=this.blBlkName;
      data.blockTmpid=1;
      data.blocktype= "Residential";
      this.blocksArray.push(data);
      //Upto here
      // console.log(this.blocksArray);
      console.log(this.unitlistjson);
      let _blkname = '';
      this.isValidUnitRecord=false;
      this.isExcelDataExceed=false;
      
      //
      //console.log(new Set(exceldata).size !== exceldata.length);
     /* let valueArr = exceldata.map(item => { return item.flatno.toLowerCase() });
      let isDuplicate = valueArr.some((item, idx) => {
        return valueArr.indexOf(item) != idx
      });
      if (isDuplicate) {
            Swal.fire({
              title: 'Duplicate Unitname Exist',
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
            })        
          }
          else{ */
          
      
              exceldata.forEach((unitonce,i) => {
        
                // console.log(exceldata.Id)
                // this.unitdetails[i] ={}
                // Object.keys(unitonce).forEach(datails=>{
                //   console.log(datails)
                //   this.unitdetails[i][datails] ={required:true};
                // })
                if (this.blBlkName.toLowerCase() == unitonce.blockname.toLowerCase()) {
                  //  this.blockdetailsfinalresponce.forEach(obj=>{
                  //    unitonce.blockid = obj
        
                  //  })
                  // console.log(this.blBlkName,unitonce.blockname);
               
                      _blkname = this.blBlkName;
                     let unitslength=Number(this.unitfinalcount)
        
                      if(exceldata.length<=unitslength){

                        console.log(this.currentSelectedBlockID);
                        unitonce.blockid = this.currentSelectedBlockID;
                        unitonce.Id = this.blBlkName+i+1;
                        unitonce.unitTmpid='';
                        unitonce.isSingleUnitDataEmpty=true;
                        unitonce.hasNoDuplicateUnitname=false;
                        unitonce.disableField=false;
                        unitonce.isnotvalidflatno =false,
                        unitonce.isnotvalidunittype=false,
                        unitonce.isnotvalidownershipstatus=false,
                        unitonce.isnotvalidownerfirstname=false,
                    
                        unitonce.isnotvalidownerlastname=false,
                    
                        unitonce.isnotvalidownermobilenumber=false,
                    
                        unitonce.isnotvalidowneremaiid=false,
                    
                        unitonce.isnotvalidtenantfirstname=false,
                    
                        unitonce.isnotvalidtenantlastname=false,
                    
                        unitonce.isnotvalidtenantmobilenumber=false,
                        unitonce.isnotvalidtenantemaiid=false;
                        unitonce.InvalidUnitDimension = false;
                        unitonce.InvalidUnitRate = false;
                        unitonce.isUnitCreated=false;	
                        unitonce.isUnitNotCreated=true;
                        unitonce.isUnitNameModifiedForDuplicateRecord='No';
                        if (!this.unitlistjson[this.blBlkName]) {
                          this.unitlistjson[this.blBlkName] = []
                        }
                        Object.keys(this.unitlistjson).forEach(element => {
                          this.unitlistjson[element].forEach(detalisdata => {
              
                            if (this.blBlkName == element) {
                              if (!detalisdata.blockname) {
                                this.unitlistjson[this.blBlkName] = []
                              }
                            }
                          })
                        })
                        this.unitlistjson[this.blBlkName].push(unitonce)
                        this.isValidUnitRecord=true;  
                        console.log(this.unitlistjson);
                        console.log(this.unitlistjson[this.blBlkName]);

                      }
                      else{
                     $(".se-pre-con").fadeOut("slow");
                        this.isExcelDataExceed=true;	
                        console.log('this.isExcelDataExceed=true');
                        Swal.fire({
                          title: "Please Check uploaded no of units should not more than given no of units for perticualar Block",
                          text: "",
                          confirmButtonColor: "#f69321",
                          confirmButtonText: "OK"
                        })
                        //document.getElementById('uploadexcelscreen').style.display = 'block'
                       // document.getElementById('unitsbulkold').style.display = 'none'
                      }
                    
               
                }
              });
        
          //}
      // this.validateUnitDetailsField(_blkname);
      console.log("unit data what contains",this.unitlistjson);
      setTimeout(()=>{
        if(this.isValidUnitRecord){
          this.gotonexttab1('',_blkname,this.iindex);
        }
      },this.arraylist1.length * 1500)
    }
  }
  gotonexttab1(ev, name,index) {
    console.log(name);
     
    this.unitmovingnexttab1(name,index);

  }
  unitmovingnexttab1(name,index) {
    //if (this.isunitdetailsempty) {
      this.submitunitdetails1(name,index);
    //}
  }
  // getUnittype(Id,unittype,name){
  //   console.log(Id,unittype,name);
  //   this.validateUnitDetailsField(name);
  // }
  // getOwnerShipStatus(Id,unittype,name){
  //   console.log(Id,unittype,name);
  //   this.validateUnitDetailsField(name);
  // }
  exceptionMessage1='';
  SubmitOrSaveAndContinue1='SAVE AND CONTINUE';
  // nextObjId1='';
  // isNextIetrationEnabled1;
  // nextBlckId1='';
  unitlistuniquejsonagainfiltered=[];
  unitlistuniquejson=[];
  unitlistduplicatejson=[];
  unitsuccessarray =[]
  unitlistuniquejson1 = [];
  message;
  submitunitdetails1(name,index) {
    this.duplicateUnitCount=0;
    this.invalidUnitCount=0;
    this.unitsuccessarray = [];
   /* let valueManualUnitnameArr = this.unitlistjson[name].map(item => { return item.flatno.toLowerCase() });
    let isManualUnitnameDuplicate = valueManualUnitnameArr.some((item, idx) => {
      return valueManualUnitnameArr.indexOf(item) != idx
    });
    if (isManualUnitnameDuplicate) {
      Swal.fire({
        title: 'Duplicate Unitname Exist',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else { */
      // let abc = Object.keys(this.unitlistjson);
      // this.finalblocknameTmp = this.finalblocknameTmp.filter(item => {
      //   return item != name;
      // })
      console.log(this.finalblocknameTmp);
      console.log(this.finalblocknameTmp.length);
      if (this.finalblocknameTmp.length == (this.iindex + 2)) {
        console.log('iFinsideLTab');
        this.finalblocknameTmp[this.iindex + 1]['displaytext'] = "Submit";
        console.log(this.finalblocknameTmp);
      }
      this.iindex += 1;
      this.exceptionMessage1 = '';
      console.log(name);
      console.log(this.unitlistjson[this.blBlkName]);
      console.log(this.unitlistjson);
      let date = new Date();
      var getDate = date.getDate();
      var getMonth = date.getMonth() + 1;
      var getFullYear = date.getFullYear();
      var currentdata = getDate + "-" + getMonth + "-" + getFullYear;
      //this.unitsuccessarray=[];
      console.log(date)

    // let ipAddress = this.utilsService.createUnit();
    // let unitcreateurl = `${ipAddress}oyeliving/api/v1/unit/create`
    // 
    /* if (this.unitlistduplicatejson.length>0) {
       this.unitlistjson[name] = [];
       this.unitlistjson[name] = this.unitlistduplicatejson;
       console.log(this.unitlistjson[name]);
       this.duplicateUnitrecordexist= true;
     }
     else { */
    if (this.unitrecordDuplicateUnitnameModified) {
      $(".se-pre-con").show();
      // this.unitsuccesscount = 0;
      let tempArr = [];
      this.unitlistjson[this.blBlkName].forEach(iitm => {
        if (iitm.disableField == false) {
          tempArr.push(iitm);
        }
      })
      this.unitlistjson[this.blBlkName] = [];
      this.unitlistjson[this.blBlkName] = tempArr;
      console.log(this.unitlistjson[this.blBlkName]);
      this.duplicateUnitrecordexist=false;
    }
    else{
      // this.unitlistjson[this.blBlkName].forEach(iitm => {
      //   console.log(iitm.flatno.toLowerCase());
      //   let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == iitm.flatno.toLowerCase());
      //   console.log(found);
      //   console.log(this.unitlistuniquejson);
      //   if (found) {
      //     this.unitlistduplicatejson.push(iitm);
      //     console.log(this.unitlistduplicatejson);
      //     this.duplicateUnitrecordexist = true;
      //   }
      //   else {
      //     this.unitlistuniquejson.push(iitm);
      //     iitm.hasNoDuplicateUnitname = true;
      //     console.log(this.unitlistuniquejson);
      //   }
      // })
      this.unitlistjson[this.blBlkName].forEach(item=>{
        if (item.ownershipstatus == "Sold Owner Occupied Unit" || item.ownershipstatus == "Sold Vacant Unit") {
          if (item.flatno == "" || item.flatno == undefined ||
            item.unittype == "" || item.unittype == undefined ||
            item['unit dimension'] == "" || item['unit dimension'] == undefined ||
            item['Unit Calculation Type'] == "" || item['Unit Calculation Type'] == undefined ||
            item['unit rate'] == "" || item['unit rate'] == undefined ||
            item.owneremaiid == "" || item.owneremaiid == undefined ||
            item.ownerfirstname == "" || item.ownerfirstname == undefined ||
            item.ownerlastname == "" || item.ownerlastname == undefined ||
            item.ownermobilenumber == "" || item.ownermobilenumber == undefined
          ) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
            this.invalidUnitCount += 1;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined &&
            item['unit dimension'] != "" && item['unit dimension'] != undefined &&
            item['Unit Calculation Type'] != "" && item['Unit Calculation Type'] != undefined &&
            item['unit rate'] != "" && item['unit rate'] != undefined &&
            item.owneremaiid != "" && item.owneremaiid != undefined &&
            item.ownerfirstname != "" && item.ownerfirstname != undefined &&
            item.ownerlastname != "" && item.ownerlastname != undefined &&
            item.ownermobilenumber != "" && item.ownermobilenumber != undefined
          ) {
            this.unitlistuniquejson.push(item);

            // let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
            // console.log(found);
            // if (found) {
            //   this.unitlistduplicatejson.push(item);
            //   this.duplicateUnitrecordexist = true;
            // }
            // else {
            //   this.unitlistuniquejson.push(item);
            //   item.hasNoDuplicateUnitname = true;
            //   item.disableField=true;
            // }
          }
        }
        else if (item.ownershipstatus == "Sold Tenant Occupied Unit") {
          console.log(item);
          if (item.flatno == "" || item.flatno == undefined ||
            item.owneremaiid == "" || item.owneremaiid == undefined ||
            item.ownerfirstname == "" || item.ownerfirstname == undefined ||
            item.ownermobilenumber == "" || item.ownermobilenumber == undefined ||
            item.unittype == "" || item.unittype == undefined ||
            item['unit dimension'] == "" || item['unit dimension'] == undefined ||
            item['Unit Calculation Type'] == "" || item['Unit Calculation Type'] == undefined ||
            item['unit rate'] == "" || item['unit rate'] == undefined ||
            item.ownerlastname == "" || item.ownerlastname == undefined ||
            item.tenantfirstname == "" || item.tenantfirstname == undefined ||
            item.tenantlastname == "" || item.tenantlastname == undefined ||
            item.tenantmobilenumber == "" || item.tenantmobilenumber == undefined ||
            item.tenantemaiid == "" || item.tenantemaiid == undefined) {
            console.log('Sold Tenant Occupied Unit-duplicate')
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
            this.invalidUnitCount += 1;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.owneremaiid != "" && item.owneremaiid != undefined &&
            item.ownerfirstname != "" && item.ownerfirstname != undefined &&
            item.ownermobilenumber != "" && item.ownermobilenumber != undefined &&
            item.unittype != "" && item.unittype != undefined &&
            item['unit dimension'] != "" && item['unit dimension'] != undefined &&
            item['Unit Calculation Type'] != "" && item['Unit Calculation Type'] != undefined &&
            item['unit rate'] != "" && item['unit rate'] != undefined &&
            item.ownerlastname != "" && item.ownerlastname != undefined &&
            item.tenantfirstname != "" && item.tenantfirstname != undefined &&
            item.tenantlastname != "" && item.tenantlastname != undefined &&
            item.tenantmobilenumber != "" && item.tenantmobilenumber != undefined &&
            item.tenantemaiid != "" && item.tenantemaiid != undefined) {
            console.log('Sold Tenant Occupied Unit-unique')
            this.unitlistuniquejson.push(item);

            // let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
            // console.log(found);
            // if (found) {
            //   this.unitlistduplicatejson.push(item);
            //   this.duplicateUnitrecordexist = true;
            // }
            // else {
            //   this.unitlistuniquejson.push(item);
            //   item.hasNoDuplicateUnitname = true;
            //   item.disableField = true;
            // }
          }
        } 
        else if (item.ownershipstatus == "UnSold Tenant Occupied Unit") {
          if (item.flatno == "" || item.flatno == undefined ||
            item.unittype == "" || item.unittype == undefined ||
            item['unit dimension'] == "" || item['unit dimension'] == undefined ||
            item['Unit Calculation Type'] == "" || item['Unit Calculation Type'] == undefined ||
            item['unit rate'] == "" || item['unit rate'] == undefined ||
            item.tenantfirstname == "" || item.tenantfirstname == undefined ||
            item.tenantlastname == "" || item.tenantlastname == undefined ||
            item.tenantmobilenumber == "" || item.tenantmobilenumber == undefined ||
            item.tenantemaiid == "" || item.tenantemaiid == undefined) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
            this.invalidUnitCount += 1;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined &&
            item['unit dimension'] != "" && item['unit dimension'] != undefined &&
            item['Unit Calculation Type'] != "" && item['Unit Calculation Type'] != undefined &&
            item['unit rate'] != "" && item['unit rate'] != undefined &&
            item.tenantfirstname != "" && item.tenantfirstname != undefined &&
            item.tenantlastname != "" && item.tenantlastname != undefined &&
            item.tenantmobilenumber != "" && item.tenantmobilenumber != undefined &&
            item.tenantemaiid != "" && item.tenantemaiid != undefined) {
            this.unitlistuniquejson.push(item);
            //  let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
            // console.log(found);
            // if (found) {
            //   this.unitlistduplicatejson.push(item);
            //   this.duplicateUnitrecordexist = true;
            // }
            // else {
            //   this.unitlistuniquejson.push(item);
            //   item.hasNoDuplicateUnitname = true;
            //   item.disableField = true;
            // }
          }
        }
        else if (item.ownershipstatus == "UnSold Vacant Unit") {
          if (item.flatno == "" || item.flatno == undefined ||
          item.unittype == "" || item.unittype == undefined ||
          item['unit dimension'] == "" || item['unit dimension'] == undefined ||
          item['Unit Calculation Type'] == "" || item['Unit Calculation Type'] == undefined ||
          item['unit rate'] == "" || item['unit rate'] == undefined) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
            this.invalidUnitCount += 1;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined  &&
            item['unit dimension'] == "" && item['unit dimension'] == undefined &&
            item['Unit Calculation Type'] == "" && item['Unit Calculation Type'] == undefined &&
            item['unit rate'] == "" && item['unit rate'] == undefined) {
              this.unitlistuniquejson.push(item);
          
            //   let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
            // console.log(found);
            // if (found) {
            //   this.unitlistduplicatejson.push(item);
            //   this.duplicateUnitrecordexist = true;
            // }
            // else {
            //   this.unitlistuniquejson.push(item);
            //   item.hasNoDuplicateUnitname = true;
            //   item.disableField = true;
            // }
          }
        }
        else if (item.ownershipstatus == "" || item.ownershipstatus == undefined) {
          if (item.flatno == "" || item.flatno == undefined ||
            item.unittype == "" || item.unittype == undefined ||
            item['unit dimension'] == "" || item['unit dimension'] == undefined ||
            item['Unit Calculation Type'] == "" || item['Unit Calculation Type'] == undefined ||
            item['unit rate'] == "" || item['unit rate'] == undefined ||
            item.ownershipstatus == "" || item.ownershipstatus == undefined) {
              this.unitlistduplicatejson.push(item);
             this.invalidUnitCount += 1;
          }
        }
      })
      let unitgroup = this.unitlistuniquejson.reduce((r, a) => {
        r[a.flatno.toLowerCase()] = [...r[a.flatno.toLowerCase()] || [], a];
        return r;
      }, {});
      console.log("unit_group", unitgroup);
      Object.keys(unitgroup).forEach(element => {
        if (unitgroup[element].length > 1) {
          this.duplicateUnitCount += 1;
          console.log(this.duplicateUnitCount);
          unitgroup[element].forEach(item => {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          })
        }
        else if (unitgroup[element].length == 1) {
          let found = this.unitlistduplicatejson.some(el => {
            console.log(el.flatno);
            if(el.flatno != undefined){
             return el.flatno.toLowerCase() == unitgroup[element][0].flatno.toLowerCase();
            } 
          })
          if (found) {
            this.duplicateUnitCount += 1;
            this.unitlistduplicatejson.push(unitgroup[element][0]);
          }
          else {
            unitgroup[element].forEach(item => {
              item.hasNoDuplicateUnitname = true;
              item.disableField = true;
              this.unitlistuniquejson1.push(item);
            })
          }
        }
      })
      /***/
      this.unitlistjson[this.blBlkName] = [];
      console.log(this.unitlistduplicatejson);
      console.log(this.unitlistuniquejson1);
      this.unitlistjson[this.blBlkName] = this.unitlistuniquejson1;
      console.log(this.unitlistjson[this.blBlkName]);
    }
      //}
      //
      $(".se-pre-con").fadeOut("slow");
    this.progressbarmodalRef=this.modalService.show(this.unitprogressbartemplate,Object.assign({}, { class: 'modal1' }));
    this.unitprogressvaluemax = Number(this.unitlistjson[this.blBlkName].length);
    this.unitlistjson[this.blBlkName].forEach((unit, index) => {
      console.log(unit);
      ((index) => {
        setTimeout(() => {
          this.unitsuccessarray.push(unit);
          this.unitdetailscreatejson = {
              "ASAssnID": this.currentAssociationID,
              "ACAccntID": this.globalService.getacAccntID(),
              "units": [
                {

                  "UNUniName": unit.flatno,
                  "UNUniType": unit.unittype,
                  "UNOcStat": unit.ownershipstatus,
                  "UNOcSDate": "",
                  "UNOwnStat": "",
                  "UNSldDate": "",
                  "UNDimens": unit['unit dimension'],
                  "UNRate": unit['unit rate'],
                  "UNCalType": unit['Unit Calculation Type'],
                  "FLFloorID": 14,
                  "BLBlockID": this.currentSelectedBlockID,
                  "Owner":
                    [{

                      "UOFName": (unit.ownerfirstname == undefined ? '' : unit.ownerfirstname),
                      "UOLName": (unit.ownerlastname == undefined ? '' : unit.ownerlastname),
                      "UOMobile": (unit.ownermobilenumber == undefined ? '' : unit.ownermobilenumber),
                      "UOISDCode": "",
                      "UOMobile1": "",
                      "UOMobile2": "",
                      "UOMobile3": "",
                      "UOMobile4": "",
                      "UOEmail": (unit.owneremaiid == undefined ? '' : unit.owneremaiid),
                      "UOEmail1": "sowmya_padmanabhuni@oyespace.com",
                      "UOEmail2": "sowmya_padmanabhuni@oyespace.com",
                      "UOEmail3": "sowmya_padmanabhuni@oyespace.com",
                      "UOEmail4": "sowmya_padmanabhuni@oyespace.com",
                      "UOCDAmnt": "2000"

                    }],
                  "Tenant": [{
                    "UTFName": (unit.tenantfirstname == undefined ? '' : unit.tenantfirstname),
                    "UTLName": (unit.tenantlastname == undefined ? '' : unit.tenantlastname),
                    "UTMobile": (unit.tenantmobilenumber == undefined ? '' : unit.tenantmobilenumber),
                    "UTISDCode": "+91",
                    "UTMobile1": "+919398493298",
                    "UTEmail": (unit.tenantemaiid == undefined ? '' : unit.tenantemaiid),
                    "UTEmail1": "pl@gmail.com"
                  }],
                  "unitbankaccount":
                  {
                    "UBName": "SBI",
                    "UBIFSC": "SBIN0014",
                    "UBActNo": "LOP9090909",
                    "UBActType": "Savings",
                    "UBActBal": 12.3,
                    "BLBlockID": this.currentSelectedBlockID,
                  },

                  "UnitParkingLot":
                    [
                      {
                        "UPLNum": "1902",
                        "MEMemID": 287,
                        "UPGPSPnt": "24.0088 23. 979"
                      }
                    ]
                }
              ]
            }
            console.log(this.unitdetailscreatejson)
            this.viewUniService.createUnit(this.unitdetailscreatejson)
            // this.http.post(unitcreateurl, this.unitdetailscreatejson, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
              .subscribe((res: any) => {
                this.unitsuccesscount += 1;
                this.unitprogressvalue = this.unitsuccesscount;
                console.log(res)
                unit.hasNoDuplicateUnitname=true;
                unit.disableField=true;
                unit.isUnitCreated=true;
                unit.isUnitNotCreated=false;
                this.totalUnitcount += 1;
                console.log('totalUnitcount',this.totalUnitcount);
              }, error => {
                console.log(error);
                this.exceptionMessage1 = error['error']['exceptionMessage'];
                console.log(this.exceptionMessage1);
              });
        }, 2500 * index)
      })(index)

    });
      
      setTimeout(() => {
        this.progressbarmodalRef.hide();
        if (this.unitsuccessarray.length == 1) {
          this.message = 'Unit Created Successfully';
          if (this.duplicateUnitCount > 0 && this.invalidUnitCount > 0) {
            this.message = `${this.invalidUnitCount} Invalid
                            ${this.duplicateUnitCount} Duplicate`
          }
          else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
            this.message = `${this.invalidUnitCount} Invalid`
          }
          else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
            this.message = `${this.duplicateUnitCount} Duplicate`
          }
        }
        else if (this.unitsuccessarray.length > 1) {
          if (this.duplicateUnitCount > 0 && this.invalidUnitCount > 0) {
            this.message = `${this.invalidUnitCount} Invalid
                            ${this.duplicateUnitCount} Duplicate`
          }
          else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
            this.message = `${this.invalidUnitCount} Invalid`
          }
          else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
            this.message = `${this.duplicateUnitCount} Duplicate`
          }
          else {
            this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
          }
        }
        if (this.duplicateUnitrecordexist) {
          // document.getElementById('unitupload_excel').style.display = 'none'
          // document.getElementById('unitshowmanual').style.display = 'block';
          // document.getElementById('unitsmanualnew').style.display = 'none';
          // document.getElementById('unitsbulkold').style.display = 'block';
          Swal.fire({
            title: this.message,
            text: "",
            type: "success",
            allowOutsideClick:false,
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          }).then(
            (result) => {
              if (result.value) {
                let tmpArr = [];
                if(this.unitlistuniquejson1.length>0){
                  this.unitlistuniquejson1.forEach(itm1 => {
                    tmpArr.push(itm1);
                  })
                }
                if(this.unitlistduplicatejson.length>0){
                  this.unitlistduplicatejson.forEach(itm1 => {
                    if(itm1.isUnitNameModifiedForDuplicateRecord=='No'){
                      itm1.isUnitNameModifiedForDuplicateRecord = 'Yes';
                      console.log('isUnitNameModifiedForDuplicateRecord==Yes');
                    }
                    tmpArr.push(itm1);
                  })
                }
                this.unitlistjson[this.blBlkName]=[];
                this.unitlistjson[this.blBlkName]=tmpArr.reverse();
                this.unitlistjson[this.blBlkName]=tmpArr;
                console.log(this.unitlistjson[this.blBlkName]);
                this.unitlistjson[this.blBlkName][0]['unitTmpid'] = this.unitlistjson[this.blBlkName][0]['Id'];
                console.log(this.unitlistjson[this.blBlkName][0]['unitTmpid']);
                this.unitrecordDuplicateUnitnameModified=true;
                this.isunitdetailsempty = false;
              
              }
            })
        }
        let abc0 = _.sortBy(Object.keys(this.unitlistjson));
        if (_.sortBy(Object.keys(this.unitlistjson))[abc0.length - 1] == this.blBlkName) {
          console.log('insidelasttab');
          if (!this.duplicateUnitrecordexist) {
            console.log('inlasttabNoduplicaterecordexist');
            let mesg = `Total Unit Created - ${this.totalUnitcount}`
            // document.getElementById('unitupload_excel').style.display = 'none'
            // document.getElementById('unitshowmanual').style.display = 'block';
            // document.getElementById('unitsmanualnew').style.display = 'none';
            // document.getElementById('unitsbulkold').style.display = 'block';
            Swal.fire({
              title: mesg,
              text: "",
              type:"success",
              confirmButtonColor: "#f69321",
              confirmButtonText: "OK",
              allowOutsideClick:false
            }).then(
              (result) => {
                if (result.value) {
                  this.isunitdetailsempty = true;
                  //let abc1 = Object.keys(this.unitlistjson);
                  //if(Object.keys(this.unitlistjson)[abc1.length-1]==name){
                  console.log('test block');
                 this.router.navigate(['units']);

                  // this.viewAssnService.dashboardredirect.next(result)
                  // this.viewAssnService.enrlAsnEnbled = false;
                  // this.viewAssnService.vewAsnEnbled = true;
                  // this.viewAssnService.joinAsnEbld = false;
                  /*}
                  else{
                    this.demo2TabIndex = this.demo2TabIndex + 1;
                  }*/

                }
              })
          }
          else{
            console.log('inlasttabduplicaterecordexist');
            // document.getElementById('unitupload_excel').style.display = 'none'
            // document.getElementById('unitshowmanual').style.display = 'block';
            // document.getElementById('unitsmanualnew').style.display = 'none';
            // document.getElementById('unitsbulkold').style.display = 'block';
            if (this.unitlistduplicatejson.length > 0) {
              if (this.duplicateUnitCount > 0 && this.invalidUnitCount > 0) {
                this.message = `${this.invalidUnitCount} Invalid
                                ${this.duplicateUnitCount} Duplicate`
              }
              else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
                this.message = `${this.invalidUnitCount} Invalid`
              }
              else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
                this.message = `${this.duplicateUnitCount} Duplicate`
              }
            }
            else {
              this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
            }
            Swal.fire({
              title: this.message,
              text: "",
              type: "success",
              confirmButtonColor: "#f69321",
              confirmButtonText: "OK",
              allowOutsideClick:false
            }).then(
              (result) => {
                if (result.value) {
                  let tmpArr = [];
                  if(this.unitlistuniquejson1.length>0){
                    this.unitlistuniquejson1.forEach(itm1 => {
                      tmpArr.push(itm1);
                    })
                  }
                  if(this.unitlistduplicatejson.length>0){
                    this.unitlistduplicatejson.forEach(itm1 => {
                      if(itm1.isUnitNameModifiedForDuplicateRecord =='No'){
                        itm1.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log('isUnitNameModifiedForDuplicateRecord==Yes');
                      }
                      tmpArr.push(itm1);
                    })
                  }
                  this.unitlistjson[this.blBlkName]=[];
                  this.unitlistjson[this.blBlkName]=tmpArr.reverse();
                  this.unitlistjson[this.blBlkName]=tmpArr;
                  console.log(this.unitlistjson[this.blBlkName]);
                  this.unitlistjson[this.blBlkName][0]['unitTmpid'] = this.unitlistjson[this.blBlkName][0]['Id'];
                  console.log(this.unitlistjson[this.blBlkName][0]['unitTmpid']);
                  this.unitrecordDuplicateUnitnameModified=true;
                  this.isunitdetailsempty = false;
              
                }
              })
          }
        }
        else {
          console.log('demo2TabIndex');
          if (!this.duplicateUnitrecordexist) {
            let mesg = `${this.unitsuccessarray.length}-Unit Created Successfully`;
            Swal.fire({
              title: mesg,
              text: "",
              type: "success",
              confirmButtonColor: "#f69321",
              confirmButtonText: "OK",
              allowOutsideClick:false
            }).then(
              (result) => {
                if (result.value) {
                  let tmpArr = [];
                  if (this.unitlistuniquejson1.length > 0) {
                    this.unitlistuniquejson1.forEach(itm1 => {
                      tmpArr.push(itm1);
                    })
                  }
                  if (this.unitlistduplicatejson.length > 0) {
                    this.unitlistduplicatejson.forEach(itm1 => {
                      tmpArr.push(itm1);
                    })
                  }
                  this.unitlistjson[this.blBlkName] = [];
                  this.unitlistjson[this.blBlkName] = tmpArr;
                  console.log(this.unitlistjson[this.blBlkName]);
                  this.unitlistuniquejson = [];
                  this.unitlistuniquejson1 = [];
                  this.unitlistduplicatejson = [];
                  // document.getElementById('unitupload_excel').style.display = 'none'
                  // document.getElementById('unitshowmanual').style.display = 'block';
                  // document.getElementById('unitsmanualnew').style.display = 'none';
                  // document.getElementById('unitsbulkold').style.display = 'block';
                  //this.demo2TabIndex = this.demo2TabIndex + 1;
                  // console.log(this.increasingBlockArrLength);
                  console.log(this.blockTabId);
                  //console.log(document.querySelectorAll('.mat-tab-label-container')[1].children[0].childNodes[0].childNodes);
                  //let arr = Array.from(document.querySelectorAll('.mat-tab-label-container')[1].children[0].childNodes[0].childNodes);
                  //console.log(arr);
                  //console.log((<HTMLElement> arr[this.blockTabId+1]).innerHTML);
                  //(<HTMLElement> arr[this.blockTabId+1]).innerHTML += '&nbsp;<i class="fa fa-check-circle-o" style="color: #41ca41" aria-hidden="true"></i>';
                  this.blockTabId += 1;
                  this.blocksArray.forEach((itm, indx) => {
                    if (itm.blockname.toLowerCase() == this.blBlkName.toLowerCase()) {
                      itm.isUnitsCreatedUnderBlock = true;
                      itm.isUnitsCreatedUnderBlock1 = false;
                      if (this.blocksArray[indx + 1] != undefined) {
                        console.log(this.blocksArray[indx + 1]['blockname']);
                        this.blBlkName = this.blocksArray[indx + 1]['blockname'];
                        this.nextBlckId = this.blocksArray[indx + 1]['Id'];
                        console.log(this.blBlkName);
                        console.log(this.nextBlckId);
                      }
                    }
                  })
                  this.isunitdetailsempty = false;
                  this.assignTmpid(this.nextBlckId, this.blBlkName);
                  this.indexToCheckValidBlockName += 1;
                }
              })
          }  
        }

      },Number(this.unitlistjson[this.blBlkName].length) * 3000)
          //document.getElementById("mat-tab-label-0-4").style.backgroundColor = "lightblue";
      
        //}
  }
  nextBlckId='';
  assignTmpid(objId,blockname){
    console.log(objId);
    // this.blocknameforIteration=blockname;
    // console.log(this.blocknameforIteration);
    this.blocksArray.forEach(elemnt=>{
      if(elemnt.Id == objId){
        console.log('test',objId);
        elemnt.blockTmpid = objId;
        console.log(elemnt.blockTmpid);
      }
      else{
        elemnt.blockTmpid='';
      }
    })
    console.log(this.unitlistjson[blockname][0]['Id'],blockname);
    this.assignUnitTmpid(this.unitlistjson[blockname][0]['Id'],blockname);
  }
  assignUnitTmpid(obj2Id,blockname){
    console.log(obj2Id);
    this.unitlistjson[blockname].forEach(elemnt=>{
      if(elemnt.Id==obj2Id){
        console.log('test',obj2Id);
        elemnt.unitTmpid=obj2Id;
        console.log(elemnt.unitTmpid);
      }
      else{
        elemnt.unitTmpid='';
      }
    })
  }
  validateUnitDetailsField(name, Id, flatno) {
    this.numberofunitexistence = 0;
    this.isunitdetailsempty = true;
    Object.keys(this.unitlistjson).forEach(element => {
      console.log(this.unitlistjson[element])

      this.unitlistjson[element].forEach(unit => {
        let headername = unit.Id.slice(0, -2);
        console.log(headername);
        console.log(name);
        console.log(unit.Id,Id);
        if (unit.Id == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          if (this.isunitdetailsempty) {
            if (unit.ownershipstatus == "Sold Owner Occupied Unit" || unit.ownershipstatus == "Sold Vacant Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined 
              ) {
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    unit_group[element].forEach(itm1=>{
                      if(itm1.flatno.toLowerCase()==unit.flatno.toLowerCase()){
                        unit.hasNoDuplicateUnitname = false;
                        unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log(unit.flatno);
                        console.log(unit.Id,Id);
                      }
                    })
                  }
                  else if (unit_group[element].length == 1) {
                    unit_group[element].forEach(itm2=>{
                      if(itm2.flatno.toLowerCase()==unit.flatno.toLowerCase()){
                        unit.hasNoDuplicateUnitname = true;
                        unit.isUnitNameModifiedForDuplicateRecord = 'No';
                        console.log(unit.flatno);
                        console.log(unit.Id,Id);
                      }
                    })
                  }
                })                
              }
            }
            else if (unit.ownershipstatus == "Sold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if (a.flatno != undefined) {
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    unit_group[element].forEach(itm1 => {
                      if (itm1.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = false;
                        unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                  else if (unit_group[element].length == 1) {
                    unit_group[element].forEach(itm2 => {
                      if (itm2.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = true;
                        unit.isUnitNameModifiedForDuplicateRecord = 'No';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if (a.flatno != undefined) {
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    unit_group[element].forEach(itm1 => {
                      if (itm1.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = false;
                        unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                  else if (unit_group[element].length == 1) {
                    unit_group[element].forEach(itm2 => {
                      if (itm2.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = true;
                        unit.isUnitNameModifiedForDuplicateRecord = 'No';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Vacant Unit" || unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined
              ) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if (a.flatno != undefined) {
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    unit_group[element].forEach(itm1 => {
                      if (itm1.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = false;
                        unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                  else if (unit_group[element].length == 1) {
                    unit_group[element].forEach(itm2 => {
                      if (itm2.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = true;
                        unit.isUnitNameModifiedForDuplicateRecord = 'No';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if (a.flatno != undefined) {
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    unit_group[element].forEach(itm1 => {
                      if (itm1.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = false;
                        unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                  else if (unit_group[element].length == 1) {
                    unit_group[element].forEach(itm2 => {
                      if (itm2.flatno.toLowerCase() == unit.flatno.toLowerCase()) {
                        unit.hasNoDuplicateUnitname = true;
                        unit.isUnitNameModifiedForDuplicateRecord = 'No';
                        console.log(unit.flatno);
                        console.log(unit.Id, Id);
                      }
                    })
                  }
                })
              }
            }
          }
        }
        /**/
        if (name.toLowerCase() == headername.toLowerCase()) {
          console.log(unit);
          console.log(flatno);
          console.log(this.unitlistjson[element]);
          if (this.isunitdetailsempty) {
            if (unit.ownershipstatus == "Sold Owner Occupied Unit" || unit.ownershipstatus == "Sold Vacant Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined
              ) {
                console.log('test0-Sold Owner Occupied Unit')
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                console.log('test1-Sold Owner Occupied Unit')
                this.isunitdetailsempty = true;
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    this.isunitdetailsempty = false;
                    console.log(unit)
                  }
                  else if (unit_group[element].length == 1) {
                    console.log(unit)
                    unit_group[element].forEach(itm1=>{
                      if(flatno != undefined){
                        if(itm1.flatno.toLowerCase()==flatno.toLowerCase()){
                          unit.isUnitNameModifiedForDuplicateRecord = 'No';
                          unit.hasNoDuplicateUnitname = true;
                        }
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "Sold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                  console.log('test0-Sold Tenant Occupied Unit')
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                console.log('test1-Sold Tenant Occupied Unit')
                this.isunitdetailsempty = true;
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    this.isunitdetailsempty = false;
                  }
                  else if (unit_group[element].length == 1) {
                    console.log(unit)
                    unit_group[element].forEach(itm1=>{
                      if(flatno != undefined){
                        if(itm1.flatno.toLowerCase()==flatno.toLowerCase()){
                          unit.isUnitNameModifiedForDuplicateRecord = 'No';
                          unit.hasNoDuplicateUnitname = true;
                        }
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                  console.log('test0-UnSold Tenant Occupied Unit')
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                console.log('test1-UnSold Tenant Occupied Unit')
                this.isunitdetailsempty = true;
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    this.isunitdetailsempty = false;
                  }
                  else if (unit_group[element].length == 1) {
                    console.log(unit)
                    unit_group[element].forEach(itm1=>{
                      if(flatno != undefined){
                        if(itm1.flatno.toLowerCase()==flatno.toLowerCase()){
                          unit.isUnitNameModifiedForDuplicateRecord = 'No';
                          unit.hasNoDuplicateUnitname = true;
                        }
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Vacant Unit" || unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined
              ) {
                console.log('test0-UnSold Vacant Unit')
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                console.log('test1-UnSold Vacant Unit')
                this.isunitdetailsempty = true;
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    this.isunitdetailsempty = false;
                  }
                  else if (unit_group[element].length == 1) {
                    console.log(unit)
                    unit_group[element].forEach(itm1=>{
                      if(flatno != undefined){
                        if(itm1.flatno.toLowerCase()==flatno.toLowerCase()){
                          unit.isUnitNameModifiedForDuplicateRecord = 'No';
                          unit.hasNoDuplicateUnitname = true;
                        }
                      }
                    })
                  }
                })
              }
            }
            else if (unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit['unit dimension'] == "" || unit['unit dimension'] == undefined ||
                unit['Unit Calculation Type'] == "" || unit['Unit Calculation Type'] == undefined ||
                unit['unit rate'] == "" || unit['unit rate'] == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
                console.log('test0-ownershipstatus == " "')
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
              }
              else {
                console.log('test1-ownershipstatus')
                this.isunitdetailsempty = true;
                unit.isSingleUnitDataEmpty = false;
                let unit_group = this.unitlistjson[element].reduce((r, a) => {
                  if(a.flatno != undefined){
                    r[a.flatno] = [...r[a.flatno] || [], a];
                  }
                  return r;
                }, {});
                console.log("unit_group", unit_group);
                Object.keys(unit_group).forEach(element => {
                  if (unit_group[element].length > 1) {
                    this.isunitdetailsempty = false;
                  }
                  else if (unit_group[element].length == 1) {
                    console.log(unit)
                    unit_group[element].forEach(itm1=>{
                      if(flatno != undefined){
                        if(itm1.flatno.toLowerCase()==flatno.toLowerCase()){
                          unit.isUnitNameModifiedForDuplicateRecord = 'No';
                          unit.hasNoDuplicateUnitname = true;
                        }
                      }
                    })
                  }
                })
              }
            }
          }
        }
        /**/
      })
    })
    console.log(this.unitlistjson[name]);
    let unitgroup_for_logicalorder_with_valid_flatnos = [];
    this.unitlistjson[name].forEach(item => {
      if (item.flatno != undefined) {
        unitgroup_for_logicalorder_with_valid_flatnos.push(item);
      }
    })
    console.log(unitgroup_for_logicalorder_with_valid_flatnos);
    let unitgroup_for_logicalorder = unitgroup_for_logicalorder_with_valid_flatnos.reduce((r, a) => {
      if(a.flatno != undefined){
        r[a.flatno.toLowerCase()] = [...r[a.flatno.toLowerCase()] || [], a];
        return r;
      }
    }, {});
    if (Object.keys(unitgroup_for_logicalorder).length == this.unitlistjson[name].length) {
      console.log(Object.keys(unitgroup_for_logicalorder).length, this.unitlistjson[name].length);
      Object.keys(unitgroup_for_logicalorder).forEach(itm1=>{
        unitgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.ownershipstatus == "Sold Owner Occupied Unit" || itm2.ownershipstatus == "Sold Vacant Unit") {
            if (itm2.flatno == "" || itm2.flatno == undefined ||
              itm2.unittype == "" || itm2.unittype == undefined ||
              itm2['unit dimension'] == "" || itm2['unit dimension'] == undefined ||
              itm2['Unit Calculation Type'] == "" || itm2['Unit Calculation Type'] == undefined ||
              itm2['unit rate'] == "" || itm2['unit rate'] == undefined ||
              itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined ||
              itm2.owneremaiid == "" || itm2.owneremaiid == undefined ||
              itm2.ownerfirstname == "" || itm2.ownerfirstname == undefined ||
              itm2.ownerlastname == "" || itm2.ownerlastname == undefined ||
              itm2.ownermobilenumber == "" || itm2.ownermobilenumber == undefined
            ) {
              this.canDoUnitLogicalOrder = false;
            }
          }
          else if (itm2.ownershipstatus == "Sold Tenant Occupied Unit") {
            if (itm2.flatno == "" || itm2.flatno == undefined ||
              itm2.owneremaiid == "" || itm2.owneremaiid == undefined ||
              itm2.ownerfirstname == "" || itm2.ownerfirstname == undefined ||
              itm2.ownermobilenumber == "" || itm2.ownermobilenumber == undefined ||
              itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined ||
              itm2.unittype == "" || itm2.unittype == undefined ||
              itm2['unit dimension'] == "" || itm2['unit dimension'] == undefined ||
              itm2['Unit Calculation Type'] == "" || itm2['Unit Calculation Type'] == undefined ||
              itm2['unit rate'] == "" || itm2['unit rate'] == undefined ||
              itm2.ownerlastname == "" || itm2.ownerlastname == undefined ||
              itm2.tenantfirstname == "" || itm2.tenantfirstname == undefined ||
              itm2.tenantlastname == "" || itm2.tenantlastname == undefined ||
              itm2.tenantmobilenumber == "" || itm2.tenantmobilenumber == undefined ||
              itm2.tenantemaiid == "" || itm2.tenantemaiid == undefined) {
                this.canDoUnitLogicalOrder = false;
  
            }
          }
          else if (itm2.ownershipstatus == "UnSold Tenant Occupied Unit") {
            if (itm2.flatno == "" || itm2.flatno == undefined ||
              itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined ||
              itm2.unittype == "" || itm2.unittype == undefined ||
              itm2['unit dimension'] == "" || itm2['unit dimension'] == undefined ||
              itm2['Unit Calculation Type'] == "" || itm2['Unit Calculation Type'] == undefined ||
              itm2['unit rate'] == "" || itm2['unit rate'] == undefined ||
              itm2.tenantfirstname == "" || itm2.tenantfirstname == undefined ||
              itm2.tenantlastname == "" || itm2.tenantlastname == undefined ||
              itm2.tenantmobilenumber == "" || itm2.tenantmobilenumber == undefined ||
              itm2.tenantemaiid == "" || itm2.tenantemaiid == undefined) {
                this.canDoUnitLogicalOrder = false;
            }
          }
          else if (itm2.ownershipstatus == "UnSold Vacant Unit" || itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined) {
            if (itm2.flatno == "" || itm2.flatno == undefined ||
              itm2.unittype == "" || itm2.unittype == undefined ||
              itm2['unit dimension'] == "" || itm2['unit dimension'] == undefined ||
              itm2['Unit Calculation Type'] == "" || itm2['Unit Calculation Type'] == undefined ||
              itm2['unit rate'] == "" || itm2['unit rate'] == undefined ||
              itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined
            ) {
              this.canDoUnitLogicalOrder = false;
            }
          }
          else if (itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined) {
            if (itm2.flatno == "" || itm2.flatno == undefined ||
              itm2.unittype == "" || itm2.unittype == undefined ||
              itm2['unit dimension'] == "" || itm2['unit dimension'] == undefined ||
              itm2['Unit Calculation Type'] == "" || itm2['Unit Calculation Type'] == undefined ||
              itm2['unit rate'] == "" || itm2['unit rate'] == undefined ||
              itm2.ownershipstatus == "" || itm2.ownershipstatus == undefined) {
                this.canDoUnitLogicalOrder = false;
            }
          }
        })
      })
      if(this.canDoUnitLogicalOrder == true){
        let tempUnitArr = _.sortBy(this.unitlistjson[name], "flatno");
        console.log(tempUnitArr);
        this.unitlistjson[name]=[];
        console.log(this.unitlistjson[name]);
        this.unitlistjson[name]=tempUnitArr;
        console.log(this.unitlistjson[name]);
      }
    }
  }
  resetStep5bulk(ev, blknamecommon, Id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL"
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {

          Object.keys(this.unitlistjson).forEach(element => {
            this.unitlistjson[element].forEach(unit => {
              if (unit['Id'].toLowerCase() == Id.toLowerCase()) {
                console.log(Id);
                unit.flatno = "",
                  unit.blockname = "",
                  unit.owneremaiid = "",
                  unit.ownerfirstname = "",
                  unit.ownermobilenumber = "",
                  unit.ownershipstatus = "",
                  unit.unittype = "",
                  unit.ownerlastname = "",
                  unit.ownermobilenumber = "",
                  unit.owneremaiid = "",
                  unit.tenantfirstname = "",
                  unit.tenantlastname = "",
                  unit.tenantmobilenumber = "",
                  unit.tenantemaiid = "",
                  unit['unit dimension'] = "",
                  unit['Unit Calculation Type'] = "",
                  unit['unit rate'] = ""
              }
            })
          })
        }
      })



    /* Object.keys(this.unitlistjson).forEach(element=>{
       console.log(this.unitlistjson[element])
       this.unitlistjson[element].forEach(unit => {
 if(blknamecommon == unit.blockname&&unit.blockname!=undefined){
 
       unit.flatno="",
       unit.blockname ="",
       unit.owneremaiid="",
       unit.ownerfirstname="",
       unit.ownermobilenumber="",
       unit.ownershipstatus="",
       unit.unittype="",
       unit.ownerlastname="",
       unit.ownermobilenumber= "",
       unit.owneremaiid="",
       unit.tenantfirstname="",
       unit.tenantlastname="",
       unit.tenantmobilenumber="",
       unit.tenantemaiid=""
     }else{
       let blname = unit.Id.slice(0, -2);
       if(blknamecommon == blname){
         unit.flatno="",
         unit.blockname ="",
         unit.owneremaiid="",
         unit.ownerfirstname="",
         unit.ownermobilenumber="",
         unit.ownershipstatus="",
         unit.unittype="",
         unit.ownerlastname="",
         unit.ownermobilenumber= "",
         unit.owneremaiid="",
         unit.tenantfirstname="",
         unit.tenantlastname="",
         unit.tenantmobilenumber="",
         unit.tenantemaiid=""
       }
    
     }
 
       })
     }) */

  }
  // resetStep5bulk(ev,blknamecommon){
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you really want to reset?",
  //     type: "warning",
  //     confirmButtonColor: "#f69321",
  //     confirmButtonText: "OK",
  //     showCancelButton: true,
  //     cancelButtonText: "CANCEL"
  //   }).then(
  //     (result) => {
  //       console.log(result)

  //       if (result.value) {
  //         Object.keys(this.unitlistjson).forEach(element=>{
  //           console.log(this.unitlistjson[element])
  //           this.unitlistjson[element].forEach(unit => {
  //     if(blknamecommon.toUpperCase() == unit.blockname.toUpperCase()&&unit.blockname!=undefined){
      
  //           unit.flatno="",
  //           unit.blockname ="",
  //           unit.owneremaiid="",
  //           unit.ownerfirstname="",
  //           unit.ownermobilenumber="",
  //           unit.ownershipstatus="",
  //           unit.unittype="",
  //           unit.ownerlastname="",
  //           unit.ownermobilenumber= "",
  //           unit.owneremaiid="",
  //           unit.tenantfirstname="",
  //           unit.tenantlastname="",
  //           unit.tenantmobilenumber="",
  //           unit.tenantemaiid=""
  //         }else{
  //           let blname = unit.Id.slice(0, -2);
  //           if(blknamecommon == blname){
  //             unit.flatno="",
  //             unit.blockname ="",
  //             unit.owneremaiid="",
  //             unit.ownerfirstname="",
  //             unit.ownermobilenumber="",
  //             unit.ownershipstatus="",
  //             unit.unittype="",
  //             unit.ownerlastname="",
  //             unit.ownermobilenumber= "",
  //             unit.owneremaiid="",
  //             unit.tenantfirstname="",
  //             unit.tenantlastname="",
  //             unit.tenantmobilenumber="",
  //             unit.tenantemaiid=""
  //           }
         
  //         }
      
  //           })
  //         })
  //       }
  //     })


  

  // }
  keyPress3(event:any){
    const pattern = /^[1-9][0-9]*$/;
   let inputChar = String.fromCharCode(event.charCode);
   // console.log(inputChar, e.charCode);
      if (!pattern.test(inputChar)) {
      // invalid character, prevent input
          event.preventDefault();
     }
 }
 _keyPress2(event:any,Id) {
   var ch = String.fromCharCode(event.keyCode);
    var filter = /[a-zA-Z]/;
    if(!filter.test(ch)){
         event.returnValue = false;
    }

 }
 _keyPress(event: any, Id) {
   const pattern = /[0-9]/;
   let inputChar = String.fromCharCode(event.charCode);
   if (!pattern.test(inputChar)) {
     event.preventDefault();
   }
 }
  // unitmatching: boolean;
  // getUnitName(Id, flatno,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['flatno'] = flatno;
  //         if(unit['flatno']==""||unit['flatno']==undefined){
  //           unit['isnotvalidflatno']=true;
  //         }
  //         else{
  //           unit['isnotvalidflatno']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getunittype(Id, unittype,name){
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['unittype'] = unittype;
  //         if(unit['unittype']==""){
  //           unit['isnotvalidunittype']=true;
  //         }
  //         else{
  //           unit['isnotvalidunittype']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getUnittypeOnChange(event,blocknameforIteration){
  //   console.log(event,blocknameforIteration);
  //   this.validateUnitDetailsField(blocknameforIteration);
  // }
  // getOwnershipstatusOnChange(event,blocknameforIteration){
  //   this.validateUnitDetailsField(blocknameforIteration);
  // }
  // getownershipstatus(Id, ownershipstatus,name){
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['ownershipstatus'] = ownershipstatus;
  //         if(unit['ownershipstatus']==""){
  //           unit['isnotvalidownershipstatus']=true;
  //         }
  //         else{
  //           unit['isnotvalidownershipstatus']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getownerfirstname(Id, ownerfirstname,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['ownerfirstname'] = ownerfirstname;
  //         if(unit['ownerfirstname']==""){
  //           unit['isnotvalidownerfirstname']=true;
  //         }
  //         else{
  //           unit['isnotvalidownerfirstname']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getownerlastname(Id, ownerlastname,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['ownerlastname'] = ownerlastname;
  //         if(unit['ownerlastname']==""){
  //           unit['isnotvalidownerlastname']=true;
  //         }
  //         else{
  //           unit['isnotvalidownerlastname']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getownermobilenumber(Id, ownermobilenumber,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['ownermobilenumber'] = ownermobilenumber;
  //         if(unit['ownermobilenumber']==""){
  //           unit['isnotvalidownermobilenumber']=true;
  //         }
  //         else{
  //           unit['isnotvalidownermobilenumber']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // getowneremaiid(Id, owneremaiid,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['owneremaiid'] = owneremaiid;
  //         if(unit['owneremaiid']==""){
  //           unit['isnotvalidowneremaiid']=true;
  //         }
  //         else{
  //           unit['isnotvalidowneremaiid']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // gettenantfirstname(Id, tenantfirstname,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['tenantfirstname'] = tenantfirstname;
  //         if(unit['tenantfirstname']==""){
  //           unit['isnotvalidtenantfirstname']=true;
  //         }
  //         else{
  //           unit['isnotvalidtenantfirstname']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // gettenantlastname(Id, tenantlastname,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['tenantlastname'] = tenantlastname;
  //         if(unit['tenantlastname']==""){
  //           unit['isnotvalidtenantlastname']=true;
  //         }
  //         else{
  //           unit['isnotvalidtenantlastname']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // gettenantmobilenumber(Id, tenantmobilenumber,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['tenantmobilenumber'] = tenantmobilenumber;
  //         if(unit['tenantmobilenumber']==""){
  //           unit['isnotvalidtenantmobilenumber']=true;
  //         }
  //         else{
  //           unit['isnotvalidtenantmobilenumber']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }
  // gettenantemaiid(Id, tenantemaiid,name) {
  //   Object.keys(this.unitlistjson).forEach(element=>{
  //     this.unitlistjson[element].forEach(unit => {
  //       console.log(unit)
  //       if (unit['Id'] == Id) {
  //         unit['tenantemaiid'] = tenantemaiid;
  //         if(unit['tenantemaiid']==""){
  //           unit['isnotvalidtenantemaiid']=true;
  //         }
  //         else{
  //           unit['isnotvalidtenantemaiid']=false;
  //         }
  //       }
  //     })
  //   })
  //   this.validateUnitDetailsField(name);
  // }

  

  unitmatching: boolean;
  getUnitName(Id, flatno, name) {
    this.canDoUnitLogicalOrder = true;
    this.numberofunitexistence = 0;
    this.valueExcelUnitArr = [];
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          unit['flatno'] = flatno;
          if (unit['flatno'] == "" || unit['flatno'] == undefined) {
            unit['isnotvalidflatno'] = true;
          }
          else {
            unit['isnotvalidflatno'] = false;
          }
          //
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                  console.log('this.numberofunitexistence == 1');
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                  console.log('this.numberofunitexistence > 1');
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
          //
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno); 
  }
  getUnittype(Id, unittype, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    console.log(Id, unittype, name, flatno);
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getOwnerShipStatus(Id, unittype, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    console.log(Id, unittype, name);
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  ValidateLessThanZeroValue(Id,unitdimension,name,flatno) {
    console.log(unitdimension);
    this.canDoUnitLogicalOrder = true;
    this.numberofunitexistence = 0;
    this.valueExcelUnitArr = [];
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          unit['unit dimension'] = unitdimension;
          if (unit['unit dimension'] == "" || unit['unit dimension'] == undefined) {
            unit['InvalidUnitDimension'] = true;
          }
          else {
            if (Number(unit['unit dimension']) <= 0) {
              unit['InvalidUnitDimension'] = true;
            }
            else{
              unit['InvalidUnitDimension'] = false;
            }
          }
          //
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                  console.log('this.numberofunitexistence == 1');
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                  console.log('this.numberofunitexistence > 1');
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno); 
  }
  getCalculationType(Id, UnitCalculationType, name, flatno){
    this.canDoUnitLogicalOrder = true;
    console.log(Id, UnitCalculationType, name, flatno);
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getUnitrate(Id,unitrate,name,flatno){
    console.log(unitrate);
    this.canDoUnitLogicalOrder = true;
    this.numberofunitexistence = 0;
    this.valueExcelUnitArr = [];
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          unit['unit rate'] = unitrate;
          if (unit['unit rate'] == "" || unit['unit rate'] == undefined) {
            unit['InvalidUnitRate'] = true;
          }
          else {
              unit['InvalidUnitRate'] = false;
          }
          //
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                  console.log('this.numberofunitexistence == 1');
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                  console.log('this.numberofunitexistence > 1');
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno); 
  }
  /* getunittype(Id, unittype,name){
     Object.keys(this.unitlistjson).forEach(element=>{
       this.unitlistjson[element].forEach(unit => {
         console.log(unit)
         if (unit['Id'] == Id) {
           unit['unittype'] = unittype;
           if(unit['unittype']==""){
             unit['isnotvalidunittype']=true;
           }
           else{
             unit['isnotvalidunittype']=false;
           }
         }
       })
     })
     this.validateUnitDetailsField(name);
   } */
  /* getUnittypeOnChange(event,blocknameforIteration){
     console.log(event,blocknameforIteration);
     this.validateUnitDetailsField(blocknameforIteration);
   }
   getOwnershipstatusOnChange(event,blocknameforIteration){
     this.validateUnitDetailsField(blocknameforIteration);
   } */
  /* getownershipstatus(Id, ownershipstatus,name){
     Object.keys(this.unitlistjson).forEach(element=>{
       this.unitlistjson[element].forEach(unit => {
         console.log(unit)
         if (unit['Id'] == Id) {
           unit['ownershipstatus'] = ownershipstatus;
           if(unit['ownershipstatus']==""){
             unit['isnotvalidownershipstatus']=true;
           }
           else{
             unit['isnotvalidownershipstatus']=false;
           }
         }
       })
     })
     this.validateUnitDetailsField(name);
   } */
  getownerfirstname(Id, ownerfirstname, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownerfirstname'] = ownerfirstname;
          if (unit['ownerfirstname'] == "") {
            unit['isnotvalidownerfirstname'] = true;
          }
          else {
            unit['isnotvalidownerfirstname'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getownerlastname(Id, ownerlastname, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownerlastname'] = ownerlastname;
          if (unit['ownerlastname'] == "") {
            unit['isnotvalidownerlastname'] = true;
          }
          else {
            unit['isnotvalidownerlastname'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getownermobilenumber(Id, ownermobilenumber, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownermobilenumber'] = ownermobilenumber;
          if (unit['ownermobilenumber'] == "") {
            unit['isnotvalidownermobilenumber'] = true;
          }
          else {
            unit['isnotvalidownermobilenumber'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getowneremaiid(Id, owneremaiid, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['owneremaiid'] = owneremaiid;
          if (unit['owneremaiid'] == "") {
            unit['isnotvalidowneremaiid'] = true;
          }
          else {
            unit['isnotvalidowneremaiid'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  gettenantfirstname(Id, tenantfirstname, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantfirstname'] = tenantfirstname;
          if (unit['tenantfirstname'] == "") {
            unit['isnotvalidtenantfirstname'] = true;
          }
          else {
            unit['isnotvalidtenantfirstname'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  gettenantlastname(Id, tenantlastname, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantlastname'] = tenantlastname;
          if (unit['tenantlastname'] == "") {
            unit['isnotvalidtenantlastname'] = true;
          }
          else {
            unit['isnotvalidtenantlastname'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  gettenantmobilenumber(Id, tenantmobilenumber, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantmobilenumber'] = tenantmobilenumber;
          if (unit['tenantmobilenumber'] == "") {
            unit['isnotvalidtenantmobilenumber'] = true;
          }
          else {
            unit['isnotvalidtenantmobilenumber'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  gettenantemaiid(Id, tenantemaiid, name, flatno) {
    this.canDoUnitLogicalOrder = true;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantemaiid'] = tenantemaiid;
          if (unit['tenantemaiid'] == "") {
            unit['isnotvalidtenantemaiid'] = true;
          }
          else {
            unit['isnotvalidtenantemaiid'] = false;
          }
        }
      })
    })
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined && flatno != undefined){
              if (itm.flatno.toLowerCase() == flatno.toLowerCase()) {
                this.numberofunitexistence += 1;
                if (this.numberofunitexistence == 1) {
                  unit.hasNoDuplicateUnitname = true;
                  unit.isUnitNameModifiedForDuplicateRecord = 'No';
                  this.isunitdetailsempty = true;
                }
                else {
                  unit.hasNoDuplicateUnitname = false;
                  unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                }
              }
            }
            else if(itm.flatno == undefined){
              console.log('itm.flatno == undefined');
              this.isunitdetailsempty = false;
            }
          })
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  //CREATE UNIT FROM EXCEL
  createUnitFromExcel() {
    // console.log(typeof jsonData);
    this.excelUnitList.forEach((item,idx) => {
      ((idx) => {
        setTimeout(() => {
          let createUnitData =
          {
            "ASAssnID": this.currentAssociationID,
            "ACAccntID": this.globalService.getacAccntID(),
            "units": [
              {
                "UNUniName": item['Unit Name - Flat no.'],
                "UNUniType": (item['UnitType'] == undefined ? "" : item['UnitType']),
                "UNRate": (item['UnitRate'] == undefined ? "" : item['UnitRate']),
                "UNOcStat": (item['OccupancyAndOwnershipStatus'] == undefined ? "UnSold Vacant Unit" : item['OccupancyAndOwnershipStatus']),
                "UNOcSDate": "2019-03-02",
                "UNOwnStat": "null",
                "UNSldDate": "2019-03-02",
                "UNDimens": (item['UnitDimension'] == undefined ? "" : item['UnitDimension']),
                "UNCalType": (item['CalculationType'] == undefined ? "" : item['CalculationType']),
                "BLBlockID": this.currentSelectedBlockID,
                "Owner":
                  [{

                    "UOFName": (item['OwnerFirstName'] == undefined ? "" : item['OwnerFirstName']),
                    "UOLName": (item['OwnerLastname'] == undefined ? "" : item['OwnerLastname']),
                    "UOMobile": (item['OwnerMobile'] == undefined ? "" : item['OwnerMobile']),
                    "UOISDCode": "+91",
                    "UOMobile1": "null",
                    "UOMobile2": "null",
                    "UOMobile3": "null",
                    "UOMobile4": "null",
                    "UOEmail": (item['OwnerEmailID'] == undefined ? "" : item['OwnerEmailID']),
                    "UOEmail1": "null",
                    "UOEmail2": "null",
                    "UOEmail3": "null",
                    "UOEmail4": "null",
                    "UOCDAmnt": ""
                  }],
                "unitbankaccount":
                {
                  "UBName": "",
                  "UBIFSC": "",
                  "UBActNo": "",
                  "UBActType": "",
                  "UBActBal": 0,
                  "BLBlockID": this.currentSelectedBlockID
                },
                "Tenant":
                  [{

                    "UTFName": (item['TenantFirstName'] == undefined ? "" : item['TenantFirstName']),
                    "UTLName": (item['TenantLastName'] == undefined ? "" : item['TenantLastName']),
                    "UTMobile": (item['TenantMobileNumber'] == undefined ? "" : item['TenantMobileNumber']),
                    "UTISDCode": "+91",
                    "UTMobile1": "",
                    "UTEmail": (item['TenantEmail'] == undefined ? "" : item['TenantEmail']),
                    "UTEmail1": ""
                  }],
                "UnitParkingLot":
                  [
                    {
                      "UPLNum": "",
                      "MEMemID": "",
                      "UPGPSPnt": "null"

                    }
                  ]
              }
            ]
          }
          console.log(createUnitData);

          this.viewUniService.createUnit(createUnitData).subscribe((response) => {
            console.log(response);
          },
            (response) => {
              console.log(response);
            });
          //
        }, 1500 * idx)
      })(idx)
    })
    Swal.fire({
      title: `${this.excelUnitList.length} - Unit Created Successfuly`,
      type: 'success',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: "View Unit"
    }).then(
      (result) => {
        if (result.value) {
          this.router.navigate(['units']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      }
    )
  }
  //CREATE UNIT FROM EXCEL

}