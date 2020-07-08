import { Component, OnInit } from '@angular/core';
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

  constructor(
    public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public router:Router
  ) {
    this.excelBlockList=[];
    this.ShowExcelUploadDiscription=true;
    this.ShowExcelDataList=false;
   }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  upLoad() {
    document.getElementById("file_upload_id").click();
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
  resetStep4(ev){
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK"
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          this.blocksArray.forEach(Object=>{
            Object.blockname="";
            // Object.blocktype="";
            Object.units="";
            Object.managername="";
            Object.managermobileno="";
            Object.manageremailid="";
            
          })
        }
      })

  }
  getblocknameornumber(Id,blockname){
    this.isblockdetailsempty=false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.blockname = blockname;
        if (element.blockname == "") {
          element['isnotvalidblockname'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidblockname'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1=true;  
        }
        else{
          element.isblockdetailsempty1=false;  
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true

      }
    })
  }
  getnoofunits(Id,units){
    this.isblockdetailsempty=false;
    this.blocksArray.forEach(element=>{
      if(element.Id== Id){
        element.units = units;
        if(element.units ==""){
          element['isnotvalidunits']=true;
          this.blockdetailInvalid=true;
        }
        else{
          element['isnotvalidunits']=false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1=true;  
        }
        else{
          element.isblockdetailsempty1=false;  
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanagername(Id,managername){
    this.isblockdetailsempty=false;
    this.blocksArray.forEach(element=>{
      if(element.Id== Id){
        element.managername = managername;
        if(element.managername ==""){
          element['isnotvalidmanagername']=true;
          this.blockdetailInvalid=true;
        }
        else{
          element['isnotvalidmanagername']=false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1=true;  
        }
        else{
          element.isblockdetailsempty1=false;  
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanagermobileno(Id,managermobileno){
    this.isblockdetailsempty=false;
    this.blocksArray.forEach(element=>{
      if(element.Id== Id){
        element.managermobileno = managermobileno;
        if(element.managermobileno ==""){
          element['isnotvalidmanagermobileno']=true;
          this.blockdetailInvalid=true;
        }
        else{
          element['isnotvalidmanagermobileno']=false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1=true;  
        }
        else{
          element.isblockdetailsempty1=false;  
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanageremailid(Id,manageremailid){
    this.isblockdetailsempty=false;
    this.blocksArray.forEach(element=>{
      if(element.Id== Id){
        element.manageremailid = manageremailid;
        if(element.manageremailid ==""){
          element['isnotvalidmanageremailid']=true;
          this.blockdetailInvalid=true;
        }
        else{
          element['isnotvalidmanageremailid']=false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1=true;  
        }
        else{
          element.isblockdetailsempty1=false;  
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getblocktype(Id,blocktype){
    this.isblockdetailsempty=false;
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
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  blocksArray = []
  isblockdetailsempty: boolean;

  
  blockname;
  blocktype;
  units;
  managername;
  managermobileno;
  manageremailid;
 
  onFileChange(ev) {
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
      this.excelBlockList=jsonData['Sheet1']
      this.ShowExcelUploadDiscription=false;
      this.ShowExcelDataList=true;
      //this.createBlockFromExcel(this.excelBlockList);

       let blockslength=Number("10")
      //for checking purpose blockbulkupload code commenting below

         if (this.excelBlockList.length <= blockslength) {
          if (this.excelBlockList.length == 0) {
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
                list.isnotvalidmanagername = false,
                  list.hasNoDuplicateBlockname = false;
                list.isnotvalidunits = false,
                   list.blocktype = "Residential"
                  list.isblockdetailsempty1=true;

                this.blocksArray.push(list);
                console.log(this.blocksArray)
              });
              this.blocksArray.forEach((element) => {
                if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
                  this.isblockdetailsempty = true;
                }
                else {
                  this.isblockdetailsempty = false;
                }
              })
              setTimeout(()=>{
                this.createblocksdetails('');
              },1000)
            //}
          }
         }
      else {
        Swal.fire({
          title: "Please Check uploaded no of blocks should not more than given no of blocks",
          text: "",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        })
        document.getElementById('upload_excel').style.display ='block';
      }
    }
    reader.readAsBinaryString(file);
  }
  unitsrowjson = {
    "flatno": "",
    "unittype": "",
    "unitdimension": "",
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
    "isnotvalidflatno":false,
    "isnotvalidunittype":false,
    "isnotvalidownershipstatus":false,
    "isnotvalidownerfirstname":false,
    "isnotvalidownerlastname":false,
    "isnotvalidownermobilenumber":false,
    "isnotvalidowneremaiid":false,
    "isnotvalidtenantfirstname":false,
    "isnotvalidtenantlastname":false,
    "isnotvalidtenantmobilenumber":false,
    "isnotvalidtenantemaiid":false,
    "isSingleUnitDataEmpty":true
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
    this.uniqueBlockArr=[];
    this.duplicateBlockArr=[];
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
            this.toggleEmptyBlockarray=true;
            this.commonblockarray1=[];
            this.commonblockarray=[];
            this.blockssuccessarray = [];
            this.blocksArray.forEach(item => {
              if(item.hasNoDuplicateBlockname==false){
                this.commonblockarray.push(item);
              }
            })
            this.commonblockarray.forEach((element) => {
              if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
                this.isblockdetailsempty = true;
              }
            })
            console.log(this.commonblockarray);
            this.blockssuccessarray = this.commonblockarray.length;
            this.blockdetailsfinalcreation();
          }
          else{
            this.blockssuccessarray =[];
            this.blocksArray.forEach(item => {
              console.log(item.blockname.toLowerCase());
              let found = this.uniqueBlockArr.some(el => el.blockname.toLowerCase() == item.blockname.toLowerCase());
              console.log(found);
              console.log(this.uniqueBlockArr);
              if (found) {
                this.duplicateBlockArr.push(item);
                console.log(this.duplicateBlockArr);
              }
              else {
                this.uniqueBlockArr.push(item);
              }
            })
            console.log(this.uniqueBlockArr);
            console.log(this.duplicateBlockArr);
            
            if (this.uniqueBlockArr.length > 0) {
              console.log('No duplicates');
              this.commonblockarray = this.uniqueBlockArr;
              console.log(this.commonblockarray);
              this.isblockdetailsempty = false;
              this.blockssuccessarray = this.uniqueBlockArr.length;
              setTimeout(() => {
                this.commonblockarray.forEach((element) => {
                  if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
                    this.isblockdetailsempty = true;
                  }
                })
                this.blockdetailsfinalcreation();
              }, 1000)
              console.log(this.commonblockarray);
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
    this.duplicateBlocknameExist=false;
    if(!this.isblockdetailsempty){
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
                  "BLMgrName": element.managername,
                  "BLMgrMobile": element.managermobileno,
                  "BLMgrEmail": element.manageremailid,
                  "ASMtType": "",
                  "ASMtDimBs": "15",
                  "ASMtFRate": "",
                  "ASUniMsmt": "12",
                  "ASBGnDate": "04/05/2020",
                  "ASLPCType": "",
                  "ASLPChrg": "",
                  "ASLPSDate": "",
                  "ASDPyDate": "04/05/2020"
                }
              ]
      
            }
            this.addblockservice.createBlock(this.jsondata)
          // this.http.post(blockcreateurl, jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
            .subscribe((res: any) => {
              console.log(res);
              if(res.data.blockID){
             
              this.blockidtmp[element.blockname]=res.data.blockID;
              console.log(this.blockidtmp);
              //console.log(res['data']['data']['blockID']);
              //console.log(this.unitlistjson[element.blockname]);
             /* this.unitlistjson[element.blockname].forEach(obj => {
                obj.blockid = res.data.blockID
                console.log(obj.blockid);
                console.log(this.unitlistjson)
              }) */
              let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
              this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
              this.finalblocknameTmp.push(this.jsondata.blocks[0].BLBlkName);
              for (var i = 0; i < blockArraylength; i++) {
                let data = JSON.parse(JSON.stringify(this.unitsrowjson))

                data.Id = this.jsondata.blocks[0].BLBlkName + i + 1;
                data.unitTmpid='';
                //data.blockid = res['data']['data']['blockID'];
                data.blockid = res.data.blockID;
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
                  confirmButtonColor: "#f69321"
                });
              }
            }, error => {
            console.log(error);
          });
     
        }, 3000 * index)
      })(index)
      })
      setTimeout(() => {
        // document.getElementById('upload_excel').style.display = 'none'
        // document.getElementById('blockdetailscancelbutton').style.display = 'none';
        // document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
        // document.getElementById('showmanual').style.display = 'block';
        // document.getElementById('blockdetailsbuttons').style.display = 'block';


        if (!this.sameBlocknameExist) {
          var message;
          if (this.blockssuccessarray == 1) {
            message = 'Block Created Successfully'
          }
          else if (this.blockssuccessarray > 1) {
            message = this.blockssuccessarray + '-' + 'Blocks Created Successfully'
          }
          Swal.fire({
            title: message,
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          }).then(
            (result) => {
              if (result.value) {
                if(this.duplicateBlockArr.length > 0){
                  this.duplicateBlocknameExist=true;
                  this.blocksArray=[];
                  this.uniqueBlockArr.forEach(itm=>{
                    itm.hasNoDuplicateBlockname=true;
                    this.blocksArray.push(itm);
                  })
                  this.duplicateBlockArr.forEach(itm1=>{
                    this.blocksArray.push(itm1);
                  })
                  console.log(this.blocksArray.length);
                  console.log(this.blocksArray);
                }
                else{
                  if(this.toggleEmptyBlockarray){
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
      },3000)
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
