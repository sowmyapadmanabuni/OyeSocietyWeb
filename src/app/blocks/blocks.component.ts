import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewBlockService } from '../../services/view-block.service';
import { GlobalServiceService } from '../global-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { ViewUnitService } from '../../services/view-unit.service';
import { AddBlockService } from '../../services/add-block.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {

  blocksData: boolean = true;
  addBlock_form: boolean = false;
  dimensionBasedRate: boolean = false;
  flatRatevalue: boolean = false;
  currentAssociationID: string;
  allBlocksLists: any = [];
  block: any = {};
  bank: any = {};
  createBlockData: any = {};
  associationID: string;
  ACAccntID: number;
  ASAssnID: string;
  currentAssociationName: string;
  config: any;
  viewBlockRow: any = {};
  assnName: string;
  totalNoofblocks: number;
  availableNoOfBlocks: number;
  allBlocksList: object;

  modalRef: BsModalRef;
   myDate : any;
  BLBlkName: string;
  BLBlkType: string;
  BLNofUnit: number;
  BLMgrName: string;
  BLMgrMobile: any;;
  BLMgrEmail: string;
  ASMtType: string;
  ASMtFRate: number;
  ASMtDimBs: string;
  ASUniMsmt: string;
  ASDPyDate: any;
  ASLPCType: string;
  ASLPChrg: number;
  ASLPSDate: any;
  BLBlockID: string;
  ASBGnDate: any;
  ASIcRFreq: string;

  addRate: string;
  addRate1: string;

  bkname: string;
  bktype: string;
  bknofflrs: string;
  bknofunit: string;

  bsConfig: object;

  blocktypes: object[];
  p: number = 1;

  invoicedatechanged: boolean;
  minDate: Date;
  minDateinNumber: number;
  startsFromMaxDate: Date;
  dueDateinNumber: number;
  enableduedatevalidation: boolean;
  duedatechanged: boolean;
  startsFromMaxDateinNumber: number;
  enablestartfromdatevalidation: boolean;
  startsfromDateChanged: boolean;
  todayDate: Date;
  enablestartfromdatevalid: boolean;
  public searchTxt: any;
  enableAddBlocksView: boolean;
  enableBlockListView: boolean;
  rate: any;
  rate1: any;
  CurrentAssociationIdForBlocks:Subscription;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords:any;
  columnName: any;
  formatDate: string;
  PaginatedValue: number;
  id: NodeJS.Timer;
  ASMtTypes:any[];
  constructor(private viewBlkService: ViewBlockService,
    public viewUnitService: ViewUnitService,
    public globalService: GlobalServiceService,
    public addblockservice: AddBlockService,
    private router: Router,
    private modalService: BsModalService) {
      this.ASMtTypes=['FlatRate','Dimension'];
      this.ASMtType = '';
      this.PaginatedValue=10;
      this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
      this.setnoofrows=10;
      this.ShowRecords='Show Records';
      this.CurrentAssociationIdForBlocks=this.globalService.getCurrentAssociationIdForBlocks()
        .subscribe(msg => {
          console.log(msg);
          this.globalService.setCurrentAssociationId(msg['msg']);
          this.initialiseBlocks();
        })
    //pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };

    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
    });

    this.allBlocksList = null;

    this.blocktypes = [{
      'name': 'Residential', 'displayName': 'Residential'
    },
    {
      'name': 'Commercial', 'displayName': 'Commercial'
    },
    {
      'name': 'Residential and Commercial', 'displayName': 'Residential and Commercial'
    }]

    this.ACAccntID = Number(this.globalService.getacAccntID());
    this.p = 1;
    this.todayDate = new Date();
    this.enableduedatevalidation = false;
    this.duedatechanged = false;
    this.invoicedatechanged = false;
    this.enablestartfromdatevalidation = false;
    this.enableAddBlocksView = false;
    this.enableBlockListView = true;
    localStorage.setItem('Component','BlocksManagent');
  }


  pageChanged(event) {
    this.config.currentPage = event;
  }
  setRows(RowNum) {
    this.ShowRecords = 'abc';
    this.setnoofrows = (RowNum == 'All' ?'All Records': RowNum);
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
  ngOnInit() {
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    //console.log('this.currentAssociationName',this.currentAssociationName);
    //console.log('this.currentAssociationID',this.currentAssociationID);
    this.getBlockDetails();
    this.id = setInterval(() => {
      this.getBlockDetails();
    },5000);

    this.viewBlkService.getassociationlist(this.currentAssociationID)
      .subscribe(data => {
        this.assnName = data['data'].association.asAsnName;
        this.totalNoofblocks = data['data'].association.asNofBlks
      });
    this.allBlocksLists = '';
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("#myInputallBlocksLists").on("keyup", function () {
        alert('test');
        var value = $(this).val().toLowerCase();
        $("#myInputallBlocksLists tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
    $(".se-pre-con").fadeOut("slow");
  }

  getBlockDetails() {
    this.viewBlkService.getBlockDetails(this.currentAssociationID).subscribe(data => {
      if(data['data']['blocksByAssoc'].length > this.allBlocksLists.length){
        this.allBlocksLists = data['data'].blocksByAssoc;
      }
      console.log('allBlocksLists', this.allBlocksLists);
      this.availableNoOfBlocks = data['data'].blocksByAssoc.length;
      //asbGnDate
    });
  }
  initialiseBlocks(){
    this.allBlocksLists=[];
    this.viewBlkService.getBlockDetails(this.globalService.getCurrentAssociationId()).subscribe(data => {
      this.allBlocksLists = data['data'].blocksByAssoc;
      //console.log('allBlocksLists', this.allBlocksLists);
      this.availableNoOfBlocks = data['data'].blocksByAssoc.length;
      //asbGnDate
    });
  }
  addBlocksShow() {
    this.toggleStepWizard();
    this.enableAddBlocksView = true;
    this.enableBlockListView = false;
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
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.allBlocksLists.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }
  }
  toggleStepWizard() {

    $(document).ready(function () {

      var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
        anchorDivs = $('div.stepwizard-row div'),
        Divs = $('div.stepwizard div div');

      //console.log(anchorDivs);
      // anchorDivs.click(function () {
      //   var $item = $(this);
      //   var $childitem = $($($item.children()[0]).attr('href'));

      //   Divs.removeClass('step-active');
      //   $item.addClass('step-active');
      //   //console.log($childitem);
      //   allWells.hide();
      //   $childitem.show();
      //   $childitem.find('input:eq(0)').focus();
      // })

     /* navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent();
        anchorDivs.removeClass('step-active');
        $item.addClass('btn-success');
        $divTgt.addClass('step-active');
        allWells.hide();
        $target.show();
        $target.find('input:eq(0)').focus();

        if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-success').addClass('btn-default');
          navListItems.removeClass('active').addClass('disabled');
        }
      }); */

      //
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
      //
      
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
  viewBlockDetails(blBlkName, blBlkType, blNofUnit) {
    this.bkname = blBlkName;
    this.bktype = blBlkType;
    this.bknofunit = blNofUnit;
    //$scope.rowId = idx;
  }

  addBlocksValidation() {
    let totalNoofblocks = this.totalNoofblocks;
    let availableNoOfBlocks = this.availableNoOfBlocks;
    if (totalNoofblocks <= availableNoOfBlocks) {
      Swal.fire({
        title: "Block limit Reached",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "Yes"
      })
    } else {
      this.router.navigate(['home/addBlocks']);
    }
  }

  addBlockForm() {
    this.blocksData = false;
    this.addBlock_form = true;

    //console.log(JSON.stringify(this.frequencys));
  }
  /*
    checkRate(){
        this.dimensionBasedRate=false;
        this.flatRatevalue=true; 
    }
  
    checkRate1(){
      this.dimensionBasedRate=true;
      this.flatRatevalue=false; 
  }
  */
  // checkRate() {

  //   if (this.block.rate == true) {
  //     this.flatRatevalue = true;
  //   }
  //   else {
  //     this.flatRatevalue = false;
  //   }
  //   if (this.block.rate1 == true) {
  //     this.dimensionBasedRate = true;
  //   }
  //   else {
  //     this.dimensionBasedRate = false;
  //   }

  // }
  onValueChange(value: Date): void {
    //console.log(value);
    if (value != null) {
      this.invoicedatechanged = true;
      this.minDate = new Date(value);
      this.minDateinNumber = new Date(value).getTime();
      //console.log('minDateinNumber', this.minDateinNumber);
      if (this.duedatechanged) {
        if (this.dueDateinNumber < this.minDateinNumber) {
          this.enableduedatevalidation = true;
        }
        else if (this.dueDateinNumber > this.minDateinNumber) {
          this.enableduedatevalidation = false;
        }
        else if (this.dueDateinNumber == this.minDateinNumber) {
          this.enableduedatevalidation = false;
        }
      }
    }
  }
  onDueDateValueChange(value: Date) {
    this.enableduedatevalidation = false;
    if (value != null) {
      this.duedatechanged = true;
      this.startsFromMaxDate = new Date(value);
      this.dueDateinNumber = new Date(value).getTime();
      //console.log('dueDateinNumber', this.dueDateinNumber);
      if (this.invoicedatechanged) {
        if (this.dueDateinNumber < this.minDateinNumber) {
          this.enableduedatevalidation = true;
        }
        else if (this.dueDateinNumber > this.minDateinNumber) {
          this.enableduedatevalidation = false;
        }
        else if (this.dueDateinNumber == this.minDateinNumber) {
          this.enableduedatevalidation = false;
        }
      }
      if (this.startsfromDateChanged) {
        if (this.startsFromMaxDateinNumber < this.dueDateinNumber) {
          this.enablestartfromdatevalidation = true;
        }
        else if (this.startsFromMaxDateinNumber == this.dueDateinNumber) {
          this.enablestartfromdatevalidation = false;
        }
      }
    }
    //this.startsFromMaxDate.setDate(this.startsFromMaxDate.getDate() + 1);
  }
  EnableBlockListView(event) {
    console.log(event);
    if(event == 'EnableBlockList'){
      this.getBlockDetails();
      this.enableBlockListView=true;
      this.enableAddBlocksView=false;
    }
  }
  onStartsFromDateValueChange(value: Date) {
    if (value != null) {
      this.startsfromDateChanged = true;
      this.startsFromMaxDateinNumber = new Date(value).getTime();
      if (this.duedatechanged) {
        if (this.startsFromMaxDateinNumber < this.dueDateinNumber) {
          this.enablestartfromdatevalidation = true;
        } else if (this.startsFromMaxDateinNumber > this.dueDateinNumber) {
          this.enablestartfromdatevalidation = false;
        }
        else if (this.startsFromMaxDateinNumber == this.dueDateinNumber) {
          this.enablestartfromdatevalidation = false;
        }
      }
    }
  }

  checkRate1(rate1) {
    if (rate1 == true) {
      this.addRate1 = 'dimension';
    } else {
      this.addRate1 = '';
    }
  }

  checkRate(rate) {

    if (rate == true) {
      this.addRate = 'flatRatevalue';
    } else {
      this.addRate = '';
    }
  }

  latePaymentChargeTypes: any = [
    { "name": "Monthly", "displayName": "Monthly" },
    { "name": "Quaterly", "displayName": "Quaterly" },
    { "name": "HalfYearly", "displayName": "HalfYearly" },
    { "name": "Annually", "displayName": "Annually" }
  ];

  frequencys: any = [
    { "name": "Monthly", "displayName": "Monthly" },
    { "name": "Quaterly", "displayName": "Quaterly" },
    { "name": "HalfYearly", "displayName": "Half Yearly" },
    { "name": "Annually", "displayName": "Annually" }
  ];

  accountTypes: any = [
    { "name": "Saving" },
    { "name": "Current" }
  ];

  createBlock() {
    this.createBlockData = {
      "ASAssnID": this.currentAssociationID,
      "ACAccntID": this.ACAccntID,
      "blocks": [{
        "BLBlkName": this.block.blockname,
        "BLBlkType": this.block.blocktype,
        "BLNofUnit": this.block.noofunits
      }]
    };

    //console.log(JSON.stringify(this.createBlockData));
    this.viewBlkService.createBlock(this.createBlockData).subscribe(res => {
      //console.log("Done")
      //alert("Block Created Successfully")
    });

    Swal.fire({
      title: 'Block Created Successfuly'
    })
  }//createBlock function ends


  viewBlock(repBlock) {
    this.viewBlockRow = {
      blockName: repBlock.blBlkName,
      blockType: repBlock.blBlkType,
      unitNo: repBlock.blNofUnit
    };
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  OpenModal(editBlocktemplate: TemplateRef<any>, blBlkName, blBlkType, blNofUnit, item, asMtType, asMtFRate, asMtDimBs, asUniMsmt, asbGnDate, asdPyDate, bldUpdated, aslpcType, aslpChrg, blBlockID, asiCrFreq, aslpsDate, bldCreated) {
    console.log('asbGnDate', asbGnDate);
    console.log('asdPyDate', asdPyDate);
    console.log('aslpsDate', aslpsDate);
    this.myDate =  bldCreated;
    this.BLBlkName = blBlkName;
    this.BLBlkType = blBlkType;
    this.BLNofUnit = blNofUnit;
    this.BLMgrName = item.faciliyManager[0]['fmName'];
    this.BLMgrMobile = item.faciliyManager[0]['acMobile'];
    this.BLMgrEmail = item.faciliyManager[0]['emailID'];
    this.ASMtType = asMtType;
    this.ASMtFRate = asMtFRate;
    this.ASMtDimBs = asMtDimBs;
    this.ASUniMsmt = asUniMsmt;

    this.ASLPCType = aslpcType;
    // this.ASBGnDate = formatDate(asbGnDate, 'dd/MM/yyyy', 'en');
    // this.ASDPyDate = formatDate(asdPyDate, 'dd/MM/yyyy', 'en');
    // this.ASLPSDate = formatDate(aslpsDate, 'dd/MM/yyyy', 'en');
    //console.log(formatDate(asbGnDate,'dd/MM/yyyy', 'en','T12:00:00'));
    //this.formatDate=formatDate(asbGnDate,'dd/MM/yyyy', 'en');
    //console.log(new Date(asbGnDate).setHours(12,0,0));
    //console.log(typeof formatDate(asbGnDate,'dd/MM/yyyy', 'en'));
    this.ASBGnDate = new Date(asbGnDate);
    this.ASDPyDate = new Date(asdPyDate);
    this.ASLPSDate = new Date(aslpsDate);
    this.ASLPChrg = aslpChrg;
    this.BLBlockID = blBlockID;
    this.ASIcRFreq = asiCrFreq;

    //console.log(this.BLBlkName);
    //console.log(this.BLBlkType);
    //console.log(this.BLNofUnit);
    //console.log(this.BLMgrEmail);
    //console.log(this.ASUniMsmt);
    console.log('ASDPyDate',this.ASDPyDate);
    //console.log(this.ASLPChrg);
    console.log(this.ASLPSDate);
    console.log(this.ASBGnDate);
    //console.log(this.BLBlockID);
    console.log(new Date(asbGnDate).toISOString());
    this.modalRef = this.modalService.show(editBlocktemplate,
      Object.assign({}, { class: 'gray modal-lg' }));

  }



  UpdateBlock() {
    let asbgndate;
    let asdpydate;
    let aslpsdate;
    let asbgndateobj
    let asdpydateobj;
    let aslpsdateobj;

    if (typeof this.ASBGnDate == 'string') {
      //alert('ASBGnDate is string');
      asbgndateobj = this.ASBGnDate.split('/');
      asbgndate = new Date(asbgndateobj[2] + '-' + asbgndateobj[1] + '-' + asbgndateobj[0] + 'T00:00:00Z');
      //alert(asbgndate);
    }
    else if (typeof this.ASBGnDate == 'object') {
      //alert('ASBGnDate is object');
      asbgndate = this.ASBGnDate;
      //alert(asbgndate);
    }
    if (typeof this.ASDPyDate == 'string') {
      //alert('ASDPyDate is string');
      asdpydateobj = this.ASDPyDate.split('/');
      asdpydate = new Date(asdpydateobj[2] + '-' + asdpydateobj[1] + '-' + asdpydateobj[0] + 'T00:00:00Z');
      //alert(asdpydate);
    }
    else if (typeof this.ASDPyDate == 'object') {
      //alert('ASDPyDate is object');
      asdpydate = this.ASDPyDate;
      //alert(asdpydate);
    }
    if (typeof this.ASLPSDate == 'string') {
      //alert('ASLPSDate is string');
      aslpsdateobj = this.ASLPSDate.split('/');
      aslpsdate = new Date(aslpsdateobj[2] + '-' + aslpsdateobj[1] + '-' + aslpsdateobj[0] + 'T00:00:00Z');
      //alert(aslpsdate);
    }
    else if (typeof this.ASLPSDate == 'object') {
      //alert('ASLPSDate is object');
      aslpsdate = this.ASLPSDate;
      //alert(aslpsdate);
    }
    let editblockdata = {
      BLBlkName: this.BLBlkName,
      BLBlkType: this.BLBlkType,
      BLNofUnit: this.BLNofUnit,
      BLMgrName: this.BLMgrName,
      BLMgrMobile: this.BLMgrMobile,
      BLMgrEmail: this.BLMgrEmail,
      ASMtType: this.ASMtType,
      ASMtFRate: this.ASMtFRate,
      ASMtDimBs: this.ASMtDimBs,
      ASUniMsmt: this.ASUniMsmt,
      ASBGnDate: formatDate(asbgndate, 'yyyy/MM/dd', 'en'),
      ASDPyDate: formatDate(asdpydate, 'yyyy/MM/dd', 'en'),
      ASLPSDate: formatDate(aslpsdate, 'yyyy/MM/dd', 'en'),
      ASLPCType: this.ASLPCType,
      ASLPChrg: this.ASLPChrg,
      BLBlockID: this.BLBlockID,
      ASAssnID: this.currentAssociationID,
      ASIcRFreq: this.ASIcRFreq
    };

    //console.log('editblockdata', editblockdata);
    this.viewBlkService.UpdateBlock(editblockdata).subscribe(res => {
      //console.log("Done");
      //console.log(JSON.stringify(res));
      //console.log('editblockdata', editblockdata);
      this.modalRef.hide();
      Swal.fire({
        title: 'Block Updated Successfuly',
      }).then(
        (result) => {

          if (result.value) {
            //this.form.reset();
            this.getBlockDetails();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['']);
          }
        }
      )

    });

  }
  managernamevalid:boolean;
  managermobilevalid:boolean;
  validatemanagermobilenumber(ev,mobile){
    if (mobile!= "" || undefined) {
      this.managermobilevalid = false;
      this.managernamevalid = true;

      if(this.BLMgrName!= "" || undefined){
      this.managernamevalid = false;
      }
    }
    else {
      if(this.BLMgrName!= "" || undefined){
        this.managermobilevalid = true;
        this.managernamevalid = false;
      }
      else if(mobile== "" || undefined){
        this.managernamevalid = false;
      }
    }
  }
  validatemanagername(ev,mngName){
    if (mngName!= "" || undefined) {
      this.managernamevalid = false;
      this.managermobilevalid = true;
      if(this.BLMgrMobile!=""|| undefined){
        this.managermobilevalid = false;
      }
    }
    else {
      // this.managernamevalid = true;
      if(mngName == "" || undefined ){
        this.managernamevalid = false;
      }else if(mngName == "" || undefined && this.BLMgrMobile!= "" || undefined){
        this.managernamevalid = true;

      }
      this.managermobilevalid = false;

    }

  }

  goToAssociation() {
    this.router.navigate(['association']);
  }
  goToBlocks() {
    this.router.navigate(['blocks']);
  }
  goToUnits() {
    this.router.navigate(['units']);
  }
  // UPLOAD BLOCK DATA FROM EXCEL
  upLoad() {
    document.getElementById("file_upload_id").click();
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
      
    }
    reader.readAsBinaryString(file);
  }
 
  // CREATE BLOCK FROM EXCEL END HERE
  NavigateToBulkUpload(){
    this.router.navigate(['excelblock']);
  }
}
