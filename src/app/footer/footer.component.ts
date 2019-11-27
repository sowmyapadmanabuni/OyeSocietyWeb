import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModal3(privacy: TemplateRef<any>) {
    this.modalRef = this.modalService.show(privacy, { class: 'modal-lg' });
  }
  openModal4(refund: TemplateRef<any>) {
    this.modalRef = this.modalService.show(refund, { class: 'modal-md' });
  }
  openModal5(termsconditions: TemplateRef<any>) {
    this.modalRef = this.modalService.show(termsconditions, { class: 'modal-lg' });
  }
}
