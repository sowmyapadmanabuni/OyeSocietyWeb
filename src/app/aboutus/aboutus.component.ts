import { Component, ViewChild,OnInit , EventEmitter, Output,TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ContactformService } from '../../contactform.service';



@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  selectedCity:String;
  modalRef: any;
  firstname:any;
  mailid:any;
  mobileNumber:any;
  Subject:any;
  City:any;
  Country:any;
  Locality:any;
  Message:any;
  @ViewChild('ContactForm',{static:true}) ContactForm: any;

  constructor(private modalService:BsModalService,private contactformService : ContactformService,
    private http: HttpClient) { 
      this.firstname="";
      this.mobileNumber='';
      this.mailid="";
      this.Subject="";
      this.City="",
      this.Country="",
      this.Locality="",
      this.Message="";
    }
    openModal6(reqdemo: TemplateRef<any>) {
      this.modalRef = this.modalService.show(reqdemo, { class: 'modal-lg' });
    }
  ngOnInit() {
    this.selectedCity="bengaluru";
  }
  
  openCity(cityName) {
    this.selectedCity = cityName;
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
