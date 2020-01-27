import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-unit-upload',
  templateUrl: './excel-unit-upload.component.html',
  styleUrls: ['./excel-unit-upload.component.css']
})
export class ExcelUnitUploadComponent implements OnInit {
  excelUnitList:any[];
  ShowExcelUploadDiscription:boolean;
  ShowExcelDataList:boolean;

  constructor() {
    this.excelUnitList=[];
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
      this.excelUnitList=jsonData['Sheet1']
      this.ShowExcelUploadDiscription=false;
      this.ShowExcelDataList=true;
      //this.createExpense(jsonData['Sheet1']);
    }
    reader.readAsBinaryString(file);
  }
}
