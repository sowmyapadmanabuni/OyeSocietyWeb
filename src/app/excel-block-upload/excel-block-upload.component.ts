import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as XLSX from 'xlsx';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from '../../services/view-block.service';
import { formatDate } from '@angular/common';
import { AddBlockService } from '../../services/add-block.service';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// import { CommonserviceService } from './../commonservice.service';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {UtilsService} from '../../app/utils/utils.service';
// import { Observable } from 'rxjs/Observable';
import { ViewAssociationService } from '../../services/view-association.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-excel-block-upload',
  templateUrl: './excel-block-upload.component.html',
  styleUrls: ['./excel-block-upload.component.css']
})
export class ExcelBlockUploadComponent implements OnInit {
  excelBlockList:any[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;
  blockdetailInvalid:boolean;
  condition = true;
  increasingBlockArrLength:any;
  duplicatemarked:any;
  isblockdetailsempty: boolean;

 
  ExcelBlkNameDuplicateList:any[];
  ExcelBlkNameDuplicateList1:any[];
  valueExcelBlckArr:any[];
  numberofexistence:any;
  valueExcelUnitArr:any[];
  numberofunitexistence:any;
  notValidBlockArr:any[];
  blockpopuptype:any;
  duplicateBlockCount:number;
  invalidBlockCount:number;
  canDoBlockLogicalOrder:boolean;
  blockprogressbartemplate: TemplateRef<any>;
  progressbarmodalRef: BsModalRef;
  blockprogressvaluemax:number;
  blocksuccesscount:number;
  blockprogressvalue:number;
  config = {
    ignoreBackdropClick: true
  };
  ASMtTypes: string[];
  frequencies: { name: string; displayName: string; }[];
  latePymtChrgTypes: { name: string; displayName: string; }[];
  facilitymanagervalid_but_mobilenumberempty:boolean;
  mobilenumbervalid_but_facilitymanagerempty:boolean;
  bsConfig:object;
  counter: any;
  counter1: any;
  counter3: any;
  calculationTypes: { name: string; displayName: string; }[];
  constructor(
    public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    private modalService: BsModalService,
    private http: HttpClient,
    public router:Router
  ) {
    this.excelBlockList=[];
    this.ShowExcelUploadDiscription=true;
    this.ShowExcelDataList=false;
    this.isblockdetailsempty=true;
    this.duplicateBlocknameExist=false;
    this.toggleEmptyBlockarray=false;

    this.notValidBlockArr=[];
    this.valueExcelBlckArr=[];
    this.duplicatemarked=false;

    this.numberofunitexistence=0;
    this.valueExcelUnitArr=[];
    this.numberofexistence=0;
    this.ExcelBlkNameDuplicateList=[];
    this.ExcelBlkNameDuplicateList1=[];

  
    this.increasingBlockArrLength=0;
   
    this.blockdetailInvalid=true;
 
    this.duplicateBlockCount=0;
    this.invalidBlockCount=0;
    this.canDoBlockLogicalOrder=true;
    this.blockprogressvaluemax=0;
    this.blocksuccesscount=0;
    this.blockprogressvalue=0;
    this.facilitymanagervalid_but_mobilenumberempty=false;
    this.mobilenumbervalid_but_facilitymanagerempty=false;
    this.counter =0 ;
    this.counter1 =0 ;
    this.counter3=0 ;
    this.bsConfig = Object.assign({}, {  
    dateInputFormat: 'DD-MM-YYYY' ,
    showWeekNumbers:false,
    isAnimated: true
  });
    this.ASMtTypes=['FlatRate','Dimension'];
    this.frequencies = [
      { "name": "Monthly", "displayName": "Monthly" },
      { "name": "Quarterly", "displayName": "Quarterly" },
      { "name": "Half Yearly", "displayName": "Half Yearly" },
      { "name": "Yearly", "displayName": "Yearly" }
    ];
    this.latePymtChrgTypes = [
      { "name": "Monthly", "displayName": "Monthly" },
      { "name": "Quarterly", "displayName": "Quaterly" },
      { "name": "Annually", "displayName": "Annually" }
    ];
    
   }
  ngOnInit() {
    this.getassociationlist();
  }
  ngAfterViewInit(){
    // $(".se-pre-con").fadeOut("slow");
  }
  upLoad() {
    document.getElementById("file_upload_id").click();
  }
  exceptionMessage='';
  blocktypeaspropertytype;
  getassociationlist(){
    let assnid=this.globalService.getCurrentAssociationId()

    let asslistapi = "https://uatapi.scuarex.com/oyeliving/api/v1/association/getAssociationList/" + assnid;

    this.http.get(asslistapi, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
    this.globalService.noofblockscount = res.data.association.asNofBlks;
    this.blocktypeaspropertytype = res.data.association.asPrpType;
    }, error => {
      console.log(error);
     this.exceptionMessage = error['error']['exceptionMessage'];
     console.log(this.exceptionMessage);
    }
    );
  }
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
 cancelbulkupload(ev){
this.router.navigate(['blocks']);
 }
 
