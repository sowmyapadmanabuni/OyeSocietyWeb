import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
declare var $: any;
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
//import * as swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  modalRef: BsModalRef;
  addUnitISTPage: boolean = true;
  addUnit2NDPage: boolean = false;
  blockID: string;
  addmyVehicle: boolean = false;
  ACAccntID: number;
  ASAssnID: string;
  associationID: string;
  currentAssociationID: string;
  currentAssociationName: string;
  tenantDetails: boolean = false;
  ownerDetails: boolean = true;
  unit_Form: boolean = false;
  selectBlock: boolean = false;
  allBlocksLists: any[];
  blBlockID: string;
  viewAddunitUI:boolean;
  showCreateUnitemplate:boolean;
    UNUniType: any;
    UNOpenBal : any;
    UNCurrBal : any;
    UNOcStat  : any;
    UNCalTypeForEdit  : any;
    UNOcSDate : any;
    UNOwnStat : any;
    UNSldDate : any;
    UNDimens  : any;
    UNCalType : any;
    FLFloorID : any;
    BLBlockID : any;
    UNUnitID  : any;
    unUniName : any;
    unitTypeForEdit:any;


  blocks: any = [];
  units: any = [];
  bank: any = {};
  unit: any = {};
  owner: any = {};
  tenant: any = {};
  config: any;
  repUnit: any = {};
  viewUnitRow: any = {};
  parkings: any = [];
  newParking: any = {};
  allUnitBYBlockID: any[];
  accountTypes:object[];
  unitTypes:object[];
  calculationTypes:object[];
  occupencys:object[];
  // addUnits: boolean;
  // unitList: boolean;

  unitType:string;
  unitno:number;
  unitdimension:number;
  unitrate:number;
  calculationtype:string;
  occupency:string;
  occupencyInEditUnit:string;
  ownerFirtname:string;
  ownerLastname:string;
  ownerMobnumber:string;
  ownerAltnumber:string;
  ownerEmail:string;
  ownerAltemail:string;
  tenantFirtname:string;
  tenantLastname:string;
  tenantMobnumber:string;
  tenantEmail:string;
  p: number=1;

  order: string = 'unUniName';
  reverse: boolean = false;
  sortedCollection: any[];
  blBlkName:any;
  searchTxt:any;
  unOcSDate:any;
  currentAssociationIdForUnit:Subscription;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords: string;
  columnName: any;
  undCreated: any;
  SelectOccupancyOwnershipStatus: string;
  SelectUnitType: string;
  PaginatedValue: number;

  constructor(private router:Router,private viewUniService: ViewUnitService,
    private globalService: GlobalServiceService,
    private orderpipe: OrderPipe,private modalService: BsModalService) {
      this.PaginatedValue=10;
      this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='Show Records';
      this.blBlkName='Select Block Name';
      this.ACAccntID=this.globalService.getacAccntID();
    this.currentAssociationID=this.globalService.getCurrentAssociationId();
    //pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };

    this.p=1;
    this.blBlockID = '';
    this.unitType='';
    this.calculationtype='Select Calculation...';
    this.occupency='Select occupency an....';
    this.occupencyInEditUnit='Select occupency an....';
    this.unitTypeForEdit='Select Unit Type';

    this.accountTypes = [
      { "name": "Saving" },
      { "name": "Current" }
    ];
  
    this.unitTypes = [
      { "name": "Flat" },
      { "name": "Villa" },
      { "name": "Vaccant Plot" }
    ];
  
    this.calculationTypes = [
      { "name": "Flat Rate Value" },
      { "name": "Dimension Based" }
    ];
  
    this.occupencys = [
      { "name": "Sold Owner Occupied" },
      { "name": "Sold Tenant Occupied" },
      { "name": "Sold Vaccant" },
      { "name": "Unsold Vaccant" },
      { "name": "Unsold Tenant Occupied" }
    ];

    this.tenantFirtname='';
    this.tenantLastname='';
    this.tenantMobnumber='';
    this.tenantEmail='';

    this.ownerFirtname='';
    this.ownerLastname='';
    this.ownerMobnumber='';
    this.ownerAltnumber='';
    this.ownerEmail='';
    this.ownerAltemail='';
    //
    this.currentAssociationIdForUnit = this.globalService.getCurrentAssociationIdForUnit()
      .subscribe(msg => {
        console.log(msg);
        this.globalService.setCurrentAssociationId(msg['msg']);
        this.initialiseUnit();
      })
    this.SelectOccupancyOwnershipStatus='Select Occupancy Ownership Status';
    this.SelectUnitType='Select Unit Type';
  }
     pageChanged(event) {
      this.config.currentPage = event;
    }

  OpenModal(editUnits: TemplateRef<any>, unUnitID, unUniType, unOcStat, unDimens, unCalType, blBlockID, asAssnID, acAccntID, unUniName, undCreated) {
    this.SelectOccupancyOwnershipStatus = 'Select Occupancy Ownership Status';
    this.SelectUnitType = 'Select Unit Type';
    this.unUniName = unUniName,
      this.unitTypeForEdit = unUniType,
      this.occupencyInEditUnit = unOcStat,
      console.log(this.occupencyInEditUnit);
      this.UNDimens = unDimens,
      this.UNCalType = unCalType,
      // this.FLFloorID = 1,
      this.BLBlockID = blBlockID,
      this.UNUnitID = unUnitID
    this.undCreated = undCreated;
    this.modalRef = this.modalService.show(editUnits);
  }

  ngOnInit() {
    this.viewUniService.addUnits = false;
    this.viewUniService.unitList = true;
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    //this.associationID="10";
    this.getUnitDetails();
    this.getBlocks();
    this.viewUniService.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        this.allBlocksLists=[];
        this.allBlocksLists = data['data'].blocksByAssoc;
        //console.log('allBlocksLists',this.allBlocksLists);
      });
  }
  GetIsUnitCreated(event) {
    console.log(event);
    if (event == 'true') {
      this.viewUniService.addUnits = false;
      this.viewUniService.unitList = true;
    }
  }

  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  
  initialiseUnit(){
    this.allUnitBYBlockID=[];
    this.blBlkName='Select Block Name';
    this.viewUniService.GetBlockListByAssocID(this.globalService.getCurrentAssociationId())
      .subscribe(data => {
        this.allBlocksLists=[];
        this.allBlocksLists = data['data'].blocksByAssoc;
        console.log('allBlocksLists',this.allBlocksLists);
      });
  }
  getUnitDetails() {
    // console.log(this.associationID);
    //console.log(" Current association ID:" + this.currentAssociationID);
    this.viewUniService.getUnitDetails(this.currentAssociationID).subscribe(res => {
      console.log(res);
      var data: any = res;
      this.units = data.data.unit;
      //console.log(this.units);
    });
  }

  getBlocks() {
    this.viewUniService.getBlocks(this.currentAssociationID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      //console.log('data.data.blocksByAssoc', data.data.blocksByAssoc);
      this.blocks = data.data.blocksByAssoc;

    });
  }
  setRows(RowNum) {
    this.ShowRecords='abc';
    this.setnoofrows = (RowNum=='All'?'All Records':RowNum);
    $(document).ready(()=> {
      let element=document.querySelector('.page-item.active');
      console.log(element);
      console.log(element);
      if(element != null){
      (element.children[0] as HTMLElement).click();
      console.log(element.children[0]['text']);
      }
      else if (element == null) {
        this.PaginatedValue=0;
      }
    });
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  addBlockForm() {
    this.showCreateUnitemplate = true;
  }
  getOccupencyandOwnershipStatus(occupencyname) {
    this.occupency = occupencyname;
  }

  getCalculationTypes(calculationTypename) {
    //console.log(calculationTypename);
    this.calculationtype = calculationTypename;
  }
  loadBlock(block: string) {
    this.unit_Form = true;
    //console.log("blockID:" + this.blockID);
  }

  // addParking() {
  //   this.parkings.push(this.newParking)
  //   this.newParking = {};
  // }


  deleteParking(index) {
    this.parkings.splice(index, 1);
  }

  gotoAddunit(){
    //alert('inside go to addunit');
    this.router.navigate(['home/addunit']);
  }

  tenantOwnerdiv(occupency) {
    this.occupencys.forEach(item => {
      if (occupency == 'Unsold Vaccant') {
        this.tenantDetails = true;
        this.ownerDetails = false;
      }
      else if (occupency == 'Unsold Tenant Occupied') {
        this.tenantDetails = true;
        this.ownerDetails = false;
      }
      else {
        this.tenantDetails = false;
        this.ownerDetails = true;
      }
    })
  }




  viewUnit(repUnit:any){
    //console.log('repUnit',JSON.stringify(repUnit));
      this.currentAssociationName=this.globalService.getCurrentAssociationName();
      this.viewUnitRow={
        unitNo : repUnit.unUniName,
        unitType: repUnit.unUniType,
        unitDimen: repUnit.unDimens,
        rate: repUnit.unRate,
        calculationType: repUnit.unCalType,
        occupencyStatus: repUnit.unOcStat
      };
     
  }

  getAllUnitDetailsByBlockID(blBlockID,blBlkName) {
    this.blBlkName=blBlkName;
    this.blockID = blBlockID;
    this.blBlkName=blBlkName;
    this.allUnitBYBlockID=[]
    //this.blBlockID=blBlockID;

    /*-------------------Get Unit List By Block ID ------------------*/
    this.viewUniService.GetUnitListByBlockID(blBlockID)
      .subscribe(data => {
        console.log('allUnitBYBlockID',data);
        this.allUnitBYBlockID = data['data'].unitsByBlockID;
            //
            this.sortedCollection = this.orderpipe.transform(this.allUnitBYBlockID, 'unUniName');
            console.log(this.sortedCollection);
      });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }




  goToAssociation(){
    this.router.navigate(['association']);
  }
  goToUnitsBlocks(){
    this.router.navigate(['unitsblocks']);
  }
  goToBlocks(){
    this.router.navigate(['blocks']);
  }
  goToUnits(){
    this.router.navigate(['units']);
  }



  
  toggleStepWizard() {

    $(document).ready(function () {

      var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
        anchorDivs = $('div.stepwizard-row div'),
        Divs = $('div.stepwizard div div');

        //console.log(anchorDivs);

     /* navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent(); // these lines are for Underline 

          anchorDivs.removeClass('step-active'); // these lines are for Underline
          $item.addClass('btn-success');
          $divTgt.addClass('step-active'); // these lines are for Underline

          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
        if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-success').addClass('btn-default');
          navListItems.removeClass('active').addClass('disabled');
        }
      }); */

      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent();
        console.log('test');
        anchorDivs.removeClass('step-active');
        if (!$item.hasClass('disabled')) {
          console.log('disabled');
          navListItems.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          $divTgt.addClass('step-active');
          allWells.hide();
          console.log($target);
          console.log($target.attr("id"));
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      })

      allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
          curInputs = curStep.find("input[type='text']"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]'),
          isValid = true;

        $(".form-group").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
          if (!curInputs[i].validity.valid) {
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
        }

        if (isValid) {
          nextStepWizard.trigger('click');
          curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
        }
      });

      $('div.setup-panel div a.btn-success').trigger('click');
    });
  }
  addUnitsShow() {
    if(this.blBlkName=='Select Block Name'){
      Swal.fire({
        title: "Please Select Block",
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else{
    this.toggleStepWizard();
    this.viewUniService.addUnits = true;
    this.viewUniService.unitList = false;
    }
  }

  upLoad() {    
    if(this.blBlkName=='Select Block Name'){
    Swal.fire({
      title: "Please Select Block",
      text: "",
      type: "error",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK"
    })
  }
    else{
      document.getElementById("file_upload_id").click();
    }
  }
    // below code is for the Excel file upload
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
        this.createUnit(jsonData['Sheet1']);
      }
      reader.readAsBinaryString(file);
    }
//CREATE UNIT FROM EXCEL
  createUnit(jsonData) {
    console.log(typeof jsonData);
    Array.from(jsonData).forEach(item => {
      let createUnitData =
      {
        "ASAssnID": this.currentAssociationID,
        "ACAccntID": this.globalService.getacAccntID(),
        "units": [
          {
            "UNUniName": item['Unit Name - Flat no.'],
            "UNUniType": (item['UnitType']==undefined? "":item['UnitType']),
            "UNRate": (item['UnitRate']==undefined? "":item['UnitRate']),
            "UNOcStat": (item['OccupancyAndOwnershipStatus']==undefined? "UnSold Vacant Unit":item['OccupancyAndOwnershipStatus']),
            "UNOcSDate": "2019-03-02",
            "UNOwnStat": "null",
            "UNSldDate": "2019-03-02",
            "UNDimens": (item['UnitDimension']==undefined? "":item['UnitDimension']),
            "UNCalType": (item['CalculationType']==undefined? "":item['CalculationType']),
            "BLBlockID": this.blockID,
            "Owner":
              [{
  
                "UOFName": (item['OwnerFirstName']==undefined? "":item['OwnerFirstName']),
                "UOLName": (item['OwnerLastname']==undefined? "":item['OwnerLastname']),
                "UOMobile": (item['OwnerMobile']==undefined? "":item['OwnerMobile']),
                "UOISDCode": "+91",
                "UOMobile1": "null",
                "UOMobile2": "null",
                "UOMobile3": "null",
                "UOMobile4": "null",
                "UOEmail": (item['OwnerEmailID']==undefined? "":item['OwnerEmailID']),
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
              "BLBlockID": this.blockID
            },
            "Tenant":
              [{
  
                "UTFName": (item['TenantFirstName']==undefined? "":item['TenantFirstName']),
                "UTLName": (item['TenantLastName']==undefined? "":item['TenantLastName']),
                "UTMobile": (item['TenantMobileNumber']==undefined? "":item['TenantMobileNumber']),
                "UTISDCode": "+91",
                "UTMobile1": "",
                "UTEmail": (item['TenantEmail']==undefined? "":item['TenantEmail']),
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
    })
    Swal.fire({
      title: 'Unit Created Successfuly',
      type: 'success',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: "View Unit"
    })
  }
//CREATE UNIT FROM EXCEL

  // UPDATE UNIT FUNCTION STARTS HERE
  UpdateUnit(){
    let updateUnitData={
      "UNUniType" : this.unUniName,
      "UNOpenBal"    : "12.3",
      "UNCurrBal"    : "25.12",
      "UNOcStat"    : this.occupencyInEditUnit,
      "UNOcSDate" : "2018-02-25",
      "UNOwnStat" : "Active",
      "UNSldDate"    : "2018-02-02",
      "UNDimens"  : this.UNDimens,
      "UNCalType"    : this.UNCalType,
      "FLFloorID" : 1,
      "BLBlockID" : this.blockID,
      "UNUnitID"  : this.UNUnitID
    }
    this.viewUniService.UpdateUnitInfo(updateUnitData)
    .subscribe(data=>{
      //console.log(data);
      this.modalRef.hide();
      Swal.fire({
        title: 'Unit Updated Successfuly',
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {
            this.getAllUnitDetailsByBlockID(this.blockID,this.blBlkName);
          }
        })
    },
    err=>{
      //console.log(err);
    })
  }
  // UPDATE UNIT FUNCTION END HERE

  SelectOccupencyStatus(UNOcStat){
    this.SelectOccupancyOwnershipStatus='abc';
    this.UNOcStat=UNOcStat;
    this.occupencyInEditUnit=UNOcStat;
  }

  getUnitType(unitTpname) {
    this.SelectUnitType='abc';
    this.UNUniType = unitTpname;
    this.unitTypeForEdit = unitTpname;
  }

  getCalculationTypesUpadte(UNCalType){
    this.UNCalType = UNCalType;
    // this.UNCalTypeForEdit = UNCalType;
  }
  NavigateToBulkUpload(){
    this.router.navigate(['excelunit']);
  }
  onPageChange(event) {
    //console.log(event);
    //console.log(this.p);
    //console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if((event['srcElement']['text'] != undefined) && (event['srcElement']['text'] != '»') && (event['srcElement']['text'] != '1') && (Number(event['srcElement']['text']) == NaN)){
        //console.log('test');
        //console.log(Number(event['srcElement']['text']) == NaN);
        //console.log(Number(event['srcElement']['text']));
        let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
        this.p= Number(element.children[0]['text']);
      //console.log(this.p);
    } 
    if(event['srcElement']['text'] == '«'){
      //console.log(this.p);
      this.p= 1;
    }
    //console.log(this.p);
    let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
    if(element != null){
      this.p=Number(element.children[0]['text']);
      console.log(this.p);
      if (this.ShowRecords != 'Show Records') {
        console.log('testtt');
        //let PminusOne=this.p-1;
        //console.log(PminusOne);
        //console.log((this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //console.log(PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //this.PaginatedValue=PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows);
        console.log(this.p);
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.allUnitBYBlockID.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }  }
}
