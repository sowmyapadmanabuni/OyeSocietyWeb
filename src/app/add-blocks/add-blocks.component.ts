import { Component, OnInit,ViewChild, Output,EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { AddBlockService } from '../../services/add-block.service';
import { GlobalServiceService } from '../global-service.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import {ViewAssociationService} from '../../services/view-association.service'
import { ViewUnitService } from '../../services/view-unit.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-add-blocks',
  templateUrl: './add-blocks.component.html',
  styleUrls: ['./add-blocks.component.css']
})
export class AddBlocksComponent implements OnInit {

  frequencies: object[];
  assnName: string;
  bsConfig: object;
  latePymtChrgTypes: object[];
  addRate: string;
  addRate1: string;
  condition = true;
  blockname: string;
  blocktype: string;
  noofunits: any;
  mngName: string;
  mobile: any;
  manageremail: any;
  flatRatevalue: number;
  maintenanceValue: number;
  measurements: number;
  billGenerationDate: Date;
  dueDate: Date;
  latePymtChargeType: string;
  latePymtCharge: any;
  startsFrom: Date;
  frequency: string;

  blocktypes: object[];

  minDate: Date;
  minDateinNumber: number;
  startsFromMaxDate: Date;
  dueDateinNumber: number;
  enableduedatevalidation: boolean;
  duedatechanged: boolean;
  invoicedatechanged: boolean;
  startsFromMaxDateinNumber: number;
  enablestartfromdatevalidation: boolean;
  startsfromDateChanged: boolean;

  currentAssociationID: string;
  currentAssociationName: string;
  currentaccountID:number;
  association: any;
  country: any;
 meter:string;
  //@ViewChild('ctrateBlockform') ctrateBlockform: any;

  todayDate:Date;
  check:any;
check1:any;
rate:any;
rate1:any;
@Output() EnableBlockListView:EventEmitter<string>;
ASMtFRate:any;
ASMtDimBs:any;
ASIcRFreq:any;
ASMtTypes:any[];
ASMtType:any;


  constructor(private addblockservice: AddBlockService,
    private globalservice: GlobalServiceService,
    private router:Router,
    private http: HttpClient,
    private viewassn: ViewAssociationService,
    private viewUniService: ViewUnitService) {
      this.ASMtTypes=['FlatRate','Dimension'];
      this.ASMtType = '';
      this.ASMtFRate='';
      this.ASMtDimBs='';
      this.ASIcRFreq='';
      this.EnableBlockListView=new EventEmitter<string>();
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    this.currentAssociationName = this.globalservice.getCurrentAssociationName();
    this.currentaccountID=this.globalservice.getacAccntID();
    this.assnName = this.currentAssociationName;
    this.bsConfig = Object.assign({}, { containerClass: 'theme-orange', 
                                        dateInputFormat: 'DD-MM-YYYY' ,
                                        showWeekNumbers:false,
                                        isAnimated: true});
    this.frequency = '';
    this.latePymtChargeType = 'SELECT CHARGE TYPE';
    this.blocktype = 'Select Block';
    this.enableduedatevalidation = false;
    this.duedatechanged = false;
    this.invoicedatechanged = false;
    this.enablestartfromdatevalidation = false;
    this.startsfromDateChanged = false;
    this.todayDate=new Date();

    this.latePymtChrgTypes = [
      { "name": "Monthly", "displayName": "Monthly" },
      { "name": "quaterly", "displayName": "Quaterly" },
      { "name": "Annually", "displayName": "Annually" }
    ];

    this.frequencies = [
      { "name": "Monthly", "displayName": "Monthly" },
      { "name": "Quarterly", "displayName": "Quarterly" },
      { "name": "Half Yearly", "displayName": "Half Yearly" },
      { "name": "Yearly", "displayName": "Yearly" }
    ];

    this.blocktypes = [{
      'name': 'Residential', 'displayName': 'Residential'
    },
    {
      'name': 'Commercial', 'displayName': 'Commercial'
    },
    {
      'name': 'Residential and Commercial', 'displayName': 'Residential and Commercial'
    }]

    this.maintenanceValue=0;
    this.flatRatevalue=0;
    this.blockname='';
    this.noofunits='';
    this.mngName='';
    this.mobile='';
    this.manageremail='';
    this.latePymtCharge='';
  }

