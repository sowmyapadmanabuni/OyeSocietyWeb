import { Component, OnInit, ViewChild, Input , Output, EventEmitter} from '@angular/core';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
import {GlobalServiceService} from '../global-service.service';
import {Router} from '@angular/router'
import { NgForm } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {ParkingDetail} from '../../app/models/parking-detail';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css']
})
export class AddUnitComponent implements OnInit {
  currentAssociationName:string;
  blockID: string;
  allUnitBYBlockID: any[];
  blBlockID: string;
  showCreateUnitemplate:boolean;
  calculationTypes:object[];

  unitTypes:object[];
  unitType:string;
  unitno:string;
  unitdimension:string;
  unitrate:string;
  calculationtype:string;
  occupency:string;
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
  newParkingNo:any;
  newVehicleNo:any;
  occupencys:object[];
  tenantDetails: boolean = false;
  ownerDetails: boolean = false;
  currentAssociationID:string;
  allBlocksLists: any[];

  accountID:number;
  toggleunitvehicleinformation:boolean;
  //@ViewChild('createunitForm') createunitForm: NgForm;
  scopeIP: string;
  createunitForm:any;
  newParkingDetail:any={};
  parkingDetails:any[];
  deleteAmenity:any;
  @Input() checkIsUnitCreated:EventEmitter<string>;
  InvalidUnitDimension:boolean;
  InvalidUnitRate:boolean;
  @Output() EnableUnitListView:EventEmitter<string>;
  UNCalType:any;
  UNRate:any;

  constructor(private viewUniService: ViewUnitService,
    private globalservice:GlobalServiceService,
    private router:Router,
    private http:HttpClient) {
      this.UNCalType='';
      this.UNRate='';
      this.InvalidUnitDimension = false;
      this.InvalidUnitRate=false;
      this.scopeIP="https://apidev.oyespace.com/";
      this.currentAssociationName=this.globalservice.getCurrentAssociationName();
      this.accountID=this.globalservice.getacAccntID();
      this.toggleunitvehicleinformation=true;
      this.EnableUnitListView=new EventEmitter<string>();

    this.blBlockID = '';
    this.occupency='Select Occupancy';
    this.unitType='Select Unit Type';
    this.calculationtype='Select Calcula...';
    this.blockID='';

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


    this.unitno = '';
    this.unitrate = '';
    this.unitdimension = '';

    this.ownerFirtname = '';
    this.ownerLastname = '';
    this.ownerMobnumber = '';
    this.ownerAltnumber = '';
    this.ownerEmail = '';
    this.ownerAltemail = '';
    this.tenantFirtname = '';
    this.tenantLastname = '';
    this.tenantMobnumber = '';
    this.tenantEmail = '';
    this.newParkingNo = '';
    this.newVehicleNo = '';
    this.parkingDetails = [];
    this.newParkingDetail.ParkingLotNumber = "";
    this.newParkingDetail.VehicleNumber = "";
    this.checkIsUnitCreated=new EventEmitter<string>();
   }
   occupancy = [
    "Sold Owner Occupied Unit" ,
    "Sold Tenant Occupied Unit" ,
    "Sold Vacant Unit" ,
    "UnSold Vacant Unit" ,
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
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    //console.log('this.currentAssociationID',this.currentAssociationID);
    this.viewUniService.GetBlockListByAssocID(this.currentAssociationID)
    .subscribe(data => {
      this.allBlocksLists = data['data'].blocksByAssoc;
      //console.log('allBlocksLists',this.allBlocksLists);
    });
  }

  getAllUnitDetailsByBlockID(blBlockID) {
    //console.log('getAllUnitDetailsByBlockID',blBlockID)
    this.blockID = blBlockID;
    //console.log('this.blockID',this.blockID)
    /*-------------------Get Unit List By Block ID ------------------*/
    this.viewUniService.GetUnitListByBlockID(blBlockID)
      .subscribe(data => {
        //console.log('allUnitBYBlockID',data);
        this.allUnitBYBlockID = data['data'].unitsByBlockID;
      });

      this.showCreateUnitemplate=true;
  }

  getUnitType(unitTpname) {
    ////console.log(unitTpname);
    this.unitType = unitTpname;
  }
  getOccupencyandOwnershipStatus(occupencyname) {
    ////console.log(occupencyname);
    this.occupency = occupencyname;
  }
  getCalculationTypes(calculationTypename) {
    ////console.log(calculationTypename);
    this.calculationtype = calculationTypename;
  }

