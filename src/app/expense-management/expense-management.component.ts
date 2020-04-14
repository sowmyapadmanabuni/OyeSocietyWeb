declare var $: any;
import { Component, OnInit, TemplateRef} from '@angular/core';
import { ViewExpensesService } from '../../services/view-expenses.service';
import { Viewexpense } from '../models/viewexpense';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExpenseData } from '../models/expense-data';
import { EditExpenseData } from '../models/edit-expense-data';
import { AddExpenseService } from '../../services/add-expense.service';
import { BlocksByAssoc } from '../models/blocks-by-assoc';
import { PurchaseOrdersByAssoc } from '../models/purchase-orders-by-assoc';
import { UnitsByBlockID } from '../models/units-by-block-id';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { HttpEventType, HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service';
import { ViewInvoiceService } from '../../services/view-invoice.service';
import {DashBoardService} from '../../services/dash-board.service';
import * as _ from 'lodash';
import { OrderPipe } from 'ngx-order-pipe';
import {UtilsService} from '../utils/utils.service';
import {ExpenseList} from '../models/expense-list';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { ViewUnitService } from '../../services/view-unit.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.css']
})
export class ExpenseManagementComponent implements OnInit {
  modalRef: BsModalRef;

  viewexpenses: Observable<Viewexpense[]>;
  mgrName: Observable<string>;

  associationlist: object;
  associationDetails: object;
  assnName: string;
  todayDate: Date;

  blockID: string;
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
  editexpensedata: EditExpenseData;
  BPIden: number;
  EXRABudg: number;
  VNName: string;
  POEAmnt: number;
  p: number;
  dynamic: number;
  allUnitBYBlockID:any[];
  UnitName:any;

  currentAssociationID: string;

  invoiceLists: any[];

  viewexpensesByBlockId: Object[];
  currentassociationname:string;
  bsConfig: {dateInputFormat: string; showWeekNumbers: boolean; isAnimated: boolean;};
  disableButton: boolean;
  isnotValidformat: boolean;
  isLargefile: boolean;
  defaultThumbnail:string;
  
  order: string = 'exHead';
  reverse: boolean = false;
  sortedCollection: any[];
  _viewexpensesByBlockId:any[];
  invoiced:any[];
  expid:string;
  toggleGenerateInvButton:boolean;
  ExpSDate:any;
  ExpEDate:any;
  expenseList:ExpenseList[];
  togglegenerateinv:boolean;
  toggleBulkInvGenerate:boolean;
  exidList:any[];
  Invoiced:any;
  enableAddExpnseView:boolean;
  enableExpenseListView:boolean;
  IsInvoiced:any;
  toggle:any;
  searchTxt:any;
  minDate:any;
  ddno:any;
  DemandDraftDate:any;
  minDemandDraftDate:any;
  currentAssociationIdForExpense: Subscription;
  ExpenseStartDate:any;
  ExpenseEndDate:any;
  setnoofrows:any;
  rowsToDisplay:any[];
  ShowRecords:any;
  columnName: any;
  unUnitID: any;
  toggleTd: boolean;
  testDate: Date;
  invalidAmount: boolean;
  toggleDistributionType:boolean;
  toggleUnitList: boolean;
  isDateFieldEmpty: boolean;
  PaginatedValue:number;
  ShowAllRecords: string;

