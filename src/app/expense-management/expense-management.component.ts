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
import { HttpEventType } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service';
import { ViewInvoiceService } from '../../services/view-invoice.service';
import {DashBoardService} from '../../services/dash-board.service';
import * as _ from 'lodash';
import { OrderPipe } from 'ngx-order-pipe';
import {UtilsService} from '../utils/utils.service';
import {ExpenseList} from '../models/expense-list';

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

  currentAssociationID: string;

  invoiceLists: any[];

  viewexpensesByBlockId: Object[];
  currentassociationname:string;
  bsConfig: { containerClass: string; dateInputFormat: string; showWeekNumbers: boolean; isAnimated: boolean; };
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

  constructor(private viewexpenseservice: ViewExpensesService,
    private modalService: BsModalService,
    private addexpenseservice: AddExpenseService,
    private router: Router,
    private toastr: ToastrService,
    private globalservice: GlobalServiceService,
    private viewinvoiceservice: ViewInvoiceService,
    private dashboardservice:DashBoardService,
    private orderpipe: OrderPipe,
    private utilsService:UtilsService
  ) {
    this.currentassociationname=this.globalservice.getCurrentAssociationName();
    this.blockID = '';
    this.todayDate = new Date();
    this.currentAssociationID = this.globalservice.getCurrentAssociationId();

    this.addexpenseservice.enableAddExpnseView = false;
    this.addexpenseservice.enableExpenseListView=true;
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
      containerClass: 'theme-orange',
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
    });
    this._viewexpensesByBlockId=[];
    this.expenseList=[];
    this.toggle='All';
  }
  GetexpenseList(param) {
    this.toggle = param;
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

    this.viewexpenseservice.getAssociationList(this.currentAssociationID)
      .subscribe(data => {
        this.associationlist = data['data'].association;
        this.associationDetails = data['data'].association;
        this.assnName = data['data'].association.asAsnName;
      });

    //this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.currentAssociationID);
    this.viewexpenses = this.viewexpenseservice.GetExpenseListByAssocID(this.currentAssociationID);
    //http://apidev.oyespace.com/oyeliving/api/v1/Expense/GetExpenseListByBlockID/{BlockID}


    this.addexpenseservice.GetPurchaseOrderListByAssocID(this.currentAssociationID)
      .subscribe(data => {
        console.log(data);
        this.purchaseOrders = data;
      });

    this.addexpenseservice.GetBlockListByAssocID(this.currentAssociationID)
      .subscribe(item => {
        this.allBlocksLists = item;
        console.log('allBlocksLists', this.allBlocksLists);
      });
    if (this.viewexpenseservice.currentBlockName != '' && this.viewexpenseservice.currentBlockId != '') {
      this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
    }
  }
  getExpLst(e) {
    console.log(e);
    this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId, this.viewexpenseservice.currentBlockName);
  }
  GetExpenseListByBlockID(blockID,blBlkName) {
    this.expenseList=[];
    this.viewexpensesByBlockId=[];
    this.blockID=blockID;
    console.log('GetExpenseListByBlockID',blockID);
    this.viewexpenseservice.currentBlockId=blockID;
    this.viewexpenseservice.currentBlockName=blBlkName;
    this.viewexpenseservice.GetExpenseListByBlockID(blockID)
    .subscribe(
      data=>{
        console.log('GetExpenseListByBlockID',data);
        this.viewexpensesByBlockId=data;
        this._viewexpensesByBlockId=this.viewexpensesByBlockId;
        this.viewexpensesByBlockId.forEach(item => {
          console.log(item['inNumber']);
          this.expenseList.push(new ExpenseList(item['exid'],item['exHead'], item['exApplTO'], item['unUniIden'], item['exIsInvD'], item['exDate'], item['expAmnt'], '',item['inNumber']));
        })
        console.log(this.expenseList);
        this._viewexpensesByBlockId=this.expenseList;
        this.expenseList = _.sortBy(this.expenseList, e => e.exDate);
        console.log('viewexpensesByBlockId',this.expenseList);
        //
        this.sortedCollection = this.orderpipe.transform(this.expenseList, 'exHead');
        console.log(this.sortedCollection);
      }

    ) 
    //this.viewexpenseservice.GetExpenseListByBlockID(blockID);
    console.log(this.viewexpensesByBlockId);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  poDetails() {
    console.log('poDetails');
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
      .subscribe(data => console.log(data));
  }
  onPageChange(event) {
    console.log(event['srcElement']['text']);
    if(event['srcElement']['text'] == '1'){
      this.p=1;
    }
    if(event['srcElement']['text'] != '1'){
      this.p= Number(event['srcElement']['text'])-1;
      console.log(this.p);
      if(this.p == 1){
        this.p =2;
      }
    } 
    if(event['srcElement']['text'] == '«'){
      this.p= 1;
    }
  }
  generateInvoice() {
    console.log(this.blockID);
    console.log(this.expid);
    console.log(this.exidList.length);
    console.log(this.togglegenerateinv);
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
        console.log(data);
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
          console.log(err['error']);
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
    console.log('repexpense1-', repexpense1);
    console.log('idx-', idx);
  }
  openModal(editexpensetemplate: TemplateRef<any>, exid: number, exDesc: any, expAmnt: string, exApplTO, exHead, exType, pmid, inNumber, poid, exPyCopy, exRecurr, exDate, blBlockID) {
    console.log('purchaseOrders',this.purchaseOrders);
    console.log('InvoiceNumber',inNumber);
    // this.POEAmnt = this.purchaseOrders[0]['poEstAmt'];
    // this.VNName = this.purchaseOrders[0]['poPrfVen'];
    // this.BPIden = this.purchaseOrders[0]['bpIden'];
    this.EXRABudg = 0;

    this.editexpensedata.EXID = exid;
    this.editexpensedata.EXDesc = exDesc;
    this.editexpensedata.EXPAmnt = expAmnt;
    this.editexpensedata.EXApplTO = exApplTO;
    this.editexpensedata.EXHead = exHead;
    this.editexpensedata.EXType = exType;
    this.editexpensedata.PMID = pmid;
    this.editexpensedata.inNumber = inNumber;
    this.editexpensedata.POID = poid;
    this.editexpensedata.EXPyCopy = exPyCopy;
    this.editexpensedata.EXRecurr = exRecurr;
    this.editexpensedata.EXDate = formatDate(exDate, 'dd/MM/yyyy', 'en');
    this.editexpensedata.BLBlockID = blBlockID;
    console.log(this.editexpensedata);

    this.modalRef = this.modalService.show(editexpensetemplate,
      Object.assign({}, { class: 'gray modal-lg' }));

    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
    dataTransfer.items.add(new File([exPyCopy], exPyCopy));
    console.log('dataTransfer', dataTransfer);
    const inputElement: HTMLInputElement = document.getElementById('uploadFileinput') as HTMLInputElement;
    console.log('inputElement', inputElement.files);
    inputElement.files = dataTransfer.files;
  }

  prerequisitesAddUnit(blockName: string) {
    this.addexpenseservice.prerequisitesAddUnit(this.blockID);
  }
  applicableTo(applicableto: string) {
    let blockid = this.editexpensedata.BLBlockID;
    console.log(applicableto);
    this.applies = applicableto;
    if (this.applies == 'All' || this.applies == 'SoldOwnerOccupied' || this.applies == 'SoldTenantOccupied') {
      this.distributionTypes = [{ "name": "Dimension Based" }, { "name": "Per Unit" }, { "name": "Actuals" }];
    }
    //  $scope.ascUnit = '';
    this.addexpenseservice.GetUnitListByBlockID(blockid)
      .subscribe(data => {
        console.log(data);
        this.ascUnit = data;
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
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
        anchorDivs = $('div.stepwizard-row div');;
  
      allWells.hide();
  
      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this),
          $divTgt = $(this).parent();
          anchorDivs.removeClass('step-active');
        if (!$item.hasClass('disabled')) {
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
          curInputs = curStep.find("input[type='text'],input[type='url']"),
          isValid = true;
  
        $(".form-group").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
          if (!curInputs[i].validity.valid) {
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
        }
  
        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
      });
  
      $('div.setup-panel div a.btn-success').trigger('click');
    });
  }
  onUpLoad() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.editexpensedata.EXPyCopy);
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
    let exdate;
 
    let editexpenseobj


    if(typeof this.editexpensedata.EXDate == 'string'){
      //alert('editexpensedata.EXDate is string');
      editexpenseobj=this.editexpensedata.EXDate.split('/');
      //exdate = new Date(editexpenseobj[2]+'-'+editexpenseobj[1]+'-'+editexpenseobj[0]+'T00:00:00Z');
      exdate = new Date(editexpenseobj[2]+'-'+editexpenseobj[1]+'-'+editexpenseobj[0]+'T00:00:00Z');
      //let newexdate = new Date(editexpenseobj[2]+'-'+editexpenseobj[1]+'-'+editexpenseobj[0]+'T00:00:00Z').toUTCString();
      //alert('toString'+exdate);
    }
    else if(typeof this.editexpensedata.EXDate == 'object'){
      //alert('this.editexpensedata.EXDate is object');
      exdate = this.editexpensedata.EXDate;
      //alert(exdate);
    }

    this.editexpensedata.EXDate = formatDate(exdate, 'yyyy/MM/dd', 'en'); //'2019-07-24T12:00:00';//
    console.log('editexpensedata', this.editexpensedata);
    this.viewexpenseservice.updateExpense(this.editexpensedata)
      .subscribe(data => {
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
      })
  }

  getCurrentBlockDetails(blBlockID) {
    console.log('blBlockID-' + blBlockID);
    this.viewinvoiceservice.getCurrentBlockDetails(blBlockID, this.currentAssociationID)
      .subscribe(data => {
        this.invoiceLists = data['data'].invoices;
        console.log('invoiceLists?', this.invoiceLists);
      })
  }
  GetexpenseListByInvoiceID(IsInvoiced,param) {
    console.log(IsInvoiced);
    this.toggle=param;
    let expid='';
    if(IsInvoiced == true){
      expid='true'
    }
    else if(IsInvoiced == false){
      expid='false'
    }
    console.log('expid',typeof expid);
    this.viewinvoiceservice.expid=expid;
    //this._viewexpensesByBlockId = this.viewexpensesByBlockId;
    this.expenseList = this._viewexpensesByBlockId;
    console.log('expid',expid);
    console.log('expid',typeof expid);
    if (expid == 'true') {
      this.Invoiced='Yes';
      this.toggleGenerateInvButton = true;
    }
    else{
      this.Invoiced='No';
      this.toggleGenerateInvButton = false;
    }
    //this.GetExpenseListByBlockID(this.viewexpenseservice.currentBlockId);
    if(expid == 'true' || expid == 'false'){
      console.log(this.viewexpensesByBlockId);
      this.expenseList = this.expenseList.filter(item=>{
        console.log('exIsInvD',typeof item['exIsInvD']);
        console.log('exIsInvD-string',typeof item['exIsInvD'].toString());
        return item['exIsInvD'].toString().toLowerCase() == expid.toLowerCase();
      })
      console.log(this.expenseList);
    }
    if(param == 'All'){
      this.expenseList = this._viewexpensesByBlockId;
    }
  }
  getExpenseListByDatesAndID() {
    console.log(this.ExpSDate, this.ExpEDate);
    let expenseList = {
      "ASAssnID": this.currentAssociationID.toString(),
      "BLBlockID": this.viewexpenseservice.currentBlockId,
      "startdate":formatDate(this.ExpSDate,'yyyy-dd-MM','en') ,
      "enddate": formatDate(this.ExpEDate,'yyyy-dd-MM','en')
    }
    console.log(expenseList);
    this.viewexpenseservice.getExpenseListByDatesAndID(expenseList)
    .subscribe(data=>{
      this.expenseList=[];
      console.log(data['data']['expense']);
      this._viewexpensesByBlockId=data['data']['expense'];
      data['data']['expense'].forEach(item => {
        this.expenseList.push(new ExpenseList(item['exid'],item['exHead'], item['exApplTO'], item['unUniIden'], item['exIsInvD'], item['exDate'], item['expAmnt'], '',item['inNumber']));
      })
      console.log(this.expenseList);
      this._viewexpensesByBlockId=this.expenseList;
      console.log(this._viewexpensesByBlockId);
    },
    err=>{
      console.log(err);
    })
  }
  toggleGenerateInv() {
    this.toggleBulkInvGenerate = !this.toggleBulkInvGenerate;
    this.viewexpenseservice.toggleBulkInvGenerate=this.toggleBulkInvGenerate;
    console.log( this.toggleBulkInvGenerate );
    this.expenseList.forEach(item=>{
     console.log(typeof item['exIsInvD']); 
     item['checkedForGenerateInvoice']=this.toggleBulkInvGenerate;
     console.log(item['checkedForGenerateInvoice']); 
    })
  }
  getSelectedInv(exid,e){
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
}