  ResetCreateUnitFormOne(ev,occupency) {
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
          this.occupency=occupency;
          if(this.occupency){
            this.occupancy.forEach(item => {
              if (occupency == 'UnSold Vacant Unit') {
                this.unitno='';
                this.occupency='';
                this.unitType='';
                this.unitdimension='';
                this.UNCalType='';
                this.UNRate='';
                this.tenantDetails = false;
                this.ownerDetails = false;
              }
              else if (occupency == 'UnSold Tenant Occupied Unit') {
                this.unitno='';
                this.occupency='';
                this.unitType='';
                this.unitdimension='';
                this.UNCalType='';
                this.UNRate='';
                this.tenantFirtname='';
                this.tenantLastname='';
                this.tenantMobnumber='';
                this.tenantEmail='';
                this.tenantDetails = false;
                this.ownerDetails = false;
              }
              else if (occupency == 'Sold Tenant Occupied Unit') {
                this.unitno='';
                this.occupency='';
                this.unitType='';
                this.unitdimension='';
                this.UNCalType='';
                this.UNRate='';
                this.ownerFirtname = '';
                this.ownerLastname = '';
                this.ownerMobnumber = '';
                this.ownerEmail = '';
      
                this.tenantFirtname='';
                this.tenantLastname='';
                this.tenantMobnumber='';
                this.tenantEmail='';
                this.tenantDetails = false;
                this.ownerDetails = false;
              }
              else {
                this.unitno='';
                this.occupency='';
                this.unitType='';
                this.unitdimension='';
                this.UNCalType='';
                this.UNRate='';
                this.ownerFirtname = '';
                this.ownerLastname = '';
                this.ownerMobnumber = '';
                this.ownerEmail = '';
                this.tenantDetails = false;
                this.ownerDetails = false;
              }
            })
          }
          else{
            this.unitno='';
            this.occupency='';
            this.unitType='';
            this.unitdimension='';
            this.UNCalType='';
            this.UNRate='';
            this.tenantDetails = false;
            this.ownerDetails = false;
          }
       
        }
      })

  }

  ResetCreateUnitFormTwo(){
    this.ownerFirtname = '';
    this.ownerLastname = '';
    this.ownerMobnumber='';
    this.ownerEmail='';
    this.tenantFirtname='';
    this.tenantLastname='';
    this.tenantMobnumber='';
    this.tenantEmail='';
  }
  flatnovalid:boolean;
  ownerfirstnamevalid:boolean;
  ownerlastnamevalid:boolean;
  ownermobilevalid:boolean;
  owneremailvalid:boolean;
  tenantFirtnamevalid:boolean;
  tenantLastnamevalid:boolean;
  tenantmobilevalid:boolean;
  tenantemailvalid:boolean;



  validateflatno(ev,unitno){
    if (unitno != "" || undefined) {
      this.flatnovalid = false;
    } else {
      this.flatnovalid = true;
    }
  }
  validateownerfirtname(ev,ownerFirtname){
    if (ownerFirtname != "" || undefined) {
      this.ownerfirstnamevalid = false;
    } else {
      this.ownerfirstnamevalid = true;
    }
  }
  validateownerlastname(ev,ownerLastname){
    if (ownerLastname != "" || undefined) {
      this.ownerlastnamevalid = false;
    } else {
      this.ownerlastnamevalid = true;
    }
  }
  validateownermobile(ev,ownerMobnumber){
    if (ownerMobnumber != "" || undefined) {
      this.ownermobilevalid = false;
    } else {
      this.ownermobilevalid = true;
    }
  }
  validateowneremail(ev,ownerEmail){
    if (ownerEmail != "" || undefined) {
      this.owneremailvalid = false;
    } else {
      this.owneremailvalid = true;
    }
  }
  validatetenantfirstname(ev,tenantFirtname){
    if (tenantFirtname != "" || undefined) {
      this.tenantFirtnamevalid = false;
    } else {
      this.tenantFirtnamevalid = true;
    }
  }
  validatetenantlastname(ev,tenantLastname){
    if (tenantLastname != "" || undefined) {
      this.tenantLastnamevalid = false;
    } else {
      this.tenantLastnamevalid = true;
    }
  }
  validatetenantmobile(ev,tenantMobnumber){
    if (tenantMobnumber != "" || undefined) {
      this.tenantmobilevalid = false;
    } else {
      this.tenantmobilevalid = true;
    }
  }

  validatetenantemail(ev,tenantEmail){
    if (tenantEmail != "" || undefined) {
      this.tenantemailvalid = false;
    } else {
      this.tenantemailvalid = true;
    }
  }
 
  tenantOwnerdiv(occupency) {
    this.occupency=occupency;
    if(this.occupency){
      this.occupancy.forEach(item => {
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
 
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  _keyPress4(event: any) {
    const pattern = /[\d*\.?\d?]/;
    //var RegExp = new RegExp(/^\d*\.?\d*$/); 
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
    //if (!RegExp.test(event.target.value)) {
        event.preventDefault();
    }
  }

  addParking(){
    if(this.newParkingDetail.ParkingLotNumber !== "" && this.newParkingDetail.VehicleNumber !== ""){
      this.parkingDetails.push(new ParkingDetail(this.newParkingDetail.ParkingLotNumber,this.newParkingDetail.VehicleNumber));
      console.log(this.parkingDetails);
    }
    this.newParkingDetail.ParkingLotNumber = "";
    this.newParkingDetail.VehicleNumber = "";
    console.log(typeof this.newParkingDetail.ParkingLotNumber);
  }
  deleteamenity(ParkingLotNumber) {
    //console.log('AMType', AMType);
    this.parkingDetails = this.parkingDetails.filter(item =>{return item['ParkingLotNumber'] != ParkingLotNumber});
  }
  getCalculationTypesUpadte(UNCalType){
    this.UNCalType = UNCalType;
    // this.UNCalTypeForEdit = UNCalType;
  }
  createUnit() {

    let createUnitData =
    {
      "ASAssnID": this.currentAssociationID,
      "ACAccntID": this.accountID,
      "units": [
        {
          "UNUniName": this.unitno,
          "UNUniType": this.unitType,
          "UNRate": this.UNRate,
          "UNOcStat": this.occupency,
          "UNOcSDate": "2019-03-02",
          "UNOwnStat": "",
          "UNSldDate": "2019-03-02",
          "UNDimens": this.unitdimension,
          "UNCalType": this.UNCalType,
          "FLFloorID": 14,
          "BLBlockID": this.viewUniService.blockIDforUnitCreation,
          "Owner":
          [{

            "UOFName": this.ownerFirtname,
            "UOLName": this.ownerLastname,
            "UOMobile": this.ownerMobnumber,
            "UOISDCode": "+91",
            "UOMobile1": "",
            "UOMobile2": "",
            "UOMobile3": "",
            "UOMobile4": "",
            "UOEmail": this.ownerEmail,
            "UOEmail1": "",
            "UOEmail2": "",
            "UOEmail3": "",
            "UOEmail4": "",
            "UOCDAmnt": "2000"
          }],
          "unitbankaccount":
          {
            "UBName": "SBI",
            "UBIFSC": "SBIN0014",
            "UBActNo": "LOP9090909",
            "UBActType": "Savings",
            "UBActBal": 12.3,
            "BLBlockID": this.viewUniService.blockIDforUnitCreation
          },
        "Tenant":
          [{

            "UTFName":this.tenantFirtname,
            "UTLName": this.tenantLastname,
            "UTMobile": this.tenantMobnumber,
            "UTISDCode": "+91",
            "UTMobile1": "",
            "UTEmail": this.tenantEmail,
            "UTEmail1": ""
          }],
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
    console.log(createUnitData);

    this.viewUniService.createUnit(createUnitData).subscribe((response) => {
      console.log(response);
      if(response['error']){
        Swal.fire({
          title: response['error']['message'],
          type: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: "View Unit"
        })
      }
      else{
        Swal.fire({
          title: 'Unit Created Successfuly',
          type: 'success',
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: "View Unit"
        }).then(
         (result) => {
          //this.globalservice.IsUnitCreated=true;
          //this.router.navigate(['units']); 
  
           if (result.value) {
             console.log('inside unit test');
             //this.createunitForm.reset();
             this.unitno='';
             this.unitType='';
             this.calculationtype='';
             this.unitrate='';
             this.unitdimension='';
             this.occupency='';
         
             this.ownerFirtname='';
             this.ownerLastname='';
             this.ownerMobnumber='';
             this.ownerAltnumber='';
             this.ownerEmail='';
             this.ownerAltemail='';
             this.tenantFirtname='';
             this.tenantLastname='';
             this.tenantMobnumber='';
             this.tenantEmail='';
             //this.checkIsUnitCreated.emit('true');
             this.viewUniService.addUnits=false;
             this.viewUniService.unitList=true;
             this.EnableUnitListView.emit('EnableUnitList');
  
           } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.router.navigate(['home/viewunit']);
  
           }
         }
       )
      }
    },
      (response) => {
        console.log(response);
      }); 

    

  } 
  ValidateLessThanZeroValue() {
    console.log(this.unitdimension);
    if (Number(this.unitdimension) <= 0) {
      this.InvalidUnitDimension = true;
    }
    else{
      this.InvalidUnitDimension = false;
    }
  }
  ValidateUnitRateLessThanZeroValue(){
    console.log(this.unitrate);
    if (Number(this.unitrate) <= 0) {
      this.InvalidUnitRate = true;
    }
    else{
      this.InvalidUnitRate = false;
    }
  }
  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
    .set('Authorization', 'my-auth-token')
    .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
    .set('Content-Type', 'application/json');
    return headers;
    }

}
