import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { GlobalServiceService } from '../global-service.service';
import { ViewBlockService } from '../../services/view-block.service';
import { formatDate } from '@angular/common';
import { AddBlockService } from '../../services/add-block.service';
import { ViewUnitService } from '../../services/view-unit.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import {GenerateReceiptService} from '../../services/generate-receipt.service'
import {ViewInvoiceService} from '../../services/view-invoice.service'


@Component({
  selector: 'app-excel-receipt-upload',
  templateUrl: './excel-receipt-upload.component.html',
  styleUrls: ['./excel-receipt-upload.component.css']
})
export class ExcelReceiptUploadComponent implements OnInit {
ReceiptList:any[];

  constructor(
    public globalService: GlobalServiceService,
    public viewBlockService: ViewBlockService,
    public addblockservice: AddBlockService,
    public viewUnitService: ViewUnitService,
    public generateReceiptService: GenerateReceiptService,
    public viewinvoiceservice: ViewInvoiceService,
    public router:Router
  ) { }

  ngOnInit() {
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
      console.log(jsonData['Sheet1']);
      this.ReceiptList=jsonData['Sheet1']
      //this.GenerateBulkReceipt(this.ReceiptList)
    }
    reader.readAsBinaryString(file);
  }
  GenerateBulkReceipt() {
  /*  let receiptList=[];
    this.ReceiptList.forEach(item => {
      this.generateReceiptService.ReceiptListArrayForComapreWithExcel.forEach(item1 => {
        if (item['InvoiceNumber'] == item1['inNumber']) {
          receiptList.push({
            "AmountPaid": item['AmountPaid'],
            "inNumber": item1['inNumber'],
            "unUnitID": item1['unUnitID'],
            "asAssnID": item1['asAssnID'],
            "Cash(PaymentDate)": (item['Cash(PaymentDate)'] == undefined ? '' : formatDate(item['Cash(PaymentDate)'], 'yyyy/MM/dd', 'en')),
            "Cheque(BankName)": (item['Cheque(BankName)'] == undefined ? '' : item['Cheque(BankName)']),
            "inTotVal": item1['inTotVal'],
            "Cash(VoucherNumber)": (item['Cash(VoucherNumber)'] == undefined ? '' : item['Cash(VoucherNumber)']),
            "Cheque(ChequeNumber)": (item['Cheque(ChequeNumber)'] == undefined ? '' : item['Cheque(ChequeNumber)']),
            "Cheque(ChequeDate)": (item['Cheque(ChequeDate)'] == undefined ? '' : formatDate(item['Cheque(ChequeDate)'], 'yyyy/MM/dd', 'en')),
            "DemandDraft(DDNumber)": (item['DemandDraft(DDNumber)'] == undefined ? '' : item['DemandDraft(DDNumber)']),
            "DemandDraft(DDdate)": (item['DemandDraft(DDdate)'] == undefined ? '' : formatDate(item['DemandDraft(DDdate)'], 'yyyy/MM/dd', 'en'))
          })
        }
      })
    })
    console.log(receiptList); */
      this.ReceiptList.forEach((item, index) => {

      ((index) => {
        setTimeout(() => {
          console.log(index);
          this.generateReceiptService.ReceiptListArrayForComapreWithExcel.forEach(item1 => {
            console.log('item-', item['InvoiceNumber'], 'item-1', item1['inNumber']);

            if (item['InvoiceNumber'] == item1['inNumber']) {
              console.log('inside if condition');
              let genReceipt = {
                "PYAmtPaid": item['AmountPaid'],
                "INNumber": item1['inNumber'],
                "UNUnitID": item1['unUnitID'],
                "ASAssnID": item1['asAssnID'],
                "PYDate": (item['Cash(PaymentDate)'] == undefined ? '' : formatDate(item['Cash(PaymentDate)'], 'yyyy/MM/dd', 'en')),
                "MEMemID": "1",
                "PYRefNo": "sfg54658",
                "PYBkDet": (item['Cheque(BankName)'] == undefined ? '' : item['Cheque(BankName)']),
                "PYTax": "12.6",
                "PMID": 1,
                "PYAmtDue": item1['inTotVal'],
                "PYDesc": "PaymentMade",
                "PYVoucherNo": (item['Cash(VoucherNumber)'] == undefined ? '' : item['Cash(VoucherNumber)']),
                "PYChqNo": (item['Cheque(ChequeNumber)'] == undefined ? '' : item['Cheque(ChequeNumber)']),
                "PYChqDate": (item['Cheque(ChequeDate)'] == undefined ? '' : formatDate(item['Cheque(ChequeDate)'], 'yyyy/MM/dd', 'en')),
                "PYDDNo": (item['DemandDraft(DDNumber)'] == undefined ? '' : item['DemandDraft(DDNumber)']),
                "PYDDDate": (item['DemandDraft(DDdate)'] == undefined ? '' : formatDate(item['DemandDraft(DDdate)'], 'yyyy/MM/dd', 'en'))
              }

              console.log(genReceipt);
              this.viewinvoiceservice.generateInvoiceReceipt(genReceipt)
                .subscribe(data => {
                  console.log(data);
                },
                  err => {
                    console.log(err);
                })
              //
            }
          })
          //
        }, 2000 * index)
      })(index)
    }) 
  }

}
