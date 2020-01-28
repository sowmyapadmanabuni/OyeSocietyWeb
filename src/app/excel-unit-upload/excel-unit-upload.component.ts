import { Component, OnInit } from '@angular/core';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
//import * as swal from 'sweetalert2';
import { GlobalServiceService } from '../global-service.service';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-excel-unit-upload',
  templateUrl: './excel-unit-upload.component.html',
  styleUrls: ['./excel-unit-upload.component.css']
})
export class ExcelUnitUploadComponent implements OnInit {
  excelUnitList: any[];
  ShowExcelUploadDiscription: boolean;
  ShowExcelDataList: boolean;
  blBlkName: any;
  ACAccntID: any;
  currentAssociationID: any;
  config: any;
  blocks: any[];
  currentSelectedBlockID: any;
  constructor(private router: Router, private viewUniService: ViewUnitService,
    private globalService: GlobalServiceService) {
    this.excelUnitList = [];
    this.ShowExcelUploadDiscription = true;
    this.ShowExcelDataList = false;
    this.blBlkName = 'Select Block Name';
    this.ACAccntID = this.globalService.getacAccntID();
    this.currentAssociationID = this.globalService.getCurrentAssociationId();
    //pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };
  }
  ngOnInit() {
    this.getBlocks();
  }
  upLoad() {
    document.getElementById("file_upload_id").click();
  }
  getBlocks() {
    this.viewUniService.getBlocks(this.currentAssociationID).subscribe(res => {
      //console.log(JSON.stringify(res));
      var data: any = res;
      console.log('data.data.blocksByAssoc', data.data.blocksByAssoc);
      this.blocks = data.data.blocksByAssoc;
    });
  }
  getAllUnitDetailsByBlockID(blBlockID, blBlkName) {
    this.currentSelectedBlockID = blBlockID;
    console.log('Current selected BlockID', this.currentSelectedBlockID)
  }
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //const dataString = JSON.stringify(jsonData);
      console.log(jsonData['Sheet1']);
      this.excelUnitList = jsonData['Sheet1']
      this.ShowExcelUploadDiscription = false;
      this.ShowExcelDataList = true;
      //this.createExpense(jsonData['Sheet1']);
    }
    reader.readAsBinaryString(file);
  }

  //CREATE UNIT FROM EXCEL
  createUnitFromExcel() {
    // console.log(typeof jsonData);
    this.excelUnitList.forEach(item => {
      let createUnitData =
      {
        "ASAssnID": this.currentAssociationID,
        "ACAccntID": this.globalService.getacAccntID(),
        "units": [
          {
            "UNUniName": item['Unit Name - Flat no.'],
            "UNUniType": (item['UnitType'] == undefined ? "" : item['UnitType']),
            "UNRate": (item['UnitRate'] == undefined ? "" : item['UnitRate']),
            "UNOcStat": (item['OccupancyAndOwnershipStatus'] == undefined ? "UnSold Vacant Unit" : item['OccupancyAndOwnershipStatus']),
            "UNOcSDate": "2019-03-02",
            "UNOwnStat": "null",
            "UNSldDate": "2019-03-02",
            "UNDimens": (item['UnitDimension'] == undefined ? "" : item['UnitDimension']),
            "UNCalType": (item['CalculationType'] == undefined ? "" : item['CalculationType']),
            "BLBlockID": this.currentSelectedBlockID,
            "Owner":
              [{

                "UOFName": (item['OwnerFirstName'] == undefined ? "" : item['OwnerFirstName']),
                "UOLName": (item['OwnerLastname'] == undefined ? "" : item['OwnerLastname']),
                "UOMobile": (item['OwnerMobile'] == undefined ? "" : item['OwnerMobile']),
                "UOISDCode": "+91",
                "UOMobile1": "null",
                "UOMobile2": "null",
                "UOMobile3": "null",
                "UOMobile4": "null",
                "UOEmail": (item['OwnerEmailID'] == undefined ? "" : item['OwnerEmailID']),
                "UOEmail1": "null",
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
              "BLBlockID": this.currentSelectedBlockID
            },
            "Tenant":
              [{

                "UTFName": (item['TenantFirstName'] == undefined ? "" : item['TenantFirstName']),
                "UTLName": (item['TenantLastName'] == undefined ? "" : item['TenantLastName']),
                "UTMobile": (item['TenantMobileNumber'] == undefined ? "" : item['TenantMobileNumber']),
                "UTISDCode": "+91",
                "UTMobile1": "",
                "UTEmail": (item['TenantEmail'] == undefined ? "" : item['TenantEmail']),
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
    })
    Swal.fire({
      title: `${this.excelUnitList.length} - Unit Created Successfuly`,
      type: 'success',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: "View Unit"
    }).then(
      (result) => {
        if (result.value) {
          this.router.navigate(['units']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      }
    )
  }
  //CREATE UNIT FROM EXCEL

}