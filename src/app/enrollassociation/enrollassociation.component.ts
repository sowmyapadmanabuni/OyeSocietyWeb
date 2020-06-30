import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import {UtilsService} from '../../app/utils/utils.service';
// import { Observable } from 'rxjs/Observable';
import { ViewAssociationService } from '../../services/view-association.service';
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

  gstpanform:FormGroup;
  panform: FormGroup;
  blocksdetailsform:FormGroup;
  uploadForm: FormGroup;
  uploadPanForm: FormGroup;
  countrieslist=[];
  // blocksdetailsform:FormGroup=this.formBuilder.group({});
  unitsdetailsform:FormGroup;
  isbulkupload = false;
  ismanualupload =false;
  associationfinalresult;
  titleAlert: string = 'This field is required';
  post: any = '';
  private formSubmitAttempt: boolean;
  isblockdetailsempty: boolean;
  isunitdetailsempty:boolean;
  blockdetailInvalid:boolean;
  blocktypeform = new FormControl("");
  condition = true;

  constructor(private http: HttpClient,private cdref: ChangeDetectorRef,
    public viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private utilsService:UtilsService,
    private modalService: BsModalService, private formBuilder: FormBuilder) {
      this.blockdetailInvalid=true;
      this.url='';
      this.isblockdetailsempty=true;
      // this.isunitdetailsempty=false;
     }

  // countrieslist = [
  //   "INDIA",
  //   "AFGHANISTAN",
  //   "ALGERIA",
  //   "ARGENTINA",
  //   "AUSTRALIA",
  //   "AUSTRIA",
  //   "BELGIUM",
  //   "BHUTAN",
  //   "BRAZIL",
  //   "CANADA",
  //   "CHINA",
  //   "CUBA",
  //   "DENMARK",
  //   "FINLAND",
  //   "FRANCE",
  //   "GERMANY",
  //   "IRELAND",
  //   "ISRAEL",
  //   "ITALY",
  //   "JAPAN",
  //   "MALAYSIA",
  //   "MEXICO",
  //   "NETHERLANDS",
  //   "NORWAY",
  //   "QATAR",
  //   "RUSSIA",
  //   "SINGAPORE",
  //   "SWITZERLAND",
  //   "UAE",
  //   "UNITED KINGDOM",
  //   "USA",
  //   "QATAR"
  // ]
  states = [
    "ANDAMAN",
    "ANDHRA PRADESH",
    "ARUNACHAL PRADESH",
    "ASSAM",
    "BIHAR",
    "CHANDIGARH",
    "CHHATTISGARH",
    "DADRA",
    "DELHI",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL PRADESH",
    "JAMMU AND KASHMIR",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "LADAKH",
    "LAKSHADWEEP",
    "MADHYA PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUDUCHERRY",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR PRADESH",
    "UTTARAKHAND",
    "WEST BENGAL"
  ]
  propertyType = ['Residential','Commercial','Residential and Commercial']/*[
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
  blockType = ['Residential','Commercial','Residential and Commercial']/*[
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
  unittypedata =[
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
      gstnumber:[''],
      pannumber:['']
    });
    this.unitsDetailsgenerateform();
    this.countrylist();
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
      'cntryname':[null, Validators.required],
      'statename':[null, Validators.required],
      'cityname': [null, Validators.required],
      'prprtytype':[null, Validators.required],
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
      'gst':[null],
      'originalpan': [null, Validators.required]
    });
  }
  blockDetailsgenerateform() {
    this.blocksdetailsform  = this.formBuilder.group({
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

  isFieldValidunitsdetails(field: string){
    return !this.unitsdetailsform.get(field).valid && this.unitsdetailsform.get(field).touched;

  }
  isFieldValidblocksdetails(field: string,index) {
    // return !this.blocksdetailsform.get(index.toString()).get(field).valid && this.blocksdetailsform.get(index.toString()).get(field).touched;
   if(index!=null&&index!=undefined){
    return !this.blocksdetailsform.get(field).valid && this.blocksdetailsform.get(field).touched;

   }
  }
  countrylist(){
 let countryurl = "http://apidev.oyespace.com/oyeliving/api/v1/Country/GetCountryList" 

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
  residentialorcommercialtype='';
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
    "managername": "",
    "measurementtype": "Sqft",
    "paymentcharge": "",
    "ratevalue": "",
    "startdate": "",
    "units": "",

    "isnotvalidblockname":false,
    "isnotvalidblocktype":false,
    "isnotvalidmanageremailid":false,
    "isnotvalidmanagermobileno":false,
    "isnotvalidmanagername":false,
    "isnotvalidunits":false,
    "isUnitsCreatedUnderBlock":false
   
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
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.uploadForm.get('profile').setValue(file);
    }
  }
  modalRef: BsModalRef;
  ImgForPopUp:any;
  UploadedImage: any;
  showImgOnPopUp(UploadedImagetemplate,thumbnailASAsnLogo,displayText){
    if(thumbnailASAsnLogo!=undefined){
      this.ImgForPopUp=thumbnailASAsnLogo;
      this.UploadedImage=displayText;
      this.modalRef = this.modalService.show(UploadedImagetemplate,Object.assign({}, { class: 'gray modal-lg' }));
    }
    
  }
  ASAsnLogo: any;
  thumbnailASAsnLogo:any;
  processFile() {
    console.log(this.thumbnailASAsnLogo);
    console.log(this.uploadForm.get('profile').value);
    var reader = new FileReader();
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
imgfilename;
  onPanFileSelect(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      console.log(file);
      this.imgfilename = file.name;
      this.uploadPanForm.get('panProfile').setValue(file);
    }
  }
  uploadPANCard:any;
  uploadPANCardThumbnail:any;
  processPanFile(){
    console.log(this.uploadPanForm.get('panProfile').value);
    var reader = new FileReader();
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
  pan_validate(ev){
    var regpan = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
    this.pannumber = this.pannumber.toUpperCase()
    this.firstLetter = this.assname.charAt(0).toUpperCase();
    this.fifthLetter = this.pannumber.charAt(4).toUpperCase();
    if(this.firstLetter == this.fifthLetter){
      if (regpan.test(this.pannumber) == false) {
        console.log("PAN Number Not Valid.");
        } else {
          console.log("PAN Number is Valid.");
    
        }
    }
 
  }
  keyPress3(event:any){
    const pattern = /[1-9\+\-\ ]/;
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
  caltype =[
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
  unitsuccessarray =[]

  gotonexttab(ev, name,obj3Id) {
    console.log(name);
    console.log(obj3Id);
     
    this.unitmovingnexttab(name,obj3Id);

  }
  gotonexttab1(ev, name) {
    console.log(name);
     
    this.unitmovingnexttab1(name);

  }
  unitmovingnexttab1(name) {
    //if (this.isunitdetailsempty) {
      this.submitunitdetails1(name);
    //}
  }
  unitmovingnexttab(name,obj3Id) {
    //if (this.isunitdetailsempty) {
      this.submitunitdetails(name,obj3Id);
    //}
  }


  exceptionMessage1='';
  SubmitOrSaveAndContinue1='SAVE AND CONTINUE';
  // nextObjId1='';
  // isNextIetrationEnabled1;
  // nextBlckId1='';

  submitunitdetails1(name) {
    let valueManualUnitnameArr = this.unitlistjson[name].map(item => { return item.flatno.toLowerCase() });
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
        else{
          let abc = Object.keys(this.unitlistjson);
          this.finalblocknameTmp = this.finalblocknameTmp.filter(item=>{
            return item !=  name;
          })
          console.log(this.finalblocknameTmp);
          console.log(this.finalblocknameTmp.length);
          if(this.finalblocknameTmp.length==1){
            console.log('insideltab');
            this.SubmitOrSaveAndContinue1='Submit';
          }
          this.exceptionMessage1='';
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
      
                          "UOFName": (unit.ownerfirstname==undefined?'':unit.ownerfirstname),
                          "UOLName": (unit.ownerlastname==undefined?'':unit.ownerlastname),
                          "UOMobile": (unit.ownermobilenumber==undefined?'':unit.ownermobilenumber),
                          "UOISDCode": "",
                          "UOMobile1": "",
                          "UOMobile2": "",
                          "UOMobile3": "",
                          "UOMobile4": "",
                          "UOEmail": (unit.owneremaiid==undefined?'':unit.owneremaiid),
                          "UOEmail1": "sowmya_padmanabhuni@oyespace.com",
                          "UOEmail2": "sowmya_padmanabhuni@oyespace.com",
                          "UOEmail3": "sowmya_padmanabhuni@oyespace.com",
                          "UOEmail4": "sowmya_padmanabhuni@oyespace.com",
                          "UOCDAmnt": "2000"
      
                        }],
                      "Tenant": [{
                        "UTFName": (unit.tenantfirstname==undefined?'':unit.tenantfirstname),
                        "UTLName": (unit.tenantlastname==undefined?'':unit.tenantlastname),
                        "UTMobile": (unit.tenantmobilenumber==undefined?'':unit.tenantmobilenumber),
                        "UTISDCode": "+91",
                        "UTMobile1": "+919398493298",
                        "UTEmail": (unit.tenantemaiid==undefined?'':unit.tenantemaiid),
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
      
                }, error => {
                  console.log(error);
                 this.exceptionMessage1 = error['error']['exceptionMessage'];
                 console.log(this.exceptionMessage1);
                });
              }, 2000 * index)
            })(index)
      
          });
      
          //
          //}
          //})
          //})
      
          // Object.keys(this.unitlistjson).forEach((element, index) => {
          //   console.log(this.unitlistjson[element]);
      
          // }) 
      
          setTimeout(() => {
            var message;
            if (this.unitsuccessarray.length == 1) {
              message = 'Unit Created Successfully'
            }
            else if (this.unitsuccessarray.length > 1) {
              message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
            }
      
            let abc0 = Object.keys(this.unitlistjson);
            if(Object.keys(this.unitlistjson)[abc0.length-1]==name){
              Swal.fire({
                title: (this.exceptionMessage1 == ''?message:this.exceptionMessage),
                text: "",
                type: (this.exceptionMessage1 == ''?"success":"error"),
                confirmButtonColor: "#f69321",
                confirmButtonText: "OK"
              }).then(
                (result) => {
                  if (result.value) {
                    this.isunitdetailsempty=true;
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
            else{
              this.demo2TabIndex = this.demo2TabIndex + 1;
            }
            
      
          }, Number(this.unitlistjson[name].length) * 2000)
          //document.getElementById("mat-tab-label-0-4").style.backgroundColor = "lightblue";
      
        }
  }
  exceptionMessage='';
  SubmitOrSaveAndContinue='SAVE AND CONTINUE';
  nextObjId='';
  isNextIetrationEnabled;
  nextBlckId='';
  submitunitdetails(name,obj3Id) {
    this.isNextIetrationEnabled=false;
    let valueManualUnitnameArr = this.unitlistjson[name].map(item => { return item.flatno.toLowerCase() });
    console.log(valueManualUnitnameArr);
    console.log(this.unitlistjson[name]);
    let isManualUnitnameDuplicate = valueManualUnitnameArr.some((item, idx) => {
      console.log(valueManualUnitnameArr.indexOf(item),idx);
      if(item != ""){
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
        else{
          let abc = Object.keys(this.unitlistjson);
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
          }
          this.exceptionMessage='';
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
              console.log('test',obj3Id);
              console.log(index);
              console.log(this.unitlistjson[name]);
              //console.log(this.unitlistjson[name][index+1]);
              //console.log(this.unitlistjson[name][index+1]['Id']);
              if(this.unitlistjson[name][index+1]==undefined){
                console.log('test1');
                console.log(this.blocksArray);
                console.log(name);
                this.blocksArray.forEach((itm,indx)=>{
                  if(itm.blockname.toLowerCase() == name.toLowerCase()){
                    itm.isUnitsCreatedUnderBlock=true;
                    if(this.blocksArray[indx+1]!=undefined){
                      console.log(this.blocksArray[indx+1]['blockname']);
                      this.blocknameforIteration = this.blocksArray[indx+1]['blockname'];
                      this.nextBlckId=this.blocksArray[indx+1]['Id'];
                      console.log(this.blocknameforIteration);
                      console.log(this.nextBlckId);
                    }
                  }
                })
                this.unitlistjson[this.blocknameforIteration][0]['unitTmpid']=this.unitlistjson[this.blocknameforIteration][0]['Id'];
                //this.nextObjId = this.unitlistjson[this.blocknameforIteration][0]['Id'];
                //console.log(this.nextObjId);
                console.log(this.unitlistjson[this.blocknameforIteration]);
                this.isNextIetrationEnabled=true;
              }
              else{
                this.nextObjId = this.unitlistjson[name][index+1]['Id'];
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
                  console.log(res)

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
            if(this.isNextIetrationEnabled){
              this.assignTmpid(this.nextBlckId,this.blocknameforIteration);
            }
            else{
              this.assignUnitTmpid(this.nextObjId,this.blocknameforIteration);
            }
            var message;
            if (this.unitsuccessarray.length == 1) {
              message = 'Unit Created Successfully'
            }
            else if (this.unitsuccessarray.length > 1) {
              message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
            }
      
            let abc0 = Object.keys(this.unitlistjson);
            if(Object.keys(this.unitlistjson)[abc0.length-1]==name){
              console.log(this.unitlistjson[name]);
              this.unitlistjson[name].forEach((elmt,iidx) => {
                if(elmt.Id.toLowerCase() == obj3Id.toLowerCase()){
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
            else{
              this.demo2TabIndex = this.demo2TabIndex + 1;
            }
            
      
          //}, Number(this.unitlistjson[name].length) * 2000)
          }, 2000)
          //document.getElementById("mat-tab-label-0-4").style.backgroundColor = "lightblue";
      
        }
  }
validateUnitDetailsField(name){
  this.isunitdetailsempty = true;
    Object.keys(this.unitlistjson).forEach(element => {
      console.log(this.unitlistjson[element])

      this.unitlistjson[element].forEach(unit => {
        let headername = unit.Id.slice(0, -2);
        console.log(headername);
        console.log(name);
        if (name.toLowerCase() == headername.toLowerCase()) {
          console.log(unit);
          if(this.isunitdetailsempty){
            if (unit.ownershipstatus == "Sold Owner Occupied Unit"||unit.ownershipstatus == "Sold Vacant Unit") {
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
              }
              else{
                unit.isSingleUnitDataEmpty = false;
              }
            }
            // else if (unit.ownershipstatus == "SOLD VACANT UNIT") {
            //   if (unit.flatno == "" || unit.flatno == undefined ||
            //     unit.unittype == "" || unit.unittype == undefined ||
            //     unit.ownershipstatus == "" || unit.ownershipstatus == undefined ||
            //     unit.owneremaiid == "" || unit.owneremaiid == undefined ||
            //     unit.ownerfirstname == "" || unit.ownerfirstname == undefined ||
            //     unit.ownerlastname == "" || unit.ownerlastname == undefined ||
            //     unit.ownermobilenumber == "" || unit.ownermobilenumber == undefined) {
            //     this.isunitdetailsempty = true
  
            //   }
            // }
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
              }
              else{
                unit.isSingleUnitDataEmpty = false;
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
  
              }
              else{
                unit.isSingleUnitDataEmpty = false;
              }
            }
            else if (unit.ownershipstatus == "UnSold Vacant Unit"||unit.ownershipstatus==""||unit.ownershipstatus==undefined) {
              if (unit.flatno == "" || unit.flatno == undefined ||
              unit.unittype == "" || unit.unittype == undefined ||
  
                // unit.blockname == "" || unit.blockname == undefined ||
                unit.ownershipstatus == "" || unit.ownershipstatus == undefined
              ) {
                this.isunitdetailsempty = false
                unit.isSingleUnitDataEmpty = true;
  
              }
              else{
                unit.isSingleUnitDataEmpty = false;
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
  validateAllBlocksDetailsFormFields(formGroup: FormGroup){
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
      this.residentialorcommercialtype=this.propertytype;
      console.log(this.residentialorcommercialtype);
      this.demo1TabIndex = this.demo1TabIndex + 1;
    //document.getElementById("mat-tab-label-0-0").style.backgroundColor = "lightblue";
      
    }
    else {
      this.validateAllFormFields(this.form); 
    }
  }
  pancardnameoriginal:boolean;
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
  else{
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
  blockdetailsidvise(element){
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
  movetonexttab(event){
    this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  unitdetails ={}
  blockssuccessarray;
  createblocksdetails(event) {
    let valueBlckArr = this.blocksArray.map(item => { return item.blockname.toLowerCase() });
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
        else{
          this.isblockdetailsempty=false;
          // console.log(this.blocksArray)
          this.blockssuccessarray = this.blocksArray.length;
          // if (this.blocksdetailsform.valid) {
            setTimeout(() => {
            this.blocksArray.forEach((element) => {
              if(element.blockname==""||element.blockname==undefined||element.blocktype==""||element.blocktype==undefined||element.units==""||element.units==undefined||element.managername==""||element.managername==undefined||element.managermobileno==""||element.managermobileno==undefined||element.manageremailid==""||element.manageremailid==undefined){
            this.isblockdetailsempty=true;
              }
            })
            this.blockdetailsfinalcreation();
          }, 1000 )
          console.log(this.blocksArray)
        }
  }
  
  blockidtmp={};
  blocknameforIteration='';
  sameBlocknameExist;
  blockdetailsfinalcreation(){
    if(!this.isblockdetailsempty){
      this.isblockdetailsempty=true;
      this.sameBlocknameExist=false;
      this.blocksArray.forEach((element,index) => {
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
              if(res.data.blockID){
              console.log(this.unitlistjson);
              console.log(res.data.blockID);
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
        //         this.blocksArray.forEach(element => {
        //           Object.keys(this.unitlistjson).forEach(blkname => {
        // if(blkname==element['blockname']){
        //   element['blockid']
        // }
        //           })
        //         })
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
                console.log(this.finalblockname);
                this.blocknameforIteration = this.finalblockname[0];
                this.unitlistjson[this.finalblockname[0]][0]['unitTmpid'] = this.unitlistjson[this.finalblockname[0]][0]['Id'];
                console.log(this.blocknameforIteration);
                console.log(this.unitlistjson[this.finalblockname[0]][0]['unitTmpid']);
                this.demo1TabIndex = this.demo1TabIndex + 1;
              }
            })
        }
      },3000)
      //document.getElementById("mat-tab-label-0-3").style.backgroundColor = "lightblue";

    }
  }
  manualunitdetailsclick(ev) {
    document.getElementById('unitmanualbulk').style.display = 'none'
    document.getElementById('unitshowmanual').style.display = 'block';
  }
  uploadblocks() {
    document.getElementById("file_upload_id").click();
  }
  assignTmpid(objId,blockname){
    console.log(objId);
    this.blocknameforIteration=blockname;
    console.log(this.blocknameforIteration);
    this.blocksArray.forEach(elemnt=>{
      if(elemnt.Id==objId){
        console.log('test',objId);
        elemnt.blockTmpid=objId;
        console.log(elemnt.blockTmpid);
      }
      else{
        elemnt.blockTmpid='';
      }
    })
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
    excelBlockList=[];
    ShowExcelUploadDiscription=true;
    ShowExcelDataList=false;
    
    blockfile:File
    blockarrayBuffer:any;
  filelist1:any;

    onFileChange(ev){
      this.blocksArray=[];
      this.file= ev.target.files[0];     
      let fileReader = new FileReader();    
      fileReader.readAsArrayBuffer(this.file);     
      fileReader.onload = (e) => {    
          this.arrayBuffer = fileReader.result;    
          var data = new Uint8Array(this.arrayBuffer);    
          var arr = new Array();    
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
          var bstr = arr.join("");    
          var workbook = XLSX.read(bstr, {type:"binary"});    
          var first_sheet_name = workbook.SheetNames[0];    
          var worksheet = workbook.Sheets[first_sheet_name];    
          console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
            this.excelBlockList = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
                 console.log(this.excelBlockList);
                 console.log(this.excelBlockList.length);
            this.filelist1 = [];    
      let blockslength=Number(this.noofblocks)
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
            let valueExcelBlckArr = this.excelBlockList.map(item => { return item.blockname.toLowerCase() });
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
            else {
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
                list.isnotvalidmanagername = false,

                  list.isnotvalidunits = false,
                  list.blocktype = this.residentialorcommercialtype;

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
              document.getElementById('upload_excel').style.display = 'none'
              document.getElementById('blockdetailscancelbutton').style.display = 'none';
              document.getElementById('showmanual').style.display = 'block';
              document.getElementById('blockdetailsbuttons').style.display = 'block';
            }
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
    }
  uploadunits(){
    document.getElementById("file_unitupload_id").click();
  }



  unitmatching: boolean;
  getUnitName(Id, flatno,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['flatno'] = flatno;
          if(unit['flatno']==""||unit['flatno']==undefined){
            unit['isnotvalidflatno']=true;
          }
          else{
            unit['isnotvalidflatno']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  getunittype(Id, unittype,name){
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
  }
  getownershipstatus(Id, ownershipstatus,name){
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
  }
  getownerfirstname(Id, ownerfirstname,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownerfirstname'] = ownerfirstname;
          if(unit['ownerfirstname']==""){
            unit['isnotvalidownerfirstname']=true;
          }
          else{
            unit['isnotvalidownerfirstname']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  getownerlastname(Id, ownerlastname,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownerlastname'] = ownerlastname;
          if(unit['ownerlastname']==""){
            unit['isnotvalidownerlastname']=true;
          }
          else{
            unit['isnotvalidownerlastname']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  getownermobilenumber(Id, ownermobilenumber,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['ownermobilenumber'] = ownermobilenumber;
          if(unit['ownermobilenumber']==""){
            unit['isnotvalidownermobilenumber']=true;
          }
          else{
            unit['isnotvalidownermobilenumber']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  getowneremaiid(Id, owneremaiid,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['owneremaiid'] = owneremaiid;
          if(unit['owneremaiid']==""){
            unit['isnotvalidowneremaiid']=true;
          }
          else{
            unit['isnotvalidowneremaiid']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  gettenantfirstname(Id, tenantfirstname,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantfirstname'] = tenantfirstname;
          if(unit['ownerlastname']==""){
            unit['isnotvalidtenantfirstname']=true;
          }
          else{
            unit['isnotvalidtenantfirstname']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  gettenantlastname(Id, tenantlastname,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantlastname'] = tenantlastname;
          if(unit['tenantlastname']==""){
            unit['isnotvalidtenantlastname']=true;
          }
          else{
            unit['isnotvalidtenantlastname']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  gettenantmobilenumber(Id, tenantmobilenumber,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantmobilenumber'] = tenantmobilenumber;
          if(unit['tenantmobilenumber']==""){
            unit['isnotvalidtenantmobilenumber']=true;
          }
          else{
            unit['isnotvalidtenantmobilenumber']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
  }
  gettenantemaiid(Id, tenantemaiid,name) {
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        console.log(unit)
        if (unit['Id'] == Id) {
          unit['tenantemaiid'] = tenantemaiid;
          if(unit['tenantemaiid']==""){
            unit['isnotvalidtenantemaiid']=true;
          }
          else{
            unit['isnotvalidtenantemaiid']=false;
          }
        }
      })
    })
    this.validateUnitDetailsField(name);
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
  excelunitsuploaddata(exceldata) {
    console.log(exceldata.length);
    if(exceldata.length==0){
      Swal.fire({
        title: 'Please fill all the fields',
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else{
      console.log(this.finalblockname);
      console.log(exceldata);
      console.log(this.blocksArray);
      console.log(this.unitlistjson);
      let _blkname = '';
      //
      //console.log(new Set(exceldata).size !== exceldata.length);
      let valueArr = exceldata.map(item => { return item.flatno.toLowerCase() });
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
          else{
            this.finalblockname.forEach(blkname => {
      
              exceldata.forEach((unitonce,i) => {
        
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
                  console.log(blkname,unitonce.blockname);
                  this.blocksArray.forEach((element,index) => {
                    if(element.blockname.toLowerCase()==blkname.toLowerCase()){
                      _blkname = blkname;
                    let unitslength=Number(element.units)
        
                      if(exceldata.length<=unitslength){
                        console.log(this.blockidtmp);
                        unitonce.blockid = this.blockidtmp[blkname];
                        unitonce.Id = blkname+i+1;
                        unitonce.unitTmpid='';
                        unitonce.isSingleUnitDataEmpty=true;
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
                        unitonce.isnotvalidtenantemaiid=false
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
                        document.getElementById('unitupload_excel').style.display = 'none'
                        document.getElementById('unitshowmanual').style.display = 'block';
                        document.getElementById('unitsmanualnew').style.display = 'none';
                        document.getElementById('unitsbulkold').style.display = 'block';
  
  
  
                        console.log(this.unitlistjson);
                      }
                      else{
                        Swal.fire({
                          title: "Please Check uploaded no of units should not more than given no of units for perticualar Block",
                          text: "",
                          confirmButtonColor: "#f69321",
                          confirmButtonText: "OK"
                        })
                        document.getElementById('unitupload_excel').style.display = 'block'
                      }
                    }
                  })
                }
              });
            })
          }
      this.validateUnitDetailsField(_blkname);
      console.log("unit data what contains",this.unitlistjson)
    }
  }
  file:File
  arrayBuffer:any;
  filelist:any;
  onFileunitdetailschange(ev){
    this.file= ev.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];    
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
          var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
              this.filelist = [];    
              console.log(this.filelist)    
              this.excelunitsuploaddata(arraylist)
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
  cancelmanualblocks(ev){
    document.getElementById('upload_excel').style.display ='block';
    document.getElementById('showmanual').style.display ='none';
    document.getElementById('blockdetailscancelbutton').style.display ='none';

    document.getElementById('blockdetailsbuttons').style.display ='none';
    this.blocksArray=[]
  }
submitforblocksbulkupload(ev){
  document.getElementById('showmanual').style.display ='none'
  document.getElementById('upload_excel').style.display ='block';
}
submitforbulkupload(ev){
  document.getElementById('unitshowmanual').style.display ='none'
  document.getElementById('unitsbulkold').style.display ='none'

  document.getElementById('unitupload_excel').style.display ='block';
}
cancelbulkupload(ev){
  document.getElementById('upload_excel').style.display ='none';
  document.getElementById('showmanual').style.display ='block';
  //this.blocksArray=[];
}
cancelunitsbulkupload(ev){
  document.getElementById('unitupload_excel').style.display ='none';
  document.getElementById('unitshowmanual').style.display ='block';
  // document.getElementById('unitsbulkold').style.display ='block';
  document.getElementById('unitsmanualnew').style.display ='block';

}
  detailsdata ={}
  
  submitforconformblockdetails(event){
    this.blocksArray=[];
    for (var i = 0; i < this.associationfinalresult.data.association.asNofBlks; i++) {
        var data = JSON.parse(JSON.stringify(this.rowjson))
        // this.detailsdata[i] ={}
        // Object.keys(data).forEach(datails=>{
        //   this.detailsdata[i][datails] ={required:true};
        // })
        data.Id = i+1;
        data.blockTmpid=1;
        data.blocktype= this.residentialorcommercialtype;
        this.blocksArray.push(data);
        console.log(this.blocksArray)
  
      }
      // this.blockDetailsgenerateform();
       //document.getElementById('manualbulk').style.display ='none'
       //document.getElementById('showmanual').style.display ='block';
       //document.getElementById('blockdetailsbuttons').style.display ='block';
       //document.getElementById('blockdetailscancelbutton').style.display ='block';



      // this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  submitassociationcreation(event,blocksnum) {
    this.isblockdetailsempty=true;
    let ipAddress = this.utilsService.createAssn();
    let associationurl = `${ipAddress}oyeliving/api/v1/association/create`
    if (this.blockform.valid) {
      var num1=Number(this.noofblocks)
      var num2=Number(this.noofunits);
      var totalnoofuits = num1 + num2;
      this.jsondata = {
        "acAccntID": this.globalService.getacAccntID(),
        "association": {
          "ASAddress": this.locality,
          "ASCountry": "India",
          "ASBToggle": "True",
          "ASAVPymnt": "False",
          "ASCity": this.city,
          "ASState": this.state,
          "ASPinCode": this.postalcode,
          "ASAsnLogo":  (this.ASAsnLogo == undefined ? '' : this.ASAsnLogo),
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
      this.http.post(associationurl,this.jsondata,{ headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res:any)=>{
     console.log(res)
     this.associationfinalresult = res;
   
    //  Swal.fire({
    //  title:"your association created succeefully please continue to create block details and unit details",
    //  confirmButtonColor: "#f69321",
    // //  type:"Success",
    //  icon: 'success',
    //   confirmButtonText: "OK"
    //  })
     
   
     this.assid=res.data.association.asAssnID;
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
          data.uniqueid = new Date().getTime();
          data.blocktype= this.residentialorcommercialtype;
          this.blocksArray.push(data);
          console.log(this.blocksArray)

        }
      },error=>{
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
  logo: boolean = false;

  resetStep1(ev){

    console.log(ev)
    this.form.reset();
    this.thumbnailASAsnLogo='';
   
  }
  resetStep2(ev){
    this.gstpanform.reset();
    this.uploadPANCardThumbnail='';
    // this.pancardnameoriginal=false
    this.uploadPanForm.reset();
    this.imgfilename ='';
    this.showImgOnPopUp(ev,undefined,'')

  }
  resetStep3(ev){
    this.blockform.reset();

  }
  resetStep4(ev){
    this.blocksArray.forEach(Object=>{
      Object.blockname="";
      Object.blocktype="";
      Object.units="";
      Object.managername="";
      Object.managermobileno="";
      Object.manageremailid="";
      
    })
  }
  resetStep5bulk(ev,blknamecommon){

    Object.keys(this.unitlistjson).forEach(element=>{
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
    })

  }
  resetStep5(ev,blknamecommon,Id){
    Object.keys(this.unitlistjson).forEach(element=>{
      this.unitlistjson[element].forEach(unit => {
        if (unit['Id'].toLowerCase() == Id.toLowerCase()) {
          console.log(Id);
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
      })
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
tabs =[1,2,3,4,5,6]
  public demo2TabIndex =0
  public demo2BtnClick() {
    const tabCount = 3;
    this.demo2TabIndex = (this.demo2TabIndex + 1) % tabCount;
  }
}
