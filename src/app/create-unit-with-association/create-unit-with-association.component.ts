import { Component, OnInit, Input } from '@angular/core';
import {UnitArray} from '../models/unit-array';
import { ViewUnitService } from '../../services/view-unit.service';
import { GlobalServiceService } from '../global-service.service';


@Component({
  selector: 'app-create-unit-with-association',
  templateUrl: './create-unit-with-association.component.html',
  styleUrls: ['./create-unit-with-association.component.css']
})
export class CreateUnitWithAssociationComponent implements OnInit {
  unitTypes:object[];
  unitType: any;
  unitArray: UnitArray[];
  calculationTypes:object[];
  calculationtype: any;
  occupencys:object[];
  occupency: any;
  tenantDetails: boolean;
  ownerDetails: boolean;
  toggleunitvehicleinformation: boolean;
  @Input() unitArrayList:any[];

  constructor(public viewUniService: ViewUnitService, public globalService: GlobalServiceService,) {
    this.unitTypes = [
      { "name": "Flat-1BHK" },
      { "name": "Flat-2BHK" },
      { "name": "Flat-3BHK" },
      { "name": "Villa-2BHK" },
      { "name": "Villa-3BHK" },
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

  ngOnInit() {
  }
  getUnitType(unitTpname,_id) {
    console.log(unitTpname);
    this.unitType = unitTpname;
    for (let i = 0; i < this.unitArrayList.length; i++) {
      if (this.unitArray[i]['_id'] == _id) {
          this.unitArray[i]['_unitType'] = unitTpname;
      }
    }
    console.log(this.unitArrayList);
  }
  getCalculationTypes(calculationTypename,_id) {
    ////console.log(calculationTypename);
    this.calculationtype = calculationTypename;
    for (let i = 0; i < this.unitArrayList.length; i++) {
      if (this.unitArrayList[i]['_id'] == _id) {
          this.unitArrayList[i]['_calculationtype'] = calculationTypename;
      }
    }
    console.log(this.unitArrayList);
  }
  tenantOwnerdiv(occupency,_id) {
    this.occupency=occupency;
    for (let i = 0; i < this.unitArrayList.length; i++) {
      if (this.unitArrayList[i]['_id'] == _id) {
          this.unitArrayList[i]['_occupency'] = occupency;
      }
    }
    console.log(this.unitArrayList);
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
  createUnit() {
    console.log(this.unitArrayList);
    this.unitArrayList.forEach((item,index)=> {
      ((index) => {
        setTimeout(() => {
          let createUnitData =
          {
            "ASAssnID": this.globalService.getCurrentAssociationId(),
            "ACAccntID": this.globalService.getacAccntID(),
            "units": [
              {
                "UNUniName": item['_unitno'],
                "UNUniType": item['_unitType'],
                "UNRate": item['_unitrate'],
                "UNOcStat": item['_occupency'],
                "UNOcSDate": "2019-03-02",
                "UNOwnStat": "null",
                "UNSldDate": "2019-03-02",
                "UNDimens": item['_unitdimension'],
                "UNCalType": item['_calculationtype'],
                "BLBlockID": item['_BlockID'],
                "Owner":
                  [{
      
                    "UOFName": item['_ownerFirtname'],
                    "UOLName": item['_ownerLastname'],
                    "UOMobile": item['_ownerMobnumber'],
                    "UOISDCode": "+91",
                    "UOMobile1": "",
                    "UOMobile2": "null",
                    "UOMobile3": "null",
                    "UOMobile4": "null",
                    "UOEmail": item['_ownerEmail'],
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
                  "BLBlockID": item['_BlockID']
                },
                "Tenant":
                  [{
      
                    "UTFName": item['_tenantFirtname'],
                    "UTLName": item['_tenantLastname'],
                    "UTMobile": item['_tenantMobnumber'],
                    "UTISDCode": "+91",
                    "UTMobile1": "",
                    "UTEmail": item['_tenantEmail'],
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
        },600 * index)
      })(index)
    })
  }
  

}
