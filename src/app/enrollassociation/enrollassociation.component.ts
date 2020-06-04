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
  blockform: FormGroup;
  panform: FormGroup;
  blocksdetailsform:FormGroup;
  uploadForm: FormGroup;
  uploadPanForm: FormGroup;

  // blocksdetailsform:FormGroup=this.formBuilder.group({});
  unitsdetailsform:FormGroup;
  isbulkupload = false;
  ismanualupload =false;
  associationfinalresult;
  titleAlert: string = 'This field is required';
  post: any = '';
  private formSubmitAttempt: boolean;

  constructor(private http: HttpClient,private cdref: ChangeDetectorRef,
    public viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private utilsService:UtilsService,
    private modalService: BsModalService, private formBuilder: FormBuilder) {
      this.url='';
     }
  countrieslist = [
    "INDIA",
    "AFGHANISTAN",
    "ALGERIA",
    "ARGENTINA",
    "AUSTRALIA",
    "AUSTRIA",
    "BELGIUM",
    "BHUTAN",
    "BRAZIL",
    "CANADA",
    "CHINA",
    "CUBA",
    "DENMARK",
    "FINLAND",
    "FRANCE",
    "GERMANY",
    "IRELAND",
    "ISRAEL",
    "ITALY",
    "JAPAN",
    "MALAYSIA",
    "MEXICO",
    "NETHERLANDS",
    "NORWAY",
    "QATAR",
    "RUSSIA",
    "SINGAPORE",
    "SWITZERLAND",
    "UAE",
    "UNITED KINGDOM",
    "USA",
    "QATAR"
  ]
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
  propertyType = [
    "RESIDENTIAL",
    "COMMERCIAL PROPERTY",
    "RESIDENTIAL AND COMMERCIAL PROPERTY"
  ]
  amenityType = [
    "SWIMMING POOL",
    "GYM",
    "CLUB HOUSE",
    "THEATER"
  ]
  blockType = [
    "RESIDENTIAL",
    "COMMERCIAL",
    "RESIDENTIAL AND COMMERCIAL"
  ]
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
    "SOLD OWNER OCCUPIED UNIT",
    "SOLD TENANT OCCUPIED UNIT",
    "SOLD VACANT UNIT",
    "UNSOLD VACANT UNIT",
    "UNSOLD TENANT OCCUPIED UNIT",
  ]
  unittypedata =[
    "FLAT",
    "VILLA",
    "VACCANT PLOT"
  ]
  ngOnInit() {
    // this.getAssociationList()
    this.createForm();
    this.blockandunitdetails();
    // this.pandetalis();
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
  blockandunitdetails() {
    this.blockform = this.formBuilder.group({
      'blockno': [null, Validators.required],
      'unitno': [null, Validators.required],

    });

  }
  // pandetalis() {
  //   this.panform = this.formBuilder.group({
  //     'gstno':[null],
  //     'panno': [null]
  //   });
  // }
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
  // isFieldValidPanDetails(field: string) {
  //   return !this.panform.get(field).valid && this.panform.get(field).touched;

  // }

  isFieldValidunitsdetails(field: string){
    return !this.unitsdetailsform.get(field).valid && this.unitsdetailsform.get(field).touched;

  }
  isFieldValidblocksdetails(field: string,index) {
    // return !this.blocksdetailsform.get(index.toString()).get(field).valid && this.blocksdetailsform.get(index.toString()).get(field).touched;
   if(index!=null&&index!=undefined){
    return !this.blocksdetailsform.get(field).valid && this.blocksdetailsform.get(field).touched;

   }
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
    "units": ""
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
    "isnotvalidtenantemaiid":false
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
    this.ImgForPopUp=thumbnailASAsnLogo;
    this.UploadedImage=displayText;
    this.modalRef = this.modalService.show(UploadedImagetemplate,Object.assign({}, { class: 'gray modal-lg' }));
  }
  ASAsnLogo: any;
  thumbnailASAsnLogo:any;
  processFile() {
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

  onPanFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
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
  array = []
  unitlistjson = {}
  unitdetailscreatejson;
  unitsuccessarray =[]
  gotonexttab(ev){
    this.demo2TabIndex = this.demo2TabIndex + 1;

  }
  submitunitdetails(event) {
    let date = new Date();  
    var getDate = date.getDate();
    var getMonth = date.getMonth()+1;
    var getFullYear = date.getFullYear();
   var currentdata = getDate + "-" + getMonth + "-" + getFullYear;

    console.log(date)

    let ipAddress = this.utilsService.createUnit();
    let unitcreateurl = `${ipAddress}oyeliving/api/v1/unit/create`

    // var getYear:any = getFullYear();
    Object.keys(this.unitlistjson).forEach(element=>{
      console.log(this.unitlistjson[element])
      
      this.unitlistjson[element].forEach(unit => {
       console.log(unit)
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
    
                  "UOFName": unit.ownerfirstname,
                  "UOLName": unit.ownerlastname,
                  "UOMobile": unit.ownermobilenumber,
                  "UOISDCode": "",
                  "UOMobile1": "",
                  "UOMobile2": "",
                  "UOMobile3": "",
                  "UOMobile4": "",
                  "UOEmail": unit.owneremaiid,
                  "UOEmail1": "sowmya_padmanabhuni@oyespace.com",
                  "UOEmail2": "sowmya_padmanabhuni@oyespace.com",
                  "UOEmail3": "sowmya_padmanabhuni@oyespace.com",
                  "UOEmail4": "sowmya_padmanabhuni@oyespace.com",
                  "UOCDAmnt": "2000"
    
                }],
              "Tenant": [{
                "UTFName": unit.tenantfirstname,
                "UTLName": unit.tenantlastname,
                "UTMobile": unit.tenantmobilenumber,
                "UTISDCode": "+91",
                "UTMobile1": "+919398493298",
                "UTEmail": unit.tenantemaiid,
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
        this.http.post(unitcreateurl, this.unitdetailscreatejson, { headers: { 'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1', 'Content-Type': 'application/json' } }).subscribe((res: any) => {
          console.log(res)
   
        }, error => {
          console.log(error);
        }
        );
      });

    })
    // setTimeout(() => {
    var message;
    if (this.unitsuccessarray.length == 1) {
      message = 'Unit Created Successfully'
    }
    else if (this.unitsuccessarray.length > 1) {
      message = this.unitsuccessarray.length + '-' + 'Units Created Successfully'
    }
        Swal.fire({
          title:message,
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {

              this.viewAssnService.dashboardredirect.next(result)
              // this.getAssociationDetails();
              this.viewAssnService.enrlAsnEnbled = false;
              this.viewAssnService.vewAsnEnbled = true;
              this.viewAssnService.joinAsnEbld = false;
  
              //localStorage.setItem('AssociationBlockHrefDetail', '');
  
            } 
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
    Object.keys(this.panform.controls).forEach(field => {
      const control = this.panform.get(field);
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
      this.demo1TabIndex = this.demo1TabIndex + 1;
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

    if (this.firstLetter == this.fifthLetter) {
      this.demo1TabIndex = this.demo1TabIndex + 1;

    }

  }

  
// i:number;
  blocksfields(event,i,fieldname){
    this.detailsdata[i][fieldname]["clicked"]=true;
  }
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
        })

    }, error => {
      console.log(error);
    }
    );


  
  }
  movetonexttab(event){
    this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  unitdetails ={}
  blockssuccessarray;
  createblocksdetails(event) {
    console.log(this.blocksArray)
    this.blockssuccessarray = this.blocksArray.length;
    // if (this.blocksdetailsform.valid) {
      
     

      this.blocksArray.forEach((element,index) => {
        ((index) => {
          setTimeout(() => {

        this.blockdetailsidvise(element);
  
      
        let blockArraylength = (Number(this.jsondata.blocks[0].BLNofUnit))
        
        this.finalblockname.push(this.jsondata.blocks[0].BLBlkName);
    
    
       for (var i = 0; i < blockArraylength; i++) {
        let data = JSON.parse(JSON.stringify(this.unitsrowjson))

        data.Id = this.jsondata.blocks[0].BLBlkName+i+1;
        console.log(data.Id)
        //  data.id=i+1;
        //  this.unitdetails[i] ={}
        //  Object.keys(data).forEach(datails=>{
        //    this.unitdetails[i][datails] ={required:true};
        //  })
         if (!this.unitlistjson[this.jsondata.blocks[0].BLBlkName]) {
           this.unitlistjson[this.jsondata.blocks[0].BLBlkName] = []
         }
         this.unitlistjson[this.jsondata.blocks[0].BLBlkName].push(data)
       }
      }, 3000 * index)
    })(index)
      })
      
      console.log(this.unitlistjson)
      var message;
      if(this.blockssuccessarray==1){
        message = 'Block Created Successfully'
  
      }
     else if(this.blockssuccessarray>1){
      message = this.blockssuccessarray+'-'+'Blocks Created Successfully'
      }
      Swal.fire({
        title: message,
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
      // console.log(this.unitlistjson)
      // Object.keys(this.unitlistjson).forEach(element=>{
       
      //   console.log(element)
        
      //   this.unitlistjson[element].forEach((unit,index) => {
      //    console.log(unit)
      //    console.log(element)
      //    console.log(index)
      //    console.log(typeof unit['blockid'])
      //    unit['id'] = unit['blockid']+index+1;
         
      // })
      // console.log(this.unitlistjson)
        
      // // console.log(this.unitlistjson)
      //   })
      this.demo1TabIndex = this.demo1TabIndex + 1;
    // }
    // else {
    //   this.validateAllBlocksDetailsFormFields(this.blocksdetailsform); //{7}
    // }
  

  }
  manualunitdetailsclick(ev) {
    document.getElementById('unitmanualbulk').style.display = 'none'
    document.getElementById('unitshowmanual').style.display = 'block';
  }
  uploadblocks() {
    document.getElementById("file_upload_id").click();
  }

    excelBlockList=[];
    ShowExcelUploadDiscription=true;
    ShowExcelDataList=false;
    
    blockfile:File
    blockarrayBuffer:any;
  filelist1:any;

    onFileChange(ev){
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
                 
            this.filelist1 = [];    
      let blockslength=Number(this.noofblocks)
      //for checking purpose blockbulkupload code commenting below
      if (this.excelBlockList.length <= blockslength) {
        this.excelBlockList.forEach((list, i) => {
          this.detailsdata[i] = {}
          Object.keys(list).forEach(datails => {
            this.detailsdata[i][datails] = { required: true };
          })
          this.blocksArray.push(list);
          console.log(this.blocksArray)
        });
        document.getElementById('upload_excel').style.display ='none'

        document.getElementById('showmanual').style.display ='block';
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
  getUnitName(Id, flatno) {
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
  }
  getunittype(Id, unittype){
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
  }
  getownershipstatus(Id, ownershipstatus){
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
  }
  getownerfirstname(Id, ownerfirstname) {
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
  }
  getownerlastname(Id, ownerlastname) {
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
  }
  getownermobilenumber(Id, ownermobilenumber) {
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
  }
  getowneremaiid(Id, owneremaiid) {
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
  }
  gettenantfirstname(Id, tenantfirstname) {
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
  }
  gettenantlastname(Id, tenantlastname) {
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
  }
  gettenantmobilenumber(Id, tenantmobilenumber) {
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
  }
  gettenantemaiid(Id, tenantemaiid) {
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
  }
  excelunitsuploaddata(exceldata){

    this.finalblockname.forEach(blkname => {
    
      exceldata.forEach((unitonce,i) => {

        console.log(exceldata.Id)
        // this.unitdetails[i] ={}
        // Object.keys(unitonce).forEach(datails=>{
        //   console.log(datails)
        //   this.unitdetails[i][datails] ={required:true};
        // })
        if (blkname == unitonce.blockname) {
          //  this.blockdetailsfinalresponce.forEach(obj=>{
          //    unitonce.blockid = obj

          //  })
          this.blocksArray.forEach((element,index) => {
            if(element.blockname==blkname){
            let unitslength=Number(element.units)

              if(exceldata.length<=unitslength){
                unitonce.Id = blkname+i+1;
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
    console.log("unit data what contains",this.unitlistjson)
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

submitforblocksbulkupload(ev){
  document.getElementById('manualbulk').style.display ='none'
  document.getElementById('upload_excel').style.display ='block';
}
submitforbulkupload(ev){
  document.getElementById('unitshowmanual').style.display ='none'
  document.getElementById('unitupload_excel').style.display ='block';
}
cancelbulkupload(ev){
  document.getElementById('upload_excel').style.display ='none';
  document.getElementById('manualbulk').style.display ='block'
}
cancelunitsbulkupload(ev){
  document.getElementById('unitupload_excel').style.display ='none';
  document.getElementById('unitshowmanual').style.display ='block'
}
  detailsdata ={}
  
  submitforconformblockdetails(event){
    for (var i = 0; i < this.associationfinalresult.data.association.asNofBlks; i++) {
        var data = JSON.parse(JSON.stringify(this.rowjson))
        this.detailsdata[i] ={}
        Object.keys(data).forEach(datails=>{
          this.detailsdata[i][datails] ={required:true};
        })
        this.blocksArray.push(data);
        console.log(this.blocksArray)
  
      }
      // this.blockDetailsgenerateform();
      document.getElementById('manualbulk').style.display ='none'

       document.getElementById('showmanual').style.display ='block';
      // this.demo1TabIndex = this.demo1TabIndex + 1;

  }
  submitassociationcreation(event,blocksnum) {
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
          "ASNofUnit": totalnoofuits,
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
      console.log(this.blocksArray)
      },error=>{
       console.log(error);
      }
      );
  
   
      this.demo1TabIndex = this.demo1TabIndex + 1;
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
    this.uploadPanForm.reset();
    this.uploadPANCardThumbnail='';
    this.pancardnameoriginal=false

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
  resetStep5(ev){
    Object.keys(this.unitlistjson).forEach(element=>{
      console.log(this.unitlistjson[element])
      
      this.unitlistjson[element].forEach(unit => {
       console.log(unit)

      })
    })

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
