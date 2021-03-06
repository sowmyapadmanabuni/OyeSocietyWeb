import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { CommonserviceService } from './../commonservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers } from '@angular/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalServiceService } from '../global-service.service';
import { UtilsService } from '../../app/utils/utils.service';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
import { ViewAssociationService } from '../../services/view-association.service';
import { ViewBlockService } from '../../services/view-block.service';
import * as _ from 'lodash';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-enrollassociation',
  templateUrl: './enrollassociation.component.html',
  styleUrls: ['./enrollassociation.component.css']
})
export class EnrollassociationComponent implements OnInit {
  assosciationcreate;
  blockid;
  jsondata;
  assid;
  blockdetailsjson;
  form: FormGroup;
  form1: FormGroup;
  blockform: FormGroup;
  gstpanform: FormGroup;
  panform: FormGroup;
  blocksdetailsform: FormGroup;
  uploadForm: FormGroup;
  uploadPanForm: FormGroup;
  countrieslist = [];
  stateslist = [];
  citylist = [];
  // blocksdetailsform:FormGroup=this.formBuilder.group({});
  unitsdetailsform: FormGroup;
  isbulkupload = false;
  ismanualupload = false;
  associationfinalresult;
  titleAlert: string = 'This field is required';
  post: any = '';
  private formSubmitAttempt: boolean;
  isblockdetailsempty: boolean;
  isunitdetailsempty: boolean;
  blockdetailInvalid: boolean;
  blocktypeform = new FormControl("");
  condition = true;
  toggleEmptyBlockarray;
  unitrecordDuplicateUnitnameModified;
  disableElement: boolean;
  blockTabId: any;
  increasingBlockArrLength: any;
  ExcelBlkNameDuplicateList: any[];
  ExcelBlkNameDuplicateList1: any[];
  valueExcelBlckArr: any[];
  numberofexistence: any;
  duplicatemarked: any;
  valueExcelUnitArr: any[];
  numberofunitexistence: any;
  notValidBlockArr: any[];
  duplicateBlockCount:number;
  invalidBlockCount:number;
  duplicateUnitCount:number;
  invalidUnitCount:number;
  canDoBlockLogicalOrder:boolean;
  canDoUnitLogicalOrder:boolean;
  indexToCheckValidBlockName:number;
  ValidBlockName:any;
  InvalidBlocknamePresent:boolean;
  exitblocksbuttonshow:boolean;
  arraylist1:unknown[];
  progressbarmodalRef: BsModalRef;
  blockprogressbartemplate: TemplateRef<any>;
  unitprogressbartemplate:TemplateRef<any>;
  blockprogressvalue:number;
  blockprogressvaluemax:number;
  blocksuccesscount:number;
  unitprogressvalue:number;
  unitprogressvaluemax:number;
  unitsuccesscount:number;
  config = {
    ignoreBackdropClick: true
  };
  facilitymanagervalid_but_mobilenumberempty:boolean;
  mobilenumbervalid_but_facilitymanagerempty:boolean;
  ASMtTypes: string[];
  frequencies: { name: string; displayName: string; }[];
  latePymtChrgTypes: { name: string; displayName: string; }[];
  bsConfig:object;
  counter: any;
  counter1: any;
  counter3: any;
  calculationTypes: { name: string; displayName: string; }[];
  fileName:any;
  hidechooseFile1: boolean;
  PANfileName: string;
  hidePANchooseFile1: boolean;
  okaycontinuebutton: string;
  type:any;
  popuptype:any;
  constructor(private http: HttpClient, private cdref: ChangeDetectorRef,
    public viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private utilsService: UtilsService,
    private router:Router,
    private modalService: BsModalService, private formBuilder: FormBuilder,
    private ViewBlockService: ViewBlockService) {
    //this.countrylist();
      this.isunitdetailsempty = true;
      this.okaycontinuebutton='';
      this.fileName = "No file chosen...";
      this.PANfileName ='No file chosen...';
      this.hidechooseFile1=true;
      this.hidePANchooseFile1=true;
      this.calculationTypes = [
        { "name": "FlatRateValue","displayName":"Flat Rate Value" },
        { "name": "dimension","displayName":"Dimension Based"  }
      ];
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
        { "name": "Quarterly", "displayName": "Quarterly" },
        { "name": "Annually", "displayName": "Annually" }
      ];
      this.facilitymanagervalid_but_mobilenumberempty=false;
      this.mobilenumbervalid_but_facilitymanagerempty=false;
      this.blockprogressvalue=0;
      this.blockprogressvaluemax=0;
      this.blocksuccesscount=0;
      this.unitprogressvalue=0;
      this.unitprogressvaluemax=0;
      this.unitsuccesscount=0;
      this.arraylist1=[];
      this.InvalidBlocknamePresent = false;
      this.exitblocksbuttonshow = false;
      this.ValidBlockName='';
      this.indexToCheckValidBlockName=0;
      this.canDoBlockLogicalOrder=true;
      this.canDoUnitLogicalOrder = true;
      this.duplicateBlockCount=0;
      this.invalidBlockCount=0;
      this.duplicateUnitCount=0;
      this.invalidUnitCount=0;
    this.notValidBlockArr = [];
    this.numberofunitexistence = 0;
    this.valueExcelUnitArr = [];
    this.duplicatemarked = false;
    this.numberofexistence = 0;
    this.valueExcelBlckArr = [];
    this.ExcelBlkNameDuplicateList = [];
    this.ExcelBlkNameDuplicateList1 = [];
    this.blockTabId = 0;
    this.increasingBlockArrLength = 0;
    this.iindex = 0;
    this.blockdetailInvalid = true;
    this.url = '';
    this.isblockdetailsempty = true;
    this.duplicateBlocknameExist = false;
    this.toggleEmptyBlockarray = false;
    this.duplicateUnitrecordexist = false;
    this.unitrecordDuplicateUnitnameModified = false;
    this.totalUnitcount = 0;
    this.disableElement = true;
    // this.isunitdetailsempty=false;
  }


  propertyType = ['Residential', 'Commercial', 'Residential and Commercial']/*[
    "RESIDENTIAL",
    "COMMERCIAL PROPERTY",
    "RESIDENTIAL AND COMMERCIAL PROPERTY"
  ]*/

  amenityType = [
    "SWIMMING POOL",
    "GYM",
    "CLUB HOUSE",
    "THEATER"
  ]
  blockType = ['Residential', 'Commercial', 'Residential and Commercial']/*[
    "RESIDENTIAL",
    "COMMERCIAL",
    "RESIDENTIAL AND COMMERCIAL"
  ]*/
  paymentchargetype = [
    "MONTHLY",
    "QUATERLY",
    "ANNUALLY"
  ]
  invoicecreation = [
    "MONTHLY",
    "QUATERLY",
    "HALF YEARLY",
    "YEARLY"
  ]
  occupancy = [
    "Sold Owner Occupied Unit",
    "Sold Tenant Occupied Unit",
    "Sold Vacant Unit",
    "UnSold Vacant Unit",
    "UnSold Tenant Occupied Unit"
  ]/*[
    "SOLD OWNER OCCUPIED UNIT",
    "SOLD TENANT OCCUPIED UNIT",
    "SOLD VACANT UNIT",
    "UNSOLD VACANT UNIT",
    "UNSOLD TENANT OCCUPIED UNIT",
  ]*/
  unittypedata = [
    "FLAT",
    "VILLA",
    "VACCANT PLOT"
  ]
  ngOnInit() {
    
    // this.getAssociationList()
    this.createForm();

    //this.createForm1();
    this.blockandunitdetails();
    this.pandetalis();
    this.blocksdetailsform = this.formBuilder.group({

    });
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.uploadPanForm = this.formBuilder.group({
      panProfile: [''],
      //  gstnumber: [''],
      pannumber: ['']
    });
    this.unitsDetailsgenerateform();
    this.countrylist();
  }
  ngOnChanges(changes: SimpleChanges) {
    //  this.countrylist();
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  Clright(){
    console.log("right")
   
      let pos = $('div.overflow-hidden').scrollLeft() + 50;
      $('div.overflow-hidden').scrollLeft(pos);
  
  
  }

  Clleft(){
    console.log("left")

      let pos2 = $('div.overflow-hidden').scrollLeft() - 50;
      $('div.overflow-hidden').scrollLeft(pos2);
  
  }
  getRequiredErrorMessage(field) {
    return this.blocksdetailsform.get(field).hasError('required') ? 'You must enter a value' : '';
  }
  headers = new Headers()
  // getAssociationList(){
  //   // this.headers.append('Content-Type', 'application/json')
  //   // this.headers.append('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
  //   // this.headers.append('Access-Control-Allow-Origin', '*');
  //   this.http.get("http://apidev.oyespace.com/oyeliving/api/v1/association/getAssociationList",{ headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res:any)=>{
  //     console.log(res);
  //   },error=>{
  //    console.log(error);
  //   }
  //   );
  // }
  createForm() {
    this.form = this.formBuilder.group({
      'asnname': [null, Validators.required],
      'cntryname': [null, Validators.required],
      'statename': [null, Validators.required],
      'cityname': [null, Validators.required],
      'prprtytype': [null, Validators.required],
      'zipcode': [null, Validators.required],
      'prtyname': [null, Validators.required],
      'locname': [null, Validators.required],
      'assemail': [null, [Validators.required, Validators.email]],
      'urlset': [null]

    });
  }
  createForm1() {
    this.form1 = this.formBuilder.group({
      'blocktypeform': [null]
      /*'numberofunitsform': [null, Validators.pattern],
      'managernameform': [null, Validators.pattern],
      'managermobilenumberform': [null, Validators.pattern],
      'manageremailidform': [null, Validators.pattern]*/
    });
    this.form1.disabled;
  }
  blockandunitdetails() {
    this.blockform = this.formBuilder.group({
      'blockno': [null, Validators.required],
      'unitno': [null, [Validators.required,Validators.pattern(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/)]]

    });

  }
  pandetalis() {
    this.gstpanform = this.formBuilder.group({
      // 'gst': [null],
      'originalpan': [null, Validators.required]
    });
  }
  blockDetailsgenerateform() {
    this.blocksdetailsform = this.formBuilder.group({
      'blkname': [null, Validators.required],
      'unitsno': [null, Validators.required],
      'mngname': [null, Validators.required],
      'mngmobileno': [null, Validators.required],
      'mngemaiid': [null, [Validators.required, Validators.email]],

      // 'measuretype': [null, Validators.required],
      'invoicegendate': [null, Validators.required],
      'duedatecalender': [null, Validators.required],
      'latepayment': [null, Validators.required],
      'startdatefrom': [null, Validators.required]

    });
    // this.blocksArray.forEach((obj,index)=>{
    //   this.blocksdetailsform.addControl(index.toString(),blockgroup)

    // })
  }
  // blockDetailsgenerateform() {
  //   var blockgroup = this.formBuilder.group(

  //     {
  //     'blkname': [null, Validators.required],
  //     'unitsno': [null, Validators.required],
  //     'mngname': [null, Validators.required],
  //     'mngmobileno': [null, Validators.required],
  //     'mngemaiid': [null, [Validators.required, Validators.email]],
  //     'ratefieldvalue': [null, Validators.required],
  //     'maintbill': [null, Validators.required],

  //     //'measuretype': [null, Validators.required],
  //     'invoicegendate': [null, Validators.required],
  //     'duedatecalender': [null, Validators.required],
  //     'latepayment': [null, Validators.required],
  //     'startdatefrom': [null, Validators.required]

  //   });
  //   this.blocksArray.forEach((obj,index)=>{
  //     this.blocksdetailsform.addControl(index.toString(),blockgroup)

  //   })
  // }
  unitsDetailsgenerateform() {
    this.unitsdetailsform = this.formBuilder.group({
      'flat': [null, Validators.required],
      'dimension': [null, Validators.required],
      'rate': [null, Validators.required],
      'ownfirstname': [null, Validators.required],
      'ownlastname': [null, Validators.required],
      'ownmobileno': [null, Validators.required],
      'ownemail': [null, Validators.required],

      'tentfirstname': [null, Validators.required],
      'tentlatsname': [null, Validators.required],
      'tentmobileno': [null, Validators.required],
      'tentemail': [null, [Validators.required, Validators.email]],

    });
    // this.blocksArray.forEach((obj,index)=>{
    //   this.blocksdetailsform.addControl(index.toString(),blockgroup)

    // })
  }
  isFieldValidblockandunitdetails(field: string) {
    return !this.blockform.get(field).valid && this.blockform.get(field).touched;
  }
  isFieldValidPanDetails(field: string) {
    return !this.gstpanform.get(field).valid && this.gstpanform.get(field).touched;

  }

  isFieldValidunitsdetails(field: string) {
    return !this.unitsdetailsform.get(field).valid && this.unitsdetailsform.get(field).touched;

  }
  isFieldValidblocksdetails(field: string, index) {
    // return !this.blocksdetailsform.get(index.toString()).get(field).valid && this.blocksdetailsform.get(index.toString()).get(field).touched;
    if (index != null && index != undefined) {
      return !this.blocksdetailsform.get(field).valid && this.blocksdetailsform.get(field).touched;

    }
  }
  countrylist() {
    let countryurl = "https://devapi.scuarex.com/oyeliving/api/v1/Country/GetCountryList"

    this.http.get(countryurl, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
      console.log(res)
      this.countrieslist = res.data.country;

    }, error => {
      console.log(error);
      this.exceptionMessage = error['error']['exceptionMessage'];
      console.log(this.exceptionMessage);
    }
    );
  }

  selectedcountry(country) {
    console.log(country);
    console.log(country.value);
    let countryid = country.value.coid;
    this.countryname = country.value.coName;
    console.log(countryid)

    let stateurl = "http://devapi.scuarex.com/oyeliving/api/v1/Country/GetStateListByID/" + countryid;
    console.log(stateurl)


    this.http.get(stateurl, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
      console.log(res)
      this.stateslist = res.data.states;

    }, error => {
      console.log(error);
      this.exceptionMessage = error['error']['exceptionMessage'];
      console.log(this.exceptionMessage);
    }
    );
  }
  selectedstate(state) {
    let StateID = state.stid;
    console.log(StateID)

    this.state = state.stName;
    let cityurl = "http://devapi.scuarex.com/oyeliving/api/v1/Country/GetCityListByState/" + StateID;
    console.log(cityurl)


    this.http.get(cityurl, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
      console.log(res)
      this.citylist = res.data.country;

    }, error => {
      console.log(error);
      this.exceptionMessage = error['error']['exceptionMessage'];
      console.log(this.exceptionMessage);
    }
    );
  }
  selectedcity(cityname) {
    this.city = cityname.ctName;
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }
  blockdigits = new FormControl()
  associationname = new FormControl('', [Validators.required, Validators.minLength(3)]);


  getErrorMessage() {
    if (this.associationname.hasError('required')) {
      return 'You must enter a associationname';
    }
    return this.associationname.hasError('associationname') ? 'Not a valid name' : '';
  }

  assname;
  countryname;
  propertytype;
  residentialorcommercialtype = '';
  state;
  city;
  propertyname;
  locality;
  Associationemail;
  url;
  postalcode;
  gstnumber;
  pannumber;
  noofblocks;
  noofunits;
  amenityname;
  noofamenities;
  // blockdetails variables
  blocksArray = []

  blockname;
  blocktype;
  units;
  fecilitymanagername;
  mobilenumber;
  emailid;
  ratevalue;
  maintenancevalue;
  measurementtype;
  invoicefrequency;
  invoicedate;
  duedate;
  paymentcharge;
  latepaymentcharge;
  startdate;

  rowjson = {
    "blockid": "",
    "blockTmpid": "",
    "blockname": "",
    "blocktype": "",
    "Flat Rate value": "",
    "Maintenance value": "",
    "Maintenance Type": "",
    "Unit Of Measurement": "SQFT",
    "Invoice Creation Frequency": "",
    "Invoice Generation Date": "",
    "Due Date": "",
    "Late Payment Charge Type": "",
    "Late Payment Charge": "",
    "Starts From": "",
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

    "isnotvalidblockname": false,
    "isnotvalidblocktype": false,
    "isnotvalidmanageremailid": false,
    "isnotvalidmanagermobileno": false,
    "isnotvalidfecilitymanagername": false,
    "isnotvalidunits": false,
    "isNotvalidFlatratevalue": false,
    "isNotvalidMaintenancevalue": false,
    "isNotvalidUnitOfMeasurement": false,
    "isNotvalidInvoiceCreationFrequency": false,
    "isNotvalidInvoiceGenerationDate": false,
    "isNotvalidDueDate": false,
    "isNotvalidLatePaymentChargeType": false,
    "isNotvalidLatePaymentCharge": false,
    "isNotvalidStartdate": false,
    "isUnitsCreatedUnderBlock": false,
    "isUnitsCreatedUnderBlock1": true,
    "isblockdetailsempty1": true,
    "isNotBlockCreated": true,
    "isBlockCreated": false,
    "manualBlockResetDisabled":true
  }
  //unitdetails variables

  flatno;
  unittype;
  unitdimension;
  unitrate;
  calculationtype;
  ownershipstatus;
  ownerfirstname;
  ownerlastname;
  ownermobilenumber;
  owneremaiid;
  tenantfirstname;
  tenantlastname;
  tenantmobilenumber;
  tenantemaiid;


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
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      console.log(file.name);
      this.fileName = file.name;
      console.log(this.fileName);
      this.uploadForm.get('profile').setValue(file);
      this.processFile();
    }
  }
  modalRef: BsModalRef;
  ImgForPopUp: any;
  UploadedImage: any;
  showImgOnPopUp(ev, UploadedImagetemplate, thumbnailASAsnLogo, displayText) {
    ev.preventDefault();
    //if (thumbnailASAsnLogo != undefined) {
    this.ImgForPopUp = thumbnailASAsnLogo;
    this.UploadedImage = displayText;
    this.modalRef = this.modalService.show(UploadedImagetemplate, Object.assign({}, { class: 'gray modal-lg' }));
    //}

  }
  ASAsnLogo: any;
  thumbnailASAsnLogo: any;
  processFile() {
    console.log(this.thumbnailASAsnLogo);
    console.log(this.uploadForm.get('profile').value);
    var reader = new FileReader();
    if (this.uploadForm.get('profile').value != null) {
      reader.readAsDataURL(this.uploadForm.get('profile').value);
      reader.onload = () => {
        console.log(reader.result);
        this.ASAsnLogo = reader.result;
        this.thumbnailASAsnLogo = reader.result;
        this.ASAsnLogo = this.ASAsnLogo.substring(this.ASAsnLogo.indexOf('64') + 3);
        console.log(this.ASAsnLogo);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }
  openFileinput() {
    console.log('openFileinput');
    this.hidechooseFile1=false;
    document.getElementById('chooseFile1').click();
  }
  openPANFileinput(){
    console.log('openPANFileinput');
    this.hidePANchooseFile1=false;
    document.getElementById('panProfile1').click();
  }
  imgfilename;
  onPanFileSelect(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      console.log(file);
      this.PANfileName = file.name;
      this.uploadPanForm.get('panProfile').setValue(file);
      this.processPanFile();
    }
  }
  uploadPANCard: any;
  uploadPANCardThumbnail: any;
  processPanFile() {
    console.log(this.uploadPanForm.get('panProfile').value);
    var reader = new FileReader();
    if (this.uploadPanForm.get('panProfile').value != null) {
      reader.readAsDataURL(this.uploadPanForm.get('panProfile').value);
      reader.onload = () => {
        console.log(reader.result);
        this.uploadPANCard = reader.result;
        this.uploadPANCardThumbnail = reader.result;
        this.uploadPANCard = this.uploadPANCard.substring(this.uploadPANCard.indexOf('64') + 3);
        //console.log(this.ASAsnLogo.indexOf('64')+1);
        //console.log((this.ASAsnLogo.substring(this.ASAsnLogo.indexOf('64')+3)));
        console.log(this.uploadPANCard);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }
  firstLetter: string;
  fifthLetter: string;
  matching: boolean;
  pan() {
    this.firstLetter = this.assname.charAt(0).toUpperCase();
    this.fifthLetter = this.pannumber.charAt(4).toUpperCase();
    //console.log(this.firstLetter, this.fifthLetter);
    if (this.firstLetter == this.fifthLetter) {
      // localStorage.setItem('AssociationPAN', this.crtAssn.PANNumber);
      this.matching = false;
    } else {

      this.matching = true;
    }

  }
  // _keyPress4(event:any){

  //   var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;


  //   if(regpan.test(this.pannumber)){
  //     // valid pan card number
  //     console.log("valid")
  //  } else {
  //   console.log("notvalid")

  //     // invalid pan card number
  //  }
  // }
  pan_validate(ev) {
    var regpan = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
    this.pannumber = this.pannumber.toUpperCase()
    this.firstLetter = this.assname.charAt(0).toUpperCase();
    this.fifthLetter = this.pannumber.charAt(4).toUpperCase();
    if (this.firstLetter == this.fifthLetter) {
      if (regpan.test(this.pannumber) == false) {
        console.log("PAN Number Not Valid.");
      } else {
        console.log("PAN Number is Valid.");

      }
    }

  }
  gst_validate(ev) {
    // var regpan = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
    var regpan =   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    this.pannumber = this.pannumber.toUpperCase()
    this.firstLetter = this.assname.charAt(0).toUpperCase();
    this.fifthLetter = this.pannumber.charAt(4).toUpperCase();
    if (this.firstLetter == this.fifthLetter) {
      if (regpan.test(this.pannumber) == false) {
        console.log("PAN Number Not Valid.");
      } else {
        console.log("PAN Number is Valid.");

      }
    }

  }
  // keyPress3(event:any){
  //    const pattern = /^[1-9][0-9]*$/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //   // console.log(inputChar, e.charCode);
  //      if (!pattern.test(inputChar)) {
  //      // invalid character, prevent input
  //          event.preventDefault();
  //     }
  // }
  _keyPress5(event: any, Id) {
    var ch = String.fromCharCode(event.keyCode);
    var filter = /^[a-zA-Z_ ]*$/;
    if (!filter.test(ch)) {
      event.returnValue = false;
    }

  }
  _keyPress2(event: any, Id) {
    var ch = String.fromCharCode(event.keyCode);
    var filter = /[a-zA-Z]/;
    if (!filter.test(ch)) {
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
  _keyPressValidateUnitrate(event: any, Id) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      console.log('pattern.test-false');
      event.preventDefault();
    }
  }

  caltype = [
    "FlatRateValue",
    "dimension"
  ]
  unitsjson = []
  finalunits: any = [];
  finalblockname = [];
  finalblocknameTmp = [];
  array = []
  unitlistjson = {}
  unitdetailscreatejson;
  unitsuccessarray = []

  gotonexttab(ev, name, obj3Id, index) {
    console.log(name);
    console.log(obj3Id);
    console.log(index);

    this.unitmovingnexttab(name, obj3Id, index);

  }
  gotonexttab1(ev, name, index) {
    console.log(name);

    this.unitmovingnexttab1(name, index);

  }
  unitmovingnexttab1(name, index) {
    //if (this.isunitdetailsempty) {
    this.submitunitdetails1(name, index);
    //}
  }
  unitmovingnexttab(name, obj3Id, index) {
    //if (this.isunitdetailsempty) {
    this.submitunitdetails(name, obj3Id, index);
    //}
  }


  exceptionMessage1 = '';
  SubmitOrSaveAndContinue1 = 'Save And Continue';
  SubmitOrSaveAndContinue2 = '';
  // nextObjId1='';
  // isNextIetrationEnabled1;
  // nextBlckId1='';
  unitlistuniquejson = [];
  unitlistuniquejson1 = [];
  unitlistuniquejsonagainfiltered = [];
  unitlistduplicatejson = [];
  duplicateUnitrecordexist;
  totalUnitcount;
  message;
  submitunitdetails1(name, index) {
    this.duplicateUnitCount=0;
    this.invalidUnitCount=0;
    this.unitsuccessarray = [];
    console.log(this.iindex);
    if (this.finalblocknameTmp.length == (this.iindex + 2)) {
      console.log(this.finalblocknameTmp.length,(this.iindex + 2));
      console.log('iFinsideLTab');
      this.finalblocknameTmp[this.iindex + 1]['displaytext'] = "Submit";
      console.log(this.finalblocknameTmp);
    }
    this.iindex += 1;
    console.log(this.iindex);
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
     else { 
       let abc = Object.keys(this.unitlistjson);
       this.finalblocknameTmp = this.finalblocknameTmp.filter(item => {
         return item['name'] != name;
       }) */

    this.exceptionMessage1 = '';
    console.log(name);
    console.log(this.unitlistjson[name]);
    console.log(this.unitlistjson);
    let date = new Date();
    var getDate = date.getDate();
    var getMonth = date.getMonth() + 1;
    var getFullYear = date.getFullYear();
    var currentdata = getDate + "-" + getMonth + "-" + getFullYear;
    //this.unitsuccessarray=[];
    console.log(date)

    let ipAddress = this.utilsService.createUnit();
    let unitcreateurl = `${ipAddress}oyeliving/api/v1/unit/create`
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
      //this.unitsuccesscount = 0;
      let tempArr = [];
      this.unitlistjson[name].forEach(iitm => {
        if (iitm.disableField == false) {
          tempArr.push(iitm);
        }
      })
      this.unitlistjson[name] = [];
      this.unitlistjson[name] = tempArr;
      console.log(this.unitlistjson[name]);
      this.duplicateUnitrecordexist = false;
    }
    else {
      /* this.unitlistjson[name].forEach(iitm => {
         if(iitm.flatno != undefined){
           console.log(iitm.flatno.toLowerCase());
           let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == iitm.flatno.toLowerCase());
           console.log(found);
           console.log(this.unitlistuniquejson);
           if (found) {
             this.unitlistduplicatejson.push(iitm);
             console.log(this.unitlistduplicatejson);
             this.duplicateUnitrecordexist = true;
           }
           else {
             this.unitlistuniquejson.push(iitm);
             iitm.hasNoDuplicateUnitname = true;
             iitm.disableField=true;
             console.log(this.unitlistuniquejson);
           }
         }
         if(iitm.flatno == undefined){
           this.unitlistduplicatejson.push(iitm);
         }
       }) */
      /***/
      this.unitlistjson[name].forEach(item => {
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
            console.log(this.invalidUnitCount);
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
            /* let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
             console.log(found);
             if (found) {
               this.unitlistduplicatejson.push(item);
               this.duplicateUnitrecordexist = true;
             }
             else {
               this.unitlistuniquejson.push(item);
               item.hasNoDuplicateUnitname = true;
               item.disableField=true;
             } */
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
            console.log(this.invalidUnitCount);
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
            console.log('Sold Tenant Occupied Unit-unique');
            this.unitlistuniquejson.push(item);
            /* let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
             console.log(found);
             if (found) {
               this.unitlistduplicatejson.push(item);
               this.duplicateUnitrecordexist = true;
             }
             else {
               this.unitlistuniquejson.push(item);
               item.hasNoDuplicateUnitname = true;
               item.disableField = true;
             } */
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
            console.log(this.invalidUnitCount);
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
            /* let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
             console.log(found);
             if (found) {
               this.unitlistduplicatejson.push(item);
               this.duplicateUnitrecordexist = true;
             }
             else {
               this.unitlistuniquejson.push(item);
               item.hasNoDuplicateUnitname = true;
               item.disableField = true;
             } */
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
            console.log(this.invalidUnitCount);
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined &&
            item['unit dimension'] != "" && item['unit dimension'] != undefined &&
            item['Unit Calculation Type'] != "" && item['Unit Calculation Type'] != undefined &&
            item['unit rate'] != "" && item['unit rate'] != undefined) {
            this.unitlistuniquejson.push(item);
            /* let found = this.unitlistuniquejson.some(el => el.flatno.toLowerCase() == item.flatno.toLowerCase());
             console.log(found);
             if (found) {
               this.unitlistduplicatejson.push(item);
               this.duplicateUnitrecordexist = true;
             }
             else {
               this.unitlistuniquejson.push(item);
               item.hasNoDuplicateUnitname = true;
               item.disableField = true;
             } */
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
            console.log(this.invalidUnitCount);
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
      this.unitlistjson[name] = [];
      console.log(this.unitlistduplicatejson);
      console.log(this.unitlistuniquejson1);
      this.unitlistjson[name] = this.unitlistuniquejson1;
      console.log(this.unitlistjson[name]);
    }
    //}
    //
    $(".se-pre-con").fadeOut("slow");
    this.progressbarmodalRef=this.modalService.show(this.unitprogressbartemplate,Object.assign({}, { class: 'modal1' }));
    this.unitprogressvaluemax = Number(this.arraylist1.length);
    this.unitlistjson[name].forEach((unit, index) => {
      console.log(unit);
      ((index) => {
        setTimeout(() => {
          this.unitsuccessarray.push(unit);
          this.unitdetailscreatejson = {
            "ASAssnID": this.assid,
            "ACAccntID": this.globalService.getacAccntID(),
            "units": [
              {

                "UNUniName": unit.flatno,
                "UNUniType": unit.unittype,
                "UNOcStat": unit.ownershipstatus,
                "UNOcSDate": "2019-03-02",
                "UNOwnStat": "",
                "UNSldDate": "2019-03-02",
                "UNDimens": unit['unit dimension'],
                "UNRate": unit['unit rate'],
                "UNCalType": unit['Unit Calculation Type'],
                "FLFloorID": 14,
                "BLBlockID": unit.blockid,
                "Owner1":
                  {

                    "UOFName": (unit.ownerfirstname == undefined ? '' : unit.ownerfirstname),
                    "UOLName": (unit.ownerlastname == undefined ? '' : unit.ownerlastname),
                    "UOMobile": (unit.ownermobilenumber == undefined ? '' : unit.ownermobilenumber),
                    "UOISDCode": "+91",
                    "UOEmail": (unit.owneremaiid == undefined ? '' : unit.owneremaiid),
                    "UOCDAmnt": "2000"

                  },
                "Tenant1": {
                  "UTFName": (unit.tenantfirstname == undefined ? '' : unit.tenantfirstname),
                  "UTLName": (unit.tenantlastname == undefined ? '' : unit.tenantlastname),
                  "UTMobile": (unit.tenantmobilenumber == undefined ? '' : unit.tenantmobilenumber),
                  "UTISDCode": "+91",
                  "UTEmail": (unit.tenantemaiid == undefined ? '' : unit.tenantemaiid),
                },
                "unitbankaccount":
                {
                  "UBName": "SBI",
                  "UBIFSC": "SBIN0014",
                  "UBActNo": "LOP9090909",
                  "UBActType": "Savings",
                  "UBActBal": 12.3,
                  "BLBlockID": unit.blockid
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
          this.http.post(unitcreateurl, this.unitdetailscreatejson, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
            .subscribe((res: any) => {
              this.unitsuccesscount += 1;
              this.unitprogressvalue = this.unitsuccesscount;
              console.log(res)
              unit.hasNoDuplicateUnitname = true;
              unit.disableField = true;
              unit.isUnitCreated = true;
              unit.isUnitNotCreated = false;
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
                          this.type = "error";
        }
        else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
          this.message = `${this.invalidUnitCount} Invalid`
          this.type = "error";

        }
        else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
          this.message = `${this.duplicateUnitCount} Duplicate`
          this.type = "error";

        }
      }
      else if (this.unitsuccessarray.length > 1) {
        if (this.duplicateUnitCount > 0 && this.invalidUnitCount > 0) {
          this.message = `${this.invalidUnitCount} Invalid
                          ${this.duplicateUnitCount} Duplicate`
                          this.type = "error";

        }
        else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
          this.message = `${this.invalidUnitCount} Invalid`
          this.type = "error";

        }
        else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
          this.message = `${this.duplicateUnitCount} Duplicate`
          this.type = "error";

        }
        else {
          this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
          this.type = "success";

        }
      }
      if (this.duplicateUnitrecordexist) {
        document.getElementById('unitupload_excel').style.display = 'none'
        document.getElementById('unitshowmanual').style.display = 'block';
        document.getElementById('unitsmanualnew').style.display = 'none';
        document.getElementById('unitsbulkold').style.display = 'block';
        Swal.fire({
          title: this.message,
          text: "",
          type: this.type,
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
                  if (itm1.isUnitNameModifiedForDuplicateRecord == 'No') {
                    itm1.isUnitNameModifiedForDuplicateRecord = 'Yes';
                    console.log('isUnitNameModifiedForDuplicateRecord==Yes');
                  }
                  tmpArr.push(itm1);
                })
              }
              this.unitlistjson[name] = [];
              this.unitlistjson[name] = tmpArr.reverse();
              this.unitlistjson[name] = tmpArr;
              console.log(this.unitlistjson[name]);
              this.unitlistjson[name][0]['unitTmpid'] = this.unitlistjson[name][0]['Id'];
              console.log(this.unitlistjson[name][0]['unitTmpid']);
              this.unitrecordDuplicateUnitnameModified = true;
              this.isunitdetailsempty = false;
            }
          })
      }
      let abc0 = _.sortBy(Object.keys(this.unitlistjson));
      console.log(abc0);
      if (_.sortBy(Object.keys(this.unitlistjson))[abc0.length - 1] == name) {
        console.log('insidelasttab');
        if (!this.duplicateUnitrecordexist) {
          console.log('inlasttabNoduplicaterecordexist');
          let mesg = `Total Units Created - ${this.totalUnitcount}`
          document.getElementById('unitupload_excel').style.display = 'none'
          document.getElementById('unitshowmanual').style.display = 'block';
          document.getElementById('unitsmanualnew').style.display = 'none';
          document.getElementById('unitsbulkold').style.display = 'block';
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
                this.viewAssnService.dashboardredirect.next(result)
                this.viewAssnService.enrlAsnEnbled = false;
                this.viewAssnService.vewAsnEnbled = true;
                this.viewAssnService.joinAsnEbld = false;
                /*}
                else{
                  this.demo2TabIndex = this.demo2TabIndex + 1;
                }*/

              }
            })
        }
        else {
          console.log('inlasttabduplicaterecordexist');
          document.getElementById('unitupload_excel').style.display = 'none'
          document.getElementById('unitshowmanual').style.display = 'block';
          document.getElementById('unitsmanualnew').style.display = 'none';
          document.getElementById('unitsbulkold').style.display = 'block';
          if (this.unitlistduplicatejson.length > 0) {
            if (this.duplicateUnitCount > 0 && this.invalidUnitCount > 0) {
              this.message = `${this.invalidUnitCount} Invalid
                              ${this.duplicateUnitCount} Duplicate`
                            this.type = "error";
            }
            else if (this.duplicateUnitCount == 0 && this.invalidUnitCount > 0) {
              this.message = `${this.invalidUnitCount} Invalid`
              this.type = "error";

            }
            else if (this.duplicateUnitCount > 0 && this.invalidUnitCount == 0) {
              this.message = `${this.duplicateUnitCount} Duplicate`
              this.type = "error";

            }
          }
          else {
            this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
            this.type = "success";

          }
          Swal.fire({
            title: this.message,
            text: "",
            type: this.type,
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
                    if (itm1.isUnitNameModifiedForDuplicateRecord == 'No') {
                      itm1.isUnitNameModifiedForDuplicateRecord = 'Yes';
                      console.log('isUnitNameModifiedForDuplicateRecord==Yes');
                    }
                    tmpArr.push(itm1);
                  })
                }
                this.unitlistjson[name] = [];
                this.unitlistjson[name] = tmpArr.reverse();
                this.unitlistjson[name] = tmpArr;
                console.log(this.unitlistjson[name]);
                this.unitlistjson[name][0]['unitTmpid'] = this.unitlistjson[name][0]['Id'];
                console.log(this.unitlistjson[name][0]['unitTmpid']);
                this.unitrecordDuplicateUnitnameModified = true;
                this.isunitdetailsempty = false;
              }
            })
        }
      }
      else {
        console.log('demo2TabIndex');
        if (!this.duplicateUnitrecordexist) {
         /* let mesg = `${this.unitsuccessarray.length}-Unit Created Successfully`;
          Swal.fire({
            title: mesg,
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
            allowOutsideClick:false
          }).then(
            (result) => {
              if (result.value) { */
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
                this.unitlistjson[name] = [];
                this.unitlistjson[name] = tmpArr;
                console.log(this.unitlistjson[name]);
                this.unitlistuniquejson = [];
                this.unitlistuniquejson1 = [];
                this.unitlistduplicatejson = [];
                document.getElementById('unitupload_excel').style.display = 'none'
                document.getElementById('unitshowmanual').style.display = 'block';
                document.getElementById('unitsmanualnew').style.display = 'none';
                document.getElementById('unitsbulkold').style.display = 'block';
                console.log(this.increasingBlockArrLength);
                console.log(this.blockTabId);
                this.blockTabId += 1;
                this.blocksArray.forEach((itm, indx) => {
                  if (itm.blockname.toLowerCase() == name.toLowerCase()) {
                    itm.isUnitsCreatedUnderBlock = true;
                    itm.isUnitsCreatedUnderBlock1 = false;
                    if (this.blocksArray[indx + 1] != undefined) {
                      console.log(this.blocksArray[indx + 1]['blockname']);
                      this.blocknameforIteration = this.blocksArray[indx + 1]['blockname'];
                      this.nextBlckId = this.blocksArray[indx + 1]['Id'];
                      console.log(this.blocknameforIteration);
                      console.log(this.nextBlckId);
                    }
                  }
                })
                this.isunitdetailsempty = false;
                this.assignTmpid(this.nextBlckId, this.blocknameforIteration);
                this.indexToCheckValidBlockName += 1;
              //}
            //})
        }
      }
    },Number(this.unitlistjson[name].length) * 3000)
  }
  exceptionMessage = '';
  SubmitOrSaveAndContinue = 'SAVE AND CONTINUE';
  nextObjId = '';
  isNextIetrationEnabled;
  nextBlckId = '';
  submitunitdetails(name, obj3Id, index) {
    this.isNextIetrationEnabled = false;
    let valueManualUnitnameArr = this.unitlistjson[name].map(item => { return item.flatno.toLowerCase() });
    console.log(valueManualUnitnameArr);
    console.log(this.unitlistjson[name]);
    let isManualUnitnameDuplicate = valueManualUnitnameArr.some((item, idx) => {
      console.log(valueManualUnitnameArr.indexOf(item), idx);
      if (item != "") {
        return valueManualUnitnameArr.indexOf(item) != idx
      }
    });
    if (isManualUnitnameDuplicate) {
      Swal.fire({
        title: 'Duplicate Unitname Exist',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
        allowOutsideClick:false
      })
    }
    else {
      /* let abc = Object.keys(this.unitlistjson);
         this.finalblocknameTmp = this.finalblocknameTmp.filter(item=>{
           return item !=  name;
         })
       console.log(this.finalblocknameTmp);
       console.log(this.finalblocknameTmp.length);
       if(this.finalblocknameTmp.length==0){
         console.log('insideltab');
         console.log(this.unitlistjson[name]);
         this.unitlistjson[name].forEach((elmt,iidx) => {
           if(elmt.Id == obj3Id){
             console.log('elmt.Id == obj3Id');
             if(this.unitlistjson[name][iidx+2]==undefined){
               console.log('Submit');
               this.SubmitOrSaveAndContinue='Submit';
             }
           }
         });
       } */
      this.exceptionMessage = '';
      console.log(name);
      console.log(this.unitlistjson[name]);
      console.log(this.unitlistjson);
      if (this.unitlistjson[name].length == (index + 2)) {
        console.log('this.unitlistjson[name].length == (index+2)');
        console.log(this.unitlistjson[name][index + 1]);
        console.log(index + 1);
        this.unitlistjson[name][index + 1].displayText = 'Submit';
        console.log(this.unitlistjson[name]);
      }
      let date = new Date();
      var getDate = date.getDate();
      var getMonth = date.getMonth() + 1;
      var getFullYear = date.getFullYear();
      var currentdata = getDate + "-" + getMonth + "-" + getFullYear;
      //this.unitsuccessarray=[];
      console.log(date)

      let ipAddress = this.utilsService.createUnit();
      let unitcreateurl = `${ipAddress}oyeliving/api/v1/unit/create`

      // Object.keys(this.unitlistjson).forEach(element => {
      //console.log(this.unitlistjson[element])

      //this.unitlistjson[name].forEach((unit, index) => {
      // let headername = unit.Id.slice(0, -2);
      //console.log(headername);
      //console.log(unit)
      //if (name == headername) {
      //

      this.unitlistjson[name].forEach((unit, index) => {
        console.log(unit);
        // ((index) => {
        //   setTimeout(() => {
        if (unit.Id.toLowerCase() == obj3Id.toLowerCase()) {
          console.log('test', obj3Id);
          console.log(index);
          console.log(this.unitlistjson[name]);
          //console.log(this.unitlistjson[name][index+1]);
          //console.log(this.unitlistjson[name][index+1]['Id']);
          if (this.unitlistjson[name][index + 1] == undefined) {
            console.log('test1');
            console.log(this.blocksArray);
            console.log(name);
            this.blocksArray.forEach((itm, indx) => {
              if (itm.blockname.toLowerCase() == name.toLowerCase()) {
                itm.isUnitsCreatedUnderBlock = true;
                itm.isUnitsCreatedUnderBlock1 = false;
                if (this.blocksArray[indx + 1] != undefined) {
                  console.log(this.blocksArray[indx + 1]['blockname']);
                  this.blocknameforIteration = this.blocksArray[indx + 1]['blockname'];
                  this.nextBlckId = this.blocksArray[indx + 1]['Id'];
                  console.log(this.blocknameforIteration);
                  console.log(this.nextBlckId);
                }
              }
            })
            this.unitlistjson[this.blocknameforIteration][0]['unitTmpid'] = this.unitlistjson[this.blocknameforIteration][0]['Id'];
            //this.nextObjId = this.unitlistjson[this.blocknameforIteration][0]['Id'];
            //console.log(this.nextObjId);
            console.log(this.unitlistjson[this.blocknameforIteration]);
            this.isNextIetrationEnabled = true;
          }
          else {
            this.nextObjId = this.unitlistjson[name][index + 1]['Id'];
          }
          console.log(this.nextObjId);
          this.unitsuccessarray.push(unit);

          this.unitdetailscreatejson = {
            "ASAssnID": this.assid,
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
                "BLBlockID": unit.blockid,
                "Owner1":
                  {

                    "UOFName": (unit.ownerfirstname == undefined ? '' : unit.ownerfirstname),
                    "UOLName": (unit.ownerlastname == undefined ? '' : unit.ownerlastname),
                    "UOMobile": (unit.ownermobilenumber == undefined ? '' : unit.ownermobilenumber),
                    "UOISDCode": "+91",
                    "UOEmail": (unit.owneremaiid == undefined ? '' : unit.owneremaiid),
                    "UOCDAmnt": "2000"

                  },
                "Tenant1": {
                  "UTFName": (unit.tenantfirstname == undefined ? '' : unit.tenantfirstname),
                  "UTLName": (unit.tenantlastname == undefined ? '' : unit.tenantlastname),
                  "UTMobile": (unit.tenantmobilenumber == undefined ? '' : unit.tenantmobilenumber),
                  "UTISDCode": "+91",
                  "UTEmail": (unit.tenantemaiid == undefined ? '' : unit.tenantemaiid),
                },
                "unitbankaccount":
                {
                  "UBName": "SBI",
                  "UBIFSC": "SBIN0014",
                  "UBActNo": "LOP9090909",
                  "UBActType": "Savings",
                  "UBActBal": 12.3,
                  "BLBlockID": unit.blockid
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
          this.http.post(unitcreateurl, this.unitdetailscreatejson, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
            .subscribe((res: any) => {
              console.log(res);
              unit.isUnitCreated = true;
              unit.isUnitNotCreated = false;
              unit.isSingleUnitDataEmpty = true;

            }, error => {
              console.log(error);
              this.exceptionMessage = error['error']['exceptionMessage'];
              console.log(this.exceptionMessage);
            });
        }
        //   }, 2000 * index)
        // })(index)

      });

      //
      //}
      //})
      //})

      // Object.keys(this.unitlistjson).forEach((element, index) => {
      //   console.log(this.unitlistjson[element]);

      // }) 

      setTimeout(() => {
        if (this.isNextIetrationEnabled) {
          this.assignTmpid(this.nextBlckId, this.blocknameforIteration);
        }
        else {
          this.assignUnitTmpid(this.nextObjId, this.blocknameforIteration);
        }
        var message;
        if (this.unitsuccessarray.length == 1) {
          message = 'Unit Created Successfully'
        }
        else if (this.unitsuccessarray.length > 1) {
          message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
        }

        let abc0 = Object.keys(this.unitlistjson);
        if (Object.keys(this.unitlistjson)[abc0.length - 1] == name) {
          console.log(this.unitlistjson[name]);
          this.unitlistjson[name].forEach((elmt, iidx) => {
            if (elmt.Id.toLowerCase() == obj3Id.toLowerCase()) {
              if (this.unitlistjson[name][iidx + 1] == undefined) {
                console.log(this.unitlistjson[name]);
                Swal.fire({
                  title: (this.exceptionMessage == '' ? message : this.exceptionMessage),
                  text: "",
                  type: (this.exceptionMessage == '' ? "success" : "error"),
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
                      this.viewAssnService.dashboardredirect.next(result)
                      this.viewAssnService.enrlAsnEnbled = false;
                      this.viewAssnService.vewAsnEnbled = true;
                      this.viewAssnService.joinAsnEbld = false;
                      /*}
                      else{
                        this.demo2TabIndex = this.demo2TabIndex + 1;
                      }*/

                    }
                  })
              }
            }
          });
        }
        else {
          this.demo2TabIndex = this.demo2TabIndex + 1;
        }


        //}, Number(this.unitlistjson[name].length) * 2000)
      }, 2000)
      //document.getElementById("mat-tab-label-0-4").style.backgroundColor = "lightblue";

    }
  }
  validateUnitDetailsField(name, Id, flatno) {
    this.numberofunitexistence = 0;
    //this.isunitdetailsempty = true;
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
          console.log('this.isunitdetailsempty-',this.isunitdetailsempty);
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
              console.log('inside-"Sold Tenant Occupied Unit1"');
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
        /**/
        if (name.toLowerCase() == headername.toLowerCase()) {
          if(unit.isUnitCreated == false){
            console.log(unit);
            console.log(flatno);
            console.log(this.unitlistjson[element]);
            console.log('this.isunitdetailsempty-',this.isunitdetailsempty);
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
                  //this.isunitdetailsempty = true;
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
                console.log('inside-"Sold Tenant Occupied Unit2"');
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
                  //this.isunitdetailsempty = true;
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
                  //this.isunitdetailsempty = true;
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
                  //this.isunitdetailsempty = true;
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
                  //this.isunitdetailsempty = true;
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
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  validateAllBlockformFields(formGroup: FormGroup) {
    Object.keys(this.blockform.controls).forEach(field => {
      const control = this.blockform.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  validateAllPanFormFields(formGroup: FormGroup) {
    Object.keys(this.gstpanform.controls).forEach(field => {
      const control = this.gstpanform.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  validateAllBlocksDetailsFormFields(formGroup: FormGroup) {
    Object.keys(this.blocksdetailsform.controls).forEach(field => {
      const control = this.blocksdetailsform.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  // submitamenity(event){
  //   this.demo1TabIndex = this.demo1TabIndex + 1;

  // }
  submitblockandunitdetalis() {
    if (this.blockform.valid) {
      this.demo1TabIndex = this.demo1TabIndex + 1;
    }
    else {
      this.validateAllBlockformFields(this.blockform);
    }
  }

  submitassociationdetails(event) {
    if (this.form.valid) {
      /*if(this.propertytype == 'Residential and Commercial'){
        this.residentialorcommercialtype='';
      }
      else{
        this.residentialorcommercialtype=this.propertytype;
      } */
      this.residentialorcommercialtype = this.propertytype;
      console.log(this.residentialorcommercialtype);
      this.demo1TabIndex = this.demo1TabIndex + 1;
      //document.getElementById("mat-tab-label-0-0").style.backgroundColor = "lightblue";

    }
    else {
      this.validateAllFormFields(this.form);
    }
  }
  pancardnameoriginal: boolean;
  pansucessname;
  panresponce;
  //   getpancardname(){
  //     var panjson = {
  //       "id_number": this.pannumber,
  //       "type": "pan"
  //     }
  //     this.http.post("http://devapi.scuarex.com/oye247/api/v1/IDNumberVerification ", panjson, { headers: { 'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
  //       console.log(res)
  //       this.panresponce = res;
  //       if (this.panresponce.success == true) {
  //         this.matching = false;
  //         // res.data.name
  // if(this.panresponce.data.name!=''&&this.pannumber.length==10){
  //   this.pancardnameoriginal = true;
  //   this.pansucessname =this.panresponce.data.name;
  // }
  //       }else{
  //         this.matching = true;
  //         this.pancardnameoriginal = false;

  //       }
  //     }, error => {
  //       console.log(error);
  //     }
  //     );
  //   }
  submitpandetails(event) {
    if (this.gstpanform.valid) {
      this.demo1TabIndex = this.demo1TabIndex + 1;
      //document.getElementById("mat-tab-label-0-1").style.backgroundColor = "lightblue";
    }
    else {
      this.validateAllPanFormFields(this.gstpanform)
    }
  }


  // i:number;

  // blocksfields(event,i,fieldname){
  //   this.detailsdata[i][fieldname]["clicked"]=true;
  // }

  // unitsfields(event,i,fieldname){
  //   this.unitdetails[i][fieldname]["clicked"]=true;
  //     }
  // blockdetailsfinalresponce=[];
  blockdetailsidvise(element) {
    let ipAddress = this.utilsService.createBlock();
    let blockcreateurl = `${ipAddress}oyeliving/api/v1/Block/create`

    this.jsondata = {
      "ASAssnID": this.assid,
      "ACAccntID": this.globalService.getacAccntID(),
      "blocks": [
        {
          "BLBlkName": element.blockname,
          "BLBlkType": element.blocktype,
          "BLNofUnit": element.units,
          "BLMgrName": (element['facility manager'] == undefined ? '': element['facility manager']),
          "BLMgrMobile": (element['mobile number'] == undefined ? '': element['mobile number']),
          "BLMgrEmail": (element['email id'] == undefined ? '': element['email id']),
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


    this.http.post(blockcreateurl, this.jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
      console.log(res)

      this.unitlistjson[element.blockname].forEach(obj => {
        obj.blockid = res.data.blockID
        console.log(obj.blockid)
      })

    }, error => {
      console.log(error);
    });

  }
  movetonexttab(event) {
    this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  unitdetails = {}
  blockssuccessarray;
  commonblockarray = [];
  uniqueBlockArr = [];
  duplicateBlockArr = [];
  commonblockarray1 = [];
  createblocksdetails(event) {
    this.notValidBlockArr = [];
    this.uniqueBlockArr = [];
    this.duplicateBlockArr = [];
    this.duplicateBlockCount=0;
    this.invalidBlockCount=0;
    this.toggleEmptyBlockarray = false;
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
    if (this.duplicateBlocknameExist) {
      $(".se-pre-con").show();
      //this.blocksuccesscount = 0;
      console.log('duplicateBlocknameExist');
      console.log(this.blocksArray);
      this.toggleEmptyBlockarray = true;
      this.commonblockarray1 = [];
      this.commonblockarray = [];
      this.blockssuccessarray = [];
      this.blocksArray.forEach(item => {
        if (item.disableField == false) {
          this.commonblockarray.push(item);
        }
      })
      this.commonblockarray.forEach((element) => {
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
          this.isblockdetailsempty = true;
        }
      })
      console.log(this.commonblockarray);
      this.blockssuccessarray = this.blocksArray.length;// this.commonblockarray.length;
      this.blockdetailsfinalcreation();
    }
    else {
      let blockArrWithoutBlocknameUndefined=[];
      this.blockssuccessarray = [];
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
            console.log(item);
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
      /* this.blocksArray.forEach(item => {
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
       }) */
      this.notValidBlockArr = this.uniqueBlockArr.filter((element) => {
        return (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined)));
      })
      if (this.notValidBlockArr.length > 0) {
        this.notValidBlockArr.forEach(item => {
          this.duplicateBlockArr.push(item);
          this.invalidBlockCount += 1;
          console.log(this.invalidBlockCount);
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
        console.log('duplicateBlockArr.length > 0');
        $(".se-pre-con").fadeOut("slow");
        document.getElementById('upload_excel').style.display = 'none'
        document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
        document.getElementById('showmanual').style.display = 'block';
        let displaymessage='';
        if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
          displaymessage = `${this.invalidBlockCount} Invalid
                            ${this.duplicateBlockCount} Duplicate`;
                            this.popuptype = "error";
        }
        else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
          displaymessage = `${this.invalidBlockCount} Invalid`;
          this.popuptype = "error";

        }
        else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
          displaymessage = `${this.duplicateBlockCount} Duplicate`;
          this.popuptype = "error";

        }
        Swal.fire({
          title: displaymessage,
          text: "",
          type: this.popuptype,
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK",
          allowOutsideClick:false
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

  blockidtmp = {};
  blocknameforIteration = '';
  sameBlocknameExist;
  duplicateBlocknameExist;
  blockdetailsfinalcreation() {
    $(".se-pre-con").fadeOut("slow");
    this.blockprogressvaluemax = this.blocksArray.length;
    this.duplicateBlocknameExist = false;
    console.log(this.isblockdetailsempty);
    if (!this.isblockdetailsempty) {
      this.progressbarmodalRef = this.modalService.show(this.blockprogressbartemplate,Object.assign({}, { class: 'modal1' }));
      this.isblockdetailsempty = true;
      this.sameBlocknameExist = false;
      this.commonblockarray1.push(this.commonblockarray);
      console.log(this.commonblockarray1);
      this.commonblockarray.forEach((element, index) => {
        ((index) => {
          setTimeout(() => {

            let ipAddress = this.utilsService.createBlock();
            let blockcreateurl = `${ipAddress}oyeliving/api/v1/Block/create`

            this.jsondata = {
              "ASAssnID": this.assid,
              "ACAccntID": this.globalService.getacAccntID(),
              "blocks": [
                {
                  "ASAssnID": this.assid,
                  "BLBlkName": element.blockname,
                  "BLBlkType": element.blocktype,
                  "BLNofUnit": element.units,
                  "BLMgrName": (element['facility manager'] == undefined ? '': element['facility manager']),
                  "BLMgrMobile": (element['mobile number'] == undefined ? '': element['mobile number']),
                  "BLMgrISDCode"  : "+91",
                  "BLMgrEmail":(element['email id'] == undefined ? '': element['email id']),
                  "ASMtType": element['Maintenance Type'],
                  "ASMtDimBs": element['Maintenance value'],
                  "ASMtFRate": element['Flat Rate value'],
                  "ASUniMsmt": 'sqft',
                  "ASBGnDate": formatDate(element['Invoice Generation Date'], 'yyyy/MM/dd', 'en'),
                  "ASIcRFreq": element['Invoice Creation Frequency'],
                  "ASLPCType": element['Late Payment Charge Type'],
                  "ASLPChrg": element['Late Payment Charge'],
                  "ASLPSDate": formatDate(element['Starts From'], 'yyyy/MM/dd', 'en'),
                  "ASDPyDate": formatDate(element['Due Date'], 'yyyy/MM/dd', 'en'),
                  "BankDetails": ""
                }
              ]

            }
            console.log(this.jsondata);
            this.http.post(blockcreateurl, this.jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
              .subscribe((res: any) => {
                console.log(res);
                if (res.data.blockID) {
                  this.blocksuccesscount += 1;
                  this.blockprogressvalue = this.blocksuccesscount;
                  console.log(this.unitlistjson);
                  console.log(res.data.blockID);
                  this.blockidtmp[element.blockname] = res.data.blockID;
                  console.log(this.blockidtmp);
                  element.isNotBlockCreated = false;
                  element.isBlockCreated = true;
                  let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
                  this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
                  this.finalblocknameTmp.push({ 'name': this.jsondata.blocks[0].BLBlkName, 'displaytext': 'Save And Continue' });
                  for (var i = 0; i < blockArraylength; i++) {
                    let data = JSON.parse(JSON.stringify(this.unitsrowjson))

                    data.Id = this.jsondata.blocks[0].BLBlkName + i + 1;
                    data.unitTmpid = '';
                    data.blockid = res.data.blockID;
                    data.isUnitCreated = false;
                    data.isUnitNotCreated = true;
                    console.log(data.Id)

                    if (!this.unitlistjson[this.jsondata.blocks[0].BLBlkName]) {
                      this.unitlistjson[this.jsondata.blocks[0].BLBlkName] = []
                    }
                    this.unitlistjson[this.jsondata.blocks[0].BLBlkName].push(data)
                    console.log(this.unitlistjson);
                    console.log(this.blocksArray);
                  }
                }
                else if (res['data']['errorResponse']['message']) {
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
                this.progressbarmodalRef.hide();
                Swal.fire({
                  title: "Error",
                  text: error['error']['exceptionMessage'],
                  type: "error",
                  confirmButtonColor: "#f69321",
                  allowOutsideClick:false
                });
              });
          }, 3000 * index)
        })(index)
      })
      setTimeout(() => {
        this.progressbarmodalRef.hide();
        document.getElementById('upload_excel').style.display = 'none'
        document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
        document.getElementById('showmanual').style.display = 'block';
        this.commonblockarray.forEach(element => {
          element.hasNoDuplicateBlockname = true;
          element.disableField = true;
        })
        if (!this.sameBlocknameExist) {
          let displaymessage;
          let okaycontinuebutton;
          if (this.blockssuccessarray == 1) {
            displaymessage = 'Block Created Successfully';
            if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid
                                ${this.duplicateBlockCount} Duplicate`;
              this.okaycontinuebutton = "OK";
              this.popuptype = "error";

            }
            else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid`;
              this.okaycontinuebutton = "OK";
              this.popuptype = "error";


            }
            else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
              displaymessage = `${this.duplicateBlockCount} Duplicate`;
              this.okaycontinuebutton = "OK";
              this.popuptype = "error";


            }
          }
          else if (this.blockssuccessarray > 1) {
             if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid
                                ${this.duplicateBlockCount} Duplicate`;
                                this.okaycontinuebutton = "OK";
              this.popuptype = "error";


            }
            else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.invalidBlockCount} Invalid`;
              this.okaycontinuebutton = "OK";
              this.popuptype = "error";
              
            }
            else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
              displaymessage = `${this.duplicateBlockCount} Duplicate`;
              this.okaycontinuebutton = "OK";
              this.popuptype = "error";

            }
            else {
              displaymessage = this.blockssuccessarray + '-' + 'Blocks Created Successfully'
              this.exitblocksbuttonshow = true;
              this.okaycontinuebutton = "CONTINUE";
              this.popuptype = "success";

            }
          }
          Swal.fire({
            title: displaymessage,
            type: this.popuptype,
            showCancelButton: this.exitblocksbuttonshow,
            confirmButtonColor: "#f69321",
            confirmButtonText: this.okaycontinuebutton,
            text:"OR",
            cancelButtonText: 'EXIT',
            allowOutsideClick:false,
            customClass: {
              container: 'container-class',
              popup: 'popup-class',
              header: 'header-class',
              title: 'title-class',
              closeButton: 'close-button-class',
              icon: 'icon-class',
              image: 'image-class',
              content: 'content-class',
              input: 'input-class',
              actions: 'actions-class',
              confirmButton: 'confirm-button-class',
              cancelButton: 'cancel-button-class',
              footer: 'footer-class'
            }
          }).then(
            (result) => {
              if (result.value) {
                if (this.duplicateBlockArr.length > 0) {
                  this.duplicateBlocknameExist = true;
                  this.blocksArray = [];
                  this.duplicateBlockArr.forEach(itm1 => {
                    console.log(itm1);
                    itm1.markedasduplicate = 0;
                    this.blocksArray.push(itm1);
                  })
                  this.uniqueBlockArr.forEach(itm => {
                    itm.hasNoDuplicateBlockname = true;
                    itm.disableField = true;
                    this.blocksArray.push(itm);
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
                else {
                  if (this.toggleEmptyBlockarray) {
                    this.blocksArray = _.sortBy(this.blocksArray, "blockname");
                    console.log(this.finalblockname);
                    console.log(this.blocksArray);
                    this.blocknameforIteration = this.finalblockname[0];
                    this.unitlistjson[this.finalblockname[0]][0]['unitTmpid'] = this.unitlistjson[this.finalblockname[0]][0]['Id'];
                    console.log(this.blocknameforIteration);
                    console.log(this.unitlistjson[this.finalblockname[0]][0]['unitTmpid']);
                    this.demo1TabIndex = this.demo1TabIndex + 1;
                  }
                  else {
                    this.blocksArray = [];
                    for (let i = 0; i <= this.commonblockarray1.length - 1; i++) {
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
                    this.demo1TabIndex = this.demo1TabIndex + 1;
                  }
                }
              }
              else{
                this.router.navigate(['home']);
              }
            })
        } 
      },this.commonblockarray.length * 3500) 
    } 
  }
  createblocksdetails1(blockname, blocktype, units, fecilitymanagername, managermobileno, manageremailid, objId, index1,FlatRatevalue,Maintenancevalue,MaintenanceType,UnitOfMeasurement,InvoiceCreationFrequency,InvoiceGenerationDate,DueDate,LatePaymentChargeType,LatePaymentCharge,StartsFrom) {
    console.log(blockname, blocktype, units, fecilitymanagername, managermobileno, manageremailid, objId, index1,FlatRatevalue,Maintenancevalue,MaintenanceType,UnitOfMeasurement,InvoiceCreationFrequency,InvoiceGenerationDate,DueDate,LatePaymentChargeType,LatePaymentCharge,StartsFrom);
    console.log(this.blocksArray.length);
    let ipAddress = this.utilsService.createBlock();
    let blockcreateurl = `${ipAddress}oyeliving/api/v1/Block/create`

    this.jsondata = {
      "ASAssnID": this.assid,
      "ACAccntID": this.globalService.getacAccntID(),
      "blocks": [
        {
          "BLBlkName": blockname,
          "BLBlkType": blocktype,
          "BLNofUnit": units,
          "BLMgrName": (fecilitymanagername == undefined ? '': fecilitymanagername), 
          "BLMgrMobile": (managermobileno == undefined ? '': managermobileno), 
          "BLMgrEmail": (manageremailid == undefined ? '': manageremailid),
          "ASMtType": MaintenanceType,
          "ASMtDimBs": Maintenancevalue,
          "ASMtFRate": FlatRatevalue,
          "ASUniMsmt": 'sqft',//UnitOfMeasurement,
          "ASBGnDate": formatDate(InvoiceGenerationDate, 'yyyy/MM/dd', 'en'),
          "ASIcRFreq": InvoiceCreationFrequency,
          "ASLPCType": LatePaymentChargeType,
          "ASLPChrg": LatePaymentCharge,
          "ASLPSDate": formatDate(StartsFrom, 'yyyy/MM/dd', 'en'),
          "ASDPyDate": formatDate(DueDate, 'yyyy/MM/dd', 'en'),
          "BLMgrISDCode"  : "+91"
        }
      ]

    }
    console.log(this.jsondata);
    this.http.post(blockcreateurl, this.jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
      .subscribe((res: any) => {
        console.log(res);
        if (res.data.blockID) {
          console.log(this.unitlistjson);
          console.log(res.data.blockID);
          this.blockidtmp[blockname] = res.data.blockID;
          let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit));
          this.finalblockname.push(blockname);
          for (let i = 0; i < blockArraylength; i++) {
            let data = JSON.parse(JSON.stringify(this.unitsrowjson))

            data.Id = this.jsondata.blocks[0].BLBlkName + i + 1;
            data.unitTmpid = '';
            data.blockid = res.data.blockID;
            data.isUnitCreated = false;
            data.isUnitNotCreated = true;
            console.log(data.Id)

            if (!this.unitlistjson[this.jsondata.blocks[0].BLBlkName]) {
              this.unitlistjson[this.jsondata.blocks[0].BLBlkName] = []
            }
            this.unitlistjson[this.jsondata.blocks[0].BLBlkName].push(data)
            console.log(this.unitlistjson);
            /**/

            /**/
          }
          this.blocksArray.forEach(elemnt => {
            if (elemnt.Id == objId) {
              if (this.blocksArray.length - 1 == index1) {
                console.log('inside last tab');
                console.log(this.finalblockname);
                this.unitlistjson[this.finalblockname[0]][0]['unitTmpid'] = this.unitlistjson[this.finalblockname[0]][0]['Id'];
                console.log(this.unitlistjson[this.finalblockname[0]][0]['unitTmpid']);
                console.log(this.unitlistjson[this.finalblockname[0]]);
                this.blocksArray[0].blockTmpid = this.blocksArray[0].Id;
                console.log(this.blocksArray);
                this.blocksArray[index1].blockTmpid = '';
                elemnt.isBlockCreated = true;
                elemnt.isNotBlockCreated = false;
                elemnt.isblockdetailsempty1 = true;
                console.log(this.blocksArray[0]['Id'], this.blocksArray[0]['blockname']);
                this.assignTmpid(this.blocksArray[0]['Id'], this.blocksArray[0]['blockname']);
                this.demo1TabIndex = this.demo1TabIndex + 1;
              }
              else {
                console.log('test', objId);
                this.blocksArray[index1 + 1].blockTmpid = objId + 1;
                elemnt.blockTmpid = '';
                elemnt.isBlockCreated = true;
                elemnt.isNotBlockCreated = false;
                elemnt.isblockdetailsempty1 = true;
                console.log(elemnt.blockTmpid);
                console.log(this.blocksArray[index1 + 1].blockTmpid);
              }
            }
          })
        }
        else if (res['data']['errorResponse']['message']) {
          //this.sameBlocknameExist=true;
          //console.log('sameBlocknameExist');
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
      })
  }
  resetManualBlockCreationFields(ev, objId) {
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
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)
        if (result.value) {
          this.blocksArray.forEach(elemnt => {
            if (elemnt.Id == objId) {
              console.log('elemnt.Id==objId');
              elemnt.blockname = null;
              // elemnt.blocktype='';
              elemnt.units = null;
              elemnt['facility manager']='';
              elemnt['mobile number']='';
              elemnt['email id']='';
              elemnt['Flat Rate value']=null;
              elemnt['Maintenance value']=null;
              elemnt['Maintenance Type']=null;
              elemnt['Invoice Creation Frequency']=null;
              elemnt['Invoice Generation Date']= null;
              elemnt['Due Date']= null;
              elemnt['Late Payment Charge Type']=null;
              elemnt['Late Payment Charge']=null;
              elemnt['Starts From']= null;
              elemnt['isblockdetailsempty1'] =true;
              
            }
          })
        }
      })
  }
  manualunitdetailsclick(ev) {
    document.getElementById('unitmanualbulk').style.display = 'none'
    document.getElementById('unitshowmanual').style.display = 'block';
  }
  uploadblocks() {
    document.getElementById("file_upload_id").click();
  }
  assignTmpid(objId, blockname) {
    console.log(objId);
    this.blocknameforIteration = blockname;
    console.log(this.blocknameforIteration);
    this.blocksArray.forEach(elemnt => {
      if (elemnt.Id == objId) {
        console.log('test', objId);
        elemnt.blockTmpid = objId;
        console.log(elemnt.blockTmpid);
      }
      else {
        elemnt.blockTmpid = '';
      }
    })
    console.log(this.unitlistjson[blockname][0]['Id'], blockname);
    this.assignUnitTmpid(this.unitlistjson[blockname][0]['Id'], blockname);
  }
  assignUnitTmpid(obj2Id, blockname) {
    console.log(obj2Id);
    this.unitlistjson[blockname].forEach(elemnt => {
      if (elemnt.Id == obj2Id) {
        console.log('test', obj2Id);
        elemnt.unitTmpid = obj2Id;
        console.log(elemnt.unitTmpid);
      }
      else {
        elemnt.unitTmpid = '';
      }
    })
  }
  assignBlkarrTmpid(blkarrId) {
    console.log(blkarrId);
    this.blocksArray.forEach(elemnt => {
      if (elemnt.Id == blkarrId) {
        console.log('test', blkarrId);
        elemnt.blockTmpid = blkarrId;
        console.log(elemnt.blockTmpid);
      }
      else {
        elemnt.blockTmpid = '';
      }
    })
  }
  excelBlockList = [];
  ShowExcelUploadDiscription = true;
  ShowExcelDataList = false;

  blockfile: File
  blockarrayBuffer: any;
  filelist1: any;
  /* onFileChange(ev,blockprogressbartemplate: TemplateRef<any>) {
    this.blockprogressbartemplate = blockprogressbartemplate;
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
      console.log(jsonData['Sheet1']);
      this.excelBlockList = jsonData['Sheet1'];
      console.log(this.excelBlockList);
      console.log(this.excelBlockList.length);
      this.filelist1 = [];
      let blockslength = Number(this.noofblocks)
      if (this.excelBlockList.length <= blockslength) {
        if (this.excelBlockList.length == 0) {
          $(".se-pre-con").fadeOut("slow");
          Swal.fire({
            title: 'Please fill all the fields',
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
            allowOutsideClick:false
          })
        }
        else {
          this.excelBlockList.forEach((list, i) => {
            console.log(list);
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
            list.disableField = false;
            list.markedasduplicate = 1;
            list.isnotvalidunits = false,
              list.blocktype = this.residentialorcommercialtype;
            list.isblockdetailsempty1 = true;
            list.isNotBlockCreated = true;
            list.isNotBlockCreated_NowValid = false;
            list.isBlockCreated = false;
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
            if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="" || element['Starts From']==undefined || element['Starts From']=="" || ((element['facility manager'] != undefined && element['mobile number'] == '') && (element['facility manager'] != '' && element['mobile number'] == '')) || ((element['facility manager'] == undefined && element['mobile number'] != undefined) && (element['facility manager'] == undefined && element['mobile number'] != '')) || ((element['facility manager'] != undefined && element['mobile number'] == undefined) && (element['facility manager'] != '' && element['mobile number'] == undefined))) {
              this.isblockdetailsempty = true;
            }
          })
          console.log(this.excelBlockList.length);
          setTimeout(() => {
            this.increasingBlockArrLength = this.blocksArray.length + 1;
            this.createblocksdetails('');
          },this.excelBlockList.length * 1500)
        }
      }
      else {
        $(".se-pre-con").fadeOut("slow");
        Swal.fire({
          title: "Please Check uploaded no of blocks should not more than given no of blocks",
          text: "",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK",
          allowOutsideClick:false
        })
        document.getElementById('upload_excel').style.display = 'block';
      }
    }
    reader.readAsBinaryString(file);
  } */ 
   onFileChange(ev,blockprogressbartemplate: TemplateRef<any>) {
    this.blockprogressbartemplate = blockprogressbartemplate;
    console.log($(".se-pre-con"))
    $(".se-pre-con")[0].innerHTML = `<span style="position: absolute;top: 67%;left: 42%;font-size: 22px;color: red;">Validating block records</span><br>
    <span style="position: absolute;top: 74%;left: 34%;font-size: 22px;color: red;">please wait don't navigate back or reload page</span>`;

    $(".se-pre-con").show();
   this.isblockdetailsempty = false;
    this.file = ev.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary",cellDates:true,dateNF: 'dd/mm/yyyy'});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.excelBlockList = XLSX.utils.sheet_to_json(worksheet, { raw: true});
      console.log(this.excelBlockList);
      console.log(this.excelBlockList.length);
      this.filelist1 = [];
      let blockslength = Number(this.noofblocks)
      if (this.excelBlockList.length <= blockslength) {
        if (this.excelBlockList.length == 0) {
          $(".se-pre-con").fadeOut("slow");
          Swal.fire({
            title: 'Please fill all the fields',
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
            allowOutsideClick:false
          })
            console.log(this.blocksArray);

        }
        else {
          this.blocksArray = [];
          this.excelBlockList.forEach((list, i) => {
            console.log(list);
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
            list.disableField = false;
            list.markedasduplicate = 1;
            list.isnotvalidunits = false,
              list.blocktype = this.residentialorcommercialtype;
            list.isblockdetailsempty1 = true;
            list.isNotBlockCreated = true;
            list.isNotBlockCreated_NowValid = false;
            list.isBlockCreated = false;
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
          console.log(this.excelBlockList.length);
          setTimeout(() => {
            this.increasingBlockArrLength = this.blocksArray.length + 1;
            this.createblocksdetails('');
          },this.excelBlockList.length * 1500)
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
        document.getElementById('upload_excel').style.display = 'block';
      }

    } 
  } 
  uploadunits() {
    document.getElementById("file_unitupload_id").click();
  }



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
            unit['manualUnitResetDisabled'] = false;
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
              unit['manualUnitResetDisabled'] = true;
            }
            else{
              unit['InvalidUnitDimension'] = false;
              unit['manualUnitResetDisabled'] = false;
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
              unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
            unit['manualUnitResetDisabled'] = false;
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
          console.log(InvoiceGenerationDate.target.value);
          element['Invoice Generation Date'] = InvoiceGenerationDate.target.value;
          if (element['Invoice Generation Date'] == "") {
            //element['isNotvalidInvoiceGenerationDate'] = true;
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
            element['isNotvalidInvoiceGenerationDate'] = false;
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
  getDueDate(Id,DueDate){
     console.log(DueDate);
     this.canDoBlockLogicalOrder=true;
     this.isblockdetailsempty = false;
     this.blocksArray.forEach(element => {
       if (element.Id == Id) {
         console.log(DueDate.target.value);
         element['Due Date'] = DueDate.target.value;
         if (element['Due Date'] == "") {
           //element['isNotvalidDueDate'] = true;
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
           element['isNotvalidDueDate'] = false;
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
         console.log(StartsFrom.target.value);
         element['Starts From'] = StartsFrom.target.value;
         if (element['Starts From'] == "") {
           //element['isNotvalidStartdate'] = true;
           this.blockdetailInvalid = true;
           if (element['facility manager'] != "") {
             //this.facilitymanagervalid_but_mobilenumberempty = true;
             //element.facilitymanagervalid_but_mobilenumberempty = true;
             //element.isblockdetailsempty1 = true;
             this.isblockdetailsempty = true;
           }
           else{
             //this.mobilenumbervalid_but_facilitymanagerempty = false;
             //element.mobilenumbervalid_but_facilitymanagerempty = false;
           }
         }
         else {
           element['isNotvalidStartdate'] = false;
           if (element['facility manager'] != "") {
             //this.facilitymanagervalid_but_mobilenumberempty = false;
             //element.facilitymanagervalid_but_mobilenumberempty = false;
           }
 
         }
         if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element['Flat Rate value']==undefined || element['Flat Rate value']=="" || element['Maintenance value']==undefined || element['Maintenance value']=="" || element['Maintenance Type']==undefined || element['Maintenance Type']=="" || element['Unit Of Measurement']==undefined || element['Unit Of Measurement']=="" || element['Invoice Creation Frequency']==undefined || element['Invoice Creation Frequency']=="" || element['Invoice Generation Date']==undefined || element['Invoice Generation Date']=="" || element['Due Date']==undefined || element['Due Date']=="" || element['Late Payment Charge Type']==undefined || element['Late Payment Charge Type']=="" || element['Late Payment Charge']==undefined || element['Late Payment Charge']=="") {
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
       else if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element['Flat Rate value']!=undefined && element['Flat Rate value']!="" && element['Maintenance value']!=undefined && element['Maintenance value']!="" && element['Maintenance Type']!=undefined && element['Maintenance Type']!="" && element['Unit Of Measurement']!=undefined && element['Unit Of Measurement']!="" && element['Invoice Creation Frequency']!=undefined && element['Invoice Creation Frequency']!="" && element['Invoice Generation Date']!=undefined && element['Invoice Generation Date']!="" && element['Due Date']!=undefined && element['Due Date']!="" && element['Late Payment Charge Type']!=undefined && element['Late Payment Charge Type']!="" && element['Late Payment Charge']!=undefined && element['Late Payment Charge']!="" && ((element['facility manager'] != undefined && element['mobile number'] != undefined) && (element['facility manager'] != '' && element['mobile number'] != '')) || (element['facility manager'] == '' && element['mobile number'] == '') || (element['facility manager'] == undefined && element['mobile number'] == undefined)) {
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
                   element.isblockdetailsempty1=false;
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
  isValidUnitRecord: boolean;
  isExcelDataExceed: boolean;
  iindex: any;
  excelunitsuploaddata(exceldata, UpdateBlockUnitCountTemplate) {
    this.duplicateUnitCount=0;
    this.invalidUnitCount=0;
    this.unitlistuniquejsonagainfiltered = [];
    this.isunitdetailsempty = false;
    this.unitrecordDuplicateUnitnameModified = false;
    this.duplicateUnitrecordexist = false;
    console.log(exceldata.length);
    exceldata.forEach(item => {
      if (item.blockname.toLowerCase() != this.ValidBlockName['name'].toLowerCase()) {
        console.log(item.blockname);
        this.InvalidBlocknamePresent = true;
      }
    })
    if (exceldata.length == 0) {
      $(".se-pre-con").fadeOut("slow");
      Swal.fire({
        title: 'Please fill all the fields',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
        allowOutsideClick:false
      })
    }
    else if(this.InvalidBlocknamePresent){
      $(".se-pre-con").fadeOut("slow");
      Swal.fire({
        title: 'Please Check Blockname',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
        allowOutsideClick:false
      }).then(
        (result) => {
          if (result.value) {
            this.InvalidBlocknamePresent = false;
          }
      })
    }
    else {
      console.log(this.finalblockname);
      console.log(exceldata);
      console.log(this.blocksArray);
      console.log(this.unitlistjson);
      let _blkname = '';
      this.isValidUnitRecord = false;
      this.isExcelDataExceed = false;
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
      this.finalblockname.forEach(blkname => {

        exceldata.forEach((unitonce, i) => {

          console.log(exceldata.Id)
          // this.unitdetails[i] ={}
          // Object.keys(unitonce).forEach(datails=>{
          //   console.log(datails)
          //   this.unitdetails[i][datails] ={required:true};
          // })
          if (blkname.toLowerCase() == unitonce.blockname.toLowerCase()) {
            //  this.blockdetailsfinalresponce.forEach(obj=>{
            //    unitonce.blockid = obj

            //  })
            console.log(blkname, unitonce.blockname);
            this.blocksArray.forEach((element, index) => {
              if (element.blockname.toLowerCase() == blkname.toLowerCase()) {
                _blkname = blkname;
                let unitslength = Number(element.units)
                console.log(unitslength)
                if (exceldata.length <= unitslength) {
                  console.log(this.blockidtmp);
                  unitonce.blockid = this.blockidtmp[blkname];
                  unitonce.Id = blkname + i + 1;
                  unitonce.unitTmpid = '';
                  unitonce.isSingleUnitDataEmpty = true;
                  unitonce.hasNoDuplicateUnitname = false;
                  unitonce.disableField = false;
                  unitonce.isnotvalidflatno = false,
                    unitonce.isnotvalidunittype = false,
                    unitonce.isnotvalidownershipstatus = false,
                    unitonce.isnotvalidownerfirstname = false,

                    unitonce.isnotvalidownerlastname = false,

                    unitonce.isnotvalidownermobilenumber = false,

                    unitonce.isnotvalidowneremaiid = false,

                    unitonce.isnotvalidtenantfirstname = false,

                    unitonce.isnotvalidtenantlastname = false,

                    unitonce.isnotvalidtenantmobilenumber = false,
                    unitonce.isnotvalidtenantemaiid = false;
                    unitonce.InvalidUnitDimension = false;
                    unitonce.InvalidUnitRate = false;

                  unitonce.isUnitCreated = false;
                  unitonce.isUnitNotCreated = true;
                  unitonce.isUnitNameModifiedForDuplicateRecord = 'No';
                  if (!this.unitlistjson[blkname]) {
                    this.unitlistjson[blkname] = []
                  }
                  Object.keys(this.unitlistjson).forEach(element => {
                    this.unitlistjson[element].forEach(detalisdata => {

                      if (blkname == element) {
                        if (!detalisdata.blockname) {
                          this.unitlistjson[blkname] = []
                        }
                      }
                    })
                  })
                  this.unitlistjson[blkname].push(unitonce)
                  this.isValidUnitRecord = true;
                  console.log(this.unitlistjson);
                }
                else {
                  $(".se-pre-con").fadeOut("slow");
                  this.isExcelDataExceed = true;
                  console.log('this.isExcelDataExceed=true');
                  Swal.fire({
                    title: "Please Check uploaded no of units" + " " + exceldata.length + " "+ "should not more than given no of units for perticualar Block",
                    text: "",
                    confirmButtonColor: "#f69321",
                    confirmButtonText: "OK",
                    allowOutsideClick:false
                  })
                  document.getElementById('unitupload_excel').style.display = 'block';
                }
              }
            })
          }
        });
      })
      //}
      //this.validateUnitDetailsField(_blkname);
      console.log("unit data what contains", this.unitlistjson);
      console.log(((this.finalblockname.length + this.arraylist1.length + this.blocksArray.length) * 1500));
      console.log(this.finalblockname.length , this.arraylist1.length , this.blocksArray.length);
      console.log(this.finalblockname.length + this.arraylist1.length + this.blocksArray.length);
      setTimeout(() => {
        if (this.isExcelDataExceed) {
          //http://devapi.scuarex.com/oyeliving/api/v1/UpdatAssociationUnitBlockLimit 
          let blockunitcountupdateRequestBody =
          {
            "ASNofBlks": 4,
            "ASNofUnit": 111,
            "ASAssnID": this.assid
          }
          console.log(blockunitcountupdateRequestBody);
          const headers = new HttpHeaders()
            .set('Authorization', 'my-auth-token')
            .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
            .set('Content-Type', 'application/json');
          let IPaddress = this.utilsService.getIPaddress();
          this.http.post(IPaddress + 'oyeliving/api/v1/UpdatAssociationUnitBlockLimit', blockunitcountupdateRequestBody, { headers: headers })
            .subscribe(res => {
              console.log(res);
            },
              err => {
                console.log(err);
              })
          setTimeout(() => {
            this.http.get(IPaddress + 'oyeliving/api/v1/association/getAssociationList/' + this.assid, { headers: headers })
              .subscribe(resp => {
                console.log(resp);
                this.ViewBlockService.getBlockDetails(this.assid)
                  .subscribe(data => {
                    console.log(data);
                    console.log(data['data'].blocksByAssoc)
                  }, err => {
                    console.log(err);
                  })
              },
                err => {
                  console.log(err);
                })
          },2000)
          //
          this.blockunitcountmodalRef = this.modalService.show(UpdateBlockUnitCountTemplate,Object.assign({}, { class: 'modal1' }));
        }
        if (this.isValidUnitRecord) {
          this.gotonexttab1('', _blkname, this.iindex);
        }
      },this.arraylist1.length * 1500)
    }
  }
  file: File
  arrayBuffer: any;
  filelist: any;
  blockunitcountmodalRef: BsModalRef;

  onFileunitdetailschange(ev, UpdateBlockUnitCountTemplate,unitprogressbartemplate: TemplateRef<any>) {
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
    this.file = ev.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.arraylist1 = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = [];
      console.log(this.arraylist1)
      this.excelunitsuploaddata(this.arraylist1, UpdateBlockUnitCountTemplate)
    }
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
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)
        if (result.value) {
          this.blocksArray.forEach(elemnt => {
            if (elemnt.Id == objId) {
              console.log('elemnt.Id==objId');
              console.log(elemnt);
              elemnt.blockname = '';
              elemnt.hasNoDuplicateBlockname=false;
              elemnt.isNotBlockCreated_NowValid=false;
              elemnt['isnotvalidblockname']=true;
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
              elemnt['Invoice Creation Frequency']= '';
              elemnt['Invoice Generation Date']= null;
              elemnt['Due Date']= null;
              elemnt['Late Payment Charge Type']= '';
              elemnt['Late Payment Charge']= '';
              elemnt['Starts From']= null;
              this.isblockdetailsempty = true;

            }
          })
          console.log(this.blocksArray);
        }
      })
  }
  resetStep5bulk(ev, blknamecommon, Id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)
 
        if (result.value) {
 
          Object.keys(this.unitlistjson).forEach(element => {
            this.unitlistjson[element].forEach(unit => {
              if (unit['Id'].toLowerCase() == Id.toLowerCase()) {
                console.log(Id);
                unit.isUnitNameModifiedForDuplicateRecord = 'Yes';
                unit.hasNoDuplicateUnitname = false;
                unit.flatno = "",
                unit['isnotvalidflatno'] = true,
                  unit.blockname = "",
                  unit.owneremaiid = null,
                  unit.ownerfirstname = null,
                  unit.ownermobilenumber = null,
                  unit.ownershipstatus = null,
                  unit.unittype = null,
                  unit.ownerlastname = null,
                  unit.tenantfirstname = null,
                  unit.tenantlastname = null,
                  unit.tenantmobilenumber = null,
                  unit.tenantemaiid = null,
                  unit['unit dimension'] = null;
                  unit['Unit Calculation Type'] = null;
                  unit['unit rate'] = null;
                  this.isunitdetailsempty = false;

              }
            })
          })
          console.log(this.unitlistjson);
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
  // onFileunitdetailschange(ev) {
  //   console.log(ev)
  //   let workBook = null;
  //   let jsonData = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read(data, { type: 'binary' });
  //     jsonData = workBook.SheetNames.reduce((initial, name) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json(sheet);
  //       return initial;
  //     }, {});
  //     //const dataString = JSON.stringify(jsonData);
  //     console.log(jsonData['Sheet1']);
  //     this.excelBlockList = jsonData['Sheet1']
  //     //  var blocknos = this.excelBlockList.length;
  //     // this.isbulkupload = true;

  //     // console.log(this.finalblockname)
  //     this.excelunitsuploaddata(this.excelBlockList)


  //     document.getElementById('unitupload_excel').style.display = 'none'
  //     document.getElementById('unitshowmanual').style.display = 'block';


  //   }
  //   reader.readAsBinaryString(file);
  // }
  cancelmanualblocks(ev) {
    document.getElementById('upload_excel').style.display = 'block';
    document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
    document.getElementById('blockdetailscancelbutton').style.display = 'none';

    document.getElementById('blockdetailsbuttons').style.display = 'none';
    this.blocksArray = []
  }
  submitforblocksbulkupload(ev) {
    document.getElementById('showmanualblockwithhorizantalview').style.display = 'none'
    document.getElementById('showmanual').style.display = 'none'
    document.getElementById('upload_excel').style.display = 'block';
  }
  submitforbulkupload(ev) {
    document.getElementById('unitshowmanual').style.display = 'none'
    document.getElementById('unitsbulkold').style.display = 'none'

    document.getElementById('unitupload_excel').style.display = 'block';
  }
  cancelbulkupload(ev) {
    document.getElementById('upload_excel').style.display = 'none';
    document.getElementById('showmanualblockwithhorizantalview').style.display = 'block';
    //this.blocksArray=[];
  }
  cancelunitsbulkupload(ev) {
    console.log(this.demo2TabIndex)
    if (this.demo2TabIndex == 0) {
      document.getElementById('unitupload_excel').style.display = 'none';
      document.getElementById('unitshowmanual').style.display = 'block';
      document.getElementById('unitsbulkold').style.display = 'none';
      document.getElementById('unitsmanualnew').style.display = 'block';
    } else {
      document.getElementById('unitupload_excel').style.display = 'none';
      document.getElementById('unitshowmanual').style.display = 'block';
      document.getElementById('unitsbulkold').style.display = 'block';
      document.getElementById('unitsmanualnew').style.display = 'none';
    }


  }
  detailsdata = {}

  submitforconformblockdetails(event) {
    this.blocksArray = [];
    for (var i = 0; i < this.associationfinalresult.data.association.asNofBlks; i++) {
      var data = JSON.parse(JSON.stringify(this.rowjson))
      // this.detailsdata[i] ={}
      // Object.keys(data).forEach(datails=>{
      //   this.detailsdata[i][datails] ={required:true};
      // })
      data.Id = i + 1;
      data.blockTmpid = 1;
      data.blocktype = this.residentialorcommercialtype;
      this.blocksArray.push(data);
      console.log(this.blocksArray)

    }
    // this.blockDetailsgenerateform();
    //document.getElementById('manualbulk').style.display ='none'
    //document.getElementById('showmanualblockwithhorizantalview').style.display ='block';
    //document.getElementById('blockdetailsbuttons').style.display ='block';
    //document.getElementById('blockdetailscancelbutton').style.display ='block';



    // this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  submitassociationcreation(event, blocksnum) {
    this.isblockdetailsempty = true;
    let ipAddress = this.utilsService.createAssn();
    let associationurl = `${ipAddress}oyeliving/api/v1/association/create`
    if (this.blockform.valid) {
      var num1 = Number(this.noofblocks)
      var num2 = Number(this.noofunits);
      var totalnoofuits = num1 + num2;
      this.jsondata = {
        "acAccntID": this.globalService.getacAccntID(),
        "association": {
          "ASAddress": this.locality,
          "ASCountry": this.countryname,
          "ASBToggle": "True",
          "ASAVPymnt": "False",
          "ASCity": this.city,
          "ASState": this.state,
          "ASPinCode": this.postalcode,
          "ASAsnLogo": (this.ASAsnLogo == undefined ? '' : this.ASAsnLogo),
          "ASAsnName": this.assname,
          "ASPrpName": this.propertyname,
          "ASPrpType": this.propertytype,
          "ASNofGuard" : 2, // this is to capture no of guards under association
          "ASPDocName" : (this.PANfileName == undefined ? '' : this.PANfileName),
          "ASLogoName" : (this.fileName == undefined ? '' : this.fileName),
          "ASRegrNum": "367",
          "ASMtDimBs": 1.55,
          "ASWebURL": (this.url == undefined ? '' : this.url),
          "ASMgrName": "Ransingh",
          "ASMgrMobile": "9490791523",
          "ASMgrEmail": "sowmya_padmanabhuni@oyespace.com",
          "ASAsnEmail": this.Associationemail,
          "ASPANStat": "True",
          "ASPANNum": this.pannumber,
          "ASNofBlks": num1,
          "ASNofUnit": num2,
          "ASONStat": "True",
          "ASOMStat": "False",
          "ASFaceDet": "True",
          "ASPANDoc": (this.uploadPANCard == undefined ? '' : this.uploadPANCard),
          "ASGSTNo": (this.gstnumber == undefined ? '' : this.gstnumber),
          "BankDetails": [
            {
              "BABName": "AXIS",
              "BAActType": "SAVINGS",
              "BAActNo": "4545555",
              "BAIFSC": "UTCO12385483",
              "BAActBal": 644346
            },
            {
              "BABName": "AXIS",
              "BAActType": "SAVINGS",
              "BAActNo": "3443435",
              "BAIFSC": "398387837",
              "BAActBal": 373464
            }
          ],
          "Amenities": [
            {
              "AMType": '',
              "NoofUnits": '',
              "AMDCreated": "2019-01-21"
            }
          ]
        }
      }

      console.log(this.jsondata)
      console.log(this.url)
      this.http.post(associationurl, this.jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
        console.log(res)
        this.associationfinalresult = res;

        //  Swal.fire({
        //  title:"your association created succeefully please continue to create block details and unit details",
        //  confirmButtonColor: "#f69321",
        // //  type:"Success",
        //  icon: 'success',
        //   confirmButtonText: "OK"
        //  })

         Swal.fire({
          title: "Association Created Successfully Please Continue to Create Blocks and Units.",
          type: "success",
          confirmButtonColor: '#f69321',
          showCancelButton: true,
          confirmButtonText: 'CONTINUE',
          text:"OR",
          cancelButtonText: 'EXIT',
          allowOutsideClick:false,
          customClass: {
            container: 'container-class',
            popup: 'popup-class',
            header: 'header-class',
            title: 'title-class',
            closeButton: 'close-button-class',
            icon: 'icon-class',
            image: 'image-class',
            content: 'content-class',
            input: 'input-class',
            actions: 'actions-class',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
            footer: 'footer-class'
          }
        }).then(
          (result) => {
            console.log(result)
    
            if (result.value) {
              this.assid = res.data.association.asAssnID;
              console.log(this.blocksArray);
        this.blocksArray = [];
        for (var i = 0; i < this.associationfinalresult.data.association.asNofBlks; i++) {
          var data = JSON.parse(JSON.stringify(this.rowjson))
          // this.detailsdata[i] ={}
          // Object.keys(data).forEach(datails=>{
          //   this.detailsdata[i][datails] ={required:true};
          // })
          data.Id = i + 1;
          data.blockTmpid = 1;
          data.uniqueid = new Date().getTime();
          data.blocktype = this.residentialorcommercialtype;
          data.isNotBlockCreated = true;
          data.isBlockCreated = false;
          this.blocksArray.push(data);
          console.log(this.blocksArray);

        }
      this.demo1TabIndex = this.demo1TabIndex + 1;

            }
            else{
              this.router.navigate(['home']);
            }

          })
        //  for (var i = 0; i < res.data.association.asNofBlks; i++) {
        //   var data = JSON.parse(JSON.stringify(this.rowjson))
        //   this.blocksArray.push(data);
        //   console.log(this.blocksArray)

        // }


      }, error => {
        console.log(error);
      }
      );


      //document.getElementById("mat-tab-label-0-2").style.backgroundColor = "lightblue";

    }
    else {
      this.validateAllBlockformFields(this.blockform);
    }

  }
  fileInputfinal;
  fileopen(ev, fileInput2) {
    fileInput2.value = null
    this.fileInputfinal = fileInput2;
  }

  fileInputfinal1;
  fileopen1(ev, fileInput3) {
    fileInput3.value = null
    this.fileInputfinal1 = fileInput3;
  }

  logo: boolean = false;

  resetStep1(ev) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: '#f69321',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          console.log(ev)
          this.form.reset();
          this.thumbnailASAsnLogo = undefined;
          this.ASAsnLogo = "";
          if (this.fileInputfinal) {
            this.fileopen(ev, this.fileInputfinal);
          }
          this.uploadForm.reset();
          this.fileName='No file chosen...';
        }
      })


  }

  resetStep2(ev) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {

          this.gstpanform.reset();
          this.uploadPANCardThumbnail = undefined;
          this.uploadPANCard = "";
          if (this.fileInputfinal1) {
            this.fileopen1(ev, this.fileInputfinal1);
          }
          // this.pancardnameoriginal=false
          this.uploadPanForm.reset();
          this.imgfilename = '';
          this.PANfileName='No file chosen...';
          //this.showImgOnPopUp(ev, undefined, '')
        }
      })


  }
  resetStep3(ev) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          this.blockform.reset();

        }
      })


  }
  resetStep4(ev) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          this.blocksArray.forEach(Object => {
            Object.blockname = "";
            // Object.blocktype="";
            Object.units = "";
            Object['facility manager'] = "";
            Object['mobile number'] = "";
            Object['email id'] = "";

          })
        }
      })

  }
  // resetStep5bulk(ev, blknamecommon) {
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
  //         Object.keys(this.unitlistjson).forEach(element => {
  //           console.log(this.unitlistjson[element])
  //           this.unitlistjson[element].forEach(unit => {
  //             if (blknamecommon == unit.blockname && unit.blockname != undefined) {

  //               unit.flatno = "",
  //                 unit.blockname = "",
  //                 unit.owneremaiid = "",
  //                 unit.ownerfirstname = "",
  //                 unit.ownermobilenumber = "",
  //                 unit.ownershipstatus = "",
  //                 unit.unittype = "",
  //                 unit.ownerlastname = "",
  //                 unit.ownermobilenumber = "",
  //                 unit.owneremaiid = "",
  //                 unit.tenantfirstname = "",
  //                 unit.tenantlastname = "",
  //                 unit.tenantmobilenumber = "",
  //                 unit.tenantemaiid = ""
  //             } else {
  //               let blname = unit.Id.slice(0, -2);
  //               if (blknamecommon == blname) {
  //                 unit.flatno = "",
  //                   unit.blockname = "",
  //                   unit.owneremaiid = "",
  //                   unit.ownerfirstname = "",
  //                   unit.ownermobilenumber = "",
  //                   unit.ownershipstatus = "",
  //                   unit.unittype = "",
  //                   unit.ownerlastname = "",
  //                   unit.ownermobilenumber = "",
  //                   unit.owneremaiid = "",
  //                   unit.tenantfirstname = "",
  //                   unit.tenantlastname = "",
  //                   unit.tenantmobilenumber = "",
  //                   unit.tenantemaiid = ""
  //               }

  //             }

  //           })
  //         })
  //       }
  //     })




  // }
  previouspage(ev) {
    this.demo1TabIndex = this.demo1TabIndex - 1;

  }
  resetStep5(ev, blknamecommon, Id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      allowOutsideClick:false
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {

          Object.keys(this.unitlistjson).forEach(element => {
            this.unitlistjson[element].forEach(unit => {
              if (unit['Id'].toLowerCase() == Id.toLowerCase()) {
                console.log(Id);
                unit.flatno = null,
                  unit.blockname = "",
                  unit.owneremaiid = null,
                  unit.ownerfirstname = null,
                  unit.ownermobilenumber = null,
                  unit.ownershipstatus = null,
                  unit.unittype = null,
                  unit.ownerlastname = null,
                  unit.tenantfirstname = null,
                  unit.tenantlastname = null,
                  unit.tenantmobilenumber = null,
                  unit.tenantemaiid = null,
                  unit['unit dimension'] = null;
                  unit['Unit Calculation Type'] = null;
                  unit['unit rate'] = null;
                  unit.isSingleUnitDataEmpty = true;
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
  demo1TabIndex = 0;
  public demo1BtnClick() {
    const tabCount = 3;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  }
  tabs = [1, 2, 3, 4, 5, 6]
  public demo2TabIndex = 0
  public demo2BtnClick() {
    const tabCount = 3;
    this.demo2TabIndex = (this.demo2TabIndex + 1) % tabCount;
  }
}
