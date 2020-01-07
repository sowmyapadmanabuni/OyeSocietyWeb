import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-patrolling',
  templateUrl: './patrolling.component.html',
  styleUrls: ['./patrolling.component.css']
})
export class PatrollingComponent implements OnInit {
  reportlists:any[];
  modalRef: BsModalRef;
  WorkerNameList:any[];
  searchTxt:any;
  addGuest:any;

  constructor() { }

  ngOnInit() {
  }

}
