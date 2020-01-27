import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from '../../services/view-block.service';
import { formatDate } from '@angular/common';
import { AddBlockService } from '../../services/add-block.service';
import { ViewUnitService } from '../../services/view-unit.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-excel-block-upload',
  templateUrl: './excel-block-upload.component.html',
  styleUrls: ['./excel-block-upload.component.css']
})
export class ExcelBlockUploadComponent implements OnInit {
  excelBlockList:any[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;

  constructor(
    public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public router:Router
  ) {
    this.excelBlockList=[];
    this.ShowExcelUploadDiscription=true;
    this.ShowExcelDataList=false;
   }

  ngOnInit() {
  }
  upLoad() {
    document.getElementById("file_upload_id").click();
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
      this.excelBlockList=jsonData['Sheet1']
      this.ShowExcelUploadDiscription=false;
      this.ShowExcelDataList=true;
      //this.createBlockFromExcel(this.excelBlockList);
    }
    reader.readAsBinaryString(file);
  }

   // CREATE BLOCK FROM EXCEL START HERE
   createBlockFromExcel() {
    console.log(this.excelBlockList)
    this.excelBlockList.forEach((item,index)=> {
      ((index) => {
        setTimeout(() => {
          let CreateBockData = {
            "ASAssnID": this.globalService.getCurrentAssociationId(),
            "ACAccntID": this.globalService.getacAccntID(),
            "blocks": [
              {
                "ASAssnID": this.globalService.getCurrentAssociationId(),
                "BLBlkName": item['BlockName'],
                "BLBlkType": item['BlockType'],
                "BLNofUnit": item['NumberOfUnits'],
                "BLMgrName": item['ManagerName'],
                "BLMgrMobile": item['ManagerMobileNumber'],
                "BLMgrEmail": item['ManagerEmailID'],
                "ASMtType": '',
                "ASMtDimBs": item['MaintenanceValue(Rupees/Sqft)'],
                "ASMtFRate": item['FlatRateValue(amount/flat)'],
                "ASUniMsmt": 'sqft',
                "ASIcRFreq": item['InvoiceCreationFrequency'],
                "ASBGnDate": formatDate(item['InvoiceGenerationDate'], 'yyyy/MM/dd', 'en'),
                "ASLPCType": item['LatePaymentChargeType'],
                "ASLPChrg": item['LatePaymentCharge'],
                "ASLPSDate": formatDate(item['StartsFrom'], 'yyyy/MM/dd', 'en'),
                "ASDPyDate": formatDate(item['InvoiceDueDate'], 'yyyy/MM/dd', 'en'),
                "BankDetails": ''
              }
            ]
          }
    
          console.log('CreateBockData', CreateBockData);
          this.addblockservice.createBlock(CreateBockData)
            .subscribe(data => {
              console.log(data);
              if (data['data'].blockID) {
                let createUnitData =
                {
                  "ASAssnID": this.globalService.getCurrentAssociationId(),
                  "ACAccntID": this.globalService.getacAccntID(),
                  "units": [
                    {
                      "UNUniName": item['BlockName'] + "-" + "Common",
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
    
                this.viewUnitService.createUnit(createUnitData).subscribe(data => {
                  console.log(data);
                },
                  err => {
                    console.log(err);
                  })
              }
            })
        },300 * index)
      })(index)
    })
    Swal.fire({
      title: "Blocks Created",
      type: "success",
      confirmButtonColor: "#f69321",
      confirmButtonText: "Yes"
    }).then(
      (result) => {
        if (result.value) {
          this.router.navigate(['blocks']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      }
    )
  }
  
}