  constructor(public viewexpenseservice: ViewExpensesService,
    private modalService: BsModalService,
    public addexpenseservice: AddExpenseService,
    private router: Router,
    public viewUniService: ViewUnitService,
    private toastr: ToastrService,
    public globalservice: GlobalServiceService,
    public viewinvoiceservice: ViewInvoiceService,
    public dashboardservice:DashBoardService,
    private orderpipe: OrderPipe,
    private utilsService:UtilsService,
    private http: HttpClient
  ) {
    this.PaginatedValue=10;
    this.ShowAllRecords = 'No';
    this.checkField="xyz";
    this.toggleDistributionType=false;
    this.toggleUnitList=true;
    this.isDateFieldEmpty=false;
    this.distributionTypes = [{ "name": "Dimension Based" }, { "name": "Per Unit" }, { "name": "Actuals" }];
    this.globalservice.IsEnrollAssociationStarted==false;
    this.rowsToDisplay=[{'Display':'5','Row':5},
                          {'Display':'10','Row':10},
                          {'Display':'15','Row':15},
                          {'Display':'50','Row':50},
                          {'Display':'100','Row':100},
                          {'Display':'Show All Records','Row':'All'}];
    this.setnoofrows=10;
    this.ShowRecords='Show Records';
    this.currentassociationname=this.globalservice.getCurrentAssociationName();
    this.blockID = '';
    this.UnitName='';
    this.todayDate = new Date();
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();
    this.allUnitBYBlockID=[];
    this.addexpenseservice.enableAddExpnseView = false;
    this.addexpenseservice.enableExpenseListView=true;
    this.invalidAmount=false;
    //this.viewexpenseservice.GetExpenseListByAssocID();
    //this.mgrName= this.viewexpenseservice.GetBlockListByBlockID('1107');
    //this.viewexpenseservice.GetPurchaseOrderListByAssocID();

    this.expensedata = new ExpenseData();
    this.editexpensedata = new EditExpenseData();
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
    //this.editexpensedata.BLBlockID = 1107;
    //this.editexpensedata.ASAssnID = 1156;
    this.editexpensedata.EXHead = '';
    this.editexpensedata.EXRecurr = '';
    this.editexpensedata.EXApplTO = '';
    this.editexpensedata.EXType = '';
    this.editexpensedata.EXDisType = '';
    this.editexpensedata.PMID = '';
    this.editexpensedata.unUniIden = '';
    this.p = 1;
    this.dynamic = 0;
    this.expid='';
    this.toggleGenerateInvButton=true;
    this.togglegenerateinv=false;
    this,this.toggleBulkInvGenerate=false;
    this.exidList=[];
    this.Invoiced='Invoiced';
    this.viewinvoiceservice.expid='false';
    this.viewexpenseservice.currentBlockName = '';

    //this.editexpensedata.UnUniIden = '';
    //this.editexpensedata.PMID = '';
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

    this.invoiced = [{ 'name': 'true', 'displayName': 'Yes', 'id': 1 },
                     { 'name': 'false', 'displayName': 'No', 'id': 2 }]

    this.bsConfig = Object.assign({}, {
      //containerClass: 'theme-purple',
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
    });
    this._viewexpensesByBlockId=[];
    this.expenseList=[];
    this.toggle='All';
    //
    this.currentAssociationIdForExpense=this.globalservice.getCurrentAssociationIdForExpense()
    .subscribe(msg=>{
      console.log(msg);
      this.globalservice.setCurrentAssociationId(msg['msg']);
      this.initialiseEXpense();
    },err=>{
      console.log(err);
    })
  this.toggleTd=false;
  
  }
  GetexpenseList(param) {
    this.toggle = param;
  }
  setRows(RowNum) {
    this.ShowAllRecords = 'No';
    this.ShowRecords='abc';
    this.setnoofrows = (RowNum=='All'?'All Records':RowNum);
    $(document).ready(()=> {
      let element=document.querySelector('.page-item.active');
      console.log(element);
      console.log(element);
      if(element != null){
      (element.children[0] as HTMLElement).click();
      console.log(element.children[0]['text']);
      }
      else if (element == null) {
        this.PaginatedValue=0;
      }
    });
  }
  goToExpense(){
    this.router.navigate(['expense']);
  }
  goToInvoice(){
    this.router.navigate(['invoice']);
  }
  goToReceipts(){
    this.router.navigate(['receipts']);
  }
  goToVehicles(){
    this.router.navigate(['vehicles']);
  }
  ngAfterViewInit() {
    $(".se-pre-con").fadeOut("slow");
  }
  removeColumnSort(columnName) {
    this.columnName = columnName;
  }
  ngOnInit() {
    
    // this.addexpenseservice.GetBlockListByAssocID()
    //   .subscribe(item => {
    //     console.log('item',item);
    //     this.addexpenseservice.GetBudgetProjectionsByBlockID(item[0].blBlockID);
    //     this.allBlocksLists = item;
    //     this.blockID = item[0].blBlockID;
    //     this.availableNoOfBlocks = item.length;

    //   });

    this.viewexpenseservice.getAssociationList(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        this.associationlist = data['data'].association;
        this.associationDetails = data['data'].association;
        this.assnName = data['data'].association.asAsnName;
      });

