import { Component, ViewChild, OnInit, EventEmitter, Output,TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ContactformService } from '../../contactform.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.css']
})
export class SafetyComponent implements OnInit {
  firstname:any;
  mailid:any;
  mobileNumber:any;
  Subject:any;
  City:any;
  Country:any;
  Locality:any;
  Message:any;
  modalRef:any;
  
@ViewChild('ContactForm',{static:true}) ContactForm: any;
  constructor(private modalService:BsModalService,private contactformService : ContactformService,
    private http: HttpClient,) { 
      this.firstname="";
      this.mobileNumber='';
      this.mailid="";
      this.Subject="";
      this.City="",
      this.Country="",
      this.Locality="",
      this.Message="";
    }

  ngOnInit() {
    window.scrollTo(0, 0);
  }
  openModal6(reqdemo: TemplateRef<any>) {
    this.modalRef = this.modalService.show(reqdemo, { class: 'modal-lg' });
  }
  submitContactForm(){
    let contactform=  {
      "Name"     : this.firstname,
      "Email"  : this.mailid,
        "MobileNumber"  : this.mobileNumber,
        "Subject": "+91"+ this.mobileNumber,
        "PageName"    : "Scuarex request demo",
        "City"    : this.City,
        "Country"    : this.Country,
        "Locality"    : this.Locality,
        "Message"    : this.Message,
        }
  this.contactformService.submitContactForm(contactform)
  .subscribe(data=>{
    console.log(data);
    Swal.fire({
      title: "Request Demo Details Submitted Successfully",
      text: "",
      type: "success",
      confirmButtonColor: "#f69321"
    }).then(
      (result) => {
        if (result.value) {
          this.firstname='';
          this.mailid='';
          this.mobileNumber='';
          this.City='';
          this.Country='';
          this.Locality='';
          this.Message='';
          this.Subject='';
          this.modalRef.hide();
          this.ContactForm.reset();
        }
      })
  },
  err=>{
    console.log(err);
  }
  
  )
  
    }
}
