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
    public router:Router
  ) { }

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
      console.log(jsonData['Sheet1']);
      this.ReceiptList=jsonData['Sheet1']
    }
    reader.readAsBinaryString(file);
  }

}
