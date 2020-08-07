import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { CommonserviceService } from './../commonservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers } from '@angular/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalServiceService } from '../global-service.service';
import { UtilsService } from '../../app/utils/utils.service';
// import { Observable } from 'rxjs/Observable';
import { ViewAssociationService } from '../../services/view-association.service';
import { ViewBlockService } from '../../services/view-block.service';
import * as _ from 'lodash';

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

  constructor(private http: HttpClient, private cdref: ChangeDetectorRef,
    public viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private utilsService: UtilsService,
    private modalService: BsModalService, private formBuilder: FormBuilder,
    private ViewBlockService: ViewBlockService) {
      this.duplicateBlockCount=0;
      this.invalidBlockCount=0;
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
      gstnumber: [''],
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
      'unitno': [null, Validators.required]

    });

  }
  pandetalis() {
    this.gstpanform = this.formBuilder.group({
      'gst': [null],
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
  managername;
  managermobileno;
  manageremailid;
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
    "duedate": "",
    "invoicedate": "",
    "invoicefrequency": "",
    "latepaymentcharge": "",
    "maintenancevalue": "",
    "manageremailid": "",
    "managermobileno": "",
    "managername": "",
    "measurementtype": "Sqft",
    "paymentcharge": "",
    "ratevalue": "",
    "startdate": "",
    "units": "",

    "isnotvalidblockname": false,
    "isnotvalidblocktype": false,
    "isnotvalidmanageremailid": false,
    "isnotvalidmanagermobileno": false,
    "isnotvalidmanagername": false,
    "isnotvalidunits": false,
    "isUnitsCreatedUnderBlock": false,
    "isUnitsCreatedUnderBlock1": true,
    "isblockdetailsempty1": true,
    "isNotBlockCreated": true,
    "isBlockCreated": false
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
    "isUnitNameModifiedForDuplicateRecord": 'No'
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.uploadForm.get('profile').setValue(file);
    }
  }
  modalRef: BsModalRef;
  ImgForPopUp: any;
  UploadedImage: any;
  showImgOnPopUp(UploadedImagetemplate, thumbnailASAsnLogo, displayText) {
    if (thumbnailASAsnLogo != undefined) {
      this.ImgForPopUp = thumbnailASAsnLogo;
      this.UploadedImage = displayText;
      this.modalRef = this.modalService.show(UploadedImagetemplate, Object.assign({}, { class: 'gray modal-lg' }));
    }

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
  imgfilename;
  onPanFileSelect(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      console.log(file);
      this.imgfilename = file.name;
      this.uploadPanForm.get('panProfile').setValue(file);
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
  // keyPress3(event:any){
  //    const pattern = /^[1-9][0-9]*$/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //   // console.log(inputChar, e.charCode);
  //      if (!pattern.test(inputChar)) {
  //      // invalid character, prevent input
  //          event.preventDefault();
  //     }
  // }
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
    $(".se-pre-con").show();
    this.unitsuccessarray = [];
    if (this.finalblocknameTmp.length == (this.iindex + 2)) {
      console.log('iFinsideLTab');
      this.finalblocknameTmp[this.iindex + 1]['displaytext'] = "Submit";
      console.log(this.finalblocknameTmp);
    }
    this.iindex += 1;
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
            item.owneremaiid == "" || item.owneremaiid == undefined ||
            item.ownerfirstname == "" || item.ownerfirstname == undefined ||
            item.ownerlastname == "" || item.ownerlastname == undefined ||
            item.ownermobilenumber == "" || item.ownermobilenumber == undefined
          ) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined &&
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
            item.ownerlastname == "" || item.ownerlastname == undefined ||
            item.tenantfirstname == "" || item.tenantfirstname == undefined ||
            item.tenantlastname == "" || item.tenantlastname == undefined ||
            item.tenantmobilenumber == "" || item.tenantmobilenumber == undefined ||
            item.tenantemaiid == "" || item.tenantemaiid == undefined) {
            console.log('Sold Tenant Occupied Unit-duplicate')
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.owneremaiid != "" && item.owneremaiid != undefined &&
            item.ownerfirstname != "" && item.ownerfirstname != undefined &&
            item.ownermobilenumber != "" && item.ownermobilenumber != undefined &&
            item.unittype != "" && item.unittype != undefined &&
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
            item.tenantfirstname == "" || item.tenantfirstname == undefined ||
            item.tenantlastname == "" || item.tenantlastname == undefined ||
            item.tenantmobilenumber == "" || item.tenantmobilenumber == undefined ||
            item.tenantemaiid == "" || item.tenantemaiid == undefined) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined &&
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
            item.unittype == "" || item.unittype == undefined) {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          }
          else if (item.flatno != "" && item.flatno != undefined &&
            item.unittype != "" && item.unittype != undefined) {
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
            item.ownershipstatus == "" || item.ownershipstatus == undefined) {
            this.unitlistduplicatejson.push(item);
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
          unitgroup[element].forEach(item => {
            this.unitlistduplicatejson.push(item);
            this.duplicateUnitrecordexist = true;
          })
        }
        else if (unitgroup[element].length == 1) {
          unitgroup[element].forEach(item => {
            item.hasNoDuplicateUnitname = true;
            item.disableField = true;
            this.unitlistuniquejson1.push(item);
          })
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
                "UNOcSDate": "",
                "UNOwnStat": "",
                "UNSldDate": "",
                "UNDimens": "",
                "UNRate": "",
                "UNCalType": "",
                "FLFloorID": 14,
                "BLBlockID": unit.blockid,
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
              console.log(res)
              unit.hasNoDuplicateUnitname = true;
              unit.disableField = true;
              unit.isUnitCreated = true;
              unit.isUnitNotCreated = false;
              this.totalUnitcount += 1;
            }, error => {
              console.log(error);
              this.exceptionMessage1 = error['error']['exceptionMessage'];
              console.log(this.exceptionMessage1);
            });
        }, 2000 * index)
      })(index)

    });

    setTimeout(() => {
      $(".se-pre-con").fadeOut("slow");
      if (this.unitsuccessarray.length == 1) {
        this.message = 'Unit Created Successfully'
      }
      else if (this.unitsuccessarray.length > 1) {
        if (this.unitlistduplicatejson.length > 0) {
          this.message = `${this.unitsuccessarray.length} '-Units Created Successfully
                            ${this.unitlistduplicatejson.length} Duplicate`
        }
        else {
          this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
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
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
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
      let abc0 = Object.keys(this.unitlistjson);
      if (Object.keys(this.unitlistjson)[abc0.length - 1] == name) {
        console.log('insidelasttab');
        if (!this.duplicateUnitrecordexist) {
          console.log('inlasttabNoduplicaterecordexist');
          let mesg = this.totalUnitcount + '-' + 'Units Created Successfully'
          document.getElementById('unitupload_excel').style.display = 'none'
          document.getElementById('unitshowmanual').style.display = 'block';
          document.getElementById('unitsmanualnew').style.display = 'none';
          document.getElementById('unitsbulkold').style.display = 'block';
          Swal.fire({
            title: (this.exceptionMessage1 == '' ? mesg : this.exceptionMessage1),
            text: "",
            type: (this.exceptionMessage1 == '' ? "success" : "error"),
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
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
            this.message = `${this.unitsuccessarray.length} '-Units Created Successfully
                              ${this.unitlistduplicatejson.length} Duplicate`
          }
          else {
            this.message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
          }
          Swal.fire({
            title: this.message,
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
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
          //this.demo2TabIndex = this.demo2TabIndex + 1;
          console.log(this.increasingBlockArrLength);
          console.log(this.blockTabId);
          //console.log(document.querySelectorAll('.mat-tab-label-container')[1].children[0].childNodes[0].childNodes);
          //let arr = Array.from(document.querySelectorAll('.mat-tab-label-container')[1].children[0].childNodes[0].childNodes);
          //console.log(arr);
          //console.log((<HTMLElement> arr[this.blockTabId+1]).innerHTML);
          //(<HTMLElement> arr[this.blockTabId+1]).innerHTML += '&nbsp;<i class="fa fa-check-circle-o" style="color: #41ca41" aria-hidden="true"></i>';
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
        }
      }
      //this.increasingBlockArrLength += 1;
    }, Number(this.unitlistjson[name].length) * 2000)
    //}
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
        confirmButtonText: "OK"
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
                "UNDimens": "",
                "UNRate": "",
                "UNCalType": "",
                "FLFloorID": 14,
                "BLBlockID": unit.blockid,
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
                  confirmButtonText: "OK"
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
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined
              ) {
                this.isunitdetailsempty = false;
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                unit.hasNoDuplicateUnitname = true;
                
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
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                unit.hasNoDuplicateUnitname = true;
              }
            }
            else if (unit.ownershipstatus == "UnSold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                unit.hasNoDuplicateUnitname = true;
              }
            }
            else if (unit.ownershipstatus == "UnSold Vacant Unit" || unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined
              ) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
                unit.hasNoDuplicateUnitname = false;
              }
              else {
                unit.isSingleUnitDataEmpty = false;
                unit.hasNoDuplicateUnitname = true;
              }
            }
            else if (unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
                unit.isSingleUnitDataEmpty = true;
              }
              else {
                unit.isSingleUnitDataEmpty = false;
              }
            }
          }
        }
        /**/
        if (name.toLowerCase() == headername.toLowerCase()) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          if (this.isunitdetailsempty) {
            if (unit.ownershipstatus == "Sold Owner Occupied Unit" || unit.ownershipstatus == "Sold Vacant Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.owneremaiid == "" || unit.owneremaiid == undefined ||
                unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||
                unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined
              ) {
                console.log('test0-Sold Owner Occupied Unit')
                this.isunitdetailsempty = false;
              }
              else {
                console.log('test1-Sold Owner Occupied Unit')
                this.isunitdetailsempty = true;
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
                unit.ownerlastname == "" || unit.ownerlastname == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                  console.log('test0-Sold Tenant Occupied Unit')
                this.isunitdetailsempty = false;
              }
              else {
                console.log('test1-Sold Tenant Occupied Unit')
                this.isunitdetailsempty = true;
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
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Tenant Occupied Unit") {
              if (unit.flatno == "" || unit.flatno == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||

                unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||

                unit.tenantfirstname == "" || unit.tenantfirstname == undefined ||
                unit.tenantlastname == "" || unit.tenantlastname == undefined ||
                unit.tenantmobilenumber == "" || unit.tenantmobilenumber == undefined ||
                unit.tenantemaiid == "" || unit.tenantemaiid == undefined) {
                  console.log('test0-UnSold Tenant Occupied Unit')
                this.isunitdetailsempty = false;
              }
              else {
                console.log('test1-UnSold Tenant Occupied Unit')
                this.isunitdetailsempty = true;
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
                })
              }
            }
            else if (unit.ownershipstatus == "UnSold Vacant Unit" || unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined
              ) {
                console.log('test0-UnSold Vacant Unit')
                this.isunitdetailsempty = false;
              }
              else {
                console.log('test1-UnSold Vacant Unit')
                this.isunitdetailsempty = true;
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
                })
              }
            }
            else if (unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
                unit.unittype == "" || unit.unittype == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined) {
                this.isunitdetailsempty = false;
              }
              else {
                this.isunitdetailsempty = true;
              }
            }
          }
        }
        /**/
      })
    })
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
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          this.isblockdetailsempty = true;
        }
      })
      console.log(this.commonblockarray);
      this.blockssuccessarray = this.commonblockarray.length;
      this.blockdetailsfinalcreation();
    }
    else {
      this.blockssuccessarray = [];
      let group = this.blocksArray.reduce((r, a) => {
        r[a.blockname.toLowerCase()] = [...r[a.blockname.toLowerCase()] || [], a];
        return r;
      }, {});
      console.log("block_group", group);
      Object.keys(group).forEach(element => {
        if (group[element].length > 1) {
          group[element].forEach(item => {
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
        return (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined);
      })
      if (this.notValidBlockArr.length > 0) {
        this.notValidBlockArr.forEach(item => {
          this.duplicateBlockArr.push(item);
          this.invalidBlockCount += 1;
        })
      }
      this.uniqueBlockArr = this.uniqueBlockArr.filter((element) => {
        if (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element.managername != "" && element.managername != undefined && element.managermobileno != "" && element.managermobileno != undefined && element.manageremailid != "" && element.manageremailid != undefined) {
          console.log(element);
        }
        return (element.blockname != "" && element.blockname != undefined && element.blocktype != "" && element.blocktype != undefined && element.units != "" && element.units != undefined && element.managername != "" && element.managername != undefined && element.managermobileno != "" && element.managermobileno != undefined && element.manageremailid != "" && element.manageremailid != undefined);
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

  blockidtmp = {};
  blocknameforIteration = '';
  sameBlocknameExist;
  duplicateBlocknameExist;
  blockdetailsfinalcreation() {
    $(".se-pre-con").show();
    this.duplicateBlocknameExist = false;
    console.log(this.isblockdetailsempty);
    if (!this.isblockdetailsempty) {
      this.isblockdetailsempty = true;
      this.sameBlocknameExist = false;
      this.commonblockarray1.push(this.commonblockarray);
      console.log(this.commonblockarray1);
      this.commonblockarray.forEach((element, index) => {
        ((index) => {
          setTimeout(() => {

            // this.blockdetailsidvise(element);
            let ipAddress = this.utilsService.createBlock();
            let blockcreateurl = `${ipAddress}oyeliving/api/v1/Block/create`

            this.jsondata = {
              "ASAssnID": this.assid,
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
            console.log(this.jsondata);
            this.http.post(blockcreateurl, this.jsondata, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } })
              .subscribe((res: any) => {
                console.log(res);
                if (res.data.blockID) {
                  console.log(this.unitlistjson);
                  console.log(res.data.blockID);
                  this.blockidtmp[element.blockname] = res.data.blockID;
                  console.log(this.blockidtmp);
                  element.isNotBlockCreated = false;
                  element.isBlockCreated = true;
                  //console.log(res['data']['data']['blockID']);
                  //console.log(this.unitlistjson[element.blockname]);
                  /* this.unitlistjson[element.blockname].forEach(obj => {
                     obj.blockid = res.data.blockID
                     console.log(obj.blockid);
                     console.log(this.unitlistjson)
                   }) */
                  let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
                  this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
                  this.finalblocknameTmp.push({ 'name': this.jsondata.blocks[0].BLBlkName, 'displaytext': 'Save And Continue' });
                  for (var i = 0; i < blockArraylength; i++) {
                    let data = JSON.parse(JSON.stringify(this.unitsrowjson))

                    data.Id = this.jsondata.blocks[0].BLBlkName + i + 1;
                    data.unitTmpid = '';
                    //data.blockid = res['data']['data']['blockID'];
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
                  //this.sameBlocknameExist=true;
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
            /* let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
             this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
            for (var i = 0; i < blockArraylength; i++) {
             let data = JSON.parse(JSON.stringify(this.unitsrowjson))
       
             data.Id = this.jsondata.blocks[0].BLBlkName+i+1;
             console.log(data.Id)
           
              if (!this.unitlistjson[this.jsondata.blocks[0].BLBlkName]) {
                this.unitlistjson[this.jsondata.blocks[0].BLBlkName] = []
              }
              this.unitlistjson[this.jsondata.blocks[0].BLBlkName].push(data)
            } */
          }, 3000 * index)
        })(index)
      })
      setTimeout(() => {
        $(".se-pre-con").fadeOut("slow");
        document.getElementById('upload_excel').style.display = 'none'
        // document.getElementById('blockdetailscancelbutton').style.display = 'none';
        document.getElementById('showmanualblockwithhorizantalview').style.display = 'none';
        document.getElementById('showmanual').style.display = 'block';
        // document.getElementById('blockdetailsbuttons').style.display = 'block';
        this.commonblockarray.forEach(element => {
          element.hasNoDuplicateBlockname = true;
          element.disableField = true;
        })
        if (!this.sameBlocknameExist) {
          let displaymessage;
          if (this.blockssuccessarray == 1) {
            displaymessage = 'Block Created Successfully'
          }
          else if (this.blockssuccessarray > 1) {
             if (this.duplicateBlockCount > 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.blockssuccessarray}'-Blocks Created Successfully
                         ${this.invalidBlockCount} Invalid
                         ${this.duplicateBlockCount} Duplicate`;
            }
            else if (this.duplicateBlockCount == 0 && this.invalidBlockCount > 0) {
              displaymessage = `${this.blockssuccessarray}'-Blocks Created Successfully
                         ${this.invalidBlockCount} Invalid`;
            }
            else if (this.duplicateBlockCount > 0 && this.invalidBlockCount == 0) {
              displaymessage = `${this.blockssuccessarray}'-Blocks Created Successfully
                         ${this.duplicateBlockCount} Duplicate`;
            }
            else {
              displaymessage = this.blockssuccessarray + '-' + 'Blocks Created Successfully'
            }
          }
          Swal.fire({
            title: displaymessage,
            text: "",
            type: "success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          }).then(
            (result) => {
              if (result.value) {
                if (this.duplicateBlockArr.length > 0) {
                  this.duplicateBlocknameExist = true;
                  this.blocksArray = [];
                  this.duplicateBlockArr.forEach(itm1 => {
                    itm1.markedasduplicate = 0;
                    this.blocksArray.push(itm1);
                  })
                  this.uniqueBlockArr.forEach(itm => {
                    itm.hasNoDuplicateBlockname = true;
                    itm.disableField = true;
                    this.blocksArray.push(itm);
                  })
                  //console.log(this.blocksArray.reverse());
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
                  //this.blocksArray.reverse();
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
            })
        }
      }, 3000)
      //document.getElementById("mat-tab-label-0-3").style.backgroundColor = "lightblue";

    }
  }
  createblocksdetails1(blockname, blocktype, units, managername, managermobileno, manageremailid, objId, index1) {
    console.log(blockname, blocktype, units, managername, managermobileno, manageremailid, objId, index1);
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
          "BLMgrName": managername,
          "BLMgrMobile": managermobileno,
          "BLMgrEmail": manageremailid,
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
            confirmButtonColor: "#f69321"
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
      cancelButtonText: "CANCEL"
    }).then(
      (result) => {
        console.log(result)
        if (result.value) {
          this.blocksArray.forEach(elemnt => {
            if (elemnt.Id == objId) {
              console.log('elemnt.Id==objId');
              elemnt.blockname = '';
              // elemnt.blocktype='';
              elemnt.units = '';
              elemnt.managername = '';
              elemnt.managermobileno = '';
              elemnt.manageremailid = '';
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

  onFileChange(ev) {
    this.isblockdetailsempty = false;
    this.blocksArray = [];
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
      this.excelBlockList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(this.excelBlockList);
      console.log(this.excelBlockList.length);
      this.filelist1 = [];
      let blockslength = Number(this.noofblocks)
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
            list.disableField = false;
            list.markedasduplicate = 1;
            list.isnotvalidunits = false,
              list.blocktype = this.residentialorcommercialtype;
            list.isblockdetailsempty1 = true;
            list.isNotBlockCreated = true;
            list.isBlockCreated = false;

            this.blocksArray.push(list);
            console.log(this.blocksArray)
          });
          this.blocksArray.forEach((element) => {
            if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
              this.isblockdetailsempty = true;
            }
          })
          setTimeout(() => {
            this.increasingBlockArrLength = this.blocksArray.length + 1;
            this.createblocksdetails('');
          }, 1000)
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
        document.getElementById('upload_excel').style.display = 'block';
      }

    }
  }
  uploadunits() {
    document.getElementById("file_unitupload_id").click();
  }



  unitmatching: boolean;
  getUnitName(Id, flatno, name) {
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
          //
        }
      })
    })
    this.validateUnitDetailsField(name, Id, flatno);
  }
  getUnittype(Id, unittype, name, flatno) {
    console.log(Id, unittype, name, flatno);
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined){
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
    console.log(Id, unittype, name);
    this.numberofunitexistence = 0;
    Object.keys(this.unitlistjson).forEach(element => {
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          console.log(unit);
          console.log(this.unitlistjson[element]);
          this.unitlistjson[element].forEach(itm => {
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
            if(itm.flatno != undefined){
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
    this.valueExcelBlckArr = [];
    this.ExcelBlkNameDuplicateList = [];
    this.ExcelBlkNameDuplicateList1 = [];
    this.isblockdetailsempty = false;
    this.numberofexistence = 0;

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
            }
            else {
              element.hasNoDuplicateBlockname = false;
            }
          }
        })
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getnoofunits(Id, units) {
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.units = units;
        if (element.units == "") {
          element['isnotvalidunits'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidunits'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanagername(Id, managername) {
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.managername = managername;
        if (element.managername == "") {
          element['isnotvalidmanagername'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidmanagername'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanagermobileno(Id, managermobileno) {
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.managermobileno = managermobileno;
        if (element.managermobileno == "") {
          element['isnotvalidmanagermobileno'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidmanagermobileno'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  getmanageremailid(Id, manageremailid) {
    this.isblockdetailsempty = false;
    this.blocksArray.forEach(element => {
      if (element.Id == Id) {
        element.manageremailid = manageremailid;
        if (element.manageremailid == "") {
          element['isnotvalidmanageremailid'] = true;
          this.blockdetailInvalid = true;
        }
        else {
          element['isnotvalidmanageremailid'] = false;
        }
        if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
          element.isblockdetailsempty1 = true;
        }
        else {
          element.isblockdetailsempty1 = false;
        }
      }
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
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
      if (element.blockname == "" || element.blockname == undefined || element.blocktype == "" || element.blocktype == undefined || element.units == "" || element.units == undefined || element.managername == "" || element.managername == undefined || element.managermobileno == "" || element.managermobileno == undefined || element.manageremailid == "" || element.manageremailid == undefined) {
        this.isblockdetailsempty = true
      }
    })
  }
  isValidUnitRecord: boolean;
  isExcelDataExceed: boolean;
  iindex: any;
  excelunitsuploaddata(exceldata, UpdateBlockUnitCountTemplate) {
    this.unitlistuniquejsonagainfiltered = [];
    this.isunitdetailsempty = false;
    this.unitrecordDuplicateUnitnameModified = false;
    this.duplicateUnitrecordexist = false;
    console.log(exceldata.length);
    if (exceldata.length == 0) {
      Swal.fire({
        title: 'Please fill all the fields',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
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
                  this.isExcelDataExceed = true;
                  console.log('this.isExcelDataExceed=true');
                  Swal.fire({
                    title: "Please Check uploaded no of units should not more than given no of units for perticualar Block",
                    text: "",
                    confirmButtonColor: "#f69321",
                    confirmButtonText: "OK"
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
          }, 2000)
          //
          this.blockunitcountmodalRef = this.modalService.show(UpdateBlockUnitCountTemplate, Object.assign({}, { class: 'gray modal-sm' }));
        }
        if (this.isValidUnitRecord) {
          this.gotonexttab1('', _blkname, this.iindex);
        }
      }, 2000)
    }
  }
  file: File
  arrayBuffer: any;
  filelist: any;
  blockunitcountmodalRef: BsModalRef;

  onFileunitdetailschange(ev, UpdateBlockUnitCountTemplate) {
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
      let arraylist1 = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = [];
      console.log(this.filelist)
      this.excelunitsuploaddata(arraylist1, UpdateBlockUnitCountTemplate)
    }
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
          "ASGSTNo": "",
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


        this.assid = res.data.association.asAssnID;
        //  for (var i = 0; i < res.data.association.asNofBlks; i++) {
        //   var data = JSON.parse(JSON.stringify(this.rowjson))
        //   this.blocksArray.push(data);
        //   console.log(this.blocksArray)

        // }
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
      }, error => {
        console.log(error);
      }
      );


      this.demo1TabIndex = this.demo1TabIndex + 1;
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
      cancelButtonText: "CANCEL"

    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          console.log(ev)
          this.form.reset();
          this.thumbnailASAsnLogo = undefined;
          if (this.fileInputfinal) {
            this.fileopen(ev, this.fileInputfinal);
          }
          this.uploadForm.reset();
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
      cancelButtonText: "CANCEL"
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {

          this.gstpanform.reset();
          this.uploadPANCardThumbnail = undefined;
          if (this.fileInputfinal1) {
            this.fileopen1(ev, this.fileInputfinal1);
          }
          // this.pancardnameoriginal=false
          this.uploadPanForm.reset();
          this.imgfilename = '';
          this.showImgOnPopUp(ev, undefined, '')
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
      cancelButtonText: "CANCEL"
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
      cancelButtonText: "CANCEL"
    }).then(
      (result) => {
        console.log(result)

        if (result.value) {
          this.blocksArray.forEach(Object => {
            Object.blockname = "";
            // Object.blocktype="";
            Object.units = "";
            Object.managername = "";
            Object.managermobileno = "";
            Object.manageremailid = "";

          })
        }
      })

  }
  resetStep5bulk(ev, blknamecommon) {
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
            console.log(this.unitlistjson[element])
            this.unitlistjson[element].forEach(unit => {
              if (blknamecommon == unit.blockname && unit.blockname != undefined) {

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
                  unit.tenantemaiid = ""
              } else {
                let blname = unit.Id.slice(0, -2);
                if (blknamecommon == blname) {
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
                    unit.tenantemaiid = ""
                }

              }

            })
          })
        }
      })




  }
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
                  unit.tenantemaiid = ""
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
