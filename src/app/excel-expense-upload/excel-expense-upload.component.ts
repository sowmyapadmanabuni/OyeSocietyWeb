import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from 'src/services/view-block.service';
import { AddBlockService } from 'src/services/add-block.service';
import { ViewUnitService } from 'src/services/view-unit.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AddExpenseService } from 'src/services/add-expense.service';

@Component({
  selector: 'app-excel-expense-upload',
  templateUrl: './excel-expense-upload.component.html',
  styleUrls: ['./excel-expense-upload.component.css']
})
export class ExcelExpenseUploadComponent implements OnInit {
  excelExpenseList:any[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;

  constructor(public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public router:Router,
    private addexpenseservice: AddExpenseService) {
      this.excelExpenseList=[];
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
      this.excelExpenseList=jsonData['Sheet1']
      this.ShowExcelUploadDiscription=false;
      this.ShowExcelDataList=true;
      //this.createBlockFromExcel(this.excelBlockList);
    }
    reader.readAsBinaryString(file);
  }
  createExpenseFromBlock(){
    console.log(this.excelExpenseList);
    this.excelExpenseList.forEach(item=>{
      let expensedata={
       // "POEAmnt": "",
        "EXChqNo": (item['ChequeNo']==undefined?'':item['ChequeNo']),
       // "BPID": "",
        "INNumber": item['Invoice-ReceiptNo'],
        "EXPyCopy": "",
        "ASAssnID":this.globalService.getCurrentAssociationId(),
        "BLBlockID": '',//this.blockID,
        "EXHead": item['ExpenseHead'],
        "EXDesc": item['ExpenseDescription'],
        "EXDCreated": item['ExpenditureDate'],
        "EXPAmnt": item['AmountPaid'],
        "EXRecurr": item['ExpenseRecurranceType'],
        "EXApplTO": item['ApplicableToUnit'],
        "EXType": item['ExpenseType'],
        "EXDisType": item['DistributionType'],
        "UnUniIden": "",
        "PMID": 1,
        "BABName": item['Bank'],
        "EXPBName": item['PayeeBankName'],
        "EXChqDate": (item['ChequeDate']==undefined?'':item['ChequeDate']),
        "VNName": "Bills",
        "EXDDNo": (item['DemandDraftNo']==undefined?'':item['DemandDraftNo']),
        "EXDDDate": (item['DemandDraftDate']==undefined?'':item['DemandDraftDate']),
        "EXVoucherNo": (item['VoucherNo']==undefined?'':item['VoucherNo']),
        "EXAddedBy":"",
        "EXPName":item['PayeeName']
      }
      this.addexpenseservice.createExpense(expensedata)
        .subscribe(
          (data) => {
            console.log(data);
          },
          (err) => {
            console.log(err);
          }
        );
    })
  }
}
