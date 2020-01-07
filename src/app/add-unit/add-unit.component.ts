import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
import {GlobalServiceService} from '../global-service.service';
import {Router} from '@angular/router'
import { NgForm } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  ownerDetails: boolean = true;
  currentAssociationID:string;
  allBlocksLists: any[];

  accountID:number;
  toggleunitvehicleinformation:boolean;
  //@ViewChild('createunitForm') createunitForm: NgForm;
  scopeIP: string;
  createunitForm:any;

  constructor(private viewUniService: ViewUnitService,
    private globalservice:GlobalServiceService,
    private router:Router,
    private http:HttpClient) {
      this.scopeIP="https://apidev.oyespace.com/";
      this.currentAssociationName=this.globalservice.getCurrentAssociationName();
      this.accountID=this.globalservice.getacAccntID();
      this.toggleunitvehicleinformation=true;

    this.blBlockID = '';
    this.occupency='Select Occupency';
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

    this.unitno='';
    this.unitrate='';
    this.unitdimension='';

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
    this.newParkingNo='';
    this.newVehicleNo='';


   }

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

  tenantOwnerdiv(occupency) {
    this.occupency=occupency;
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

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  addParking(){

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
          "UNRate": this.unitrate,
          "UNOcStat": this.occupency,
          "UNOcSDate": "2019-03-02",
          "UNOwnStat": "null",
          "UNSldDate": "2019-03-02",
          "UNDimens": this.unitdimension,
          "UNCalType": this.calculationtype,
          "BLBlockID": this.viewUniService.blockIDforUnitCreation,
          "Owner":
          [{

            "UOFName": this.ownerFirtname,
            "UOLName": this.ownerLastname,
            "UOMobile": this.ownerMobnumber,
            "UOISDCode": "+91",
            "UOMobile1": this.ownerAltnumber,
            "UOMobile2": "null",
            "UOMobile3": "null",
            "UOMobile4": "null",
            "UOEmail": this.ownerEmail,
            "UOEmail1": this.ownerAltemail,
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
            "BLBlockID": this.blockID
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
                "UPLNum": "",
                "MEMemID": "",
                "UPGPSPnt": "null"

              }
            ]
        }
      ]
    }
    ////console.log(createUnitData);

    this.viewUniService.createUnit(createUnitData).subscribe((response) => {

      Swal.fire({
        title: 'Unit Created Successfuly',
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: "View Unit"
      }).then(
       (result) => {

         if (result.value) {
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


         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigate(['home/viewunit']);
         }
       }
     )

    },
      (response) => {
        ////console.log(response);
      }); 

    

  } 

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
    .set('Authorization', 'my-auth-token')
    .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
    .set('Content-Type', 'application/json');
    return headers;
    }

}
