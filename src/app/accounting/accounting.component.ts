import { Component, OnInit,TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  modalRef: any;
  constructor(private modalService:BsModalService) { }
  openModal6(reqdemo: TemplateRef<any>) {
    this.modalRef = this.modalService.show(reqdemo, { class: 'modal-lg' });
  }
  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