  ngOnInit() {
    this.getassociationlist();
    this.getMeasurement();
    this.check="true";
   this.check1="true";
  }
  getLatePymtChargeType(name) {
    this.latePymtChargeType = name;
  }
  getBlockType(param){
    this.blocktype=param;
    
  }
  exceptionMessage='';
  blockarray=[]
  singleblocktype;
  currentassndata;
  getassociationlist(){
    let assnid=this.globalservice.getCurrentAssociationId()

    let asslistapi = "https://uatapi.scuarex.com/oyeliving/api/v1/association/getAssociationList/" + assnid;

    this.http.get(asslistapi, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
    this.currentassndata = res;
    this.singleblocktype = res.data.association.asPrpType;
    console.log(this.singleblocktype)
    }, error => {
      console.log(error);
     this.exceptionMessage = error['error']['exceptionMessage'];
     console.log(this.exceptionMessage);
    }
    );
  }
  getMeasurement(){
    this.viewassn.getAssociationDetailsByAssociationid(this.currentAssociationID).subscribe((res)=>{
      var data:any =res;
      //console.log(data);
      this.association=data.data.association;
      //console.log(this.association);
      this.country= this.association['asCountry'];
      //this.viewassn.ascountry = this.country;
      //console.log('country',this.country);
      // if(this.asCountry =='India'){
      //   this.meter='sqft';
      //   alert(this.meter);
      // }
      //   else if(this.asCountry !='India'){
      //     this.meter='sqmt';
      //     alert(this.meter);
 
      // }
      if (data['data']['association']['asCountry'] == "India") {
        this.meter ='sqft';
      }
      else {
        this.meter = 'sqmt';
      }
      if (data['data']['association']['asCountry'] != "India") {
        this.meter = 'sqmt';
      }
      else {
        this.meter = 'sqft';
      }
 
    })
  }
  ngAfterViewInit() {
  }
  checking(rate){
    if(rate==true){
      this.check="true";
    }
    else{
      this.check="false";
    }
  }
    checking1(rate1){
     if(rate1==true){
      this.check1="true";
    }else{
      this.check1="false";
    }
  }
  telInputObject(telinputobj) {
    //console.log(telinputobj);
  }
  hasError(errorobj) {
    //console.log(errorobj);
  }
  getNumber(numberobj) {
    //console.log(numberobj);
  }
  onCountryChange(countryobj) {
    //console.log(countryobj['dialCode']);
  }
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
    //this.minDate.setDate(this.minDate.getDate() + 1);
  }
  gotoviewBlocks(){
    this.router.navigate(['home/viewBlocks']);
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  _keyPress2(event) {
    const pattern = /[a-zA-Z _]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  blockdetailsvalid:boolean;
  noofunitsvallid:boolean;
  blocktypevalid:boolean;
  managernamevalid:boolean;
  managermobilevalid:boolean;
  manageremailvalid:boolean;
  flatratevalue:boolean;
  maintenancevalue:boolean;
  latePaymentchargevalid:boolean;
  validateblockname(ev, blockname) {
    if (blockname!= "" || undefined) {
      this.blockdetailsvalid = false;
    }
    else {
      this.blockdetailsvalid = true;
    }
  }
  validatenoofunits(ev,noofunits){
    if (noofunits!= "" || undefined) {
      this.noofunitsvallid = false;
    }
    else {
      this.noofunitsvallid = true;
    }
  }
  getblocktypevalid(blocktype){
    if (blocktype!= "" || undefined) {
      this.blocktypevalid = false;
    }
    else {
      this.blocktypevalid = true;
    }
  }
  validatemanagername(ev,mngName){
    if (mngName!= "" || undefined) {
      this.managernamevalid = false;
      this.managermobilevalid = true;
      if(this.mobile!=""|| undefined){
        this.managermobilevalid = false;
      }
    }
    else {
      // this.managernamevalid = true;
      this.managermobilevalid = false;

    }

  }
  validateflatratevalue(ev,ASMtFRate){
    if (ASMtFRate!= "" || undefined) {
      this.flatratevalue = false;
    }
    else {
      this.flatratevalue = true;
    }

  }
  validatemaintenancevalue(ev,ASMtDimBs){
    if (ASMtDimBs!= "" || undefined) {
      this.maintenancevalue = false;
    }
    else {
      this.maintenancevalue = true;
    }

  }
  validatemanagermobilenumber(ev,mobile){
    if (mobile!= "" || undefined) {
      this.managermobilevalid = false;
      this.managernamevalid = true;

      if(this.mngName!= "" || undefined){
      this.managernamevalid = false;
      }
    }
    else {
      if(this.mngName!= "" || undefined){
        this.managermobilevalid = true;
        this.managernamevalid = false;
      }
      else{
        this.managernamevalid = false;
      }
    }
  }
  validatemanageremail(ev,manageremail){
    if (manageremail!= "" || undefined) {
      this.manageremailvalid = false;
    }
    else {
      this.manageremailvalid = true;
    }
  }
  validatelatepayment(ev,latePymtCharge){
    if (latePymtCharge!= "" || undefined) {
      this.latePaymentchargevalid = false;
    }
    else {
      this.latePaymentchargevalid = true;
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
  onStartsFromDateValueChange(value: Date) {
    if (value != null) {
      this.startsfromDateChanged = true;
      this.startsFromMaxDateinNumber = new Date(value).getTime();
      if (this.duedatechanged) {
        if (this.startsFromMaxDateinNumber < this.dueDateinNumber) {
          this.enablestartfromdatevalidation = true;
        }
        else if (this.startsFromMaxDateinNumber > this.dueDateinNumber) {
          this.enablestartfromdatevalidation = false;
        }
        else if (this.startsFromMaxDateinNumber == this.dueDateinNumber) {
          this.enablestartfromdatevalidation = false;
        }
      }
    }
  }

  checkRate(rate) {
    if (rate == true) {
      this.addRate = 'flatRatevalue';
    } else {
      this.addRate = '';
    }
  }

  checkRate1(rate1) {
    if (rate1 == true) {
      this.addRate1 = 'dimension';
    } else {
      this.addRate1 = '';
    }
  }

  passvalue(frequency) {
    //console.log(frequency);
  }
  // blockType = [
  //   "RESIDENTIAL",
  //   "COMMERCIAL",
  //   "RESIDENTIAL AND COMMERCIAL"
  // ]
  getASMtType(obj){
    console.log(obj);
    this.ASMtType = obj.value
  }
  blockType = ['Residential','Commercial','Residential and Commercial']
  createBlock() {
    //frm.classList.add('was-validated');
    // if (this.ctrateBlockform.valid) {
      let CreateBockData = {
        "ASAssnID": this.currentAssociationID,
        "ACAccntID": this.currentaccountID,
        "blocks": [
          {
            "ASAssnID": this.currentAssociationID,
            "BLBlkName": this.blockname,
            "BLBlkType": this.singleblocktype,
            "BLNofUnit": this.noofunits,
            "BLMgrName": (this.mngName == undefined ? '' : this.mngName),
            "BLMgrISDCode"  : "+91",
            "BLMgrMobile": (this.mobile == undefined ? '' : this.mobile),
            "BLMgrEmail": (this.manageremail == undefined ? '' : this.manageremail),
            "ASMtType": '',
            "ASMtDimBs": '',
            "ASMtFRate": '',
            "ASUniMsmt": 'sqft',
            "ASIcRFreq": this.ASIcRFreq,
            "ASBGnDate": formatDate(this.billGenerationDate, 'yyyy/MM/dd', 'en'),
            "ASLPCType": this.latePymtChargeType,
            "ASLPChrg": this.latePymtCharge,
            "ASLPSDate": formatDate(this.startsFrom, 'yyyy/MM/dd', 'en'),
            "ASDPyDate": formatDate(this.dueDate, 'yyyy/MM/dd', 'en'),
            "BankDetails": ''
          }
        ]
      }

      console.log('CreateBockData', CreateBockData);
      this.addblockservice.createBlock(CreateBockData)
        .subscribe(data => {
          console.log(data);
          if(data['data'].blockID){
            swal.fire({
              title: "Block Created Successfully",
              text: "",
              type: "success",
              confirmButtonColor: "#f69321"
            }).then(
              (result) => {
                if (result.value) {

                  // let createUnitData =
                  // {
                  //   "ASAssnID": this.currentAssociationID,
                  //   "ACAccntID": this.currentaccountID,
                  //   "units": [
                  //     {
                  //       "UNUniName": this.blockname + "-" + "Common",
                  //       "UNUniType": '',
                  //       "UNRate": '',
                  //       "UNOcStat": '',
                  //       "UNOcSDate": '',
                  //       "UNOwnStat": '',
                  //       "UNSldDate": '',
                  //       "UNDimens": '',
                  //       "UNCalType": '',
                  //       "BLBlockID": data['data'].blockID,
                  //       "Owner1":
                  //       {
              
                  //         "UOFName": '',
                  //         "UOLName": '',
                  //         "UOMobile": '',
                  //         "UOISDCode": '',
                  //         "UOEmail": '',
                  //         "UOCDAmnt": ''
                  //       },
                  //       "unitbankaccount":
                  //       {
                  //         "UBName": '',
                  //         "UBIFSC": '',
                  //         "UBActNo": '',
                  //         "UBActType": '',
                  //         "UBActBal": '',
                  //         "BLBlockID": data['data'].blockID
                  //       },
                  //     "Tenant1":
                  //       {
              
                  //         "UTFName":'',
                  //         "UTLName": '',
                  //         "UTMobile": '',
                  //         "UTISDCode": '',
                  //         "UTEmail": ''
                  //       },
                  //       "UnitParkingLot":
                  //         [
                  //           {
                  //             "UPLNum": '',
                  //             "MEMemID": '',
                  //             "UPGPSPnt": ''
              
                  //           }
                  //         ]
                  //     }
                  //   ]
                  // }

                  // this.viewUniService.createUnit(createUnitData).subscribe(data => {
                  //   console.log(data);
                  //   this.EnableBlockListView.emit('EnableBlockList');
                  //   },
                  //   err => {
                  //     console.log(err);
                  //   })

                  //this.router.navigate(['home/viewBlocks']);
                    this.EnableBlockListView.emit('EnableBlockList');

                }
              })
          }
          else if (data['data']['errorResponse']['message']){
            swal.fire({
              title: "Error",
              text: data['data']['errorResponse']['message']+ " "+"For The"+ " " +this.currentassndata.data.association.asAsnName + " " +"Current Count Is" + " " + this.currentassndata.data.association.asNofBlks + "-Blocks" + " "+'And' + " " + this.currentassndata.data.association.asNofUnit + " " + "-Units" + " " +"Before Adding Please Click On OK to Increase The Blocks/Units Count",
              type: "error",
              confirmButtonColor: "#f69321"
            }).then(
              (result) => {
                console.log(result)
        
                if (result.value) {
                  let EditAssociationData = {}
                  EditAssociationData['ASAsnName'] = this.currentassndata.data.association.asAsnName;
                  EditAssociationData['ASCountry'] = this.currentassndata.data.association.asCountry;
                  EditAssociationData['ASAddress'] = this.currentassndata.data.association.asAddress;
                  EditAssociationData['ASCity'] = this.currentassndata.data.association.asCity;
                  EditAssociationData['ASState'] = this.currentassndata.data.association.asState;
                  EditAssociationData['ASPinCode'] = this.currentassndata.data.association.asPinCode;
                  EditAssociationData['ASPrpType'] = this.currentassndata.data.association.asPrpType;
                  EditAssociationData['ASPrpName'] = this.currentassndata.data.association.asPrpName;
                  EditAssociationData['ASNofBlks'] = this.currentassndata.data.association.asNofBlks;
                  EditAssociationData['ASNofUnit'] = this.currentassndata.data.association.asNofUnit;
                  EditAssociationData['asAssnID'] = this.currentassndata.data.association.asAssnID;
                  EditAssociationData['BAActID'] = '';
                  EditAssociationData['AMID'] = '';
                  EditAssociationData['AMType'] = '';
                  EditAssociationData['NoofAmenities'] = '';
                  EditAssociationData['ASPANNum'] = this.currentassndata.data.association.aspanNum;
                  EditAssociationData['asWebURL'] = this.currentassndata.data.association.asWebURL;
                  EditAssociationData['asAsnEmail'] = this.currentassndata.data.association.asAsnEmail;
                  EditAssociationData['BABName'] = "SBI";
                  EditAssociationData['BAIFSC'] = "iciic89898989";
                  EditAssociationData['BAActNo'] = "7654324567890";
                  EditAssociationData['BAActType'] = "savings";
                  EditAssociationData['ASPrpType'] = this.currentassndata.data.association.asPrpType;
        // this.viewassn.EditAssociationData = this.currentassndata.data.association;
        let editAssociationData = {
          "ASAddress": this.currentassndata.data.association.asAddress,
          "ASCountry": this.currentassndata.data.association.asCountry,
          "ASAsnName": this.currentassndata.data.association.asAsnName,
          "ASPANNum": this.currentassndata.data.association.aspanNum,
          "ASRegrNum": "",
          "ASCity": this.currentassndata.data.association.asCity,
          "ASState": this.currentassndata.data.association.asState,
          "ASPinCode": this.currentassndata.data.association.asPinCode,
          "ASPrpName": this.currentassndata.data.association.asPrpName,
          "ASPrpType": this.currentassndata.data.association.asPrpType,
          "ASNofBlks": this.currentassndata.data.association.asNofBlks,
          "ASNofUnit": this.currentassndata.data.association.asNofUnit,
          "ASAssnID": this.currentassndata.data.association.asAssnID,
          "asWebURL": this.currentassndata.data.association.asWebURL,
          "asAsnEmail": this.currentassndata.data.association.asAsnEmail,
          "Amenities":
            [{
              "AMType": "Club",
              "NoofAmenities": 2,
              "AMID": "1"
            }],
  
          "BankDetails": [{
            "BABName": "SBI",
            "BAIFSC": "iciic89898989",
            "BAActNo": "7654324567890",
            "BAActType": "savings",
            "BAActID": "1"
          }]
        }
        this.viewassn.EditAssociationData = editAssociationData;

        console.log(this.viewassn.EditAssociationData)
         this.router.navigate(['editassociation']);

                
                }
              })
          }
       
        },
          (err) => {
            console.log(err);
            swal.fire({
              title: "Error",
              text: `${err['error']['error']['message']}`,
              type: "error",
              confirmButtonColor: "#f69321"
            });
          });

    //}
  }

  removeValidationClass(frm) {
    this.enableduedatevalidation = false;
    frm.classList.remove('was-validated');
  }

  resetStep1(){
    swal.fire({
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

          this.blockname = '';
          this.noofunits = '';
          this.mngName = '';
          this.mobile = '';
          this.manageremail = '';
          this.ASMtFRate = '';
          this.ASMtDimBs = '';
          this.ASMtType = '';
          this.ASIcRFreq = '';
          this.billGenerationDate = null
          this.dueDate = null;
          this.latePymtChargeType = '';
          this.latePymtCharge = '';
          this.startsFrom = null;
        }
      })

  }
  resetStep2(){
    this.mngName='';
    this.mobile='';
    this.manageremail='';
  }
  resetStep3() {
    this.flatRatevalue = 0;
    this.maintenanceValue = 0;
    this.meter = '';
    this.frequency = '';
    this.billGenerationDate = null;
    this.dueDate = null;
    this.latePymtChargeType = 'SELECT CHARGE TYPE';
    this.startsFrom = null;
  }
}
