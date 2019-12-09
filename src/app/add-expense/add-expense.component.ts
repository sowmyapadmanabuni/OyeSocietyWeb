import { Component, OnInit } from '@angular/core';
import { AddExpenseService } from '../../services/add-expense.service';
import { ViewExpensesService } from '../../services/view-expenses.service';
import { BlocksByAssoc } from '../models/blocks-by-assoc';
import { Router } from '@angular/router';
import { PurchaseOrdersByAssoc } from '../models/purchase-orders-by-assoc';
import { UnitsByBlockID } from '../models/units-by-block-id';
import { ExpenseData } from '../models/expense-data';
import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {GlobalServiceService} from '../global-service.service';

//import * as XLSX from 'xlsx';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  blockID: number;
  availableNoOfBlocks: number;
  allBlocksLists: BlocksByAssoc[];
  purchaseOrders: PurchaseOrdersByAssoc[];
  blockName: string;
  dateandTime: Date;
  purchaseorderid: string;
  applicableto: string;
  expenserecurrencetype: string;
  expensetype: string;
  expenseHead: object[];
  categories: object[];
  expensecategories: object[];
  applicabltToUnits: object[];
  distributionTypes: object[];
  expensehead: string;
  applies: string;
  distribution: string;
  ascUnit: UnitsByBlockID[];
  unitid: number;
  unit: string;
  methodArray: object[];
  checkField: string;
  paybymethod: string;
  selectedFile: File;
  expensedata: ExpenseData;
  allUnitListsByBlock: object;
  existingNoOfUnits: number;
  maxUnitsPerBlock: number;
  avialableUnitSpace: number;
  //@ViewChild('addExpense') form: any;
  minDate: Date;
  minDemandDraftDate: Date;
  bsConfig: object;
  EXDate: Date;
  EXChqDate: Date;
  EXDDDate: Date;
  bankList: string[];
  dynamic: number;
  isLargefile: boolean;
  isnotValidformat: boolean;
  disableButton: boolean;

  currentAssociationID:string;
  currentAssociationName:string;

  isSingleUnit:boolean;
  otherThanSingleUnit:boolean;
  defaultThumbnail:string;

  arrayBuffer:any;
  file:File;
  expensedataXlsx:ExpenseData;
  pmid:any;
  paymentMethodType:any;

  constructor(private addexpenseservice: AddExpenseService,
    private router: Router,
    private viewexpensesservice: ViewExpensesService,
    private globalservice:GlobalServiceService) {

    this.currentAssociationID=this.globalservice.getCurrentAssociationId();
    this.currentAssociationName=this.globalservice.getCurrentAssociationName();
    this.expensedata = new ExpenseData();
    this.expensedataXlsx=new ExpenseData();
    this.expensedata.POID=1;
    this.expensedata.EXRABudg=12.32;
    this.expensedata.POEAmnt=23.65;
    this.expensedata.EXChqNo='';
    this.expensedata.BPID=1;
    this.expensedata.EXPName='';
    this.expensedata.INNumber="";
    this.expensedata.EXPyCopy='';
    this.selectedFile = null;
    this.blockName = '';
    this.purchaseorderid = '';
    this.expensehead = '';
    this.expenserecurrencetype = '';
    this.applicableto = '';
    this.expensetype = '';
    this.distribution = '';
    this.unit = '';
    this.paybymethod = '';
    this.dateandTime = new Date();
    this.expensedata.ASAssnID = this.currentAssociationID;
    this.expensedata.BLBlockID = '';
    //this.expensedata.POID = '';
    this.expensedata.EXHead = 'Select Expense Head';
    this.expensedata.EXDesc =  "";
    this.expensedata.EXDate = "2018-02-02";
    this.expensedata.EXPAmnt = '';
    this.expensedata.EXRecurr = 'Select Expense Type';
    this.expensedata.EXApplTO = 'Select Applicable To Unit';
    this.expensedata.EXType = 'Select Expense Type';
    this.expensedata.EXDisType = 'Select Distribution Type';
    this.expensedata.UnUniIden = 'Select Unit';
    this.paymentMethodType='Select Payment Method';
    this.expensedata.PMID = '';
    this.expensedata.BABName = 'Select Bank';
    this.expensedata.EXPBName = 'Payee Bank';
    this.expensedata.EXChqDate="2018-02-02";
    this.expensedata.VNName='Bills';
    this.expensedata.EXDDNo='';
    this.expensedata.EXDDDate='';
    this.expensedata.EXVoucherNo='';
    this.expensedata.EXAddedBy='';
    this.avialableUnitSpace = 0;
    this.EXDate = null;
    this.EXChqDate = null;
    this.EXDDDate = null;
    this.dynamic = 0;
    this.isLargefile = false;
    this.isnotValidformat = false;
    this.disableButton = false;
    this.isSingleUnit=false;
    this.otherThanSingleUnit=true;
    this.pmid=0;

    this.defaultThumbnail='../../assets/images/default_thumbnail.png';

    this.expenseHead = [
      { 'name': '', 'displayName': 'Corpus', 'id': 1 },
      { 'name': '', 'displayName': 'Generator', 'id': 2 },
      { 'name': '', 'displayName': 'Common Area Electric Bill', 'id': 3 },
      { 'name': '', 'displayName': 'Security Fees', 'id': 4 },
      { 'name': '', 'displayName': 'HouseKeeping', 'id': 5 },
      { 'name': '', 'displayName': 'Fixed Maintenance', 'id': 6 },
      { 'name': '', 'displayName': 'One Time Onboarding fee', 'id': 7 },
      { 'name': '', 'displayName': 'One Time Membership fee', 'id': 8 },
      { 'name': '', 'displayName': 'Water Meter', 'id': 9 },
      { 'name': '', 'displayName': 'Renting Fees', 'id': 10 },
      { 'name': '', 'displayName': 'Unsold Rental Fees', 'id': 11 },
      { 'name': '', 'displayName': 'One Time Occupancy Fees', 'id': 12 }
    ]

    this.categories = [
      { "name": "Monthly", "displayName": "Monthly", "id": 1 },
      { "name": "Quaterly", "displayName": "Quaterly", "id": 3 },
      { "name": "HalfYearly", "displayName": "Half Yearly", "id": 6 },
      { "name": "Annually", "displayName": "Annually", "id": 12 }
    ]

    this.expensecategories = [{ "name": "Fixed", "displayName": "Fixed", "id": 10 }, { "name": "Variable", "displayName": "Variable", "id": 11 }]

    this.applicabltToUnits = [
      { 'name': 'All Units', 'displayName': 'All Units' },
      { 'name': 'Single Unit', 'displayName': 'Single Unit' },
      { 'name': 'All Sold Owner Occupied Units', 'displayName': 'All Sold Owner Occupied Units' },
      { 'name': 'All Sold Tenant Occupied Units', 'displayName': 'All Sold Tenant Occupied Units' },
      { 'name': 'All Sold Vacant Units', 'displayName': 'All Sold Vacant Units' },
      { 'name': 'Unsold Vacant Units', 'displayName': 'Unsold Vacant Units' },
      { 'name': 'Unsold Tenant Occupied Units', 'displayName': 'Unsold Tenant Occupied Units' },
      { 'name': 'All Sold Units', 'displayName': 'All Sold Units' },
      { 'name': 'All UnSold Units', 'displayName': 'All UnSold Units' },
      { 'name': 'All Occupied Units', 'displayName': 'All Occupied Units' },
      { 'name': 'All Vacant Unit', 'displayName': 'All Vacant Unit' }
    ]

    this.methodArray = [{ 'name': 'Cash', 'displayName': 'Cash', 'id': 1 },
    { 'name': 'Cheque', 'displayName': 'Cheque', 'id': 2 },
    { 'name': 'DemandDraft', 'displayName': 'Demand Draft', 'id': 3 },
    { 'name': 'OnlinePay', 'displayName': 'OnlinePay', 'id': 4 }
    ]

    this.distributionTypes = [{ "name": "Dimension Based","displayName":"Dimension Based" }, 
    { "name": "Per Unit","displayName":"Per Unit" }];

    this.bankList = [
      'Allahabad Bank',
      'Andhra Bank',
      'Bank of Baroda',
      'Bank of India',
      'Bank of Maharashtra',
      'Canara Bank',
      'Central Bank of India',
      'Corporation Bank',
      'Indian Bank',
      'Indian Overseas Bank',
      'Oriental Bank of Commerce',
      'Punjab and Sind Bank',
      'Punjab National Bank',
      'State Bank of India',
      'Syndicate Bank',
      'UCO Bank',
      'Union Bank of India',
      'United Bank of India',
      'Catholic Syrian Bank',
      'City Union Bank',
      'DCB Bank',
      'Dhanlaxmi Bank',
      'Federal Bank',
      'HDFC Bank',
      'ICICI Bank',
      'IDFC First Bank',
      'IndusInd Bank',
      'Jammu & Kashmir Bank',
      'Karnataka Bank',
      'Karur Vysya Bank',
      'Kotak Mahindra Bank',
      'Lakshmi Vilas Bank',
      'Nainital Bank',
      'RBL Bank',
      'South Indian Bank',
      'Tamilnad Mercantile Bank Limited',
      'Yes Bank',
      'IDBI Bank'
    ]

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());

    this.minDemandDraftDate = new Date();
    this.minDemandDraftDate.setDate(this.minDemandDraftDate.getDate() - 80);

    this.bsConfig = Object.assign({}, { containerClass: 'theme-orange',
     dateInputFormat: 'DD-MM-YYYY',
     showWeekNumbers:false,
     isAnimated: true});

  }

  ngOnInit() {
    this.addexpenseservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(item => {
        this.allBlocksLists = item;
        this.availableNoOfBlocks = item.length;
        console.log('allBlocksLists', this.allBlocksLists);

      });

    this.addexpenseservice.GetPurchaseOrderListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        console.log(data);
        this.purchaseOrders = data;
      });

    this.addexpenseservice.getAssociationList(this.currentAssociationID);
    //this.addexpenseservice.applicableTo('applicableTo');
  }
  // poDetails(POID) {
  //   let purchaseOrders = this.purchaseOrders.find(po => po['poid'] == POID);
  //   console.log(purchaseOrders);
  //   this.expensedata.POEAmnt = purchaseOrders['poEstAmt'];
  //   this.expensedata.VNName = purchaseOrders['poPrfVen'];
  //   this.expensedata.BPIden = purchaseOrders['bpIden'];
  //   this.expensedata.EXRABudg = 0;
  // }
  prerequisitesAddUnit(blBlockID) {
    console.log('prerequisitesAddUnit', blBlockID);
    this.blockID = blBlockID;
    let blockbyassoc = this.allBlocksLists.find(item => item['blBlockID'] == blBlockID);
    this.maxUnitsPerBlock = blockbyassoc['blNofUnit'];

    this.addexpenseservice.prerequisitesAddUnit(blockbyassoc['blBlockID'])
      .subscribe(data => {
        this.allUnitListsByBlock = data['data'];
        this.existingNoOfUnits = data['data']['unitsByBlockID'].length;
        this.avialableUnitSpace = this.maxUnitsPerBlock - this.existingNoOfUnits;
        console.log('avialableUnitSpace', this.avialableUnitSpace);
      },
        (response) => {
          console.log(response.message);
        });
  }
  getexpensedataBABName(bank) {
    this.expensedata.BABName = bank;
  }
  gotoViewexpense() {
    this.router.navigate(['home/viewexpense']);
  }
  applicableTo(EXApplTO: string) {
    this.applies = EXApplTO;
    this.expensedata.EXApplTO=EXApplTO;
    if (EXApplTO == 'Single Unit') {
      this.isSingleUnit = true;
      this.otherThanSingleUnit=false;
      this.expensedata.EXDisType='Actuals';
    } 
    else if(EXApplTO != 'Single Unit'){
      this.expensedata.EXDisType='Select Distribution Type';
      this.expensedata.UnUniIden ='Select Unit';
      this.otherThanSingleUnit=true;
      this.isSingleUnit = false;
    }
    //  $scope.ascUnit = '';
    this.addexpenseservice.GetUnitListByBlockID(this.viewexpensesservice.currentBlockId)
      .subscribe(data => {
        this.ascUnit = data;
      })
  }
  getexpensedataEXType(displayName) {
    this.expensedata.EXType = displayName;
  }
  getExpenseDataEXDisType(name) {
    this.expensedata.EXDisType = name;
  }
  getExpenseHead(displayName) {
    this.expensedata.EXHead = displayName;
  }
  getExpenseReccuranceType(displayName){
    this.expensedata.EXRecurr=displayName;
  }
  getUnit(unUniName){
    this.expensedata.UnUniIden=unUniName;
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
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
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
  

    this.expensedata.EXPyCopy = expycopy;
  }
  removeSelectedfile() {
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
    imgthumbnailelement.src = this.defaultThumbnail;
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
    dataTransfer.items.add('', '');
    console.log('dataTransfer', dataTransfer);
    const inputElement: HTMLInputElement = document.getElementById('uploadFileinput') as HTMLInputElement;
    console.log('inputElement', inputElement.files);
    inputElement.files = dataTransfer.files;
    this.disableButton=false;
    this.isnotValidformat = false;
    this.isLargefile = false;
  }
  Upload() {
    document.getElementById("file_upload_id").click();
  }
 /* onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary',cellDates:true });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log(jsonData);
      this.addExpFromXlsx(jsonData);
    }
    reader.readAsBinaryString(file);
  }*/

  onUpLoad() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.expensedata.EXPyCopy);
    this.addexpenseservice.onUpLoad(fd)
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
  addExpFromXlsx(jsonData){

    switch (jsonData['Sheet1'][0]['Payment Method']) {
      case 'Cash':
       this.expensedata.PMID = 1;
      case 'Cheque':
       this.expensedata.PMID = 2;
      case 'Demand Draft':
       this.expensedata.PMID = 3;
      case 'OnlinePay':
       this.expensedata.PMID = 4;
    }
   this.expensedataXlsx.EXHead=jsonData['Sheet1'][0]['Expense Head'];//:string;
   this.expensedataXlsx.EXDesc=jsonData['Sheet1'][0]['Expense Description'];//:string;
   this.expensedataXlsx.EXDate=formatDate(jsonData['Sheet1'][0]['Expenditure Date'], 'yyyy/MM/dd', 'en');//:string;
   this.expensedataXlsx.EXPAmnt=jsonData['Sheet1'][0]['Amount'];//:number;
   this.expensedataXlsx.EXApplTO=jsonData['Sheet1'][0]['Applicable to Unit'];//:string;
   this.expensedataXlsx.EXRecurr=jsonData['Sheet1'][0]['Expense Recurrence Type'];//:string;
   this.expensedataXlsx.EXType=jsonData['Sheet1'][0]['Expense Type'];//:string;
   this.expensedataXlsx.BABName=jsonData['Sheet1'][0]['Select Bank'];//:string;
   this.expensedataXlsx.PMID=this.pmid;//:string;
   this.expensedataXlsx.EXPName=jsonData['Sheet1'][0]['Payee Name'];//:string;
   this.expensedataXlsx.EXPBName=jsonData['Sheet1'][0]['Payee Bank Name'];//:string;
   this.expensedataXlsx.EXChqNo=jsonData['Sheet1'][0]['Cheque No'];//:number;
   this.expensedataXlsx.EXChqDate=formatDate(jsonData['Sheet1'][0]['Cheque Date'], 'yyyy/MM/dd', 'en');//:string;
   this.expensedataXlsx.INNumber=jsonData['Sheet1'][0]['InvoiceNoReceiptNo'];//:string;
   //this.expensedataXlsx.EXPyCopy='';//:string;
    //VNName:string;
    //this.expensedataXlsx.INGenDate //:Date;
    this.expensedataXlsx.EXDisType=jsonData['Sheet1'][0]['Distribution Type']; //:string;
    this.expensedataXlsx.UnUniIden=jsonData['Sheet1'][0]['Select Unit']; //:string;
    this.expensedataXlsx.BLBlockID=this.viewexpensesservice.currentBlockId; //:string;
    this.expensedataXlsx.ASAssnID=this.currentAssociationID; //:string;
    this.expensedataXlsx.EXDDNo=jsonData['Sheet1'][0]['Demand Draft No'];//:number;
    this.expensedataXlsx.EXDDDate=formatDate(jsonData['Sheet1'][0]['Demand Draft Date'], 'yyyy/MM/dd', 'en');//:string;
    console.log('expensedataXlsx',this.expensedataXlsx);
    this.addexpenseservice.createExpense(this.expensedataXlsx)
      .subscribe(
        () => {
          this.viewexpensesservice.currentBlockId = this.expensedataXlsx.BLBlockID;
          swal.fire({
            title: "Expense Added Successfully",
            text: "",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#f69321",
            confirmButtonText: "Add New Expense",
            cancelButtonText: "View Expense"
          }).then(
            (result) => {

              if (result.value) {
                //this.form.reset();
                this.resetForm();
              } else if (result.dismiss === swal.DismissReason.cancel) {
                this.router.navigate(['home/viewexpense']);
              }
            }
          )
        },
        () => {
          swal.fire('Error', 'Something went wrong!', 'error')
        }
      );
  }
  addExp() {
    this.expensedata.BLBlockID=this.viewexpensesservice.currentBlockId;
    this.expensedata.EXDate = formatDate(this.EXDate, 'yyyy-MM-dd', 'en');
    if (this.checkField == 'Cash') {
      this.expensedata.EXChqDate = '';
    }
    if (this.checkField == 'Cheque') {
      this.expensedata.EXChqDate = formatDate(this.EXChqDate, 'yyyy-MM-dd', 'en');
    }
    if (this.checkField == 'DemandDraft') {
      this.expensedata.EXChqDate = '';
      this.expensedata.EXDDDate = formatDate(this.EXDDDate, 'yyyy-MM-dd', 'en');
    }
    console.log('expensedata', this.expensedata);
    this.addexpenseservice.createExpense(this.expensedata)
      .subscribe(
        (data) => {
          console.log(data);
          this.viewexpensesservice.currentBlockId = this.expensedata.BLBlockID;
          swal.fire({
            title: "Expense Added Successfully",
            text: "",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#f69321",
            confirmButtonText: "Add New Expense",
            cancelButtonText: "View Expense"
          }).then(
            (result) => {

              if (result.value) {
                //this.form.reset();
                //this.resetForm();
                
              } else if (result.dismiss === swal.DismissReason.cancel) {
                //this.router.navigate(['home/viewexpense']);
              }
            }
          )
        },
        (err) => {
          console.log(err);
          swal.fire('Error', 'Something went wrong!', 'error')
        }
      );
  }

  showMethod(PMID: string,displayName) {
    console.log(displayName);
    switch (displayName) {
      case 'Cash':
        this.expensedata.PMID = 1;
        break;
      case 'Cheque':
        this.expensedata.PMID = 2;
        break;
      case 'Demand Draft':
        this.expensedata.PMID = 3;
        break;
      case 'OnlinePay':
        this.expensedata.PMID = 4;
        break;
  }

  console.log(this.expensedata.PMID);
  this.paymentMethodType=displayName;
  let paymentobj = this.methodArray.filter(item => item['id'] == PMID)
  this.checkField = paymentobj[0]['name'];
}
  getPayeeBankName(bank){
    this.expensedata.EXPBName=bank;
  }
  resetForm(e?) {
    if (e != undefined) {
      e.preventDefault();
    }
    //this.form.reset();
    //this.expensedata.POID = '';
    this.expensedata.EXHead = '';
    this.expensedata.EXRecurr = '';
    this.expensedata.EXApplTO = '';
    this.expensedata.EXType = '';
    this.expensedata.EXDisType = '';
    this.expensedata.UnUniIden = '';
    this.expensedata.PMID = '';
  }

}