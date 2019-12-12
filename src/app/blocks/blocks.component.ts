import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewBlockService } from '../../services/view-block.service';
import { GlobalServiceService } from '../global-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
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
  myDate = new Date();
  BLBlkName: string;
  BLBlkType: string;
  BLNofUnit: number;
  BLMgrName: string;
  BLMgrMobile: number;
  BLMgrEmail: string;
  ASMtType: string;
  ASMtFRate: number;
  ASMtDimBs: string;
  ASUniMsmt: string;
  ASDPyDate: string;
  ASLPCType: string;
  ASLPChrg: number;
  ASLPSDate: string;
  BLBlockID: string;
  ASBGnDate: string;
  ASIcRFreq: string;

  addRate: string;
  addRate1: string;

  bkname: string;
  bktype: string;
  bknofflrs: string;
  bknofunit: string;

  bsConfig: object;

  blocktypes: object[];
  p: number;


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
  enableAddBlocksView:boolean;
  enableBlockListView:boolean;

  constructor(private viewBlkService: ViewBlockService,
    private globalService: GlobalServiceService,
    private router: Router,
    private modalService: BsModalService) { 
    //pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };

    this.bsConfig = Object.assign({}, { containerClass: 'theme-orange', dateInputFormat: 'DD-MM-YYYY' ,
    showWeekNumbers:false,
    isAnimated: true });

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

    this.ACAccntID=Number(this.globalService.getacAccntID());
    this.p = 1;
    this.todayDate=new Date();
    this.enableduedatevalidation = false;
   this.duedatechanged = false;
   this.invoicedatechanged = false;
   this.enablestartfromdatevalidation=false;
   this.enableAddBlocksView=false;
   this.enableBlockListView=true;
  }


  pageChanged(event) {
    this.config.currentPage = event;
  }

  ngOnInit() {
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    console.log('this.currentAssociationName',this.currentAssociationName);
    console.log('this.currentAssociationID',this.currentAssociationID);
    this.getBlockDetails();
    this.viewBlkService.getassociationlist(this.currentAssociationID)
      .subscribe(data => {
        this.assnName = data['data'].association.asAsnName;
        this.totalNoofblocks = data['data'].association.asNofBlks
      });
      this.allBlocksLists='';
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
  }

  getBlockDetails() {
    this.viewBlkService.getBlockDetails(this.currentAssociationID).subscribe(data => {
      this.allBlocksLists = data['data'].blocksByAssoc;
      console.log('allBlocksLists', this.allBlocksLists);
      this.availableNoOfBlocks = data['data'].blocksByAssoc.length;
      //asbGnDate
    });
  }
  addBlocksShow() {
    this.toggleStepWizard();
    this.enableAddBlocksView=true;
    this.enableBlockListView = false;
  }
  toggleStepWizard() {

    $(document).ready(function () {

      var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

      allWells.hide();

      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this);

        if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      });

      allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
          curInputs = curStep.find("input[type='text'],input[type='url']"),
          isValid = true;

        $(".form-group").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
          if (!curInputs[i].validity.valid) {
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
        }

        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
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

    console.log(JSON.stringify(this.frequencys));
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
    console.log(value);
    if (value != null) {
      this.invoicedatechanged = true;
      this.minDate = new Date(value);
      this.minDateinNumber = new Date(value).getTime();
      console.log('minDateinNumber', this.minDateinNumber);
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
      console.log('dueDateinNumber', this.dueDateinNumber);
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
  onStartsFromDateValueChange(value: Date) {
    if (value != null) {
      this.startsfromDateChanged = true;
      this.startsFromMaxDateinNumber = new Date(value).getTime();
      if (this.duedatechanged) {
        if (this.startsFromMaxDateinNumber < this.dueDateinNumber) {
          this.enablestartfromdatevalidation = true;
        }else if (this.startsFromMaxDateinNumber > this.dueDateinNumber) {
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

    console.log(JSON.stringify(this.createBlockData));
    this.viewBlkService.createBlock(this.createBlockData).subscribe(res => {
      console.log("Done")
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

  OpenModal(editBlocktemplate: TemplateRef<any>,blBlkName,blBlkType,blNofUnit,blMgrName,blMgrMobile,blMgrEmail,asMtType,asMtFRate,asMtDimBs,asUniMsmt,asbGnDate,asdPyDate,bldUpdated,aslpcType,aslpChrg,blBlockID,asiCrFreq,aslpsDate) {

    this.BLBlkName = blBlkName;
    this.BLBlkType = blBlkType;
    this.BLNofUnit = blNofUnit;
    this.BLMgrName = blMgrName;
    this.BLMgrMobile = blMgrMobile;
    this.BLMgrEmail = blMgrEmail;
    this.ASMtType = asMtType;
    this.ASMtFRate = asMtFRate;
    this.ASMtDimBs = asMtDimBs;
    this.ASUniMsmt = asUniMsmt;

    this.ASLPCType = aslpcType;
    this.ASBGnDate = formatDate(asbGnDate, 'dd/MM/yyyy', 'en');
    this.ASDPyDate = formatDate(asdPyDate, 'dd/MM/yyyy', 'en');
    this.ASLPSDate = formatDate(aslpsDate, 'dd/MM/yyyy', 'en');
    this.ASLPChrg = aslpChrg;
    this.BLBlockID = blBlockID;
    this.ASIcRFreq =asiCrFreq;

    console.log(this.BLBlkName);
    console.log(this.BLBlkType);
    console.log(this.BLNofUnit);
    console.log(this.BLMgrEmail);
    console.log(this.ASUniMsmt);
    console.log('ASDPyDate',this.ASDPyDate);
    console.log(this.ASLPChrg);
    console.log(this.ASLPSDate);
    console.log(this.BLBlockID);
    console.log(this.ASBGnDate);
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

    if(typeof this.ASBGnDate == 'string'){
      //alert('ASBGnDate is string');
      asbgndateobj=this.ASBGnDate.split('/');
      asbgndate = new Date(asbgndateobj[2]+'-'+asbgndateobj[1]+'-'+asbgndateobj[0]+'T00:00:00Z');
      //alert(asbgndate);
    }
    else if(typeof this.ASBGnDate == 'object'){
      //alert('ASBGnDate is object');
      asbgndate = this.ASBGnDate;
      //alert(asbgndate);
    }
    if(typeof this.ASDPyDate == 'string'){
      //alert('ASDPyDate is string');
      asdpydateobj= this.ASDPyDate.split('/');
      asdpydate = new Date(asdpydateobj[2]+'-'+asdpydateobj[1]+'-'+asdpydateobj[0]+'T00:00:00Z');
      //alert(asdpydate);
    }
    else if(typeof this.ASDPyDate == 'object'){
      //alert('ASDPyDate is object');
      asdpydate = this.ASDPyDate;
      //alert(asdpydate);
    }
    if(typeof this.ASLPSDate == 'string'){
      //alert('ASLPSDate is string');
      aslpsdateobj= this.ASLPSDate.split('/');
      aslpsdate = new Date(aslpsdateobj[2]+'-'+aslpsdateobj[1]+'-'+aslpsdateobj[0]+'T00:00:00Z');
      //alert(aslpsdate);
    }
    else if(typeof this.ASLPSDate == 'object'){
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
      ASIcRFreq:this.ASIcRFreq
    };

    console.log('editblockdata', editblockdata);
    this.viewBlkService.UpdateBlock(editblockdata).subscribe(res => {
      console.log("Done");
      console.log(JSON.stringify(res));
      console.log('editblockdata', editblockdata);
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

  goToAssociation(){
    this.router.navigate(['association']);
  }
  goToBlocks(){
    this.router.navigate(['blocks']);
  }
  goToUnits(){
    this.router.navigate(['units']);
  }
}
