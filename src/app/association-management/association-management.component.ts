import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { ViewAssociationService } from '../../services/view-association.service';
import { GlobalServiceService } from '../global-service.service';
import { Router,ActivatedRoute,ParamMap } from '@angular/router';
import { Amenity } from '../models/amenity';
import { ViewChild } from '@angular/core';
import { Bank } from '../models/bank';
import { BlocksByAssoc } from '../models/blocks-by-assoc';
import{Sendrequest} from '../models/sendrequest';
import Swal from 'sweetalert2';
import { OrderPipe } from 'ngx-order-pipe';
import {DashBoardService} from '../../services/dash-board.service';
import {HomeService} from '../../services/home.service';
import { formatDate } from '@angular/common';
import { ViewUnitService } from '../../services/view-unit.service';
import { AddBlockService } from '../../services/add-block.service';
import {BlockArrayDetail} from '../../app/models/block-array-detail';
import {UnitArray} from '../models/unit-array'
import * as _ from 'underscore';


declare var $: any;


@Component({
  selector: 'app-association-management',
  templateUrl: './association-management.component.html',
  styleUrls: ['./association-management.component.css']
})

export class AssociationManagementComponent implements OnInit {
  modalRef: BsModalRef;
  assnID:any;
  @Input() amenityType: string;
  @Input() amenityNo: string;
  enrollAssociation: boolean;
  joinAssociation: boolean;
  viewAssociation_Table: boolean;
  private newAttribute: any = {};

  //crtAssn:CreateAssn;
  selectedFile: File;
  @ViewChild('viewassociationForm',{static:true}) viewassociationForm: any;
  accountID: number;
  currentAssociationID: string;
  associations: any = [];
  crtAssn: any = {};
  am: any = {};
  bankDetails: any ={};
  createAsssociationData: any = {};
  association: any = {};
  amenity: any = {};
  bank: any = {};
  PANdiv1: boolean = false;
  PANdiv2: boolean = false;
  amenityDetails: boolean = false;
  amenities: Amenity[];
  bankites: Bank[];
  newBank: Bank;
  config: any;
  AmenityT: string;
  AmenityN: string;
  AmenityId: string;
  Bankname: string;
  IFSC: string;
  AccountNumber: string;
  accountType: string;
  AmenityType: string;
  AmenityNo: number;
  logo: boolean = false;
  senddata: Sendrequest;
  EXPyCopy: string;
  dynamic: number;
  currentAssociationName: string;
  submitted = false;
  modal: any = {};
  filesize: boolean;
  isLargefile: boolean;
  disableButton: boolean;
  isnotValidformat: boolean;
  _validFileExtensions = [".bmp", ".gif", ".png"];
  viewassociationRow: any = {};
  associationname: string;
  propertyName: string;
  locality: string;
  NoofUnits: number;
  country: string;
  pincode: number;
  State: string;
  propertyType: string;
  blocks: number;
  panno: string;
  regno: string;
  BankName: string;
  panNo: string
  panDuplicate: boolean = false;
  file: string;
  city: string;
  pandoc: string;
  isNotValid: boolean;
  asAssnID: number;
  gstno: string;
  firstLetter: string;
  fifthLetter: string;
  editassndata: object;
  BankId:number;
  unUnitID:any;
  blockname:any;
 
  
  //  firstLetter = crtAssn.name.charAt(0).toUpperCase();
  //   fifthLetter = this.panNo.charAt(4).toUpperCase();


  ASAsnName: string;
  ASCountry: string;
  ASAddress: string;
  ASCity: string;
  ASState: string;
  ASPinCode: string;
  ASPrpType: string;
  ASAcntType: string;
  ASPrpName: string;
  ASNofBlks: string;
  ASNofUnit: string;
  AMType: string;
  NoofAmenities: string
  BABName: string;
  BankN: string;
  BAIFSC: string;
  BAActNo: string;
  BAActType: string;
  AMID: number;
  BAActID: number;
  newBABName: any;
  newBAIFSC: any;
  newAMTypes: any;
  newNoofAmenitie:string;
  newBAActNo: string;
  newBAActType: string;
  allBlocksLists:BlocksByAssoc[];
  allUnitBlockID:any[];
  accountTypes:object[];
  bankings: any;
  blockID: any;
  UOFName: string;
  UOLName: string;
  UOMobile: string;
  UOEmail: string;
  unitId:string;
  UTFName: string;
  UTLName: any;
  UTMobile: string;
  UTEMail: string;
  UNUnitID: number;
  name: string;
  lastname: string;
  mobile: string;
  email: string;
  nameS: string;
  lastnameS: string;
  mobileS: string;
  emailS: string;
  tname: string;
  tlastname: string;
  tmobile: string;
  temail: string;

  joinownername:string;
  joinownerlastname:string;
  joinownermobile:string;
  joinowneremail:string;

  matching:boolean;
  currentPage:number;
  page: number;
  p: number=1;
  
  newamenities:any[];

  togglevalidateGST:boolean;
  defaultThumbnail: string;
  defaultPanThumbnail: string;

  order: string = 'asAsnName';
  reverse: boolean = false;
  sortedCollection: any[];
  _associations: any;
  UNOcSDate:any;
  bsConfig:any;

  dtOptions: DataTables.Settings = {};

  items = ['Java', 'Spring', 'API'];
  public searchTxt: any;
  public obj: any = [
    { 'name': 'Developement', 'email': 'HRIS', 'age': '34', 'city': 'Noida, UP, India' },
    { 'name': 'HRIS', 'email': 'php', 'age': '34', 'city': 'Noida' },
    { 'name': 'QA', 'email': 'Wordpress', 'age': '34', 'city': 'Noida' },
    { 'name': 'Testing', 'email': 'java', 'age': '34', 'city': 'Noida' },
    { 'name': 'Office', 'email': 'Codeingiter', 'age': '34', 'city': 'Noida' },
    { 'name': 'Marketing', 'email': 'API', 'age': '34', 'city': 'Noida' },
    { 'name': 'Finacial', 'email': 'Spring', 'age': '34', 'city': 'Noida' },
    { 'name': 'Sales', 'email': 'Laravel', 'age': '34', 'city': 'Noida' },
    { 'name': 'Exceutive', 'email': 'jQuery', 'age': '34', 'city': 'Noida' }
  ];

  userlist: any[] = [];
  assnName:any;
  blBlkName:any;
  activeEnabled:boolean;
  OwnerType:any;
  account:any;
  toggleFaCircleO:boolean;
  toggleFaCircle1:boolean;
  amType:any;
  noofAmenities:any;
  minDate:any;
  newdate:any;
  toggleGSTAvailableTxt:any;
  ASPropType:any;
  blocktype: string;
  blocktypeID: any;
  noofunits: string;
  mngName: string;
  BlockManagermobile: string;
  manageremail: string;
  maintenanceValue: number;
  flatRatevalue: number;
  frequency: string;
  billGenerationDate: Date;
  latePymtChargeType: string;
  latePymtChargeTypeId:any;
  latePymtCharge: string;
  startsFrom: Date;
  dueDate: string;
  check: any;
  check1: any;
  addRate: string;
  addRate1: string;
  invoicedatechanged: boolean;
  minDateinNumber: number;
  duedatechanged: boolean;
  dueDateinNumber: number;
  enableduedatevalidation: boolean;
  startsFromMaxDate: Date;
  startsfromDateChanged: boolean;
  startsFromMaxDateinNumber: number;
  enablestartfromdatevalidation: boolean;
  blocktypes: { 'name': string; 'displayName': string; }[];
  frequencies: { "name": string; "displayName": string; }[];
  latePymtChrgTypes: { "name": string; "displayName": string; }[];
  meter: string;
  blockArray: BlockArrayDetail[];
  unitArray: UnitArray[];
  unitArrayList:any[];
  unitTypes:object[];
  unitType: any;
  calculationTypes:object[];
  calculationtype: any;
  occupencys:object[];
  occupency: any;
  tenantDetails: boolean;
  ownerDetails: boolean;
  toggleunitvehicleinformation: boolean;
  groupedArray:any;
  BlockHrefDetail:any[];
  enableCreateUnitWithAssociation:boolean;
  selectedFile1: File
  UnitIDforJoinAssn: any;

