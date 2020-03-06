import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from 'src/services/view-block.service';
import { AddBlockService } from 'src/services/add-block.service';
import { ViewUnitService } from 'src/services/view-unit.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AddExpenseService } from 'src/services/add-expense.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-excel-expense-upload',
  templateUrl: './excel-expense-upload.component.html',
  styleUrls: ['./excel-expense-upload.component.css']
})
export class ExcelExpenseUploadComponent implements OnInit {
  excelExpenseList:any[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;
  allBlocksLists:any[];
  currentBlockName:any;
  blBlockID: any;

  constructor(public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public router:Router,
    private addexpenseservice: AddExpenseService) {
      this.excelExpenseList=[];
      this.ShowExcelUploadDiscription=true;
      this.ShowExcelDataList=false;
    this.allBlocksLists=[];
    this.currentBlockName='';
     }

  ngOnInit() {
    this.addexpenseservice.GetBlockListByAssocID(this.globalService.getCurrentAssociationId())
    .subscribe(item => {
      this.allBlocksLists = item;
      //console.log('allBlocksLists', this.allBlocksLists);
    });
  }
  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
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
        "EXChqNo": (item['Cheque No']==undefined?'':item['Cheque No']),
       // "BPID": "",
        "INNumber": item['Invoice-Receipt No'],
        "EXPyCopy": "",
        "ASAssnID":this.globalService.getCurrentAssociationId(),
        "BLBlockID": this.blBlockID,
        "EXHead": item['Expense Head'],
        "EXDesc": item['Expense Description'],
        "EXDCreated": item['Expenditure Date'],
        "EXPAmnt": item['Amount Paid'],
        "EXRecurr": item['Expense Recurance Type'],
        "EXApplTO": item['Applicable To Unit'],
        "EXType": item['Expense Type'],
        "EXDisType": item['Distribution Type'],
        "UnUniIden": "",
        "PMID": 1,
        "BABName": item['Bank'],
        "EXPBName": item['Payee Bank'],
        "EXChqDate": (item['Cheque Date']==undefined?'':item['Cheque Date']),
        "VNName": "Bills",
        "EXDDNo": (item['Demand Draft No']==undefined?'':item['Demand Draft No']),
        "EXDDDate": (item['Demand Draft Date']==undefined?'':item['Demand Draft Date']),
        "EXVoucherNo": (item['Voucher No']==undefined?'':item['Voucher No']),
        "EXAddedBy":"",
        "EXPName":item['Payee Name']
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
    Swal.fire({
      title: `${this.excelExpenseList.length} - Expenses Created`,
      type: "success",
      confirmButtonColor: "#f69321",
      confirmButtonText: "Yes"
    }).then(
      (result) => {
        if (result.value) {
          this.router.navigate(['expense']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      }
    )
  }
  GetExpenseListByBlockID(blBlockID,blBlkName) {
    console.log(blBlockID,blBlkName);
    this.blBlockID = blBlockID;
    this.currentBlockName=blBlkName;
  }
}
