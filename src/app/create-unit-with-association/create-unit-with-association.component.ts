import { Component, OnInit, Input } from '@angular/core';
import {UnitArray} from '../models/unit-array';
import { ViewUnitService } from '../../services/view-unit.service';
import { GlobalServiceService } from '../global-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;
import {Subscription} from 'rxjs'


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
  @Input() BlockHrefDetail:any[];
  createUnitWithAssociation:Subscription;

  constructor(public viewUniService: ViewUnitService,
    public globalService: GlobalServiceService,
    private router: Router) {
      // this.createUnitWithAssociation=this.globalService.GetCreateUnitWithAssociation()
      // .subscribe(data=>{
      //   console.log(data);
      // })
      console.log(this.globalService.BlockHrefDetail);
      console.log(this.globalService.unitArrayList);
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
  ngAfterViewInit(){
      $(document).ready(function () {
        var navListItems = $('div.setup-panel div a'),
        AddExp = $('#AddExp'),
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
          // console.log($item);
          // console.log(anchorDiv);
          // console.log($divTgt);
          // console.log(anchorDivs);
          anchorDivs.removeClass('step-active');
          //console.log(anchorDivs);
          if (!$item.hasClass('disabled')) {
            //console.log('disabled');
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.addClass('btn-success');
            $divTgt.addClass('step-active');
            allWells.hide();
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
  getID(Id) {
    console.log(Id);
  }
  NavigateToBulkUpload(){
    this.router.navigate(['excelunit']);
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
    setTimeout(()=>{
      Swal.fire({
        title: 'Unit Created Successfuly',
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: "View Unit"
      })
    },(600 * (this.unitArrayList.length + 1)));

  }

}