    //this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.globalservice.getCurrentAssociationId());
    this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.globalservice.getCurrentAssociationId());
    //http://apidev.oyespace.com/oyeliving/api/v1/Expense/GetExpenseListByBlockID/{BlockID}


    this.addexpenseservice.GetPurchaseOrderListByAssocID(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        //console.log(data);
        this.purchaseOrders = data;
      });

    this.addexpenseservice.GetBlockListByAssocID(this.globalservice.getCurrentAssociationId())
      .subscribe(item => {
        this.allBlocksLists = item;
        //console.log('allBlocksLists', this.allBlocksLists);
      });
    if (this.viewexpenseservice.currentBlockName != '' && this.viewexpenseservice.currentBlockId != '') {
      this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
    }
  }
  getExpLst(e) {
    //console.log(e);
    this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
  }
  GetExpenseListByBlockID(blockID,blBlkName) {
    this.p=1;
    this.UnitName='';
    this.allUnitBYBlockID=[]
    this.expenseList=[];
    this.viewexpensesByBlockId=[];
    this.blockID=blockID;
    console.log('GetExpenseListByBlockID',blockID);
    this.viewexpenseservice.currentBlockId=blockID;
    this.editexpensedata.BLBlockID=blockID
    this.viewexpenseservice.currentBlockName=blBlkName;
    /* this.viewexpenseservice.GetExpenseListByBlockID(blockID)
    .subscribe(
      data=>{
        console.log('GetExpenseListByBlockID',data);
        this.viewexpensesByBlockId=data;
        this._viewexpensesByBlockId=this.viewexpensesByBlockId;
        this.viewexpensesByBlockId.forEach(item => {
          this.expenseList.push(new ExpenseList(item['exid'],item['exHead'], item['exApplTO'], item['unUniIden'], item['exIsInvD'], item['exDate'], item['expAmnt'], '',item['inNumber'],item['exdUpdated'],item['exDesc'],item['exRecurr'],item['exType'],item['pmid'],item['poid'],item['blBlockID']));
          this.GetexpenseListByInvoiceID('id','All','abc');
        })
        console.log(this.expenseList);
        this.expenseList = _.sortBy(this.expenseList, e => e['exdUpdated']).reverse();
        this._viewexpensesByBlockId=this.expenseList;
        this.sortedCollection = this.orderpipe.transform(this.expenseList, 'exHead');
      },
      err=>{
        console.log(err);
        swal.fire({
          text: `No Data Found`,
          confirmButtonColor: "#f69321"
        });
      }
    ) */

      //http://apidev.oyespace.com/oyeliving/api/v1/Expense/GetExpenseListByBlockID/{BlockID}
       let headers = new HttpHeaders()
       .set('Authorization', 'my-auth-token')
       .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
       .set('Content-Type', 'application/json');
       let ipAddress=this.utilsService.GetExpenseListByBlockID();
       let url = `${ipAddress}oyeliving/api/v1/Expense/GetExpenseListByBlockID/${blockID}`;
       this.http.get(url, { headers: headers })
       .subscribe(data=>{
         console.log(data['data']['expenseByBlock']);
         this.viewexpensesByBlockId=data['data']['expenseByBlock'];
        this._viewexpensesByBlockId=this.viewexpensesByBlockId;
        // this.viewexpensesByBlockId.forEach(item => {
        //   this.expenseList.push(new ExpenseList(item['exid'],item['exHead'], item['exApplTO'], item['unUniIden'], item['exIsInvD'], item['exDate'], item['expAmnt'], '',item['inNumber'],item['exdUpdated'],item['exDesc'],item['exRecurr'],item['exType'],item['pmid'],item['poid'],item['blBlockID']));
        // })
        this.expenseList=data['data']['expenseByBlock'];
        this.GetexpenseListByInvoiceID('id','All','abc');
        console.log(this.expenseList);
        this.expenseList = _.sortBy(this.expenseList, e => e['exdUpdated']).reverse();
        this._viewexpensesByBlockId=this.expenseList;
       })

    this.getAllUnitDetailsByBlockID();
  }
  getExpenseListByDateRange(ExpenseEndDate) {
    console.log(this._viewexpensesByBlockId);
    this.expenseList = this._viewexpensesByBlockId;
    //console.log(formatDate(new Date(this.ExpenseStartDate),'dd/MM/yyyy','en'));
    console.log(new Date(new Date(this.ExpenseStartDate).getFullYear(),new Date(this.ExpenseStartDate).getMonth()+1,new Date(this.ExpenseStartDate).getDate()).getTime());
    //console.log(formatDate(this.ExpenseEndDate, 'dd/MM/yyyy', 'en'));
    //console.log(formatDate(new Date(ExpenseEndDate),'dd/MM/yyyy','en'));
    console.log(new Date(new Date(ExpenseEndDate).getFullYear(),new Date(ExpenseEndDate).getMonth()+1,new Date(ExpenseEndDate).getDate()).getTime());
    console.log(ExpenseEndDate);
    this.expenseList = this.expenseList.filter(item=>{
      console.log(new Date(item['exdUpdated']),new Date(new Date(item['exdUpdated']).getFullYear(),new Date(item['exdUpdated']).getMonth()+1,new Date(item['exdUpdated']).getDate()).getTime());
      console.log(new Date(formatDate(this.ExpenseStartDate,'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime())
      console.log(new Date(formatDate(this.ExpenseStartDate,'MM/dd/yyyy','en')).getTime() <= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime() && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime() >= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime())
      //return new Date(formatDate(this.ExpenseStartDate,'MM/dd/yyyy','en')).getTime() <= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime() && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')).getTime() >= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')).getTime();
      return new Date(formatDate(this.ExpenseStartDate,'MM/dd/yyyy','en')) <= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en')) && new Date(formatDate(ExpenseEndDate,'MM/dd/yyyy','en')) >= new Date(formatDate(item['exdUpdated'],'MM/dd/yyyy','en'));
    })
    console.log(this.expenseList);
  }
  convert() {

    let doc = new jsPDF();
    let head = ["Expense Head","Applicable","Unit","Invoice Generated","Date","Amount"];
    let body = [];

    /* The following array of object as response from the API req  */

  /*  var itemNew = [
      { id: 'Case Number', name: '101111111' },
      { id: 'Patient Name', name: 'UAT DR' },
      { id: 'Hospital Name', name: 'Dr Abcd' }
    ] */


    this.expenseList.forEach(element => {
      let temp = [element['exHead'], element['exApplTO'], element['unUniIden'],(element['exIsInvD'].toString()=="true"?"Yes":"No") , formatDate(element['exDate'],'dd/MM/yyyy','en') , 'Rs.'+element['expAmnt']];
      body.push(temp);
    });
    console.log(body);
    doc.autoTable({ head: [head], body: body });
    doc.save('Expense.pdf');
    }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  poDetails() {
    //console.log('poDetails');
    this.POEAmnt = this.purchaseOrders[0]['poEstAmt'];
    this.VNName = this.purchaseOrders[0]['poPrfVen'];
    this.BPIden = this.purchaseOrders[0]['bpIden'];
    this.EXRABudg = 0;
  }

  deleteExpense(unUniIden, exApplTO, inGenDate) {
    let viewexpense = {
      "UnUniIden": unUniIden,
      "EXApplTO": exApplTO,
      "INGenDate": inGenDate,
      "ASAssnID": this.viewexpenseservice.currentAssociationID
    }
    this.viewexpenseservice.deleteExpense(viewexpense)
      .subscribe(data => {
        //console.log(data)
      });
  }
  onPageChange(event) {
    //console.log(event);
    //console.log(this.p);
    //console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if((event['srcElement']['text'] != undefined) && (event['srcElement']['text'] != '»') && (event['srcElement']['text'] != '1') && (Number(event['srcElement']['text']) == NaN)){
        //console.log('test');
        //console.log(Number(event['srcElement']['text']) == NaN);
        //console.log(Number(event['srcElement']['text']));
        let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
        this.p= Number(element.children[0]['text']);
      console.log(this.p);
    } 
    if(event['srcElement']['text'] == '«'){
      //console.log(this.p);
      this.p= 1;
    }
    //console.log(this.p);
    let element=document.querySelector('.page-item.active');
    //console.log(element.children[0]['text']);
    if(element != null){
      this.p=Number(element.children[0]['text']);
      console.log(this.p);
      if (this.ShowRecords != 'Show Records') {
        console.log('testtt');
        //let PminusOne=this.p-1;
        //console.log(PminusOne);
        //console.log((this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //console.log(PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows));
        //this.PaginatedValue=PminusOne*(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows);
        console.log(this.p);
        this.PaginatedValue=(this.setnoofrows=='All Records'?this.expenseList.length:this.setnoofrows);
        console.log(this.PaginatedValue);
      }
    }  }
  generateInvoice() {
    //console.log(this.blockID);
    //console.log(this.expid);
    //console.log(this.exidList.length);
    //console.log(this.togglegenerateinv);
    if(this.blockID == '' || (this.togglegenerateinv == false && this.toggleBulkInvGenerate == false)){
          swal.fire({
            title: "Please Select One or More Checkbox for GenerateInvoice",
            text: "",
            type: "error",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK"
          })
    } 
    else{
          this.viewexpenseservice.generateInvoice(this.currentAssociationID,this.exidList,this.expenseList)
      .subscribe((data) => {
        //console.log(data);
        swal.fire({
          title: `${(this.exidList.length == 1?`${this.exidList.length}-Invoice Generated and Posted Successfully`:`${(this.exidList.length == 0?`${this.expenseList.length}-Invoices Generated and Posted Successfully`:`${this.exidList.length}-Invoices Generated and Posted Successfully`)}`)}`,
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
            if (result.value) {
              this.exidList=[];
              //this.router.navigate(['home/viewinvoice']);
              this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
              //this.GetexpenseListByInvoiceID(this.viewinvoiceservice.expid);
            }
          })

        //
      },
        (err) => {
          this.exidList=[];
          //console.log(err['error']);
          swal.fire({
            title: "Error",
            text: `${err['error']['exceptionMessage']}`,
            type: "error",
            confirmButtonColor: "#f69321"
          });
         /* this.toastr.error('', 'Invoice has been generated for all expenses', {
            timeOut: 3000
          }); */
          this.toastr.success('Invoice Already Generated For All Expenses','',{timeOut:3000});
        }
      );
    }

  }
  toggleAddExpenseView() {
    if(this.viewexpenseservice.currentBlockName == ''){
      swal.fire({
        title: "Please Select Block to Add Expense",
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else{
      this.toggleStepWizard();
      this.addexpenseservice.enableAddExpnseView = true;
      this.addexpenseservice.enableExpenseListView=false;
    }
  }
  editExpense(repexpense1, idx) {
    //console.log('repexpense1-', repexpense1);
    //console.log('idx-', idx);
  }
  openModal(editexpensetemplate: TemplateRef<any>, exid: number, exDesc: any, expAmnt: string, exApplTO, exHead, exType, pmid, inNumber, poid, exPyCopy, exRecurr, exdUpdated, blBlockID, unUniIden, exIsInvD) {
    console.log(exIsInvD);
    if (exIsInvD== false) {
      //console.log('purchaseOrders',this.purchaseOrders);
      //console.log('InvoiceNumber',inNumber);
      // this.POEAmnt = this.purchaseOrders[0]['poEstAmt'];
      // this.VNName = this.purchaseOrders[0]['poPrfVen'];
      // this.BPIden = this.purchaseOrders[0]['bpIden'];
      //this.ValidateAmount()
      console.log(poid);
      console.log(exDesc);
      console.log(exRecurr);
      console.log(exType);
      console.log(pmid);
      console.log(new Date(exdUpdated));
      console.log(new Date(exdUpdated).getDate());
      console.log(new Date(exdUpdated).getMonth());
      console.log(new Date(exdUpdated).getFullYear());
      console.log(new Date(exdUpdated).getHours());
      console.log(new Date(exdUpdated).getMinutes());
      console.log(new Date(exdUpdated).getSeconds());
      console.log(new Date(exdUpdated).getTimezoneOffset());
      console.log(new Date(new Date(exdUpdated).getFullYear(), new Date(exdUpdated).getMonth(), new Date(exdUpdated).getDate(), 12, 0, 0));
      this.EXRABudg = 0;
      let formattedDate = new Date(new Date(exdUpdated).getFullYear(), new Date(exdUpdated).getMonth(), new Date(exdUpdated).getDate(), 12, 0, 0);
      console.log(formattedDate);
      console.log(formatDate(formattedDate, 'dd/MM/yyyy', 'en'));
      this.editexpensedata.EXID = exid;
      this.editexpensedata.EXDesc = exDesc;
      this.editexpensedata.EXPAmnt = expAmnt;
      this.editexpensedata.EXApplTO = exApplTO;
      this.editexpensedata.EXHead = exHead;
      this.editexpensedata.EXType = exType;
      this.editexpensedata.PMID = pmid;
      this.editexpensedata.inNumber = exid.toString();
      this.editexpensedata.POID = poid;
      this.editexpensedata.EXPyCopy = '';
      this.editexpensedata.EXRecurr = exRecurr;
      this.editexpensedata.EXDate = formattedDate;
      this.editexpensedata.BLBlockID = blBlockID;
      this.editexpensedata.unUniIden = unUniIden;
      console.log(this.editexpensedata);
      this.checkField="xyz";
      this.editexpensedata.PMID = '';

      if(this.editexpensedata.EXApplTO == 'Single Unit'){
        this.toggleUnitList=false;
      }
      else{
        this.toggleUnitList=true;
      }

      this.modalRef = this.modalService.show(editexpensetemplate,
        Object.assign({}, { class: 'gray modal-lg' }));

      const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
      dataTransfer.items.add(new File([exPyCopy], exPyCopy));
      //console.log('dataTransfer', dataTransfer);
      const inputElement: HTMLInputElement = document.getElementById('uploadFileinput') as HTMLInputElement;
      //console.log('inputElement', inputElement.files);
      inputElement.files = dataTransfer.files;
    }
  }

  prerequisitesAddUnit(blockName: string) {
    this.addexpenseservice.prerequisitesAddUnit(this.blockID);
  }
  applicableTo(applicableto: string) {
    let blockid = this.editexpensedata.BLBlockID;
    console.log(applicableto);
    this.applies = applicableto;
    if (this.applies == 'All Units' || this.applies == 'SoldOwnerOccupied' || this.applies == 'SoldTenantOccupied') {
      this.distributionTypes = [{ "name": "Dimension Based" }, { "name": "Per Unit" }, { "name": "Actuals" }];
    }
    if(this.applies == 'Single Unit'){
      this.toggleUnitList=false;
    }
    else{
      this.toggleUnitList=true;
    }
    //  $scope.ascUnit = '';
    this.addexpenseservice.GetUnitListByBlockID(blockid)
      .subscribe(data => {
        console.log(data);
        this.ascUnit = data;
      })
  }
  upLoad() {
    document.getElementById("file_upload_id").click();
  }
  // below code is for the Excel file upload
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
      this.createExpense(jsonData['Sheet1']);
    }
    reader.readAsBinaryString(file);
  }
  createExpense(jsonData){
    Array.from(jsonData).forEach(item=>{
      let expensedata={
       // "POEAmnt": "",
        "EXChqNo": (item['ChequeNo']==undefined?'':item['ChequeNo']),
       // "BPID": "",
        "INNumber": item['Invoice-ReceiptNo'],
        "EXPyCopy": "",
        "ASAssnID":this.globalservice.getCurrentAssociationId(),
        "BLBlockID": this.blockID,
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
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let splitarr = this.selectedFile['name'].split('.')
    let currentdate = new Date();
    let expycopy = splitarr[0] + '_' + currentdate.getTime().toString() + '.' + splitarr[1];

    this.editexpensedata.EXPyCopy = expycopy;
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
   let reader  = new FileReader();

   reader.onloadend = function () {
     imgthumbnailelement.src  = reader.result as string;;
   }
   if (this.selectedFile) {
     reader.readAsDataURL(this.selectedFile);
   } else {
     imgthumbnailelement.src = "";
   }
  }
  toggleStepWizard() {
  
    $(document).ready(function () {
  
      var navListItems = $('div.setup-panel div a'),
        addExpBtn = $('#AddExpense'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
        anchorDivs = $('div.stepwizard-row div'),
        Divs = $('div.stepwizard div div');
      //console.log(anchorDivs);

      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent();
          anchorDivs.removeClass('step-active');
          $item.addClass('btn-success');
          $divTgt.addClass('step-active');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();

        if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-success').addClass('btn-default');
          navListItems.removeClass('active').addClass('disabled');
        }
      });
  
      allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
          curInputs = curStep.find("input[type='text']"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]'),
          isValid = true;
          console.log(curAnchorBtn);
  
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
      addExpBtn.click(function () {
        console.log(this);
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]')
        curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
      })
  
      $('div.setup-panel div a.btn-success').trigger('click');
    });
  }
  onUpLoad() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.editexpensedata.EXPyCopy);
    this.addexpenseservice.onUpLoad(fd)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
          this.dynamic = Math.round(event.loaded / event.total * 100);
        }
        else if (event.type === HttpEventType.Response) {
          //console.log(event);
          this.dynamic = 0;
        }
      });
  }
  removeSelectedfile() {
    let imgthumbnailelement = <HTMLInputElement>document.getElementById("imgthumbnail");
    imgthumbnailelement.src = this.defaultThumbnail;
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
    dataTransfer.items.add('', '');
    //console.log('dataTransfer', dataTransfer);
    const inputElement: HTMLInputElement = document.getElementById('uploadFileinput') as HTMLInputElement;
    //console.log('inputElement', inputElement.files);
    inputElement.files = dataTransfer.files;
    this.disableButton=false;
    this.isnotValidformat = false;
    this.isLargefile = false;
  }
  showMethod(PMID: string) {
    let paymentobj = this.methodArray.filter(item => item['id'] == PMID)
    this.checkField = paymentobj[0]['name'];
  }
  gotoAddexpense() {
    //
    if(this.blockID == ''){
      swal.fire({
        title: "Please Select Block to Add Expense",
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }
    else {
      swal.fire({
        title: "Add Multiple Expenses in One Shot",
        text: "",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#f69321",
        confirmButtonText: "Yes",
        cancelButtonText: "One By One",
        cancelButtonColor: "#f69321"
      }).then(
        (result) => {

          if (result.value) {
            this.router.navigate(['home/addexpensexlsx']);
          } else if (result.dismiss === swal.DismissReason.cancel) {
            this.router.navigate(['home/addexpense']);
          }
        }
      )
    }
    //
    //this.router.navigate(['home/addexpense']);
  }

  updateExpense() {
   /* let exdate;
 
    let editexpenseobj


    if(typeof this.editexpensedata.EXDate == 'string'){
      editexpenseobj=this.editexpensedata.EXDate.split('/');
      exdate = new Date(editexpenseobj[2]+'-'+editexpenseobj[1]+'-'+editexpenseobj[0]+'T00:00:00Z');
    }
    else if(typeof this.editexpensedata.EXDate == 'object'){
      exdate = this.editexpensedata.EXDate;
    }

    this.editexpensedata.EXDate = formatDate(exdate, 'yyyy/MM/dd', 'en');*/
    console.log('editexpensedata', this.editexpensedata);
    this.viewexpenseservice.updateExpense(this.editexpensedata)
      .subscribe(data => {
        console.log(data);
        swal.fire({
          title: "Expense update Successfully",
          text: "",
          type: "success",
          confirmButtonColor: "#f69321",
          confirmButtonText: "OK"
        }).then(
          (result) => {
        
            if (result.value) {
              //this.form.reset();
              this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
            
            } else if (result.dismiss === swal.DismissReason.cancel) {
              //.....code
            }
          })
      },
      err=>{
        console.log(err);
      })
  }

  getCurrentBlockDetails(blBlockID) {
    //console.log('blBlockID-' + blBlockID);
    this.viewinvoiceservice.getCurrentBlockDetails(blBlockID, this.currentAssociationID)
      .subscribe(data => {
        this.invoiceLists = data['data'].invoices;
        //console.log('invoiceLists?', this.invoiceLists);
      })
  }
  GetexpenseListByInvoiceID(IsInvoiced,param,param1) {
    if(this.viewexpenseservice.currentBlockName == ''){
      swal.fire({
        title: "Please Select Block",
        text: "",
        type: "error",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      })
    }else{
      if(param1 == 'abc'){
        this.PaginatedValue=10;
      }
      else{
        this.PaginatedValue=10;
      }
      $(document).ready(()=> {
        let element=document.querySelector('.page-item.active');
        // console.log(element);
        // console.log(element);
        if(element != null){
        (element.children[0] as HTMLElement).click();
        //console.log(element.children[0]['text']);
        }
        else if (element == null) {
          this.PaginatedValue=0;
        }
      });
      this.p=1;
      console.log(IsInvoiced);
      this.toggle=param;
      let expid='';
      if(IsInvoiced == true){
        console.log('IsInvoiced == true');
        expid='true'
      }
      else if(IsInvoiced == false){
        console.log('IsInvoiced == false');
        expid='false'
      }
      //console.log('expid',typeof expid);
      this.viewinvoiceservice.expid=expid;
      //this._viewexpensesByBlockId = this.viewexpensesByBlockId;
      this.expenseList = this._viewexpensesByBlockId;
      console.log(this.expenseList);
      //console.log('expid',expid);
      //console.log('expid',typeof expid);
      if (expid == 'true') {
        console.log('expid == true');
        this.Invoiced='Yes';
        this.toggleGenerateInvButton = true;
      }
      else{
        this.Invoiced='No';
        this.toggleGenerateInvButton = false;
      }
      //this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId);
      if(expid == 'true' || expid == 'false'){
        //console.log(this.viewexpensesByBlockId);
        this.expenseList = this.expenseList.filter(item=>{
          console.log('exIsInvD',typeof item['exIsInvD']);
          console.log('exIsInvD-string',typeof item['exIsInvD'].toString());
          if(this.UnitName==''){
            return item['exIsInvD'].toString().toLowerCase() == expid.toLowerCase();
          }
          else{
            return ((item['exIsInvD'].toString().toLowerCase() == expid.toLowerCase()) && (item['unUniIden'] == this.UnitName));
          }
        })
        console.log(this.expenseList);
      }
      if(param == 'All'){
        console.log('test1');
        this.expenseList = this._viewexpensesByBlockId;
        console.log(this.expenseList);
        if(this.UnitName!=''){
          console.log('test2');
          this.expenseList = this.expenseList.filter(item=>{
              return item['unUniIden'] == this.UnitName;
          })
          console.log(this.expenseList);
        }
        else{
          console.log('test3');
          this.expenseList = this._viewexpensesByBlockId;
        }
      }
    //
      if (param == 'toggleYes') {
        this.toggleTd = false;
      }
      else if (param == 'toggleNo') {
        this.toggleTd = true;
      }
      else if (param == 'All') {
        this.toggleTd = false;
      }
    //
    }
  }
  getExpenseListByDatesAndID() {
    //console.log(this.ExpSDate, this.ExpEDate);
    let expenseList = {
      "ASAssnID": this.currentAssociationID.toString(),
      "BLBlockID": this.viewexpenseservice.currentBlockId,
      "startdate":formatDate(this.ExpSDate,'yyyy-dd-MM','en') ,
      "enddate": formatDate(this.ExpEDate,'yyyy-dd-MM','en')
    }
    //console.log(expenseList);
    this.viewexpenseservice.getExpenseListByDatesAndID(expenseList)
    .subscribe(data=>{
      this.expenseList=[];
      console.log(data['data']['expense']);
      this._viewexpensesByBlockId=data['data']['expense'];
      data['data']['expense'].forEach(item => {
        this.expenseList.push(new ExpenseList(item['exid'],item['exHead'], item['exApplTO'], item['unUniIden'], item['exIsInvD'], item['exDate'], item['expAmnt'], '',item['inNumber'],item['exdUpdated'],item['exDesc'],item['exRecurr'],item['exType'],item['pmid'],item['poid'],item['blBlockID']));
      })
      console.log(this.expenseList);
      this._viewexpensesByBlockId=this.expenseList;
      //console.log(this._viewexpensesByBlockId);
    },
    err=>{
      console.log(err);
    })
  }
  toggleGenerateInv() {
    this.toggleBulkInvGenerate = !this.toggleBulkInvGenerate;
    this.viewexpenseservice.toggleBulkInvGenerate=this.toggleBulkInvGenerate;
    //console.log( this.toggleBulkInvGenerate );
    this.expenseList.forEach(item=>{
     //console.log(typeof item['exIsInvD']); 
     item['checkedForGenerateInvoice']=this.toggleBulkInvGenerate;
     //console.log(item['checkedForGenerateInvoice']); 
    })
  }
  getSelectedInv(exid,e){
    console.log(exid);
    console.log(e);
    this.togglegenerateinv=false;
    if (e) {
      const found = this.exidList.some(el => el['EXID'] === exid);
      if (!found) {
        this.togglegenerateinv = true;
        let _exid = { 'EXID': exid }
        this.exidList.push(_exid);
        console.log(exid);
        console.log(this.exidList);
      }
    }
  }
  initialiseEXpense(){
    $(".se-pre-con").show();
    this.UnitName='';
    this.allUnitBYBlockID=[];
    this.allBlocksLists=[];
    this.expenseList=[];
    this.viewexpenseservice.currentBlockName = '';
    this.viewexpenseservice.getAssociationList(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        this.associationlist = data['data'].association;
        this.associationDetails = data['data'].association;
        this.assnName = data['data'].association.asAsnName;
      });

    //this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.globalservice.getCurrentAssociationId());
    this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.globalservice.getCurrentAssociationId());
    //http://apidev.oyespace.com/oyeliving/api/v1/Expense/GetExpenseListByBlockID/{BlockID}


    this.addexpenseservice.GetPurchaseOrderListByAssocID(this.globalservice.getCurrentAssociationId())
      .subscribe(data => {
        //console.log(data);
        this.purchaseOrders = data;
      });

    this.addexpenseservice.GetBlockListByAssocID(this.globalservice.getCurrentAssociationId())
      .subscribe(item => {
        console.log(item);
        this.allBlocksLists = item;
        $(".se-pre-con").fadeOut("slow");
        console.log('allBlocksLists', this.allBlocksLists);
      },
      err=>{
        this.allBlocksLists=[];
        console.log(err);
      });
    if (this.viewexpenseservice.currentBlockName != '' && this.viewexpenseservice.currentBlockId != '') {
      this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
    }
  }
  NavigateToBulkUpload(){
    this.router.navigate(['excelexpense']);
  }
  getAllUnitDetailsByBlockID() {
    /*-------------------Get Unit List By Block ID ------------------*/
    this.viewUniService.GetUnitListByBlockID(this.blockID)
      .subscribe(data => {
        console.log('allUnitBYBlockID',data);
        this.allUnitBYBlockID = data['data'].unitsByBlockID;
      },
      err=>{
        console.log(err);
      });
  }
  getCurrentUnitDetails(unUnitID,unUniName){
    this.UnitName=unUniName;
    this.unUnitID=unUnitID;
    console.log(unUniName);
    this.expenseList=this._viewexpensesByBlockId;
    this.expenseList = this.expenseList.filter(item => {
      return item['unUniIden'] == unUniName;
    })
    console.log(this.expenseList);
    console.log(this.toggle);
    if(this.toggle=='toggleNo'){
      this.expenseList=this._viewexpensesByBlockId;
      this.expenseList = this.expenseList.filter(item=>{
        console.log('exIsInvD',typeof item['exIsInvD']);
        console.log('exIsInvD-string',typeof item['exIsInvD'].toString());
          return ((item['exIsInvD'].toString().toLowerCase() == false) && (item['unUniIden'] == this.UnitName));
      })
      console.log(this.expenseList);
    }
  }
  ValidateAmount(){
    console.log(this.editexpensedata.EXPAmnt);
    if(Number(this.editexpensedata.EXPAmnt)==0){
      this.invalidAmount=true;
    }
    else{
      this.invalidAmount=false;
    }
  }
  ValidateExpenseAmount(){
    console.log(this.editexpensedata.EXPAmnt);
    if(Number(this.editexpensedata.EXPAmnt)==0){
      this.invalidAmount=true;
    }
    else{
      this.invalidAmount=false;
    }
  }
  validateDate(event, StartDate, EndDate) {
    this.isDateFieldEmpty=false;
    console.log(StartDate.value, EndDate.value);
    if (event.keyCode == 8) {
      if ((StartDate.value == '' || StartDate.value == null) && (EndDate.value == '' || EndDate.value == null)) {
        console.log('test');
        this.isDateFieldEmpty=true;
        this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId,this.viewexpenseservice.currentBlockName);
      }
    }
  }
  GetExpenseList(){
    if(this.isDateFieldEmpty==true){
      this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId,this.viewexpenseservice.currentBlockName);
    }
  }
}
