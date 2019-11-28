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
import { AngularFireMessaging } from '@angular/fire/messaging';
import { formatDate } from '@angular/common';
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
 
  
  //  firstLetter = crtAssn.name.charAt(0).toUpperCase();
  //   fifthLetter = this.panNo.charAt(4).toUpperCase();


  ASAsnName: string;
  ASCountry: string;
  ASAddress: string;
  ASCity: string;
  ASState: string;
  ASPinCode: string;
  ASPrpType: string;
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

  constructor(private modalService: BsModalService,
    private viewAssnService: ViewAssociationService,
    private globalService: GlobalServiceService,
    private router: Router,
    private route:ActivatedRoute,
    private orderpipe: OrderPipe,
    private dashboardservice:DashBoardService,
    private homeservice:HomeService,
    private afMessaging: AngularFireMessaging) {
    //this.userlist = this.obj;
    //pagination
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
      console.log('test1');
      this.enrollAssociation = true;
      this.viewAssociation_Table = true;
      if (this.dashboardservice.enrollassociationforresident) {
        this.viewAssociation_Table = false;
        console.log('test2');
      }
      this.joinAssociation = false;
      this.homeservice.toggleviewassociationtable = false;
    }
    if (!this.dashboardservice.toggleViewAssociationTable) {
      console.log('test3');
      this.enrollAssociation = false;
      this.viewAssociation_Table = false;
      this.joinAssociation = true;
    }
    if (this.homeservice.toggleviewassociationtable) {
      console.log('test4');
      this.viewAssociation_Table = true;
      this.joinAssociation = false;
      this.enrollAssociation = false;
      //alert('joinAssociation');
    }

    //   this.route.params.subscribe(data=>{
    //     console.log(data['asAssnID']);
    //     this.viewAssnService.getBlockDetailsByAssociationID(data['asAssnID']) 

    // .subscribe(res => {
    //   console.log(res);
    //     var data: any = res;
    //     this.allBlocksLists= res['data']['blocksByAssoc'];
    //     console.log(this.allBlocksLists);
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
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      $('#example').DataTable();
    });

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
  
  pageChanged(event: any): void {
    this.page = event.page;
  }
  enblEnrlAsnVew(){
    
  }
  viewassociation(repviewreceiptmodalit: any) {
    console.log(JSON.stringify(repviewreceiptmodalit));
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
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
          this.dynamic = Math.round(event.loaded / event.total * 100);
        }
        else if (event.type === HttpEventType.Response) {
          console.log(event);
          this.dynamic = 0;
        }
      });
  }
  // getAmenities(amenities: object) {

  //   this.amenities.push(new Amenity(amenities['AmenityT'], amenities['AmenityN'], amenities['AmenityId']));
  //   this.AmenityT = '';
  //   this.AmenityN = '';
  //   console.log('amenities', this.amenities);
  // }

  deleteamenity(AMType) {
    console.log('AMType', AMType);
    this.newamenities = this.newamenities.filter(item =>{return item['AMType'] != AMType});
  }
  // getBank(bankities: object) {

  //   this.bankites.push(new Bank(bankities['BankName'], bankities['IFSC'], bankities['AccountNumber'], bankities['accountType'], bankities['BankId']));
  //   this.BankName = '';
  //   this.IFSC = '';
  //   this.AccountNumber = '';
  //   this.accountType = '';
  //   console.log('bankites', this.bankites);
  // }
  prerequisitesAddUnit(blBlockID) {
    console.log('prerequisitesAddUnit', blBlockID);
    this.blockID = blBlockID;
    let blockbyassoc = this.allBlocksLists.find(item => item['blBlockID'] == blBlockID);
    this.getAllUnitDetailsByBlockID(blBlockID);
    //this.viewAssnService.getBlockDetailsByAssociationID() 

  }

  getAllUnitDetailsByBlockID(blBlockID) {
    console.log('blockid', blBlockID);
    this.allUnitBlockID=[];
    //this.route.params.subscribe(data=>{console.log(data['blBlockID']);
    this.viewAssnService.GetUnitListByBlockID(blBlockID)
      .subscribe(res => {
        var data: any = res;
        this.allUnitBlockID= data.data.unitsByBlockID;
        console.log('allUnitBlockID',this.allUnitBlockID);
        console.log(res);
        // console.log('allUnitBYBlockID',data);
        // this.allUnitBYBlockID = data['data'].unitsByBlockID;
      });

  }

  // deleteBank(BankId) {
  //   console.log('BankId', BankId);
  //   this.bankites = this.bankites.filter(item => item['BankId'] != BankId);
  // }
  openViewAssociation(viewreceiptmodal: TemplateRef<any>, asAsnName, asPrpName, asAddress, asNofUnit, aSCountry, asPinCode, asState, asPrpType, asNofBlks, aspanNum, asRegrNum, asAsnLogo, asCity, aspanDoc, asAssnID, asgstNo) {
    console.log(asAsnName);
    console.log(asPrpName);
    console.log(asAddress);
    console.log(asNofUnit);
    console.log(aSCountry);
    console.log(asPinCode);
    console.log(asState);
    console.log(asPrpType);
    console.log(asRegrNum);
    console.log(asAsnLogo);
    console.log(asCity);
    console.log(asAsnLogo);
    console.log(aspanDoc);
    console.log('asAssnID', asAssnID);
    console.log(asgstNo);

    this.viewAssnService.getAssociationDetail(asAssnID)
      .subscribe(data => {
        console.log('bank', data['data']['association']['bankDetails'].length);
        //console.log('getAssociationDetail', data['data']['association']['amenities'][0]['amType']);
        //this.amenityType = data['data']['association']['amenities'][0]['amType'];
       // console.log('getAssociationDetail', data['data']['association']['amenities'][0]['noofAmenities']);
        //this.amenityNo = data['data']['association']['amenities'][0]['noofAmenities'];

        this.BankName = '';
        this.IFSC = '';
        this.AccountNumber = '';
        this.accountType = '';

        if (data['data']['association']['bankDetails'].length > 0) {

          console.log('getAssociationDetail', data['data']['association']['bankDetails'][0]['babName']);
          this.BankName = data['data']['association']['bankDetails'][0]['babName'];
          console.log('getAssociationDetail', data['data']['association']['bankDetails'][0]['baifsc']);
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
    
    console.log("Updating Association");
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
      console.log("Done");
      console.log(JSON.stringify(res));
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
        console.log(err);
      });


  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };

    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    //this.accountID="2";
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    this.currentAssociationName = this.globalService.getCurrentAssociationName();
    this.getAssociationDetails();
    // this.getAssociationDetail();
    //this.firstLetter = this.crtAssn.asAsnName.charAt(0).toUpperCase();
    //this.firstLetter = this.crtAssn.aspanNum.charAt(4).toUpperCase();
    console.log(this.firstLetter, this.firstLetter);
    // if (this.firstLetter == this.firstLetter) {
    //   this.matching = false;
    // } else {
    //   this.matching = true;
    // }

this.association="";
this.association="";
this.crtAssn.country='';
this.crtAssn.propertyType='';
this.crtAssn.newBAActType='';
    this.viewAssnService.getAssociationAllDetails()
    .subscribe(item => {
      console.log('getAssociationAllDetails',item);
      this._associations= item['data']['associations'];
     //this.availableNoOfBlocks = item.length;
      console.log('associations', this.associations);  

    })
  }
  
  loadAssociation(asAssnID){
    console.log('asAssnID',asAssnID);
    this.assnID=asAssnID;
    this.viewAssnService.getBlockDetailsByAssociationID(asAssnID)
    .subscribe(response=>{
      console.log(response);
     this.allBlocksLists= response['data']['blocksByAssoc'];
    })
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }


  getAssociationDetails() {
    console.log(this.accountID)
    this.viewAssnService.getAssociationDetails(this.accountID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      console.log(data.data.associationByAccount);
      this.associations = data.data.associationByAccount;
      console.log(this.associations);
      //
      this.sortedCollection = this.orderpipe.transform(this.associations, 'asAsnName');
      console.log(this.sortedCollection);
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
    console.log(this.firstLetter, this.fifthLetter);
    if (this.firstLetter == this.fifthLetter) {
      
      this.matching = false;
    } else {
      
      this.matching = true;
    }

  }
  openPANfield() {
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
    console.log(asAssnID);
    this.router.navigate(['joinassociation',asAssnID]);
  }
  addAmenity(event) {
    console.log('amenity',event);
    console.log('AMType'+ event['AMType']);
    console.log('NoofAmenities'+ event['NoofAmenities']);
    if(event['AMType'] !== "" && event['NoofAmenities'] !== ""){
       //alert('inside if condition null');
       this.newamenities.push(new Amenity(event['AMType'],event['NoofAmenities']));
    }
    console.log('newamenities',this.newamenities);
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



  onFileSelected(event) {
    this.isLargefile = false;
    this.isnotValidformat = false;
    this.disableButton = false;
    this.selectedFile = <File>event.target.files[0];
    console.log('file type', this.selectedFile['type']);

    if (this.selectedFile['type'] == "application/zip") {
      console.log('inside file type');
      this.isnotValidformat = true;
      this.disableButton = true;
    }

    if (this.selectedFile['size'] > 2000000) {
      console.log('inside file size');
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
    console.log('file type', this.selectedFile['type']);
    if (this.selectedFile['type'] == "application/zip") {
      console.log('inside file type');
      this.isnotValidformat = true;
      this.disableButton = true;
    }
    if (this.selectedFile['size'] > 2000000) {
      console.log('inside file size');
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
    console.log('dataTransfer', dataTransfer);
    const inputElement: HTMLInputElement = document.getElementById('viewassosnuploadFileinput') as HTMLInputElement;
    console.log('inputElement', inputElement.files);
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
    console.log('dataTransfer', dataTransfer);
    const inputElements: HTMLInputElement = document.getElementById('uploadPaninput') as HTMLInputElement;
    console.log('inputElement', inputElements.files);
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
    { "name": "Residential Property", "displayName": "Residential Property" },
    { "name": "Commercial Property", "displayName": "Commercial Property" },
    { "name": "Residential And Commercial Property", "displayName": "Residential And Commercial Property" }
  ];
  Roles: any=[
    { "name": "Owner" },
    { "name": "Tenant" }
  ];


  onSubmit() {

    console.log("Creating Association");
    console.log("locality: " + this.crtAssn.locality);
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
        "ASNofBlks": 1000000,//this.crtAssn.totalNoBlocks,
        "ASNofUnit": 10000000,//this.crtAssn.totalNoUnits,
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

    this.viewAssnService.createAssn(this.createAsssociationData).subscribe(res => {
      console.log(res['data']['association']['asAssnID']);
      //console.log(res['association']['asAssnID']);
      this.viewAssnService.associationId=res['data']['association']['asAssnID'];
      this.viewAssnService.asNofBlks=res['data']['association']['asNofBlks'];
      this.viewAssnService.asNofUnit=res['data']['association']['asNofUnit'];
      Swal.fire({
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
              var data: any = res;
              console.log(data.data.associationByAccount);
              this.associations = data.data.associationByAccount;
              console.log(this.associations);
            });

            //
            //this.router.navigate(['home/addblockunitxlsx']);

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            //this.router.navigate(['']);
          }
        }
      )
    },
      res => {
        console.log('error', res);
      });

  }
  OpenSendRequest(OpenSendRequest: TemplateRef<any>){



    this.modalRef = this.modalService.show(OpenSendRequest,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  resetForm(){
    console.log('teSt');
    console.log(this.crtAssn.propertyType);
    console.log(this.ASPrpType);
    this.viewassociationForm.reset();
  }

  OnSendButton(OwnerType){
    // this.afMessaging.requestPermission
    // .subscribe(
    //   () => { console.log('Permission granted!'); },
    //   (error) => { console.error(error); },  
    // );

    // this.afMessaging.requestPermission
    //   .pipe(mergeMapTo(this.afMessaging.tokenChanges))
    //   .subscribe(
    //     (token) => { console.log('Permission granted! Save to the server!', token); },
    //     (error) => { console.error(error); },
    //   );

    /* this.afMessaging.tokenChanges
      .subscribe(
        (token) => { console.log('Permission granted! Save to the server!', token); },
        (error) => { console.error(error); },
      ); */

   /* this.senddata={
      "ISDCode":"+91",
      "MobileNumber":"7353204696",
      "text":"ABC... want to join your Association"
    }
    this.viewAssnService.sendRequestmethod(this.senddata)
      .subscribe(
        (data) => {
          swal.fire({
            title: "Sent Successfully",
            text: "",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#f69321",
    
          })
          console.log(data);
        }) */ 
      let senddataForJoinOwner={
          "ASAssnID"     :Number(this.assnID),
          "BLBlockID"       : Number(this.blockID),
          "UNUnitID"     : Number(this.unUnitID),
          "MRMRoleID"    : (OwnerType=='joinowner'?1:2),
          "FirstName"    : this.dashboardservice.acfName,
          "MobileNumber" : this.dashboardservice.acMobile,
          "ISDCode"      : "+91",
          "LastName"     : this.dashboardservice.aclName,
          "Email"        : "",
          "SoldDate"     : "2019-03-02",
          "OccupancyDate": formatDate(this.UNOcSDate, 'yyyy-MM-dd', 'en')
      }
      console.log(senddataForJoinOwner);
        this.viewAssnService.joinAssociation(senddataForJoinOwner)
          .subscribe(
            (data) => {
              this.modalRef.hide();
              Swal.fire({
                title: 'Joined Successfully',
                showCancelButton: true,
                type:'success',
                confirmButtonColor: "#f69321"
              })
              console.log(data);
            },
            err=>{
              console.log(err);
              Swal.fire({
                title: "Error",
                type:'error',
                text: `${err['error']['error']['message']}`,
                confirmButtonColor: "#f69321"
              });
            })
        
  }

  validateGST() {
    let firstLetter = this.crtAssn.name.charAt(0).toUpperCase();
    let fifthLetter = this.crtAssn.GSTNumber.charAt(4).toUpperCase();
    console.log(firstLetter, fifthLetter);
    console.log('GSTNumber.length' + this.crtAssn.GSTNumber.length);
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
      console.log(res['data']['account'][0].acfName);
      console.log(res['data']['account'][0].aclName);
      console.log(res['data']['account'][0].acMobile);
      console.log(res['data']['account'][0].acEmail);

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
        console.log(res['data']['account'][0].acfName);
        console.log(res['data']['account'][0].aclName);
        console.log(res['data']['account'][0].acMobile);
        console.log(res['data']['account'][0].acEmail);
  
        this.tname = res['data']['account'][0].acfName;
        this.tlastname = res['data']['account'][0].aclName;
        this.tmobile = res['data']['account'][0].acMobile;
        this.temail= res['data']['account'][0].acEmail;
      })
  
      this.modalRef = this.modalService.show(jointenant,
        Object.assign({}, { class: 'gray modal-lg' }));
      }
  
  
  
  




      OpenModal(template: TemplateRef<any>, asAsnName: string, asCountry: string, asAddress: string, asCity: string, asState, asPinCode, asPrpType, asPrpName, asNofBlks, asNofUnit, amType, noofAmenities, baBName, baIFSC, baActNo, baActType, asAssnID,BAActID,AMID) {
        console.log('amType-', amType, 'noofAmenities-', noofAmenities);
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
        console.log(asAsnName);
        console.log(asPrpName);
        console.log(asAddress);
        console.log(asNofUnit);
        console.log(asCountry);
        console.log(asPinCode);
        console.log(asState);
        console.log(asPrpType);
        console.log(asCity);
        console.log(asAssnID);
        console.log(amType);
        console.log(baBName);
    
        this.viewAssnService.getAssociationDetails(asAssnID)
    
        this.viewAssnService.getAssociationDetailsByAssociationid(asAssnID).subscribe(res => {
          //console.log(JSON.str ingify(res));
          var data: any = res;
          console.log(res['data']['association']['amenities'][0].amType);
          console.log(res['data']['association']['amenities'][0].noofAmenities);
          this.AMType = res['data']['association']['amenities'][0].amType;
          this.NoofAmenities = res['data']['association']['amenities'][0].noofAmenities;
          console.log(res['data']['association']['bankDetails'][0].babName);
          console.log(res['data']['association']['bankDetails'][0].baifsc);
          console.log(res['data']['association']['bankDetails'][0].baActNo);
          console.log(res['data']['association']['bankDetails'][0].baActType);
          this.BABName = res['data']['association']['bankDetails'][0].babName;
          this.BAIFSC = res['data']['association']['bankDetails'][0].baifsc;
          this.BAActNo = res['data']['association']['bankDetails'][0].baActNo;
          this.BAActType = res['data']['association']['bankDetails'][0].baActType;
          console.log(res['data']['association'][0].asPrpType);
          this.ASPrpType = res['data']['association'][0].asPrpType;
        });
    
        this.modalRef = this.modalService.show(template,
          Object.assign({}, { class: 'gray modal-lg' }));
      }



   OpenModals(jointemplate: TemplateRef<any>,unUnitID) {
     console.log(unUnitID);
     this.unUnitID=unUnitID;
    this.modalRef = this.modalService.show(jointemplate,
     Object.assign({}, { class: 'gray modal-lg' }));}
  
}