  constructor(private modalService: BsModalService,
    public viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private router: Router,
    private route:ActivatedRoute,
    private orderpipe: OrderPipe,
    public viewUniService: ViewUnitService,
    private dashboardservice:DashBoardService,
    private homeservice:HomeService,
    private addblockservice: AddBlockService) {
    this.enableCreateUnitWithAssociation=false;
    this.meter='sqft';
    this.blockArray=[];
    this.unitArray=[];
    this.unitArrayList=[];
    this.BlockHrefDetail=[];
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
      }];
      
      this.invoicedatechanged = false;
      this.duedatechanged = false;
      this.enableduedatevalidation = false;
      this.startsfromDateChanged = false;
      this.enablestartfromdatevalidation = false;
    this.BAActType='Select Account Type';
    this.ASCountry='Country';
    this.ASPropType='Select Property Type';
    this.toggleFaCircleO=false;
    this.toggleFaCircle1=false;
    this.viewAssnService.enrlAsnEnbled=false;
    this.viewAssnService.vewAsnEnbled=true;
    this.viewAssnService.joinAsnEbld=false;
    this.isLargefile = false;
    this.isnotValidformat = false;
    this.disableButton = false;
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };

    //alert('test');
    this.enrollAssociation = false;
    this.joinAssociation = false;
    if (this.dashboardservice.toggleViewAssociationTable) {
      //console.log('test1');
      this.enrollAssociation = true;
      this.viewAssociation_Table = true;
      if (this.dashboardservice.enrollassociationforresident) {
        this.viewAssociation_Table = false;
        //console.log('test2');
      }
      this.joinAssociation = false;
      this.homeservice.toggleviewassociationtable = false;
    }
    if (!this.dashboardservice.toggleViewAssociationTable) {
      //console.log('test3');
      this.enrollAssociation = false;
      this.viewAssociation_Table = false;
      this.joinAssociation = true;
    }
    if (this.homeservice.toggleviewassociationtable) {
      //console.log('test4');
      this.viewAssociation_Table = true;
      this.joinAssociation = false;
      this.enrollAssociation = false;
      //alert('joinAssociation');
    }

    //   this.route.params.subscribe(data=>{
    //     //console.log(data['asAssnID']);
    //     this.viewAssnService.getBlockDetailsByAssociationID(data['asAssnID']) 

    // .subscribe(res => {
    //   //console.log(res);
    //     var data: any = res;
    //     this.allBlocksLists= res['data']['blocksByAssoc'];
    //     //console.log(this.allBlocksLists);
    // });
    this.crtAssn.newBABName = '';
    this.crtAssn.newBAIFSC = '';
    this.crtAssn.newBAActNo = '';
    this.crtAssn.newBAActType = '';

    this.crtAssn.GSTNumber = '';
    this.crtAssn.email = '';
    this.crtAssn.url = '';

    this.association = '';

    this.isLargefile = false;
    this.amenities = [];

    this.AmenityT = '';
    this.AmenityN = '';
    this.AmenityId = '';

    this.bankites = [];
    this.BankN = '';
    this.IFSC = '';
    this.AccountNumber = '';
    this.accountType = '';
    this.newBABName = '';
    this.newBAIFSC = '';
    this.newAMTypes = '';
    this.newNoofAmenitie = '';
    this.unitId = '';
    this.assnName='Associations';
    this.blBlkName='Blocks';
    this.activeEnabled=false;
    this.unUnitID=this.globalService.getCurrentUnitId();

    this.blockname='';
    this.blocktype = 'Select Block';
    this.noofunits='';
    this.mngName='';
    this.BlockManagermobile='';
    this.manageremail='';
    this.maintenanceValue=0;
    this.flatRatevalue=0;
    this.frequency = '';
    this.latePymtChargeType = 'SELECT CHARGE TYPE';
    this.latePymtCharge='';



    this.accountTypes = [
      { "name": "SAVINGS" },
      { "name": "CURRENT" }
    ];

    this.currentPage = 1;

    this.accountID = this.globalService.getacAccntID();
    this.newamenities = [];
    this.defaultThumbnail = '../../assets/images/default_thumbnail.png';
    this.defaultPanThumbnail = '../../assets/images/default_panthumbnail copy.png';
    this.ASAsnName = '';
    this.assnID = this.globalService.currentAssociationId;
    this.UNOcSDate = '';
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-orange',
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
    });
    this.toggleGSTAvailableTxt=true;
    this.unitTypes = [
      { "name": "Flat" },
      { "name": "Villa" },
      { "name": "Vaccant Plot" }
    ];
    this.calculationTypes = [
      { "name": "FlatRateValue","displayName":"Flat Rate Value" },
      { "name": "dimension","displayName":"Dimension Based"  }
    ];
    this.occupencys = [
      { "name": "Sold Owner Occupied Unit" },
      { "name": "Sold Tenant Occupied Unit" },
      { "name": "Sold Vacant Unit" },
      { "name": "UnSold Vacant Unit" },
      { "name": "UnSold Tenant Occupied Unit" }
    ];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngAfterViewInit() {
    this.toggleStepWizrd();
  }
  getUnitType(unitTpname,_id) {
    console.log(unitTpname);

    for (let i = 0; i < this.BlockHrefDetail.length; i++) {
      for (let j = 0; j < this.BlockHrefDetail[i]['UnitArray'].length; j++) {
        if (this.BlockHrefDetail[i]['UnitArray'][j]['_id'] == _id) {
          this.BlockHrefDetail[i]['UnitArray'][j]['_unitType'] = unitTpname;
        }
      }
    }
    console.log(this.BlockHrefDetail);
  }
  getCalculationTypes(calculationTypename,_id) {
    console.log(calculationTypename);
    this.calculationtype = calculationTypename;
    for (let i = 0; i < this.BlockHrefDetail.length; i++) {
      for (let j = 0; j < this.BlockHrefDetail[i]['UnitArray'].length; j++) {
        if (this.BlockHrefDetail[i]['UnitArray'][j]['_id'] == _id) {
          this.BlockHrefDetail[i]['UnitArray'][j]['_calculationtype'] = calculationTypename;
        }
      }
    }
    console.log(this.BlockHrefDetail);
  }
  tenantOwnerdiv(occupency,_id) {
    this.occupency=occupency;
    for (let i = 0; i < this.BlockHrefDetail.length; i++) {
      for (let j = 0; j < this.BlockHrefDetail[i]['UnitArray'].length; j++) {
        if (this.BlockHrefDetail[i]['UnitArray'][j]['_id'] == _id) {
          this.BlockHrefDetail[i]['UnitArray'][j]['_occupency'] = occupency;
        }
      }
    }
    console.log(this.BlockHrefDetail);  

    this.occupencys.forEach(item => {
      if (occupency == 'UnSold Vacant Unit') {
        this.tenantDetails = false;
        this.ownerDetails = false;
        this.toggleunitvehicleinformation=false;
      }
      else if (occupency == 'UnSold Tenant Occupied Unit') {
        this.tenantDetails = true;
        this.ownerDetails = false;
        this.toggleunitvehicleinformation=true;
      }
      else if (occupency == 'Sold Tenant Occupied Unit') {
        this.tenantDetails = true;
        this.ownerDetails = true;
        this.toggleunitvehicleinformation=true;
      }
      else {
        this.tenantDetails = false;
        this.ownerDetails = true;
        this.toggleunitvehicleinformation=true;
      }
    })
  }
  countryName(countryName) {
    this.ASCountry = countryName;
  }
  createUnit() {
    console.log(this.BlockHrefDetail);
    for (let i = 0; i < this.BlockHrefDetail.length; i++) {
      for (let j = 0; j < this.BlockHrefDetail[i]['UnitArray'].length; j++) {
        if(this.BlockHrefDetail[i]['UnitArray'][j]['_unitno'] != ''){
        ((j) => {
          setTimeout(() => {
            let createUnitData =
            {
              "ASAssnID": this.globalService.getCurrentAssociationId(),
              "ACAccntID": this.globalService.getacAccntID(),
              "units": [
                {
                  "UNUniName": this.BlockHrefDetail[i]['UnitArray'][j]['_unitno'],
                  "UNUniType": this.BlockHrefDetail[i]['UnitArray'][j]['_unitType'],
                  "UNRate": this.BlockHrefDetail[i]['UnitArray'][j]['_unitrate'],
                  "UNOcStat": this.BlockHrefDetail[i]['UnitArray'][j]['_occupency'],
                  "UNOcSDate": "2019-03-02",
                  "UNOwnStat": "null",
                  "UNSldDate": "2019-03-02",
                  "UNDimens": this.BlockHrefDetail[i]['UnitArray'][j]['_unitdimension'],
                  "UNCalType": this.BlockHrefDetail[i]['UnitArray'][j]['_calculationtype'],
                  "BLBlockID": this.BlockHrefDetail[i]['UnitArray'][j]['_BlockID'],
                  "Owner":
                    [{
        
                      "UOFName": this.BlockHrefDetail[i]['UnitArray'][j]['_ownerFirtname'],
                      "UOLName": this.BlockHrefDetail[i]['UnitArray'][j]['_ownerLastname'],
                      "UOMobile": this.BlockHrefDetail[i]['UnitArray'][j]['_ownerMobnumber'],
                      "UOISDCode": "+91",
                      "UOMobile1": "",
                      "UOMobile2": "null",
                      "UOMobile3": "null",
                      "UOMobile4": "null",
                      "UOEmail": this.BlockHrefDetail[i]['UnitArray'][j]['_ownerEmail'],
                      "UOEmail1": "",
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
                    "BLBlockID": this.BlockHrefDetail[i]['UnitArray'][j]['_BlockID']
                  },
                  "Tenant":
                    [{
        
                      "UTFName": this.BlockHrefDetail[i]['UnitArray'][j]['_tenantFirtname'],
                      "UTLName": this.BlockHrefDetail[i]['UnitArray'][j]['_tenantLastname'],
                      "UTMobile": this.BlockHrefDetail[i]['UnitArray'][j]['_tenantMobnumber'],
                      "UTISDCode": "+91",
                      "UTMobile1": "",
                      "UTEmail": this.BlockHrefDetail[i]['UnitArray'][j]['_tenantEmail'],
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
          },600 * j)
        })(j)
      }
      }
    }
    setTimeout(() => {
      Swal.fire({
        title: 'Unit Created Successfully',
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {

          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        })
    },600 * (this.BlockHrefDetail.length+this.unitArray.length));
  }
  onPageChange(event) {
    //console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if(event['srcElement']['text'] != '1'){
      this.p= Number(event['srcElement']['text'])-1;
    } 
    if(event['srcElement']['text'] == '«'){
      this.p= 1;
    }
  }
  pageChanged(event: any): void {
    this.page = event.page;
  }
  getAccountType(accounttypeName) {
    this.BAActType = accounttypeName;
  }
  enblEnrlAsnVew() {
    ////console.log('test');
    //alert('test');
    this.toggleStepWizrd();
    this.viewAssnService.enrlAsnEnbled=true;
    this.viewAssnService.vewAsnEnbled=false;
    this.viewAssnService.joinAsnEbld=false;
  }
  toggleIsGSTAvailable() {
    // console.log('test');
    this.toggleGSTAvailableTxt = !this.toggleGSTAvailableTxt;
    if (this.toggleGSTAvailableTxt) {
      (<HTMLInputElement>document.getElementById('GSTNumberID')).value='';
      (<HTMLInputElement>document.getElementById('PANNumberID')).value='';
      (<HTMLInputElement>document.getElementById('PANNumberID')).disabled=false;
      // console.log((<HTMLInputElement>document.getElementById('PANNumberID')));
    }
  }
  fillPANValue(){
    let PANNumberIDCtrl=document.getElementById('PANNumberID');
    // console.log(PANNumberIDCtrl);
    if(!this.toggleGSTAvailableTxt){
      // console.log(this.crtAssn.GSTNumber.length);
      if(this.crtAssn.GSTNumber.length == 15){
        // console.log(this.crtAssn.GSTNumber.substring(2,12));
        this.crtAssn.PANNumber=this.crtAssn.GSTNumber.substring(2,12);
        PANNumberIDCtrl.setAttribute('disabled','true');
      }
    }
  }
  enblJoinAsnVew() {
    this.viewAssnService.enrlAsnEnbled=false;
    this.viewAssnService.vewAsnEnbled=false;
    this.viewAssnService.joinAsnEbld=true;
  }
  viewassociation(repviewreceiptmodalit: any) {
    //console.log(JSON.stringify(repviewreceiptmodalit));
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    this.viewassociationRow = {
      associationname: repviewreceiptmodalit.ASAsnName,
      propertyName: repviewreceiptmodalit.ASPrpName,
      locality: repviewreceiptmodalit.ASAddress,
      NoofUnits: repviewreceiptmodalit.ASNofUnit,
      calculationType: repviewreceiptmodalit.unCalType,
      ownershipStatus: repviewreceiptmodalit.unOwnStat
    };
  }
  
  onUpLoad() {

    const fd = new FormData();
    fd.append('image', this.selectedFile, this.EXPyCopy);
    this.viewAssnService.onUpLoad(fd)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
          this.dynamic = Math.round(event.loaded / event.total * 100);
        }
        else if (event.type === HttpEventType.Response) {
          //console.log(event);
          this.dynamic = 0;
        }
      });
  }
  // getAmenities(amenities: object) {

  //   this.amenities.push(new Amenity(amenities['AmenityT'], amenities['AmenityN'], amenities['AmenityId']));
  //   this.AmenityT = '';
  //   this.AmenityN = '';
  //   //console.log('amenities', this.amenities);
  // }

  deleteamenity(AMType) {
    //console.log('AMType', AMType);
    this.newamenities = this.newamenities.filter(item =>{return item['AMType'] != AMType});
  }
  // getBank(bankities: object) {

  //   this.bankites.push(new Bank(bankities['BankName'], bankities['IFSC'], bankities['AccountNumber'], bankities['accountType'], bankities['BankId']));
  //   this.BankName = '';
  //   this.IFSC = '';
  //   this.AccountNumber = '';
  //   this.accountType = '';
  //   //console.log('bankites', this.bankites);
  // }
  prerequisitesAddUnit(blBlockID,blBlkName) {
    //console.log('prerequisitesAddUnit', blBlockID);
    this.blockID = blBlockID;
    this.blBlkName=blBlkName;
    let blockbyassoc = this.allBlocksLists.find(item => item['blBlockID'] == blBlockID);
    this.getAllUnitDetailsByBlockID(blBlockID);
    this.toggleFaCircle1=true;
  }

  getAllUnitDetailsByBlockID(blBlockID) {
    //console.log('blockid', blBlockID);
    this.allUnitBlockID=[];
    //this.route.params.subscribe(data=>{console.log(data['blBlockID']);
    this.viewAssnService.GetUnitListByBlockID(blBlockID)
      .subscribe(res => {
        var data: any = res;
        console.log(res);
        this.allUnitBlockID= data.data.unitsByBlockID;
        //console.log('allUnitBlockID',this.allUnitBlockID);
        //console.log(res);
        // console.log('allUnitBYBlockID',data);
        // this.allUnitBYBlockID = data['data'].unitsByBlockID;
      });

  }

  // deleteBank(BankId) {
  //   console.log('BankId', BankId);
  //   this.bankites = this.bankites.filter(item => item['BankId'] != BankId);
  // }
  openViewAssociation(viewreceiptmodal: TemplateRef<any>, asAsnName, asPrpName, asAddress, asNofUnit, aSCountry, asPinCode, asState, asPrpType, asNofBlks, aspanNum, asRegrNum, asAsnLogo, asCity, aspanDoc, asAssnID, asgstNo) {
    //console.log(asAsnName);
    //console.log(asPrpName);
    //console.log(asAddress);
    //console.log(asNofUnit);
    //console.log(aSCountry);
    //console.log(asPinCode);
    //console.log(asState);
    //console.log(asPrpType);
    //console.log(asRegrNum);
    //console.log(asAsnLogo);
    //console.log(asCity);
    //console.log(asAsnLogo);
    //console.log(aspanDoc);
    //console.log('asAssnID', asAssnID);
    //console.log(asgstNo);

    this.viewAssnService.getAssociationDetail(asAssnID)
      .subscribe(data => {
        //console.log('bank', data['data']['association']['bankDetails'].length);
        //console.log('getAssociationDetail', data['data']['association']['amenities'][0]['amType']);
        //this.amenityType = data['data']['association']['amenities'][0]['amType'];
       // console.log('getAssociationDetail', data['data']['association']['amenities'][0]['noofAmenities']);
        //this.amenityNo = data['data']['association']['amenities'][0]['noofAmenities'];

        this.BankName = '';
        this.IFSC = '';
        this.AccountNumber = '';
        this.accountType = '';

        if (data['data']['association']['bankDetails'].length > 0) {

          //console.log('getAssociationDetail', data['data']['association']['bankDetails'][0]['babName']);
          this.BankName = data['data']['association']['bankDetails'][0]['babName'];
          //console.log('getAssociationDetail', data['data']['association']['bankDetails'][0]['baifsc']);
          this.IFSC = data['data']['association']['bankDetails'][0]['baifsc'];
          this.AccountNumber = data['data']['association']['bankDetails'][0]['baActNo'];
          this.accountType = data['data']['association']['bankDetails'][0]['baActType'];
        }

      })


    this.associationname = asAsnName;
    this.currentAssociationID = asAssnID;
    this.propertyName = asPrpName
    this.locality = asAddress
    this.NoofUnits = asNofUnit;
    this.country = aSCountry;
    this.pincode = asPinCode;
    this.State = asState;
    this.propertyType = asPrpType;
    this.blocks = asNofBlks;
    this.panno = asCity;
    // this.regno=asRegrNum;
    this.file = asRegrNum;
    this.city = asAsnLogo;
    this.pandoc = aspanDoc;
    this.gstno = asgstNo;

    this.modalRef = this.modalService.show(viewreceiptmodal,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  UpdateAssociation(){
    
    //console.log("Updating Association");
    this.editassndata = {
      ASAsnName:this.ASAsnName,
      ASCountry:this.ASCountry,
      ASAddress:this.ASAddress,
      ASCity:this.ASCity,
      ASState:this.ASState,
      ASPinCode:this.ASPinCode,
      ASPrpType:this.ASPrpType,
      ASPrpName:this.ASPrpName,
      ASNofBlks:this.ASNofBlks,
      ASNofUnit:this.ASNofUnit,
      ASAssnID:this.asAssnID,
      "Amenities":[{
        AMType:this.AMType,
        NoofAmenities:this.NoofAmenities,
        AMID:this.AMID,
        ASAssnID:this.asAssnID
      }],
      "BankDetails":[{
        BABName:this.BABName,
        BAIFSC:this.BAIFSC,
        BAActType:this.BAActType,
        BAActNo:this.BAActNo,
        ASAssnID:this.asAssnID,
        BAActID:this.BAActID
      }]
  };
    console.log(this.editassndata);
    this.viewAssnService.UpdateAssociation(this.editassndata).subscribe(res => {
      //console.log("Done");
      //console.log(JSON.stringify(res));
      //alert("Association Created Successfully")
      this.modalRef.hide();
      Swal.fire({
        title: 'Association Updated Successfuly',
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {

          if (result.value) {
            //this.form.reset();
            //this.router.navigate(['home/association']);
            this.getAssociationDetails();

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['']);
          }
        })
    },
      err => {
        //console.log(err);
      });


  }

  ngOnInit() {
    this.check="true";
    this.check1="true";
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };

    let id = this.route.snapshot.paramMap.get('id');
    //console.log(id);
    //this.accountID="2";
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    this.getAssociationDetails();
    // this.getAssociationDetail();
    //this.firstLetter = this.crtAssn.asAsnName.charAt(0).toUpperCase();
    //this.firstLetter = this.crtAssn.aspanNum.charAt(4).toUpperCase();
    //console.log(this.firstLetter, this.firstLetter);
    // if (this.firstLetter == this.firstLetter) {
    //   this.matching = false;
    // } else {
    //   this.matching = true;
    // }

this.association="";
this.association="";
this.crtAssn.country='SELECT THE COUNTRY';
this.crtAssn.propertyType='SELECT PROPERTY TYPE';
this.crtAssn.newBAActType='';
    this.viewAssnService.getAssociationAllDetails()
    .subscribe(item => {
      //console.log('getAssociationAllDetails',item);
      this._associations= item['data']['associations'];
     //this.availableNoOfBlocks = item.length;
      //console.log('associations', this.associations);  

    })
  }
  getLatePymtChargeType(name,Id) {
    this.latePymtChargeType = name;
    this.latePymtChargeTypeId=Id;
    for (let i = 0; i < this.blockArray.length; i++) {
      if (this.blockArray[i]['Id'] == Id) {
          this.blockArray[i]['latePymtChargeType'] = this.latePymtChargeType;
      }
    }
    console.log(this.blockArray);
  }
  getBlockType(param,Id){
    this.blocktype=param;
    this.blocktypeID=Id;
    console.log(Id);
    console.log(typeof Id);
    for(let i=0;i<this.blockArray.length;i++){
      if(this.blockArray[i]['Id'] == Id){
        this.blockArray[i]['blocktype']=this.blocktype;
      }
    }
    console.log(this.blockArray);
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
  
  loadAssociation(asAssnID,asAsnName){
    this.blBlkName='Blocks';
    //console.log('asAssnID',asAssnID);
    this.assnName=asAsnName;
    this.assnID=asAssnID;
    this.viewAssnService.getBlockDetailsByAssociationID(asAssnID)
    .subscribe(response=>{
      //console.log(response);
     this.allBlocksLists= response['data']['blocksByAssoc'];
     if(this.allBlocksLists.length > 0){
       this.toggleFaCircleO=true;
     }
    })
  }
  setPropertyType(propertyType){
    this.crtAssn.propertyType=propertyType;
  }
  testCreateBlock(){
    console.log(this.blockArray);
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
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
  checkRate(rate, Id) {
    console.log(rate);
    for (let i = 0; i < this.blockArray.length; i++) {
      if (this.blockArray[i]['Id'] == Id) {
        if (rate == true) {
          this.blockArray[i]['flatRate'] = 'flatRatevalue';
        } else {
          this.blockArray[i]['flatRate'] = '';
        }
      }
    }
    console.log(this.blockArray);
  }

  checkRate1(rate1,Id) {
    console.log(rate1);
    for (let i = 0; i < this.blockArray.length; i++) {
      if (this.blockArray[i]['Id'] == Id) {
        if (rate1 == true) {
          this.blockArray[i]['dimension'] = 'dimension';
        } else {
          this.blockArray[i]['dimension'] = '';
        }
      }
    }
    console.log(this.blockArray);
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
  enableActive(spanCtrl, unUnitID) {
    this.UnitIDforJoinAssn=unUnitID;
    //console.log(spanCtrl);
    //spanCtrl.classList.add("active");
    spanCtrl.classList.toggle("active");
    //this.activeEnabled = true;
  }

  getAssociationDetails() {
    //console.log(this.accountID)
    this.viewAssnService.getAssociationDetails(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      //console.log(data.data.associationByAccount);
      this.associations = data.data.associationByAccount;
      console.log(this.associations);
      //
      this.sortedCollection = this.orderpipe.transform(this.associations, 'asAsnName');
      //console.log(this.sortedCollection);
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  // getAssociationDetail(){
  //   this.viewAssnService.getAssociationDetail()
  //   .subscribe(data=>{
  //     console.log('getAssociationDetail',data);
  //   })
  // }

  enroll() {
    this.enrollAssociation = true;
    this.joinAssociation = false;
    this.viewAssociation_Table = false;
  }


  join() {
    this.enrollAssociation = false;
    this.joinAssociation = true;
    this.viewAssociation_Table = false;
  }
  pan() {

    this.firstLetter = this.crtAssn.name.charAt(0).toUpperCase();
    this.fifthLetter = this.crtAssn.PANNumber.charAt(4).toUpperCase();
    //console.log(this.firstLetter, this.fifthLetter);
    if (this.firstLetter == this.fifthLetter) {
      
      this.matching = false;
    } else {
      
      this.matching = true;
    }

  }
  openPANfield(countryname) {
    this.crtAssn.country=countryname;
    if (this.crtAssn.country == "India") {
      this.PANdiv1 = true;
    }
    else {
      this.PANdiv1 = false;
    }
    if (this.crtAssn.country != "India") {
      this.PANdiv2 = true;
    }
    else {
      this.PANdiv2 = false;
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png'
      ) {
        if (event.target.files[0].size < 200 * 200) {// Checking height * width}
          if (event.target.files[0].size < 2000000) {// checking size here - 2MB}
          }
        }
      }
    }
  }
  addjoin(asAssnID){
    //console.log(asAssnID);
    this.router.navigate(['joinassociation',asAssnID]);
  }
  addAmenity(event) {
    //console.log('amenity',event);
    //console.log('AMType'+ event['AMType']);
    //console.log('NoofAmenities'+ event['NoofAmenities']);
    if(event['AMType'] !== "" && event['NoofAmenities'] !== ""){
       //alert('inside if condition null');
       this.newamenities.push(new Amenity(event['AMType'],event['NoofAmenities']));
    }
    //console.log('newamenities',this.newamenities);
  }

  // getBank(bankities: object) {

  //   addBank() {
  //   this.BankId += 1;
  //   this.addBankites.emit({ "BankName": this.BankName, "IFSC": this.IFSC,"AccountNumber": this.AccountNumber ,"accountType": this.accountType  });
  //   this.BankName = '';
  //   this.IFSC = '';
  //   this.AccountNumber='';
  //   this.accountType='';
   
  // }
 
  // deleteBank(BankId) {
  //   this.bankites.splice(BankId, 1);
  // }this.bankites.push(new Bank(bankities['BankName'], bankities['IFSC'], bankities['AccountNumber'], bankities['accountType'], bankities['BankId']));
  //   this.BankName = '';
  //   this.IFSC = '';
  //   this.AccountNumber = '';
  //   this.accountType = '';
  //   console.log('bankites', this.bankites);
  // }
    
  addBank() {
        this.BankId += 1;
        this.bankings.push({"newBABName": this.newBABName, "newBAIFSC":this.newBAIFSC, "newBAActNo":this.newBAActNo, "newBAActType":this.newBAActType})
        this.newBABName = '';
        this.newBAIFSC = '';
        this.newBAActNo = '';
        this.newBAActType = '';        
    }

    deleteBank(BankId) {
        this.bankings.splice(BankId, 1);
    }

    // onFileChanged(event) {
    //   this.selectedFile = event.target.files[0];
    //   this.http.post('my-backend.com/file-upload', this.selectedFile)
    //   .subscribe(...);
    // }

  onFileSelected(event) {
    this.isLargefile = false;
    this.isnotValidformat = false;
    this.disableButton = false;
    this.selectedFile = <File>event.target.files[0];
    //console.log('file type', this.selectedFile['type']);

    if (this.selectedFile['type'] == "application/zip") {
      //console.log('inside file type');
      this.isnotValidformat = true;
      this.disableButton = true;
    }

    if (this.selectedFile['size'] > 2000000) {
      //console.log('inside file size');
      this.isLargefile = true;
      this.disableButton = true;
    }
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("assosnlogoimgthumbnail");
    let splitarr = this.selectedFile['name'].split('.')
    let currentdate = new Date();
    let expycopy = splitarr[0] + '_' + currentdate.getTime().toString() + '.' + splitarr[1];

    let reader  = new FileReader();

    reader.onloadend = function () {
      imgthumbnailelement.src  = reader.result as string;;
    }
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    } else {
      imgthumbnailelement.src = "";
    }

    this.EXPyCopy = expycopy;
  }
  deleteAmenity(index) {
    this.amenities.splice(index, 1);
  }

  //dropdownassociationlist. associations
  onFilSelected(event) {
    this.isLargefile = false;
    this.isnotValidformat = false;
    this.disableButton = false;
    this.selectedFile = <File>event.target.files[0];
    //console.log('file type', this.selectedFile['type']);
    if (this.selectedFile['type'] == "application/zip") {
      //console.log('inside file type');
      this.isnotValidformat = true;
      this.disableButton = true;
    }
    if (this.selectedFile['size'] > 2000000) {
      //console.log('inside file size');
      this.isLargefile = true;
      this.disableButton = true;
    }
    
    let imgpanthumbnailelement = <HTMLInputElement>document.getElementById("assosnpanimgthumbnail");
    let splitarr = this.selectedFile['name'].split('.')
    let currentdate = new Date();
    let expycopy = splitarr[0] + '_' + currentdate.getTime().toString() + '.' + splitarr[1];
    let reader  = new FileReader();
   
    
    reader.onloadend = function () {
      // imgthumbnailelement.src  = reader.result as string;
      imgpanthumbnailelement.src  = reader.result as string;
    }
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    } else {
      // imgthumbnailelement.src = "";
      imgpanthumbnailelement.src = "";
    }
  }


  removeSelectedfile() {
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("assosnlogoimgthumbnail");
    imgthumbnailelement.src = this.defaultThumbnail;

    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
    dataTransfer.items.add('', '');
    //console.log('dataTransfer', dataTransfer);
    const inputElement: HTMLInputElement = document.getElementById('viewassosnuploadFileinput') as HTMLInputElement;
    //console.log('inputElement', inputElement.files);
    inputElement.files = dataTransfer.files;
    this.disableButton = false;
    this.isnotValidformat = false;
    this.isLargefile = false;
  }
  removePanfile() {
    let imgpanthumbnailelement = <HTMLInputElement>document.getElementById("assosnpanimgthumbnail");
   imgpanthumbnailelement.src = this.defaultPanThumbnail;

    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
    dataTransfer.items.add('', '');
    //console.log('dataTransfer', dataTransfer);
    const inputElements: HTMLInputElement = document.getElementById('uploadPaninput') as HTMLInputElement;
    //console.log('inputElement', inputElements.files);
    inputElements.files = dataTransfer.files;
    this.disableButton = false;
    this.isnotValidformat = false;
    this.isLargefile = false;
  }

  countries: any = [
    { "name": "Afghanistan" }, { "name": "Algeria" }, { "name": "Argentina" }, { "name": "Australia" }, { "name": "Austria" },
    { "name": "	Belgium" }, { "name": "Bhutan" }, { "name": "Brazil" },
    { "name": "Canada" }, { "name": "China" }, { "name": "Cuba" },
    { "name": "Denmark" },
    { "name": "Finland" }, { "name": "France" },
    { "name": "Germany" },
    { "name": "India" }, { "name": "Ireland" }, { "name": "Israel" }, { "name": "Italy" },
    { "name": "Japan" },
    { "name": "Malaysia" }, { "name": "Mexico" },
    { "name": "Mexico" }, { "name": "Netherlands" }, { "name": "Norway" },
    { "name": "Qatar" },
    { "name": "Russia" },
    { "name": "Singapore" }, { "name": "Switzerland" },
    { "name": "United Arab Emirates" }, { "name": "United Kingdom" }, { "name": "United States of America" },
    { "name": "Qatar" }, { "name": "Qatar" }
  ];

  propertyTypes: any = [
    { "name": "residential", "displayName": "Residential Property" },
    { "name": "Commercial Property", "displayName": "Commercial Property" },
    { "name": "Residential And Commercial Property", "displayName": "Residential And Commercial Property" }
  ];
  Roles: any=[
    { "name": "Owner" },
    { "name": "Tenant" }
  ];

  resetStep1(){
    this.crtAssn.name='';
    this.crtAssn.logo='';
    this.crtAssn.country='SELECT COUNTRY';
    this.crtAssn.propertyType='SELECT PROPERTY TYPE';  
    this.crtAssn.state='';
    this.crtAssn.city='';
    this.crtAssn.postalCode='';
    this.crtAssn.propertyName='';
    this.crtAssn.locality='';
    this.crtAssn.email='';
    this.crtAssn.url='';
  }
  resetStep2(){
    this.crtAssn.PANNumber='';
    this.crtAssn.GSTNumber='';
    this.crtAssn.uploadPANCard='';
  }
  resetStep3(){
    this.crtAssn.totalNoBlocks='';
    this.crtAssn.totalNoUnits='';
  }
  onSubmit() {
    this.blockArray=[];
    //console.log("Creating Association");
    //console.log("locality: " + this.crtAssn.locality);
    this.createAsssociationData = {
      // "ACAccntID":"2",
      "ACAccntID": this.accountID,
      "association": {
        "ASAddress": this.crtAssn.locality,
        "ASCountry": this.crtAssn.country,
        "ASCity": this.crtAssn.city,
        "ASAsnLogo": "logo",
        "ASState": this.crtAssn.state,
        "ASPinCode": this.crtAssn.postalCode,
        "ASAsnName": this.crtAssn.name,
        "ASPrpName": this.crtAssn.propertyName,
        "ASRegrNum":  "avcx",    //this.crtAssn.assnRegisterNo,
        "ASPANNum": this.crtAssn.PANNumber,
        "ASPrpType": this.crtAssn.propertyType,
        //"ASWebURL":"",
        "ASPANStat": "True",
        //"ASPANNum":"AAAAm1234A",
        //"ASPANNum": this.crtAssn.assnPANNo,
        "ASNofBlks": this.crtAssn.totalNoBlocks,
        "ASNofUnit": this.crtAssn.totalNoUnits,
        "ASONStat": "False",
        "ASOMStat": "False",
        "ASOLOStat": "False",
        "ASOTPStat": "False",
        "ASOPStat": "False",
        "ASPANDoc": "uploadPANCard",
        //"aspanDoc": this.crtAssn.uploadPANCard,
        //"ASRegrNum": this.crtAssn.assnRegisterNo,
        // "BankName": this.crtAssn.BankName,
        // "accountType": this.crtAssn.accountType,
        // "IFSC": this.crtAssn.IFSC,
        // "AccountNumber": this.crtAssn.AccountNumber,

        // "AmenityT":this.crtAssn.AmenityT,
        // "AmenityN":this.crtAssn.AmenityN,
        // "amenityType":this.amenityType,
        // "amenityNo":this.amenityNo,
        "ASTrnsCur": "ghfy",
        "ASRefCode": "454545",
        //"ASGSTNo":"",        
        "GSTNumber": this.crtAssn.GSTNumber,
        "ASGPSPnt": "12.12.123",
        // "ASDCreated": "2019-01-05",
        // "ASDUpdated": "2019-01-05",
        // "ASIsActive": "True",
        "ASFaceDet": "False",
        "ASAsnEmail":this.crtAssn.email,
        "ASWebURL":this.crtAssn.url,
        "Amenities": this.newamenities,
      
      "BankDetails": [{
        // "BankName": this.bank.BankN,
        // "IFSC": this.bank.IFSCN,
        // "AccountNumber": this.bank.AccountN,
        // "accountType": this.bank.accountT,
        // "BankNam": this.BankName,
        // "IFS": this.IFSC,
        // "AccountNumbe": this.AccountNumber,
        // "accountTyp": this.accountType,

        "BABName": this.crtAssn.newBABName,    //this.BankName,
        "BAIFSC": this.crtAssn.newBAIFSC,
        "BAActNo": this.crtAssn.newBAActNo,
        "BAActType": this.crtAssn.newBAActType
      }]
    }
  };

    console.log(this.createAsssociationData);
    let blockArraylength = (Number(this.crtAssn.totalNoBlocks));
    // this.globalService.blockArrayLength=Number(this.crtAssn.totalNoBlocks);
    for(let i=0;i<blockArraylength;i++){
      this.blockArray.push(new BlockArrayDetail(i,'','','','','','','','','','','','','','','','','','',''));
    }
    console.log(this.blockArray.length);
    console.log(this.blockArray);
    this.viewAssnService.createAssn(this.createAsssociationData).subscribe(res => {
      console.log(res['data']['association']['asAssnID']);
      console.log(res);
      this.viewAssnService.associationId=res['data']['association']['asAssnID'];
      this.viewAssnService.asNofBlks=res['data']['association']['asNofBlks'];
      this.viewAssnService.asNofUnit=res['data']['association']['asNofUnit'];
      //this.router.navigate(['blocks']);
     /* Swal.fire({
        title: 'Association Created Successfuly',
      }).then(
        (result) => {
  
          if (result.value) {
            //this.form.reset();
            this.viewAssociation_Table = true;
            this.enrollAssociation = false;
            this.joinAssociation = false;

            this.viewAssnService.getAssociationDetails(this.accountID).subscribe(res => {
              //console.log(JSON.stringify(res));
              this.viewAssnService.enrlAsnEnbled=false;
              this.viewAssnService.vewAsnEnbled=true;
              this.viewAssnService.joinAsnEbld=false;
              var data: any = res;
              //console.log(data.data.associationByAccount);
              this.associations = data.data.associationByAccount;
              //console.log(this.associations);
            });

            //
            //this.router.navigate(['home/addblockunitxlsx']);

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            //this.router.navigate(['']);
          }
        }
      ) */
    },
      res => {
        console.log('error', res);
      });

  }
  //  */*/*/*/*/*/*/*/block creation along with association start*/*/*/*/*/*/*/*/*/*/*/*/
  createBlock() {
    this.unitArray=[];
    let isBlockNameNull: any = false;
    this.blockArray.forEach(item => {
      if (item['blkNme'] == '') {
        isBlockNameNull = true;
      }
    })
    if (!isBlockNameNull) {
      this.blockArray.forEach((item, index) => {
        ((index) => {
          setTimeout(() => {
            let CreateBockData = {
              "ASAssnID": this.viewAssnService.associationId,
              "ACAccntID": this.globalService.getacAccntID(),
              "blocks": [
                {
                  "ASAssnID": this.viewAssnService.associationId,
                  "BLBlkName": item['blkNme'],
                  "BLBlkType": item['blocktype'],
                  "BLNofUnit": item['noofunits'],
                  "BLMgrName": item['mngName'],
                  "BLMgrMobile": item['BlockManagermobile'],
                  "BLMgrEmail": item['manageremail'],
                  "ASMtType": '',
                  "ASMtDimBs": item['maintenanceValue'],
                  "ASMtFRate": item['flatRatevalue'],
                  "ASUniMsmt": 'sqft',
                  "ASIcRFreq": item['frequency'],
                  "ASBGnDate": formatDate(item['billGenerationDate'], 'yyyy/MM/dd', 'en'),
                  "ASLPCType": item['latePymtChargeType'],
                  "ASLPChrg": item['latePymtCharge'],
                  "ASLPSDate": formatDate(item['startsFrom'], 'yyyy/MM/dd', 'en'),
                  "ASDPyDate": formatDate(item['dueDate'], 'yyyy/MM/dd', 'en'),
                  "BankDetails": ''
                }
              ]
            }

            console.log('CreateBockData', CreateBockData);
            this.addblockservice.createBlock(CreateBockData)
              .subscribe(data => {
                console.log(data);
                let unitArraylength = (Number(item['noofunits']));
                // this.globalService.blockArrayLength=Number(this.crtAssn.totalNoBlocks);
                for(let i=0;i<unitArraylength;i++){
                  this.unitArray.push(new UnitArray(item['blkNme']+i.toString(),item['blkNme'],data['data'].blockID,'','','','','','','','','','','','','',''));
                }
                console.log(this.unitArray);
                if (data['data'].blockID) {
                  let createUnitData =
                  {
                    "ASAssnID": this.viewAssnService.associationId,
                    "ACAccntID": this.globalService.getacAccntID(),
                    "units": [
                      {
                        "UNUniName": item['blkNme'] + "-" + "Common",
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

                  this.viewUniService.createUnit(createUnitData).subscribe(data => {
                    console.log(data);
                  },
                    err => {
                      console.log(err);
                    })
                }
              },
                (err) => {
                  console.log(err);
                });
          }, 2000 * index)
        })(index)
      })
    }
    else {
      Swal.fire({
        title: "Error",
        text: "Add data for all Blocks",
        type: "error",
        confirmButtonColor: "#f69321"
      });
    }
    setTimeout(() => { 
     this.groupedArray =  _.groupBy(this.unitArray,'_blockName');
     console.log(Object.keys(this.groupedArray));
     let groupedKeys = Object.keys(this.groupedArray);
     groupedKeys.forEach((item,index)=>{
      console.log(item);
      console.log(index);
      let _blk=this.unitArray.filter(itm=>{
        console.log(itm);
        return itm['_blockName']==item;
      })
      console.log(_blk);
      this.BlockHrefDetail.push({"Id":index+1,"blk":item,"step":"#step-"+(index+7).toString(),"elementID":"step-"+(index+7).toString(),"UnitArray":_blk});
     })
     console.log(this.BlockHrefDetail);
      this.unitArrayList = this.unitArray;
      console.log(this.unitArrayList);
      this.globalService.SetCreateUnitWithAssociation(this.BlockHrefDetail,this.unitArrayList)
      this.enableCreateUnitWithAssociation=true;
      this.toggleStepTest();
     }, (2000 * (this.blockArray.length + 1)));
  }
  // */*/*/*/*/*/*/*/*/block creation along with association end*/*/*/*/*/*/*/*/*/*/*/
  OpenSendRequest(OpenSendRequest: TemplateRef<any>){
    this.modalRef = this.modalService.show(OpenSendRequest,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  resetForm(){
    //console.log('teSt');
    //console.log(this.crtAssn.propertyType);
    //console.log(this.ASPrpType);
    this.viewassociationForm.reset();
  }

  OnSendButton(OwnerType) {
    this.dashboardservice.getAccountFirstName(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      this.account = data.data.account;
      //console.log('account', this.account);
      //console.log(this.account[0]['acfName']);
      //console.log(this.account[0]['aclName']);
      //console.log(this.account[0]['acMobile']);
      //
      let senddataForJoinOwner = {
        "ASAssnID": Number(this.assnID),
        "BLBlockID": Number(this.blockID),
        "UNUnitID": Number(this.UnitIDforJoinAssn),
        "MRMRoleID": OwnerType,//(OwnerType=='joinowner'?1:2),
        "FirstName": this.account[0]['acfName'],
        "MobileNumber": this.account[0]['acMobile'],
        "ISDCode": "+91",
        "LastName": this.account[0]['aclName'],
        "Email": "",
        "SoldDate": "2019-03-02",
        "OccupancyDate": formatDate(this.UNOcSDate, 'yyyy-MM-dd', 'en')
      }
      console.log(senddataForJoinOwner);
      this.viewAssnService.joinAssociation(senddataForJoinOwner)
        .subscribe(
          (data) => {
            console.log(data);
            Swal.fire({
              title: 'Joined Successfully',
              showCancelButton: true,
              type: 'success',
              confirmButtonColor: "#f69321"
            })
            //console.log(data);
          },
          err => {
            console.log(err);
            Swal.fire({
              title: "Error",
              type: 'error',
              text: `${err['error']['error']['message']}`,
              confirmButtonColor: "#f69321"
            });
          })
      //
    },
      err => {
        //console.log(err);
      });

  }
  requestForJoin(){
    //console.log(this.OwnerType);
      this.OnSendButton(this.OwnerType);
  }
  validateGST() {
    let firstLetter = this.crtAssn.name.charAt(0).toUpperCase();
    let fifthLetter = this.crtAssn.GSTNumber.charAt(4).toUpperCase();
    //console.log(firstLetter, fifthLetter);
    //console.log('GSTNumber.length' + this.crtAssn.GSTNumber.length);
    if (this.crtAssn.GSTNumber.length == 5 || this.crtAssn.GSTNumber.length > 5) {
      if (firstLetter == fifthLetter) {

        this.togglevalidateGST = false;
      } else {

        this.togglevalidateGST = true;
      }
    }

  } 



  OpenModalOwner(joinowner: TemplateRef<any>, acfName: string, aclName: string, acMobile: string, acEmail: string, acAccntID){
  //   joinownername:string;
  // joinownerlastname:string;
  // joinownermobile:string;
  // joinowneremail:string
    this.joinownername = acfName;
    this.joinownerlastname = aclName;
    this.joinownermobile = acMobile;
    this.joinowneremail = acEmail;
  
    

    this.viewAssnService.GetAccountListByAccountID(acAccntID).subscribe(res => {
      var data: any = res;
      //console.log(res['data']['account'][0].acfName);
      //console.log(res['data']['account'][0].aclName);
      //console.log(res['data']['account'][0].acMobile);
      //console.log(res['data']['account'][0].acEmail);

      this.joinownername = res['data']['account'][0].acfName;
      this.joinownerlastname = res['data']['account'][0].aclName;
      this.joinownermobile = res['data']['account'][0].acMobile;
      this.joinowneremail= res['data']['account'][0].acEmail;
    })

    this.modalRef = this.modalService.show(joinowner,
      Object.assign({}, { class: 'gray modal-lg' }));
    }


    OpenModalTenant(jointenant: TemplateRef<any>, acfName: string, aclName: string, acMobile: string, acEmail: string, acAccntID){
      this.tname = acfName;
      this.tlastname = aclName;
      this.tmobile = acMobile;
      this.temail = acEmail;
    
      
  
      this.viewAssnService.GetAccountListByAccountID(acAccntID).subscribe(res => {
        var data: any = res;
        //console.log(res['data']['account'][0].acfName);
        //console.log(res['data']['account'][0].aclName);
        //console.log(res['data']['account'][0].acMobile);
        //console.log(res['data']['account'][0].acEmail);
  
        this.tname = res['data']['account'][0].acfName;
        this.tlastname = res['data']['account'][0].aclName;
        this.tmobile = res['data']['account'][0].acMobile;
        this.temail= res['data']['account'][0].acEmail;
      })
  
      this.modalRef = this.modalService.show(jointenant,
        Object.assign({}, { class: 'gray modal-lg' }));
      }
  
  getpropertyType(propertyTypeName) {
    this.ASPrpType = propertyTypeName;
  }




      OpenModal(template: TemplateRef<any>, asAsnName: string, asCountry: string, asAddress: string, asCity: string, asState, asPinCode, asPrpType, asPrpName, asNofBlks, asNofUnit, amType, noofAmenities, baBName, baIFSC, baActNo, baActType, asAssnID,BAActID,AMID) {
        //console.log('amType-', amType, 'noofAmenities-', noofAmenities);
        let EditAssociationData={};
        this.ASAsnName = asAsnName;
        this.ASCountry = asCountry;
        this.ASAddress = asAddress;
        this.ASCity = asCity;
        this.ASState = asState;
        this.ASPinCode = asPinCode;
        this.ASPrpType = asPrpType;
        this.ASPrpName = asPrpName;
        this.ASNofBlks = asNofBlks;
        this.ASNofUnit = asNofUnit;
        this.BABName = baBName;
        this.BAIFSC = baIFSC;
        this.BAActNo = baActNo;
        this.BAActType = baActType;
        this.asAssnID=asAssnID;
        this.BAActID=BAActID;
        this.AMID=AMID;
        this.amType=amType;
        this.noofAmenities=noofAmenities;
        //console.log(asAsnName);
        //console.log(asPrpName);
        //console.log(asAddress);
        //console.log(asNofUnit);
        //console.log(asCountry);
        //console.log(asPinCode);
        //console.log(asState);
        console.log(asPrpType);
        console.log(this.BAActType);
        //console.log(asCity);
        //console.log(asAssnID);
        //console.log(amType);
        //console.log(baBName);
    
        this.viewAssnService.getAssociationDetails(asAssnID)
    
        this.viewAssnService.getAssociationDetailsByAssociationid(asAssnID).subscribe(res => {
          console.log(JSON.stringify(res));
          var data: any = res;
          //console.log(res['data']['association']['amenities'][0].amType);
          //console.log(res['data']['association']['amenities'][0].noofAmenities);
          if(res['data']['association']['amenities'].length!=0){
            this.AMType = res['data']['association']['amenities'][0].amType;
            this.NoofAmenities = res['data']['association']['amenities'][0].noofAmenities;
          }
          else{
            this.AMType = '';
            this.NoofAmenities='';
          }
          //console.log(res['data']['association']['bankDetails'][0].babName);
          //console.log(res['data']['association']['bankDetails'][0].baifsc);
          //console.log(res['data']['association']['bankDetails'][0].baActNo);
          //console.log(res['data']['association']['bankDetails'][0].baActType);
          if(res['data']['association']['bankDetails'].length !=0){
            this.BABName = res['data']['association']['bankDetails'][0].babName;
            this.BAIFSC = res['data']['association']['bankDetails'][0].baifsc;
            this.BAActNo = res['data']['association']['bankDetails'][0].baActNo;
            this.BAActType = res['data']['association']['bankDetails'][0].baActType;
          }
          else{
            this.BABName = '';
            this.BAIFSC = '';
            this.BAActNo = '';
            this.BAActType = '';
          }
          console.log(res['data']['association']['asPrpType']);
          this.ASPrpType = res['data']['association']['asPrpType'];
           //
        EditAssociationData['ASAsnName'] = asAsnName;
        EditAssociationData['ASCountry'] = asCountry;
        EditAssociationData['ASAddress'] = asAddress;
        EditAssociationData['ASCity'] = asCity;
        EditAssociationData['ASState'] = asState;
        EditAssociationData['ASPinCode'] = asPinCode;
        EditAssociationData['ASPrpType'] = asPrpType;
        EditAssociationData['ASPrpName'] = asPrpName;
        EditAssociationData['ASNofBlks'] = asNofBlks;
        EditAssociationData['ASNofUnit'] = asNofUnit;
        EditAssociationData['asAssnID']=asAssnID;
        EditAssociationData['BAActID']=BAActID;
        EditAssociationData['AMID']=AMID;
        EditAssociationData['AMType']= this.AMType;
        EditAssociationData['NoofAmenities']= this.NoofAmenities;
        EditAssociationData['BABName']= this.BABName;
        EditAssociationData['BAIFSC']= this.BAIFSC;
        EditAssociationData['BAActNo']= this.BAActNo;
        EditAssociationData['BAActType']= this.BAActType;
        EditAssociationData['ASPrpType'] = this.ASPrpType;

        console.log(EditAssociationData);
        this.viewAssnService.EditAssociationData=EditAssociationData;
        this.router.navigate(['editassociation']);
        });
        // this.modalRef = this.modalService.show(template,
        //   Object.assign({}, { class: 'gray modal-lg' }));
      }

  // toggleStepWizrd() {
  //   $(document).ready(function () {

  //     var navListItems = $('div.setup-panel div a'),
  //       AddExp = $('#AddExp'),
  //       allWells = $('.setup-content'),
  //       allNextBtn = $('.nextBtn'),
  //       anchorDiv = $('div.setup-panel div'),
  //       anchorDivs = $('div.stepwizard-row div');

  //     allWells.hide();

  //     navListItems.click(function (e) {
  //       e.preventDefault();
  //       var $target = $($(this).attr('href')),
  //         $item = $(this),
  //         $divTgt = $(this).parent();
  //       console.log($target);
  //       console.log($item);
  //       // console.log(anchorDiv);
  //       // console.log($divTgt);
  //       // console.log(anchorDivs);
  //       anchorDivs.removeClass('step-active');
  //       $item.addClass('btn-success');
  //         $divTgt.addClass('step-active');
  //         allWells.hide();
  //         // if (document.forms["EnrollAssnID"].checkValidity()) {
  //           $target.show();
  //         //}
  //         $target.find('input:eq(0)').focus();
  //       //console.log(anchorDivs);
  //       if (!$item.hasClass('disabled')) {
  //         console.log('disabled');
  //         navListItems.removeClass('btn-success').addClass('btn-default');
  //         navListItems.removeClass('active').addClass('disabled');
  //       }
  //     }); 

  //     allNextBtn.click(function () {
  //       var curStep = $(this).closest(".setup-content"),
  //         curStepBtn = curStep.attr("id"),
  //         nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
  //         curInputs = curStep.find("input[type='text']"),
  //         curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]'),
  //         isValid = true;

  //       $(".form-group").removeClass("has-error");
  //       for (var i = 0; i < curInputs.length; i++) {
  //         if (!curInputs[i].validity.valid) {
  //           isValid = false;
  //           $(curInputs[i]).closest(".form-group").addClass("has-error");
  //         }
  //       }

  //       if (isValid) {
  //         nextStepWizard.trigger('click');
  //         curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
  //       }
  //     });
  //     AddExp.click(function () {
  //       console.log(this);
  //       var curStep = $(this).closest(".setup-content"),
  //         curStepBtn = curStep.attr("id"),
  //         curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]'),
  //         nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
  //         curInputs = curStep.find("input[type='text']"),
  //       isValid = true;

  //       $(".form-group").removeClass("has-error");
  //       for (var i = 0; i < curInputs.length; i++) {
  //         if (!curInputs[i].validity.valid) {
  //           isValid = false;
  //           $(curInputs[i]).closest(".form-group").addClass("has-error");
  //         }
  //       }

  //       if (isValid) {
  //         nextStepWizard.trigger('click');
  //         curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
  //       }
  //     })

  //     $('div.setup-panel div a.btn-success').trigger('click');
  //   });
  // }
  toggleStepTest() {
    $(document).ready(function () {
      //e.preventDefault();
      console.log('div.setup-panel-stepseven div a');
      console.log($('div.setup-panel-stepseven div a'));
      var navListItems1 = $('div.setup-panel-stepseven div a'),
       StepTwo = $('#step-6'),
        allWells = $('.setup-content-seven'),
        anchorDivs = $('div.stepwizard-row-stepseven div'),
        createUnit=$('#CreateUnitId');
      allWells.hide();
      navListItems1.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent();
        console.log('test');
        //console.log($target);
        console.log($item);
        // console.log(anchorDiv);
        // console.log($divTgt);
        // console.log(anchorDivs);
        anchorDivs.removeClass('step-active');
        //console.log(anchorDivs);
        if (!$item.hasClass('disabled')) {
          console.log('disabled');
          navListItems1.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          $divTgt.addClass('step-active');
          allWells.hide();
          console.log(allWells);
          console.log($target);
         console.log(StepTwo);
          StepTwo.show();
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      });
      createUnit.click(function(){
       console.log($(this).parent().parent());
      });
      $('div.setup-panel-stepseven div a.btn-success').trigger('click');
    });
  }

  toggleStepWizrd() {
    $(document).ready(function () {
      var navListItems = $('div.setup-panel div a'),
      AddExp = $('#AddExp'),
     /* StepTwo = $('#step-6'),*/
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
       anchorDiv = $('div.setup-panel div'),
       anchorDivs = $('div.stepwizard-row div');
      allWells.hide();
      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this), 
          $divTgt = $(this).parent();
          console.log('test');
        // console.log($target);
        //console.log($item);
        // console.log(anchorDiv);
        // console.log($divTgt);
        // console.log(anchorDivs);
        anchorDivs.removeClass('step-active');
        //console.log(anchorDivs);
        if (!$item.hasClass('disabled')) {
          console.log('disabled');
          navListItems.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          $divTgt.addClass('step-active');
          allWells.hide();
          console.log($target);
         /* console.log(StepTwo);
          StepTwo.show(); */
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      });
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
          nextStepWizard.removeAttr('disabled').trigger('click');
          curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
        }
      });
      AddExp.click(function () {
        console.log(this);
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]')
        curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
      })
      $('div.setup-panel div a.btn-success').trigger('click');
    });
  }

   OpenModals(jointemplate: TemplateRef<any>,unUnitID) {
     //console.log(unUnitID);
     this.unUnitID=unUnitID;
    this.modalRef = this.modalService.show(jointemplate,
     Object.assign({}, { class: 'gray modal-lg' }));
    }
    resetStep5(){
      this.blockname='';
      this.blocktype = '';
      this.noofunits='';
    }
    resetStep6(){
      this.mngName='';
      this.BlockManagermobile='';
      this.manageremail='';
    }
    resetStep7() {
      this.flatRatevalue = 0;
      this.maintenanceValue = 0;
      this.meter = '';
      this.frequency = '';
      this.billGenerationDate = null;
      this.dueDate = '';
      this.latePymtChargeType = 'SELECT CHARGE TYPE';
      this.startsFrom = null;
    }
  
}
