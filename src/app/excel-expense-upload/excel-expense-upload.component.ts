import { Component, OnInit, TemplateRef } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from 'src/services/view-block.service';
import { AddBlockService } from 'src/services/add-block.service';
import { ViewUnitService } from 'src/services/view-unit.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AddExpenseService } from 'src/services/add-expense.service';
import { DashBoardService } from 'src/services/dash-board.service';
import Swal from 'sweetalert2';
import {ExcelUploadExpenseErrorMessage} from '../../app/models/excel-upload-expense-error-message';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { formatDate } from '@angular/common';
import {ExcelExpenseList} from '../models/excel-expense-list';

@Component({
  selector: 'app-excel-expense-upload',
  templateUrl: './excel-expense-upload.component.html',
  styleUrls: ['./excel-expense-upload.component.css']
})
export class ExcelExpenseUploadComponent implements OnInit {
  excelExpenseList:any[];
  ExcelExpenseList:ExcelExpenseList[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;
  allBlocksLists:any[];
  currentBlockName:any;
  blBlockID: any;
  ExpenseListValid: boolean;
  excelUploadExpenseErrorMessage:ExcelUploadExpenseErrorMessage[];
  ExcelUploadExpenseTemplate:TemplateRef<any>;
  modalRef: BsModalRef;
  toggleExpenseErrorHeading:boolean;
  IsNotValidExcelExpenseList:boolean;

  constructor(public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public router:Router,
    private addexpenseservice: AddExpenseService,
    private modalService: BsModalService,
    private dashboardservice:DashBoardService ) {
      this.IsNotValidExcelExpenseList=false;
      this.toggleExpenseErrorHeading=true;
      this.excelUploadExpenseErrorMessage=[];
      this.ExpenseListValid=true;
      this.excelExpenseList=[];
      this.ExcelExpenseList=[];
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
  upLoad(ExcelUploadExpenseTemplate:TemplateRef<any>) {
    if(this.currentBlockName==""){
      alert("Please Select Any Block");
    }
    else{
      this.ExcelUploadExpenseTemplate=ExcelUploadExpenseTemplate;
      document.getElementById("file_upload_id").click();
    }
   
  }
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary',cellDates:true,dateNF: 'dd/mm/yyyy' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log(jsonData['Sheet1']);
      this.createExpenseFromBlock(jsonData['Sheet1']);
    }
    reader.readAsBinaryString(file);
  }
  createExpenseFromBlock(jsonDataSheet1){
    this.IsNotValidExcelExpenseList=false;
    //$(".se-pre-con").show();
    /* this.ExpenseListValid=true;
    this.excelUploadExpenseErrorMessage=[];
     Array.from(jsonDataSheet1).forEach((item,index)=>{
      ((index) => {
        setTimeout(() => {
          console.log(index);
          console.log(item);
          console.log(item['S.No']);
          console.log(item['Expense Head']);
          console.log(item['Expense Description']);
          console.log(item['Expense Recurance Type']);
          console.log(item['Applicable To Unit']);
          console.log(item['Expense Type']);
          console.log(item['Amount Paid']);
          console.log(item['Distribution Type']);
          console.log(item['Bank']);
          console.log(item['Payment Method']);
          console.log(item['Payee Name']);
          console.log(item['Expenditure Date']);
          console.log(item["Invoice-Receipt No"]);
          console.log(item["Payee Bank"]);
          console.log(item["Voucher No"]);
          console.log(item["Cheque No"]);
          console.log(item["Cheque Date"]);
          console.log(item["Demand Draft No"]);
          console.log(item["Demand Draft Date"]);
          console.log(formatDate(item["Demand Draft Date"],'dd/mm/yyyy','en'));

           if(item["Invoice-Receipt No"]==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Invoice-Receipt No','Invalid Invoice-Receipt No'))
            console.log(this.excelUploadExpenseErrorMessage);
            console.log('invalid InvoiceReceipt No');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;  
          }
          if(item['Payee Name']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Payee Name','Invalid Payee Name'))
            console.log(this.excelUploadExpenseErrorMessage);
            console.log('invalid Payee Name');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
          if(item['Expense Head']== undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Expense Head','Invalid Expense Head'))
            this.ExpenseListValid=false;
            this.ShowExcelUploadDiscription=true;
            this.ShowExcelDataList=false;
            
          }
          if(item['Expense Description']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Expense Description','Invalid Expense Description'))
            this.ExpenseListValid=false;
            this.ShowExcelUploadDiscription=true;
            this.ShowExcelDataList=false;
            
          }
          if(item['Expense Recurance Type']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Expense Recurance Type','Invalid Expense Recurance Type'))
            this.ExpenseListValid=false;
            this.ShowExcelUploadDiscription=true;
            this.ShowExcelDataList=false;
            
          }
          if(item['Applicable To Unit']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Applicable To Unit','Invalid Applicable To Unit'))
            this.ExpenseListValid=false;
            this.ShowExcelUploadDiscription=true;
            this.ShowExcelDataList=false;
            
          }
          if(item['Expense Type']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Expense Type','Invalid Expense Type'))
            this.ExpenseListValid=false;
            this.ShowExcelUploadDiscription=true;
            this.ShowExcelDataList=false;
            
          }
          if(item['Amount Paid']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Amount Paid','Invalid Amount Paid'))
            console.log('invalid amount');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
          }
          if(item['Distribution Type']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Distribution Type','Invalid Distribution Type'))
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
          if(item['Payment Method']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Payment Method','Invalid Payment Method'))
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
          if(item['Payment Method'].toLowerCase()=='cash' && item['Voucher No']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Voucher No','Invalid Voucher No'))
              console.log('invalid Voucher No');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
          } 
          if(item['Payment Method'].toLowerCase()=='cheque' && (item['Bank']==undefined || item['Payee Name']==undefined || item['Payee Bank']==undefined || item['Cheque No']==undefined || item['Cheque Date']==undefined)){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Bank , Payee Name , Payee Bank , Cheque No , Cheque Date',"'Please Note if Payment Method is 'Cheque' then 'Bank','Payee Name','Payee Bank','Cheque No','Cheque Date' column should not be empty"))
              console.log('invalid Payment Method-cheque');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
          }
          if(item['Payment Method'].toLowerCase()=='demand draft' && (item['Bank']==undefined || item['Payee Name']==undefined || item['Payee Bank']==undefined || item['Demand Draft No']==undefined || item['Demand Draft Date']==undefined)){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Bank , Payee Name , Payee Bank , Demand Draft No , Demand Draft Date',"'Please Note if Payment Method is 'Demand Draft' then 'Bank','Payee Name','Payee Bank','Demand Draft No','Demand Draft Date' column should not be empty"))
              console.log('invalid Payment Method-demand draft');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
          }
          if(item['Bank']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Bank','Invalid Bank'))
            console.log('invalid Bank');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
          if(item['Expenditure Date']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Expenditure Date','Invalid Expenditure Date'))
            console.log('invalid Expenditure Date');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
          if(item['Payee Bank']==undefined){
            this.excelUploadExpenseErrorMessage.push(new ExcelUploadExpenseErrorMessage(item['S.No'],'Payee Bank','Invalid Payee Bank'))
            console.log('invalid Payee Bank');
              this.ExpenseListValid=false;
              this.ShowExcelUploadDiscription=true;
              this.ShowExcelDataList=false;
              
          }
        }, 8000 * index)
      })(index)
    })
    setTimeout(()=>{
      console.log(this.excelUploadExpenseErrorMessage);
      if(this.ExpenseListValid){
        $(".se-pre-con").fadeOut("slow");
        this.excelExpenseList=jsonDataSheet1;
        this.ShowExcelUploadDiscription=false;
        this.ShowExcelDataList=true;
        this.toggleExpenseErrorHeading=true;
      }
      else{
        $(".se-pre-con").fadeOut("slow");
        this.toggleExpenseErrorHeading=false;
      }
    },10000*Array.from(jsonDataSheet1).length) */
    this.ShowExcelUploadDiscription=false;
    this.ShowExcelDataList=true;
    this.excelExpenseList=jsonDataSheet1; 

    let expDateOneDateAdded;
    let chkDateOneDateAdded;
    let ddDateOneDateAdded;
    this.excelExpenseList.forEach(item=>{
      let expenditureDate = new Date(item['Expenditure Date']);
      expDateOneDateAdded = new Date(expenditureDate.setDate(expenditureDate.getDate() + 1));
      console.log(expDateOneDateAdded);
      if (item['Cheque Date'] != undefined) {
        let ChequeDate = new Date(item['Cheque Date']);
        chkDateOneDateAdded = new Date(ChequeDate.setDate(ChequeDate.getDate() + 1));
        console.log(chkDateOneDateAdded);
      }
      if (item['Demand Draft Date'] != undefined) {
        let DemandDraftDate = new Date(item['Demand Draft Date']);
        ddDateOneDateAdded = new Date(DemandDraftDate.setDate(DemandDraftDate.getDate() + 1));
        console.log(ddDateOneDateAdded);
      }
      this.ExcelExpenseList.push(new ExcelExpenseList(item['Amount Paid'],
      item['Applicable To Unit'],
      item['Bank'],
      (item['Cheque Date']!=undefined?formatDate(chkDateOneDateAdded,'dd/MM/yyyy','en'):undefined),
      item['Cheque No'],
      (item['Demand Draft Date']!=undefined?formatDate(ddDateOneDateAdded,'dd/MM/yyyy','en'):undefined),
      item['Demand Draft No'],
      item['Distribution Type'],
      (item['Expenditure Date']!=undefined?formatDate(expDateOneDateAdded,'dd/MM/yyyy','en'):undefined),
      item['Expense Description'],
      item['Expense Head'],
      item['Expense Recurance Type'],
      item['Expense Type'],
      item['Invoice-Receipt No'],
      item['Payee Bank'],
      item['Payee Name'],
      item['Payment Method'],
      item['UnitName'],
      item['Voucher No']
      ))
    })
    console.log(this.ExcelExpenseList);
    //
    for(let item of this.excelExpenseList){
      if(item['Payment Method']=='Cash' && item['Voucher No']==undefined){
        console.log('1')
        this.IsNotValidExcelExpenseList=true;
        break;
      }
      if(item['Payment Method']=='Cheque' && item['Bank']==undefined && item['Payee Name']==undefined && item['Payee Bank']==undefined && item['Cheque No']==undefined && item['Cheque Date']==undefined){
        console.log('2')
        this.IsNotValidExcelExpenseList=true;
        break;
      }
      if(item['Payment Method']=='Demand Draft' && item['Bank']==undefined && item['Payee Name']==undefined && item['Payee Bank']==undefined && item['Demand Draft No']==undefined && item['Demand Draft Date']==undefined){
        console.log('3')
        this.IsNotValidExcelExpenseList=true;
        break;
      }
      if(item['Applicable To Unit']=='Single Unit' && item['UnitName']==undefined){
        console.log('4')
        this.IsNotValidExcelExpenseList=true;
        break;
      }
      if(item['Expense Head']==undefined || item['Expense Description']==undefined || item['Expense Recurance Type']==undefined || item['Applicable To Unit']==undefined || item['Expense Type']==undefined || item['Amount Paid']==undefined || item['Distribution Type']==undefined || item['Payment Method']==undefined || item['Expenditure Date']==undefined || item['Invoice-Receipt No']==undefined){
        console.log('5')
        this.IsNotValidExcelExpenseList=true;
        break;
      }
    }
  }
  createExpenseFromBlockTable() {
    let expenditureDateOneDateAdded;
    let ChequeDateDateOneDateAdded;
    let DemandDraftDateOneDateAdded;
    this.excelExpenseList.forEach(item => {
      let expenditureDate = new Date(item['Expenditure Date']);
      expenditureDateOneDateAdded = new Date(expenditureDate.setDate(expenditureDate.getDate() + 1));
      console.log(expenditureDateOneDateAdded);
      if (item['Cheque Date'] != undefined) {
        let ChequeDate = new Date(item['Cheque Date']);
        ChequeDateDateOneDateAdded = new Date(ChequeDate.setDate(ChequeDate.getDate() + 1));
        console.log(ChequeDateDateOneDateAdded);
      }
      if (item['Demand Draft Date'] != undefined) {
        let DemandDraftDate = new Date(item['Demand Draft Date']);
        DemandDraftDateOneDateAdded = new Date(DemandDraftDate.setDate(DemandDraftDate.getDate() + 1));
        console.log(DemandDraftDateOneDateAdded);
      }
      // console.log(formatDate(new Date(new Date(item['Expenditure Date']).getFullYear(), new Date(item['Expenditure Date']).getMonth(), new Date(item['Expenditure Date']).getDate()),'yyyy-MM-dd','en'));
      //console.log(formatDate(item['Expenditure Date'],'yyyy-MM-dd','en'));
      // console.log(formatDate(new Date(new Date(item['Cheque Date']).getFullYear(), new Date(item['Cheque Date']).getMonth(), new Date(item['Cheque Date']).getDate()),'yyyy-MM-dd','en'));
      //console.log(formatDate(item['Cheque Date'],'yyyy-MM-dd','en'));
      // console.log(formatDate(new Date(new Date(item['Demand Draft Date']).getFullYear(), new Date(item['Demand Draft Date']).getMonth(), new Date(item['Demand Draft Date']).getDate()),'yyyy-MM-dd','en'));
      //console.log(formatDate(item['Demand Draft Date'],'yyyy-MM-dd','en'));
      //
      let expensedata = {
        "POEAmnt": 23.65,
        "EXChqNo": (item['Cheque No']!=undefined?item['Cheque No']:''),
        "BPID": 1,
        "INNumber": item['Invoice-Receipt No'],
        "EXPyCopy": "",
        "ASAssnID": this.globalService.getCurrentAssociationId(),
        "BLBlockID": this.blBlockID,
        "EXHead": item['Expense Head'],
        "EXDesc": item['Expense Description'],
        //"EXDCreated":'2020-04-20',// formatDate(item['Expenditure Date'],'yyyy-MM-dd','en'),
        "EXDate":formatDate(expenditureDateOneDateAdded,'yyyy-MM-dd','en'),
        "EXPAmnt": item['Amount Paid'],
        "EXRecurr": item['Expense Recurance Type'],
        "EXApplTO": item['Applicable To Unit'],
        "EXType": item['Expense Type'],
        "EXDisType": item['Distribution Type'],
        "UnUniIden": (item['UnitName']!=undefined?(item['Applicable To Unit']=='Single Unit'?item['UnitName']:''):''),
        "PMID": 1,
        "BABName": (item['Bank']!=undefined?item['Bank']:''),
        "EXPBName": (item['Payee Bank']!=undefined?item['Payee Bank']:''),
        "EXChqDate":(item['Cheque Date']!=undefined?formatDate(ChequeDateDateOneDateAdded,'yyyy-MM-dd','en'):''),
        "VNName": "Bills",
        "EXDDNo": (item['Demand Draft No']!=undefined?item['Demand Draft No']:''),
        "EXDDDate":(item['Demand Draft Date']!=undefined?formatDate(DemandDraftDateOneDateAdded,'yyyy-MM-dd','en'):''),
        "EXVoucherNo": (item['Voucher No']!=undefined?item['Voucher No']:''),
        "EXAddedBy": this.dashboardservice.acfName,
        "EXPName": (item['Payee Name']!=undefined?item['Payee Name']:''),
        "POID": 1,
        "EXRABudg": 12.32
      }
      console.log(expensedata);
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