 resetforduplicatesorinvalidblocks(ev,objId) {
  console.log('ev');
  console.log(this.blocksArray);
  console.log(objId);
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to reset?",
    type: "warning",
    confirmButtonColor: '#f69321',
    confirmButtonText: 'OK',
    showCancelButton: true,
    cancelButtonText: "CANCEL"
  }).then(
    (result) => {
      console.log(result)
      if (result.value) {
        this.blocksArray.forEach(elemnt => {
          if (elemnt.Id == objId) {
            console.log('elemnt.Id==objId');
            elemnt.blockname = '';
            elemnt.hasNoDuplicateBlockname=false;
            // elemnt.units = '';
            // elemnt.fecilitymanagername = '';
            // elemnt.managermobileno = '';
            // elemnt.manageremailid = '';
            elemnt.units= '';
            elemnt['facility manager']= '';
            elemnt['mobile number']= '';
            elemnt['email id']= '';
            elemnt['Flat Rate value']= '';
            elemnt['Maintenance value']= '';
            elemnt['Maintenance Type']= '';
            elemnt['Unit Of Measurement']= '';
            elemnt['Invoice Creation Frequency']= '';
            elemnt['Invoice Generation Date']= null;
            elemnt['Due Date']= null;
            elemnt['Late Payment Charge Type']= '';
            elemnt['Late Payment Charge']= '';
            elemnt['Starts From']= null;
          }
        })
      }
    })
}
  resetStep4(ev){
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
          this.blocksArray.forEach(Object=>{
            Object.blockname="";
            // Object.blocktype="";
            Object.units="";
            Object['facility manager']="";
            Object['mobile number']="";
            Object['email id']="";

          })
        }
      })

  }

  getblocknameornumber(Id, blockname) {
    this.canDoBlockLogicalOrder=true;
    this.valueExcelBlckArr = [];
    this.ExcelBlkNameDuplicateList = [];
    this.ExcelBlkNameDuplicateList1 = [];
    this.isblockdetailsempty = false;
    this.numberofexistence = 0;

    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(blockname);
        element.blockname = blockname.toUpperCase();
        console.log(element.blockname);
        if (element.blockname == "") {
          element['isnotvalidblockname'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidblockname'] = false;
          element['manualBlockResetDisabled'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
        //
        this.blocksArray.forEach(item => {
          if (item.blockname.toLowerCase() == blockname.toLowerCase()) {
            this.numberofexistence += 1;
            if (this.numberofexistence == 1) {  
              element.hasNoDuplicateBlockname = true;
              if (item.blockname != "" && item.blockname != undefined && item.blocktype != "" && item.blocktype != undefined && item.units != "" && item.units != undefined && item['Flat Rate value']!=undefined && item['Flat Rate value']!="" && item['Maintenance value']!=undefined && item['Maintenance value']!="" && item['Maintenance Type']!=undefined && item['Maintenance Type']!="" && item['Unit Of Measurement']!=undefined && item['Unit Of Measurement']!="" && item['Invoice Creation Frequency']!=undefined && item['Invoice Creation Frequency']!="" && item['Invoice Generation Date']!=undefined && item['Invoice Generation Date']!="" && item['Due Date']!=undefined && item['Due Date']!="" && item['Late Payment Charge Type']!=undefined && item['Late Payment Charge Type']!="" && item['Late Payment Charge']!=undefined && item['Late Payment Charge']!="" && item['Starts From']!=undefined && item['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
                console.log('isNotBlockCreated_NowValid');
                element.isNotBlockCreated_NowValid=true;
              }
            }
            else {
              element.hasNoDuplicateBlockname = false;
              element.isNotBlockCreated_NowValid=false;
              element.isnotvalidblockname = true;
            }
          }
        })
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                    itm2.isNotBlockCreated_NowValid = true;
                    itm2.isnotvalidblockname = false;
                    console.log('blockgroup[key].length == 1 this.isblockdetailsempty = false');
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                    itm2.isNotBlockCreated_NowValid = false;
                    console.log('blockgroup[key].length == 1 this.isblockdetailsempty = true');
                  }
                }
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
            console.log('blockgroup[key].length > 1');
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getnoofunits(Id, units) {
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log('units',units);
          element['units'] = units;
        if (element['units'] == "") {
          element['isnotvalidunits'] = true;
          this.blockdetailInvalid = true;
          //this.facilitymanagervalid_but_mobilenumberempty = false;
          //element.facilitymanagervalid_but_mobilenumberempty = false;
          if(element['mobile number'] !=''){
            //this.mobilenumbervalid_but_facilitymanagerempty = true;
            //element.mobilenumbervalid_but_facilitymanagerempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
            console.log('4');
          }
          else{
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('5');
          }
        }
        else {
          element['isnotvalidunits'] = false;
          element['manualBlockResetDisabled'] = false;
          console.log('mobile number',element['mobile number']);
          if(element['mobile number'] =='' || element['mobile number'] == undefined){
            //this.facilitymanagervalid_but_mobilenumberempty = true;
            //element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('6');
          }
          else{
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('1');
            element.isblockdetailsempty1 = false;
            this.isblockdetailsempty = false;
          }
        }
        //if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['facility manager'] == "" || element['facility manager'] == undefined || element['mobile number'] == "" || element['mobile number'] == undefined || element['email id'] == "" || element['email id'] == undefined) {
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          console.log('2');
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-1');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-2');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-3');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-4');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-5');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-6');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getfecilitymanagername(Id, fecilitymanagername) {
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log('fecilitymanagername',fecilitymanagername);
        element['facility manager'] = fecilitymanagername;
        if (element['facility manager'] == "") {
          element['isnotvalidfecilitymanagername'] = true;
          this.blockdetailInvalid = true;
          this.facilitymanagervalid_but_mobilenumberempty = false;
          element.facilitymanagervalid_but_mobilenumberempty = false;
          if(element['mobile number'] !=''){
            this.mobilenumbervalid_but_facilitymanagerempty = true;
            element.mobilenumbervalid_but_facilitymanagerempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
            console.log('4');
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('5');
          }
        }
        else {
          element['isnotvalidfecilitymanagername'] = false;
          element['manualBlockResetDisabled'] = false;
          console.log('mobile number',element['mobile number']);
          if(element['mobile number'] =='' || element['mobile number'] == undefined){
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('6');
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
            console.log('1');
            element.isblockdetailsempty1 = false;
            this.isblockdetailsempty = false;
          }
        }
        //if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['facility manager'] == "" || element['facility manager'] == undefined || element['mobile number'] == "" || element['mobile number'] == undefined || element['email id'] == "" || element['email id'] == undefined) {
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          console.log('2');
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-1');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-2');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-3');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-4');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-5');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-6');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }

  getmanagermobileno(Id, managermobileno) {
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(managermobileno);
        element['mobile number'] = managermobileno;
        if (element['mobile number'] == "") {
          element['isnotvalidmanagermobileno'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isnotvalidmanagermobileno'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = false;
            element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getmanageremailid(Id, manageremailid) {
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element['email id'] = manageremailid;
        if (element['email id'] == "") {
          element['isnotvalidmanageremailid'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidmanageremailid'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined) {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
                
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  geFlatRatevalue(Id,FlatRatevalue){
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(FlatRatevalue);
        element['Flat Rate value'] = FlatRatevalue;
        if (element['Flat Rate value'] == "") {
          element['isNotvalidFlatratevalue'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = true;
            //element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidFlatratevalue'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = false;
            //element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getMaintenancevalue(Id,Maintenancevalue){
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(Maintenancevalue);
        element['Maintenance value'] = Maintenancevalue;
        if (element['Maintenance value'] == "") {
          element['isNotvalidMaintenancevalue'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = true;
            //element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidMaintenancevalue'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = false;
            //element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getASMtType(Id,eventvalue){
console.log(eventvalue);
this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(eventvalue.value);
        element['Maintenance Type'] = eventvalue;
        if (element['Maintenance Type'] == "") {
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = false;
            element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getUnitOfMeasurement(Id,UnitOfMeasurement){
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(UnitOfMeasurement);
        element['Unit Of Measurement'] = UnitOfMeasurement;
        if (element['Unit Of Measurement'] == "") {
          element['isNotvalidUnitOfMeasurement'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidUnitOfMeasurement'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = false;
            element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getInvoiceCreationFrequencyValue(Id,eventvalue){
    console.log(eventvalue);
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(eventvalue);
        element['Invoice Creation Frequency'] = eventvalue;
        if (element['Invoice Creation Frequency'] == "") {
          element['isNotvalidInvoiceCreationFrequency'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidInvoiceCreationFrequency'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = false;
            element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getInvoiceGenerationDate(Id,InvoiceGenerationDate){
    console.log(typeof InvoiceGenerationDate);
      this.canDoBlockLogicalOrder=true;
      this.isblockdetailsempty = false;
      this.blocksArray.forEach(element => {
        if (element.Id == Id) {
          console.log(InvoiceGenerationDate);
          element['Invoice Generation Date'] = InvoiceGenerationDate;
          if (element['Invoice Generation Date'] == "") {
            element['isNotvalidInvoiceGenerationDate'] = true;
            this.blockdetailInvalid = true;
            if (element['facility manager'] != "") {
              this.facilitymanagervalid_but_mobilenumberempty = true;
              element.facilitymanagervalid_but_mobilenumberempty = true;
              element.isblockdetailsempty1 = true;
              this.isblockdetailsempty = true;
            }
            else{
              this.mobilenumbervalid_but_facilitymanagerempty = false;
              element.mobilenumbervalid_but_facilitymanagerempty = false;
            }
          }
          else {
            element['isNotvalidInvoiceGenerationDate'] = false;
            if (element['facility manager'] != "") {
              this.facilitymanagervalid_but_mobilenumberempty = false;
              element.facilitymanagervalid_but_mobilenumberempty = false;
            }
  
          }
          if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
            element.isblockdetailsempty1 = true;
          }
          else {
            if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
              console.log(element['mobile number']);
              console.log(typeof element['mobile number']);
              console.log(element['facility manager'] != undefined);
              console.log(element['mobile number'] != undefined);
                element.isblockdetailsempty1 = false;
                console.log('3-7');
            }
            else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
              console.log(element['mobile number']);
              console.log(typeof element['mobile number']);
              console.log(element['facility manager'] != undefined);
              console.log(element['mobile number'] != undefined);
                element.isblockdetailsempty1 = true;
                console.log('3-8');
            }
            else if (element['facility manager'] == '' && element['mobile number'] == '') {
              console.log(element['mobile number']);
              console.log(typeof element['mobile number']);
              console.log(element['facility manager'] != undefined);
              console.log(element['mobile number'] != undefined);
                element.isblockdetailsempty1 = false;
                console.log('3-9');
            }
            else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
                element.isblockdetailsempty1 = true;
                console.log('3-10');
            }
            else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
                element.isblockdetailsempty1 = true;
                console.log('3-11');
            }
            else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
                element.isblockdetailsempty1 = false;
                console.log('3-12');
            }
          }
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
          element.isNotBlockCreated_NowValid=false;
          this.isblockdetailsempty = true
        }
        else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
          let blockgroup = this.blocksArray.reduce((r, a) => {
            r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
            return r;
          }, {});
          console.log("block_group", blockgroup);
          Object.keys(blockgroup).forEach(key => {
             if (blockgroup[key].length == 1) {
              blockgroup[key].forEach(itm1=>{
                this.blocksArray.forEach(itm2=>{
                  if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                    if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                      itm2.hasNoDuplicateBlockname = true;
                    }
                    else{
                      itm2.hasNoDuplicateBlockname = false;
                      this.isblockdetailsempty = true
                    }
                  }
                  if (element.Id == Id) {
                    console.log('isNotBlockCreated_NowValid');
                    element.isNotBlockCreated_NowValid=true;
                  }
                 
                })
              })
            }
            else if (blockgroup[key].length > 1) {
              this.blocksArray.forEach(itm2=>{
                if (itm2.Id == Id) {
                  console.log('Id',Id);
                  itm2.isNotBlockCreated_NowValid=false;
                }
              })
             this.isblockdetailsempty = true
            }
          })
        }
      })
      let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
        r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
        return r;
      }, {});
      if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
        console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
        Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
          blockgroup_for_logicalorder[itm1].forEach(itm2=>{
            if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
              this.canDoBlockLogicalOrder = false;
            }
          })
        })
        if(this.canDoBlockLogicalOrder == true){
          this.blocksArray = _.sortBy(this.blocksArray, "blockname");
          console.log(this.blocksArray);
        }
      }
  }
  getDueDate(Id,DueDate){
     console.log(DueDate);
     this.canDoBlockLogicalOrder=true;
     this.isblockdetailsempty = false;
     this.blocksArray.forEach(element => {
       if (element.Id == Id) {
         console.log(DueDate);
         element['Due Date'] = DueDate;
         if (element['Due Date'] == "") {
           element['isNotvalidDueDate'] = true;
           this.blockdetailInvalid = true;
           if (element['facility manager'] != "") {
             this.facilitymanagervalid_but_mobilenumberempty = true;
             element.facilitymanagervalid_but_mobilenumberempty = true;
             element.isblockdetailsempty1 = true;
             this.isblockdetailsempty = true;
           }
           else{
             this.mobilenumbervalid_but_facilitymanagerempty = false;
             element.mobilenumbervalid_but_facilitymanagerempty = false;
           }
         }
         else {
           element['isNotvalidDueDate'] = false;
           if (element['facility manager'] != "") {
             this.facilitymanagervalid_but_mobilenumberempty = false;
             element.facilitymanagervalid_but_mobilenumberempty = false;
           }
 
         }
         if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
           element.isblockdetailsempty1 = true;
         }
         else {
           if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = false;
               console.log('3-7');
           }
           else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = true;
               console.log('3-8');
           }
           else if (element['facility manager'] == '' && element['mobile number'] == '') {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = false;
               console.log('3-9');
           }
           else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
               element.isblockdetailsempty1 = true;
               console.log('3-10');
           }
           else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
               element.isblockdetailsempty1 = true;
               console.log('3-11');
           }
           else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
               element.isblockdetailsempty1 = false;
               console.log('3-12');
           }
         }
       }
       if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
         element.isNotBlockCreated_NowValid=false;
         this.isblockdetailsempty = true
       }
       else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
         let blockgroup = this.blocksArray.reduce((r, a) => {
           r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
           return r;
         }, {});
         console.log("block_group", blockgroup);
         Object.keys(blockgroup).forEach(key => {
            if (blockgroup[key].length == 1) {
             blockgroup[key].forEach(itm1=>{
               this.blocksArray.forEach(itm2=>{
                 if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                   if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                     itm2.hasNoDuplicateBlockname = true;
                   }
                   else{
                     itm2.hasNoDuplicateBlockname = false;
                     this.isblockdetailsempty = true
                   }
                 }
                 if (element.Id == Id) {
                   console.log('isNotBlockCreated_NowValid');
                   element.isNotBlockCreated_NowValid=true;
                 }
                
               })
             })
           }
           else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
           }
         })
       }
     })
     let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
       r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
       return r;
     }, {});
     if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
       console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
       Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
         blockgroup_for_logicalorder[itm1].forEach(itm2=>{
           if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
             this.canDoBlockLogicalOrder = false;
           }
         })
       })
       if(this.canDoBlockLogicalOrder == true){
         this.blocksArray = _.sortBy(this.blocksArray, "blockname");
         console.log(this.blocksArray);
       }
     }
  }
  getLatePymtChargeType(Id,eventvalue){
    console.log(eventvalue);
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(eventvalue);
        element['Late Payment Charge Type'] = eventvalue;
        if (element['Late Payment Charge Type'] == "") {
          element['isNotvalidLatePaymentChargeType'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = true;
            element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            this.mobilenumbervalid_but_facilitymanagerempty = false;
            element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidLatePaymentChargeType'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            this.facilitymanagervalid_but_mobilenumberempty = false;
            element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getLatePaymentCharge(Id,LatePaymentCharge){
    console.log(LatePaymentCharge);
    this.canDoBlockLogicalOrder=true;
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        console.log(LatePaymentCharge);
        element['Late Payment Charge'] = LatePaymentCharge;
        if (element['Late Payment Charge'] == "") {
          element['isNotvalidLatePaymentCharge'] = true;
          this.blockdetailInvalid = true;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = true;
            //element.facilitymanagervalid_but_mobilenumberempty = true;
            element.isblockdetailsempty1 = true;
            this.isblockdetailsempty = true;
          }
          else{
            //this.mobilenumbervalid_but_facilitymanagerempty = false;
            //element.mobilenumbervalid_but_facilitymanagerempty = false;
          }
        }
        else {
          element['isNotvalidLatePaymentCharge'] = false;
          element['manualBlockResetDisabled'] = false;
          if (element['facility manager'] != "") {
            //this.facilitymanagervalid_but_mobilenumberempty = false;
            //element.facilitymanagervalid_but_mobilenumberempty = false;
          }

        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
          element.isblockdetailsempty1 = true;
        }
        else {
          if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-7');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = true;
              console.log('3-8');
          }
          else if (element['facility manager'] == '' && element['mobile number'] == '') {
            console.log(element['mobile number']);
            console.log(typeof element['mobile number']);
            console.log(element['facility manager'] != undefined);
            console.log(element['mobile number'] != undefined);
              element.isblockdetailsempty1 = false;
              console.log('3-9');
          }
          else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
              element.isblockdetailsempty1 = true;
              console.log('3-10');
          }
          else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
              element.isblockdetailsempty1 = true;
              console.log('3-11');
          }
          else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
              element.isblockdetailsempty1 = false;
              console.log('3-12');
          }
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
        element.isNotBlockCreated_NowValid=false;
        this.isblockdetailsempty = true
      }
      else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
        let blockgroup = this.blocksArray.reduce((r, a) => {
          r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
          return r;
        }, {});
        console.log("block_group", blockgroup);
        Object.keys(blockgroup).forEach(key => {
           if (blockgroup[key].length == 1) {
            blockgroup[key].forEach(itm1=>{
              this.blocksArray.forEach(itm2=>{
                if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                  if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                    itm2.hasNoDuplicateBlockname = true;
                  }
                  else{
                    itm2.hasNoDuplicateBlockname = false;
                    this.isblockdetailsempty = true
                  }
                }
                if (element.Id == Id) {
                  console.log('isNotBlockCreated_NowValid');
                  element.isNotBlockCreated_NowValid=true;
                }
               
              })
            })
          }
          else if (blockgroup[key].length > 1) {
            this.blocksArray.forEach(itm2=>{
              if (itm2.Id == Id) {
                console.log('Id',Id);
                itm2.isNotBlockCreated_NowValid=false;
              }
            })
           this.isblockdetailsempty = true
          }
        })
      }
    })
    let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
      r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
      return r;
    }, {});
    if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
      console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
      Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
        blockgroup_for_logicalorder[itm1].forEach(itm2=>{
          if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
            this.canDoBlockLogicalOrder = false;
          }
        })
      })
      if(this.canDoBlockLogicalOrder == true){
        this.blocksArray = _.sortBy(this.blocksArray, "blockname");
        console.log(this.blocksArray);
      }
    }
  }
  getStartsFromDate(Id,StartsFrom){
     console.log(StartsFrom);
     this.canDoBlockLogicalOrder=true;
     this.isblockdetailsempty = false;
     this.blocksArray.forEach(element => {
       if (element.Id == Id) {
         console.log(StartsFrom);
         element['Starts From'] = StartsFrom;
         if (element['Starts From'] == "") {
           element['isNotvalidStartdate'] = true;
           this.blockdetailInvalid = true;
           if (element['facility manager'] != "") {
             this.facilitymanagervalid_but_mobilenumberempty = true;
             element.facilitymanagervalid_but_mobilenumberempty = true;
             element.isblockdetailsempty1 = true;
             this.isblockdetailsempty = true;
           }
           else{
             this.mobilenumbervalid_but_facilitymanagerempty = false;
             element.mobilenumbervalid_but_facilitymanagerempty = false;
           }
         }
         else {
           element['isNotvalidStartdate'] = false;
           if (element['facility manager'] != "") {
             this.facilitymanagervalid_but_mobilenumberempty = false;
             element.facilitymanagervalid_but_mobilenumberempty = false;
           }
 
         }
         if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
           element.isblockdetailsempty1 = true;
         }
         else {
           if ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = false;
               console.log('3-7');
           }
           else if ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = true;
               console.log('3-8');
           }
           else if (element['facility manager'] == '' && element['mobile number'] == '') {
             console.log(element['mobile number']);
             console.log(typeof element['mobile number']);
             console.log(element['facility manager'] != undefined);
             console.log(element['mobile number'] != undefined);
               element.isblockdetailsempty1 = false;
               console.log('3-9');
           }
           else if ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) {
               element.isblockdetailsempty1 = true;
               console.log('3-10');
           }
           else if ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)) {
               element.isblockdetailsempty1 = true;
               console.log('3-11');
           }
           else if (element['facility manager'] == undefined && element['mobile number'] == undefined) {
               element.isblockdetailsempty1 = false;
               console.log('3-12');
           }
         }
       }
       if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
         element.isNotBlockCreated_NowValid=false;
         this.isblockdetailsempty = true
       }
       else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
         let blockgroup = this.blocksArray.reduce((r, a) => {
           r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
           return r;
         }, {});
         console.log("block_group", blockgroup);
         Object.keys(blockgroup).forEach(key => {
            if (blockgroup[key].length == 1) {
             blockgroup[key].forEach(itm1=>{
               this.blocksArray.forEach(itm2=>{
                 if(itm1.blockname.toLowerCase() == itm2.blockname.toLowerCase()){
                   if (itm2.blockname != "" && itm2.blockname != undefined && itm2.blocktype != "" && itm2.blocktype != undefined && itm2.units != "" && itm2.units != undefined && itm2['Flat Rate value']!=undefined && itm2['Flat Rate value']!="" && itm2['Maintenance value']!=undefined && itm2['Maintenance value']!="" && itm2['Maintenance Type']!=undefined && itm2['Maintenance Type']!="" && itm2['Unit Of Measurement']!=undefined && itm2['Unit Of Measurement']!="" && itm2['Invoice Creation Frequency']!=undefined && itm2['Invoice Creation Frequency']!="" && itm2['Invoice Generation Date']!=undefined && itm2['Invoice Generation Date']!="" && itm2['Due Date']!=undefined && itm2['Due Date']!="" && itm2['Late Payment Charge Type']!=undefined && itm2['Late Payment Charge Type']!="" && itm2['Late Payment Charge']!=undefined && itm2['Late Payment Charge']!="" && itm2['Starts From']!=undefined && itm2['Starts From']!="" && ((itm2['facility manager'] != undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] != '')) || (itm2['facility manager'] == '' && itm2['mobile number'] == '') || (itm2['facility manager'] == undefined && itm2['mobile number'] == undefined)) {
                     itm2.hasNoDuplicateBlockname = true;
                   }
                   else{
                     itm2.hasNoDuplicateBlockname = false;
                     this.isblockdetailsempty = true
                   }
                 }
                 if (element.Id == Id) {
                   console.log('isNotBlockCreated_NowValid');
                   element.isNotBlockCreated_NowValid=true;
                 }
                
               })
             })
           }
           else if (blockgroup[key].length > 1) {
              this.blocksArray.forEach(itm2=>{
                if (itm2.Id == Id) {
                  console.log('Id',Id);
                  itm2.isNotBlockCreated_NowValid=false;
                }
              })
             this.isblockdetailsempty = true
           }
         })
       }
     })
     let blockgroup_for_logicalorder = this.blocksArray.reduce((r, a) => {
       r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
       return r;
     }, {});
     if (Object.keys(blockgroup_for_logicalorder).length == this.blocksArray.length) {
       console.log(Object.keys(blockgroup_for_logicalorder).length, this.blocksArray.length);
       Object.keys(blockgroup_for_logicalorder).forEach(itm1=>{
         blockgroup_for_logicalorder[itm1].forEach(itm2=>{
           if (itm2.blockname == "" || itm2.blockname == undefined || itm2.blocktype == "" || itm2.blocktype == undefined || itm2.units == "" || itm2.units == undefined || itm2['Flat Rate value']==undefined || itm2['Flat Rate value']=="" || itm2['Maintenance value']==undefined || itm2['Maintenance value']=="" || itm2['Maintenance Type']==undefined || itm2['Maintenance Type']=="" || itm2['Unit Of Measurement']==undefined || itm2['Unit Of Measurement']=="" || itm2['Invoice Creation Frequency']==undefined || itm2['Invoice Creation Frequency']=="" || itm2['Invoice Generation Date']==undefined || itm2['Invoice Generation Date']=="" || itm2['Due Date']==undefined || itm2['Due Date']=="" || itm2['Late Payment Charge Type']==undefined || itm2['Late Payment Charge Type']=="" || itm2['Late Payment Charge']==undefined || itm2['Late Payment Charge']=="" || itm2['Starts From']==undefined || itm2['Starts From']=="" || ((itm2['facility manager'] != undefined && itm2['mobile number'] == '') && (itm2['facility manager'] != '' && itm2['mobile number'] == '')) || ((itm2['facility manager'] == undefined && itm2['mobile number'] != undefined) && (itm2['facility manager'] == undefined && itm2['mobile number'] != '')) || ((itm2['facility manager'] != undefined && itm2['mobile number'] == undefined) && (itm2['facility manager'] != '' && itm2['mobile number'] == undefined))) {
             this.canDoBlockLogicalOrder = false;
           }
         })
       })
       if(this.canDoBlockLogicalOrder == true){
         this.blocksArray = _.sortBy(this.blocksArray, "blockname");
         console.log(this.blocksArray);
       }
     }
  }
  getblocktype(Id, blocktype) {
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.blocktype = blocktype;
        if (element.blocktype == "") {
          element['isnotvalidblocktype'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidblocktype'] = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  assignBlkarrTmpid(blkarrId){
    console.log(blkarrId);
    this.blocksArray.forEach(elemnt=>{
      if(elemnt.Id==blkarrId){
          console.log('test',blkarrId);
          elemnt.blockTmpid=blkarrId;
          console.log(elemnt.blockTmpid);
      }
      else{
        elemnt.blockTmpid='';
      }
    })
  }
 
  blocksArray = []
  blockname;
  blocktype;
  units;
  fecilitymanagername;
  mobilenumber;
  emailid;

  onFileChange(ev,blockprogressbartemplate: TemplateRef<any>) {
    this.blockprogressbartemplate = blockprogressbartemplate;
    $(".se-pre-con")[0].innerHTML = `<span style="position: absolute;top: 67%;left: 42%;font-size: 22px;color: red;">Validating block records</span><br>
    <span style="position: absolute;top: 74%;left: 34%;font-size: 22px;color: red;">please wait don't navigate back or reload page</span>`;

    $(".se-pre-con").show();
    this.isblockdetailsempty = false;
    this.blocksArray = [];
   
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary',cellDates:true,dateNF: 'dd/mm/yyyy' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //const dataString = JSON.stringify(jsonData);
      console.log(jsonData['Sheet1']);
      this.excelBlockList=jsonData['Sheet1']
      this.ShowExcelUploadDiscription=false;
      this.ShowExcelDataList=true;
      //this.createBlockFromExcel(this.excelBlockList);

       let blockslength=Number(this.globalService.noofblockscount)
      //for checking purpose blockbulkupload code commenting below

         if (this.excelBlockList.length <= blockslength) {
          if (this.excelBlockList.length == 0) {
          $(".se-pre-con").fadeOut("slow");
            Swal.fire({
              title: 'Please fill all the fields',
              text: "",
              type: "error",
              confirmButtonColor: "#f69321",
              confirmButtonText: "OK"
            })
          }
          else {
           /* let valueExcelBlckArr = this.excelBlockList.map(item => { return item.blockname.toLowerCase() });
            let isExcelBlkNameDuplicate = valueExcelBlckArr.some((item, idx) => {
              return valueExcelBlckArr.indexOf(item) != idx
            });
            if (isExcelBlkNameDuplicate) {
              Swal.fire({
                title: 'Duplicate Blockname Exist',
                text: "",
                type: "error",
                confirmButtonColor: "#f69321",
                confirmButtonText: "OK"
              })
            }
            else { */
              this.excelBlockList.forEach((list, i) => {
                console.log(list);
                // this.detailsdata[i] = {}
                // Object.keys(list).forEach(datails => {
                //   this.detailsdata[i][datails] = { required: true };
                // })

                  list.Id = i + 1;
                list.blockTmpid = 1;
                list.uniqueid = new Date().getTime();
                list.isnotvalidblockname = false,
                  list.isnotvalidblocktype = false,
                  list.isnotvalidmanageremailid = false,
                  list.isnotvalidmanagermobileno = false,
                  list.isUnitsCreatedUnderBlock = false;
                  list.isUnitsCreatedUnderBlock1 = true;
                list.isnotvalidfecilitymanagername = false,
                  list.hasNoDuplicateBlockname = false;
                  list.disableField=false;
                  list.markedasduplicate=1;
                list.isnotvalidunits = false,
                  list.blocktype = this.blocktypeaspropertytype;
                  list.isblockdetailsempty1=true;
                  list.isNotBlockCreated=true;
                  list.isNotBlockCreated_NowValid=false;
                  list.isBlockCreated=false;
                  list.isNotvalidFlatratevalue = false;
                  list.isNotvalidMaintenancevalue = false;
                  list.isNotvalidUnitOfMeasurement = false;
                  list.isNotvalidInvoiceCreationFrequency = false;
                  list.isNotvalidInvoiceGenerationDate = false;
                  list.isNotvalidDueDate = false;
                  list.isNotvalidLatePaymentChargeType = false;
                  list.isNotvalidLatePaymentCharge = false;
                  list.isNotvalidStartdate = false;
                  list.facilitymanagervalid_but_mobilenumberempty = false;
                  list.mobilenumbervalid_but_facilitymanagerempty = false;
                this.blocksArray.push(list);
                console.log(this.blocksArray)
              });
              this.blocksArray.forEach((element) => {
                if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="") {
                  this.isblockdetailsempty = true;
                  console.log('condition 1');
                   if(((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))){
                    element.facilitymanagervalid_but_mobilenumberempty = true;
                  }
                  else if(((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] == "" && element['mobile number'] != undefined) && (element['facility manager'] == "" && element['mobile number'] != ''))){
                    element.mobilenumbervalid_but_facilitymanagerempty = true;
                  }
                }
                else if(((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))){
                  element.facilitymanagervalid_but_mobilenumberempty = true;
                  console.log('condition 2');
                }
                else if(((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] == "" && element['mobile number'] != undefined) && (element['facility manager'] == "" && element['mobile number'] != ''))){
                  element.mobilenumbervalid_but_facilitymanagerempty = true;
                  console.log('condition 3');
                }
              })
              setTimeout(()=>{
                this.increasingBlockArrLength=this.blocksArray.length+1;
                this.createblocksdetails('');
              },this.excelBlockList.length * 1500)
            //}
          }
         }
      else {
        $(".se-pre-con").fadeOut("slow");

        Swal.fire({
          title: "Please Check uploaded no of blocks Count is" + " " + this.excelBlockList.length + " " + "should not more than given total no of blocks",
          text: "",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK",
          allowOutsideClick:false
        })
        // document.getElementById('upload_excel').style.display ='block';
      }
    }
    reader.readAsBinaryString(file);
  }
  unitsrowjson = {
    "flatno": "",
    "unittype": "",
    "unitdimension": "",
    "unit dimension": "",
    "Unit Calculation Type": "",
    "unit rate": "",
    "unitrate": "",
    "calculationtype": "",
    "ownershipstatus": "",
    "ownerfirstname": "",
    "ownerlastname": "",
    "ownermobilenumber": "",
    "owneremaiid": "",
    "tenantfirstname": "",
    "tenantlastname": "",
    "tenantmobilenumber": "",
    "tenantemaiid": "",
    "isnotvalidflatno": false,
    "isnotvalidunittype": false,
    "InvalidUnitDimension": false,
    "InvalidUnitRate": false,
    "isnotvalidownershipstatus": false,
    "isnotvalidownerfirstname": false,
    "isnotvalidownerlastname": false,
    "isnotvalidownermobilenumber": false,
    "isnotvalidowneremaiid": false,
    "isnotvalidtenantfirstname": false,
    "isnotvalidtenantlastname": false,
    "isnotvalidtenantmobilenumber": false,
    "isnotvalidtenantemaiid": false,
    "isSingleUnitDataEmpty": true,
    "displayText": "Save & Continue",
    "isUnitNameModifiedForDuplicateRecord": 'No',
    "manualUnitResetDisabled":true
  }
  unitdetails ={}
  blockssuccessarray;
  commonblockarray=[];
  uniqueBlockArr=[];
  duplicateBlockArr=[];
  commonblockarray1=[];

  toggleEmptyBlockarray;
  blockType = ['Residential','Commercial','Residential and Commercial']
  createblocksdetails(event) {
    this.notValidBlockArr=[];
    this.uniqueBlockArr=[];
    this.duplicateBlockArr=[];
    this.duplicateBlockCount=0;
    this.invalidBlockCount=0;
    this.toggleEmptyBlockarray=false;
    /* let valueBlckArr = this.blocksArray.map(item => { return item.blockname.toLowerCase() });
     console.log(valueBlckArr);
     let isBlkNameDuplicate = valueBlckArr.some((item, idx) => {
       return valueBlckArr.indexOf(item) != idx
     });
     if (isBlkNameDuplicate) {
           Swal.fire({
             title: 'Duplicate Blockname Exist',
           text: "",
           type: "error",
           confirmButtonColor: "#f69321",
           confirmButtonText: "OK"
           })
         }
         else{ */
          if(this.duplicateBlocknameExist){
            $(".se-pre-con").show();
            // this.blocksuccesscount = 0;

            this.toggleEmptyBlockarray=true;
            this.commonblockarray1=[];
            this.commonblockarray=[];
            this.blockssuccessarray = [];
            this.blocksArray.forEach(item => {
              if(item.disableField==false){
                this.commonblockarray.push(item);
              }
            })
            this.commonblockarray.forEach((element) => {
              if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
                this.isblockdetailsempty = true;
              }
            })
            console.log(this.commonblockarray);
            this.blockssuccessarray = this.blocksArray.length;//this.commonblockarray.length;
            this.blockdetailsfinalcreation();
          }
          else{
          let blockArrWithoutBlocknameUndefined=[];
            this.blockssuccessarray =[];
            this.blocksArray.forEach(item=>{
              if(item.blockname != undefined){
                blockArrWithoutBlocknameUndefined.push(item);
              }
            })
            console.log(this.blocksArray);
            this.blocksArray.forEach(item=>{
              if(item.blockname == undefined){
                console.log(item);
                this.duplicateBlockArr.push(item);
                this.invalidBlockCount += 1;
                console.log(this.invalidBlockCount)
              }
            })
            this.blocksArray=[];
            this.blocksArray=blockArrWithoutBlocknameUndefined;
            console.log(this.blocksArray);
            let group = this.blocksArray.reduce((r, a) => {
              r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
              return r;
            }, {});
            console.log("block_group", group);
            Object.keys(group).forEach(element => {
              if (group[element].length > 1) {
                group[element].forEach(item => {
                  item.isnotvalidblockname = true;
                  this.duplicateBlockArr.push(item);
                  this.duplicateBlockCount += 1;
                })
              }
              else if (group[element].length == 1) {
                group[element].forEach(item => {
                  this.uniqueBlockArr.push(item);
                })
              }
            })
            // this.blocksArray.forEach(item => {
            //   console.log(item.blockname.toLowerCase());
            //   let found = this.uniqueBlockArr.some(el => el.blockname.toLowerCase() == item.blockname.toLowerCase());
            //   console.log(found);
            //   console.log(this.uniqueBlockArr);
            //   if (found) {
            //     this.duplicateBlockArr.push(item);
            //     console.log(this.duplicateBlockArr);
            //   }
            //   else {
            //     this.uniqueBlockArr.push(item);
            //   }
            // })
            // console.log(this.uniqueBlockArr);
            // console.log(this.duplicateBlockArr);
            this.notValidBlockArr = this.uniqueBlockArr.filter((element) => {
              return (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)));
            })
            if(this.notValidBlockArr.length>0){
              this.notValidBlockArr.forEach(item=>{
                this.duplicateBlockArr.push(item);
               this.invalidBlockCount += 1;

              })
            }
            this.uniqueBlockArr = this.uniqueBlockArr.filter((element) => {
              if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
                console.log(element);
              }
              return (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && element['Starts From']!=undefined && element['Starts From']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined));
            })
            console.log(this.uniqueBlockArr);
            console.log(this.duplicateBlockArr);
            console.log(this.notValidBlockArr);

            if (this.uniqueBlockArr.length > 0) {
              console.log('No duplicates');
              this.commonblockarray = this.uniqueBlockArr;
              console.log(this.commonblockarray);
              this.isblockdetailsempty = false;
              this.blockssuccessarray = this.uniqueBlockArr.length;
              setTimeout(() => {
                this.commonblockarray.forEach((element) => {
                  if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
                    this.isblockdetailsempty = true;
                  }
                })
                this.blockdetailsfinalcreation();
              },this.blocksArray.length * 2000)
              console.log(this.commonblockarray);
            }
            else if(this.duplicateBlockArr.length > 0){
             $(".se-pre-con").fadeOut("slow");

              // document.getElementById('upload_excel').style.display = 'none'
              // document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
              // document.getElementById('showmanual').style.display = 'block';
              let displaymessage='';
              if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
                displaymessage = `${this.invalidBlockCount} Invalid
                                  ${this.duplicateBlockCount} Duplicate`;
                                  this.blockpopuptype = "error";
              }
              else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
                displaymessage = `${this.invalidBlockCount} Invalid`;
                this.blockpopuptype = "error";

              }
              else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
                displaymessage = `${this.duplicateBlockCount} Duplicate`;
                this.blockpopuptype = "error";

              }
              Swal.fire({
                title: displaymessage,
                text: "",
                type: this.blockpopuptype,
                confirmButtonColor: "#f69321",
                confirmButtonText: "OK"
              }).then(
                (result) => {
                  if (result.value) {
                    this.duplicateBlocknameExist = true;
                    this.blocksArray = [];
                    this.duplicateBlockArr.forEach(itm1 => {
                      itm1.markedasduplicate = 0;
                      this.blocksArray.push(itm1);
                    })
                    this.blocksArray.forEach(iitm => {
                      if (iitm.markedasduplicate == 0) {
                        console.log(iitm);
                        iitm.blockTmpid = '';
                        if (!this.duplicatemarked) {
                          this.duplicatemarked = true;
                          console.log(iitm);
                          iitm.blockTmpid = iitm.Id;
                        }
                        console.log(iitm.blockTmpid);
                      }
                      else {
                        iitm.blockTmpid = '';
                      }
                    })
                    this.blocksArray = _.sortBy(this.blocksArray, "markedasduplicate");
                    console.log(this.blocksArray.length);
                    console.log(this.blocksArray);
                  }
                })
            }
          }
    //}
  }
  blockidtmp={};
  blocknameforIteration='';
  sameBlocknameExist;
  duplicateBlocknameExist;
  unitlistjson = {}
  finalblockname = [];
  finalblocknameTmp = [];
  jsondata;
  blockdetailsfinalcreation(){
    $(".se-pre-con").fadeOut("slow");
    this.blockprogressvaluemax = this.blocksArray.length;
    this.duplicateBlocknameExist=false;
    if(!this.isblockdetailsempty){
      this.progressbarmodalRef = this.modalService.show(this.blockprogressbartemplate,Object.assign({}, { class: 'modal1' }));
      this.isblockdetailsempty=true;
      this.sameBlocknameExist=false;
      this.commonblockarray1.push(this.commonblockarray);
      console.log(this.commonblockarray1);
      this.commonblockarray.forEach((element,index) => {
          ((index) => {
            setTimeout(() => {

          // this.blockdetailsidvise(element);



          // let ipAddress = this.utilsService.createBlock();
          // let blockcreateurl = `${ipAddress}oyeliving/api/v1/Block/create`

            this.jsondata = {
              "ASAssnID": this.globalService.getCurrentAssociationId(),
              "ACAccntID": this.globalService.getacAccntID(),
              "blocks": [
                {
                  "BLBlkName": element.blockname,
                  "BLBlkType": element.blocktype,
                  //"BLBlkType": this.residentialorcommercialtype,
                  "BLNofUnit": element.units,
                  "BLMgrName": (element['facility manager'] == undefined ? '': element['facility manager']),
                  "BLMgrMobile": (element['mobile number'] == undefined ? '': element['mobile number']),
                  "BLMgrEmail": (element['email id'] == undefined ? '': element['email id']),
                  "ASMtType": element['Maintenance Type'],
                  "ASMtDimBs": element['Maintenance value'],
                  "ASMtFRate": element['Flat Rate value'],
                  "ASIcRFreq": element['Invoice Creation Frequency'],
                  "ASUniMsmt": 'sqft',
                  "ASBGnDate": formatDate(element['Invoice Generation Date'], 'yyyy/MM/dd', 'en'),
                  "ASLPCType": element['Late Payment Charge Type'],
                  "ASLPChrg": element['Late Payment Charge'],
                  "ASLPSDate": formatDate(element['Starts From'], 'yyyy/MM/dd', 'en'),
                  "ASDPyDate": formatDate(element['Due Date'], 'yyyy/MM/dd', 'en'),
 
                }
              ]

            }
            this.addblockservice.createBlock(this.jsondata)
          // this.http.post(blockcreateurl, jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
            .subscribe((res: any) => {
              console.log(res);

              console.log(res);
              if (res['data'].blockID) {
                let createUnitData =
                {
                  "ASAssnID": this.globalService.getCurrentAssociationId(),
                  "ACAccntID": this.globalService.getacAccntID(),
                  "units": [
                    {
                      "UNUniName": element.blockname + "-" + "Common",
                      "UNUniType": '',
                      "UNRate": '',
                      "UNOcStat": '',
                      "UNOcSDate": '',
                      "UNOwnStat": '',
                      "UNSldDate": '',
                      "UNDimens": '',
                      "UNCalType": '',
                      "BLBlockID": res['data'].blockID,
                      "Owner":
                        [{

                          "UOFName": '',
                          "UOLName": '',
                          "UOMobile": '',
                          "UOISDCode": '',
                          "UOMobile1": '',
                          "UOMobile2": '',
                          "UOMobile3": '',
                          "UOMobile4": '',
                          "UOEmail": '',
                          "UOEmail1": '',
                          "UOEmail2": '',
                          "UOEmail3": '',
                          "UOEmail4": '',
                          "UOCDAmnt": ''
                        }],
                      "unitbankaccount":
                      {
                        "UBName": '',
                        "UBIFSC": '',
                        "UBActNo": '',
                        "UBActType": '',
                        "UBActBal": '',
                        "BLBlockID": res['data'].blockID
                      },
                      "Tenant":
                        [{

                          "UTFName": '',
                          "UTLName": '',
                          "UTMobile": '',
                          "UTISDCode": '',
                          "UTMobile1": '',
                          "UTEmail": '',
                          "UTEmail1": ''
                        }],
                      "UnitParkingLot":
                        [
                          {
                            "UPLNum": '',
                            "MEMemID": '',
                            "UPGPSPnt": ''

                          }
                        ]
                    }
                  ]
                }

                this.viewUnitService.createUnit(createUnitData).subscribe(data => {
                  console.log(data);
                },
                  err => {
                    console.log(err);
                  })
              }
              if(res.data.blockID){
                this.blocksuccesscount += 1;
                this.blockprogressvalue = this.blocksuccesscount;
              this.blockidtmp[element.blockname]=res.data.blockID;
              console.log(this.blockidtmp);
              //console.log(res['data']['data']['blockID']);
              //console.log(this.unitlistjson[element.blockname]);
             /* this.unitlistjson[element.blockname].forEach(obj => {
                obj.blockid = res.data.blockID
                console.log(obj.blockid);
                console.log(this.unitlistjson)
              }) */
              element.isNotBlockCreated=false;
              element.isBlockCreated=true;
              let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
              this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
              this.finalblocknameTmp.push({'name':this.jsondata.blocks[0].BLBlkName,'displaytext':'Save And Continue'});
              for (var i = 0; i < blockArraylength; i++) {
                let data = JSON.parse(JSON.stringify(this.unitsrowjson))

                data.Id = this.jsondata.blocks[0].BLBlkName + i + 1;
                data.unitTmpid='';
                //data.blockid = res['data']['data']['blockID'];
                data.blockid = res.data.blockID;
                data.isUnitCreated=false;
                data.isUnitNotCreated=true;
                console.log(data.Id)

                if (!this.unitlistjson[this.jsondata.blocks[0].BLBlkName]) {
                  this.unitlistjson[this.jsondata.blocks[0].BLBlkName] = []
                }
                this.unitlistjson[this.jsondata.blocks[0].BLBlkName].push(data)
                console.log(this.unitlistjson);
                console.log(this.blocksArray);
              }
            }
              else if (res['data']['errorResponse']['message']){
                this.sameBlocknameExist=true;
                console.log('sameBlocknameExist');
                Swal.fire({
                  title: "Error",
                  text: res['data']['errorResponse']['message'],
                  type: "error",
                  confirmButtonColor: "#f69321",
                  allowOutsideClick:false
                });
              }
            }, error => {
            console.log(error);
          });

        }, 3000 * index)
      })(index)
      })
      setTimeout(() => {
        this.progressbarmodalRef.hide();
        // document.getElementById('blockdetailscancelbutton').style.display = 'none';
        // document.getElementById('upload_excel').style.display = 'none'
        // document.getElementById('blockdetailscancelbutton').style.display = 'none';
        // document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
        // document.getElementById('showmanual').style.display = 'block';
        // document.getElementById('blockdetailsbuttons').style.display = 'block';
        this.commonblockarray.forEach(element => {
          element.hasNoDuplicateBlockname=true;
          element.disableField=true;
        })

        if (!this.sameBlocknameExist) {
          let displaymessage;
          if (this.blockssuccessarray == 1) {
            displaymessage = 'Block Created Successfully';
            if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid
                                ${this.duplicateBlockCount} Duplicate`;
                this.blockpopuptype = "error";

            }
            else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid`;
              this.blockpopuptype = "error";

            }
            else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
              displaymessage = `${this.duplicateBlockCount} Duplicate`;
              this.blockpopuptype = "error";

            }
          }
          else if (this.blockssuccessarray > 1) {
            if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid
                                ${this.duplicateBlockCount} Duplicate`;
                this.blockpopuptype = "error";

            }
            else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid`;
              this.blockpopuptype = "error";

            }
            else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
              displaymessage = `${this.duplicateBlockCount} Duplicate`;
              this.blockpopuptype = "error";

            }
            else {
              displaymessage = this.blockssuccessarray + '-' + 'Blocks Created Successfully'
              this.blockpopuptype = "success";

            }
          }
          Swal.fire({
            title: displaymessage,
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
            allowOutsideClick:false
          }).then(
            (result) => {
              if (result.value) {
                if(this.duplicateBlockArr.length > 0){
                  this.duplicateBlocknameExist=true;
                  this.blocksArray=[];
                  this.duplicateBlockArr.forEach(itm1=>{
                    itm1.markedasduplicate=0;
                    this.blocksArray.push(itm1);
                  })
                  this.uniqueBlockArr.forEach(itm=>{
                    itm.hasNoDuplicateBlockname=true;
                    itm.disableField=true;
                    this.blocksArray.push(itm);
                  })
                  // this.duplicateBlockArr.forEach(itm1=>{
                  //   this.blocksArray.push(itm1);
                  // })
                  this.blocksArray.forEach(iitm=>{
                    if(iitm.markedasduplicate==0){
                      console.log(iitm);
                      iitm.blockTmpid='';
                      if(!this.duplicatemarked){
                        this.duplicatemarked=true;
                        console.log(iitm);
                        iitm.blockTmpid=iitm.Id;
                      }
                      console.log(iitm.blockTmpid);
                    }
                    else{
                      iitm.blockTmpid='';
                    }
                  })
                  this.blocksArray = _.sortBy(this.blocksArray, "markedasduplicate");
                  console.log(this.blocksArray.length);
                  console.log(this.blocksArray);
                }
                else{
                  if(this.toggleEmptyBlockarray){
                    this.blocksArray = _.sortBy(this.blocksArray, "blockname");

                    console.log(this.finalblockname);
                    console.log(this.blocksArray);
                    this.blocknameforIteration = this.finalblockname[0];
                    this.unitlistjson[this.finalblockname[0]][0]['unitTmpid'] = this.unitlistjson[this.finalblockname[0]][0]['Id'];
                    console.log(this.blocknameforIteration);
                    console.log(this.unitlistjson[this.finalblockname[0]][0]['unitTmpid']);
                    this.router.navigate(['blocks']);
                    // this.demo1TabIndex = this.demo1TabIndex + 1;
                  }
                  else{
                    this.blocksArray=[];
                    for(let i=0;i<=this.commonblockarray1.length-1;i++){
                      console.log(i);
                      console.log(this.commonblockarray1[i]);
                      this.commonblockarray1[i].forEach(elmt => {
                        this.blocksArray.push(elmt);
                      });
                    }
                    console.log(this.finalblockname);
                    console.log(this.blocksArray);
                    this.blocksArray = _.sortBy(this.blocksArray, "blockname");
                    this.blocknameforIteration = this.finalblockname[0];
                    this.unitlistjson[this.finalblockname[0]][0]['unitTmpid'] = this.unitlistjson[this.finalblockname[0]][0]['Id'];
                    console.log(this.blocknameforIteration);
                    console.log(this.unitlistjson[this.finalblockname[0]][0]['unitTmpid']);
                    this.router.navigate(['blocks']);
                    // this.demo1TabIndex = this.demo1TabIndex + 1;
                  }
                }
              }
            })
        }
      },this.commonblockarray.length * 3500)
      //document.getElementById("mat-tab-label-0-3").style.backgroundColor = "lightblue";

    }
  }

   // CREATE BLOCK FROM EXCEL START HERE
   createBlockFromExcel() {
    console.log(this.excelBlockList)
    this.excelBlockList.forEach((item,index)=> {
      ((index) => {
        setTimeout(() => {
          let CreateBockData = {
            "ASAssnID": this.globalService.getCurrentAssociationId(),
            "ACAccntID": this.globalService.getacAccntID(),
            "blocks": [
              {
                "ASAssnID": this.globalService.getCurrentAssociationId(),
                "BLBlkName": item['BlockName'],
                "BLBlkType": item['BlockType'],
                "BLNofUnit": item['NumberOfUnits'],
                "BLMgrName": item['ManagerName'],
                "BLMgrMobile": item['ManagerMobileNumber'],
                "BLMgrEmail": item['ManagerEmailID'],
                "ASMtType": "",
                "ASMtDimBs": "",
                "ASMtFRate": "",
                "ASUniMsmt": 'sqft',
                "ASIcRFreq": "",
                "ASBGnDate":"",
                "ASLPCType": "",
                "ASLPChrg": "",
                "ASLPSDate": "",
                "ASDPyDate": "",
                "BankDetails": ''
              }
            ]
          }

          console.log('CreateBockData', CreateBockData);
          this.addblockservice.createBlock(CreateBockData)
            .subscribe(data => {
              console.log(data);
              if (data['data'].blockID) {
                let createUnitData =
                {
                  "ASAssnID": this.globalService.getCurrentAssociationId(),
                  "ACAccntID": this.globalService.getacAccntID(),
                  "units": [
                    {
                      "UNUniName": item['BlockName'] + "-" + "Common",
                      "UNUniType": '',
                      "UNRate": '',
                      "UNOcStat": '',
                      "UNOcSDate": '',
                      "UNOwnStat": '',
                      "UNSldDate": '',
                      "UNDimens": '',
                      "UNCalType": '',
                      "BLBlockID": data['data'].blockID,
                      "Owner":
                        [{

                          "UOFName": '',
                          "UOLName": '',
                          "UOMobile": '',
                          "UOISDCode": '',
                          "UOMobile1": '',
                          "UOMobile2": '',
                          "UOMobile3": '',
                          "UOMobile4": '',
                          "UOEmail": '',
                          "UOEmail1": '',
                          "UOEmail2": '',
                          "UOEmail3": '',
                          "UOEmail4": '',
                          "UOCDAmnt": ''
                        }],
                      "unitbankaccount":
                      {
                        "UBName": '',
                        "UBIFSC": '',
                        "UBActNo": '',
                        "UBActType": '',
                        "UBActBal": '',
                        "BLBlockID": data['data'].blockID
                      },
                      "Tenant":
                        [{

                          "UTFName": '',
                          "UTLName": '',
                          "UTMobile": '',
                          "UTISDCode": '',
                          "UTMobile1": '',
                          "UTEmail": '',
                          "UTEmail1": ''
                        }],
                      "UnitParkingLot":
                        [
                          {
                            "UPLNum": '',
                            "MEMemID": '',
                            "UPGPSPnt": ''

                          }
                        ]
                    }
                  ]
                }

                this.viewUnitService.createUnit(createUnitData).subscribe(data => {
                  console.log(data);
                },
                  err => {
                    console.log(err);
                  })
              }
            })
        },300 * index)
      })(index)
    })
    Swal.fire({
      title: `${this.excelBlockList.length} - Blocks Created`,
      type: "success",
      confirmButtonColor: "#f69321",
      confirmButtonText: "Yes"
    }).then(
      (result) => {
        if (result.value) {
          this.router.navigate(['blocks']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      }
    )
  }

}
