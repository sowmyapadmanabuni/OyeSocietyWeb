import { Component, OnInit } from '@angular/core';
import { ViewAssociationService } from '../../services/view-association.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Amenity } from '../models/amenity';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-edit-association',
  templateUrl: './edit-association.component.html',
  styleUrls: ['./edit-association.component.css']
})
export class EditAssociationComponent implements OnInit {
  countries:any[];
  propertyTypes:any[];
  newamenities:any[];
  form: FormGroup;
  uploadForm: FormGroup;
  titleAlert: string = 'This field is required';

  constructor(public viewAssnService: ViewAssociationService,private formBuilder: FormBuilder,private modalService: BsModalService,
    private router: Router) {
    this.newamenities = [];
    console.log(this.viewAssnService.EditAssociationData);
     this.countries = [
      { "name": "Afghanistan" }, { "name": "Algeria" }, { "name": "Argentina" }, { "name": "Australia" }, { "name": "Austria" },
      { "name": "	Belgium" }, { "name": "Bhutan" }, { "name": "Brazil" },
      { "name": "Canada" }, { "name": "China" }, { "name": "Cuba" },
      { "name": "Denmark" },
      { "name": "Finland" }, { "name": "France" },
      { "name": "Germany" },
      { "name": "India" }, { "name": "Ireland" }, { "name": "Israel" }, { "name": "Italy" },
      { "name": "Japan" },
      { "name": "Malaysia" }, { "name": "Mexico" },
      { "name": "Mexico" }, { "name": "Netherlands" }, { "name": "Norway" },
      { "name": "Qatar" },
      { "name": "Russia" },
      { "name": "Singapore" }, { "name": "Switzerland" },
      { "name": "United Arab Emirates" }, { "name": "United Kingdom" }, { "name": "United States of America" },
      { "name": "Qatar" }, { "name": "Qatar" }
    ];

    this.propertyTypes = [
      { "name": "residential", "displayName": "Residential Property" },
      { "name": "Commercial Property", "displayName": "Commercial Property" },
      { "name": "Residential And Commercial Property", "displayName": "Residential And Commercial Property" }
    ];
  }
  countrieslist = [
    "INDIA",
    "AFGHANISTAN",
    "ALGERIA",
    "ARGENTINA",
    "AUSTRALIA",
    "AUSTRIA",
    "BELGIUM",
    "BHUTAN",
    "BRAZIL",
    "CANADA",
    "CHINA",
    "CUBA",
    "DENMARK",
    "FINLAND",
    "FRANCE",
    "GERMANY",
    "IRELAND",
    "ISRAEL",
    "ITALY",
    "JAPAN",
    "MALAYSIA",
    "MEXICO",
    "NETHERLANDS",
    "NORWAY",
    "QATAR",
    "RUSSIA",
    "SINGAPORE",
    "SWITZERLAND",
    "UAE",
    "UNITED KINGDOM",
    "USA",
    "QATAR"
  ]
  states = [
    "ANDAMAN",
    "ANDHRA PRADESH",
    "ARUNACHAL PRADESH",
    "ASSAM",
    "BIHAR",
    "CHANDIGARH",
    "CHHATTISGARH",
    "DADRA",
    "DELHI",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL PRADESH",
    "JAMMU AND KASHMIR",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "LADAKH",
    "LAKSHADWEEP",
    "MADHYA PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUDUCHERRY",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR PRADESH",
    "UTTARAKHAND",
    "WEST BENGAL"
  ]
  propertyType = [
    "RESIDENTIAL",
    "COMMERCIAL PROPERTY",
    "RESIDENTIAL AND COMMERCIAL PROPERTY"
  ]
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.uploadForm.get('profile').setValue(file);
    }
  }
  modalRef: BsModalRef;
  ImgForPopUp:any;
  UploadedImage: any;
  showImgOnPopUp(UploadedImagetemplate,thumbnailASAsnLogo,displayText){
    this.ImgForPopUp=thumbnailASAsnLogo;
    this.UploadedImage=displayText;
    this.modalRef = this.modalService.show(UploadedImagetemplate,Object.assign({}, { class: 'gray modal-lg' }));
  }
  ngOnInit() {
    this.createForm();
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      var navListItems = $('div.setup-panel div a'),
      AddExp = $('#AddExp'),
     /* StepTwo = $('#step-6'),*/
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
       anchorDiv = $('div.setup-panel div'),
       anchorDivs = $('div.stepwizard-row div');
      allWells.hide();
      navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
          $item = $(this), 
          $divTgt = $(this).parent();
          console.log('test');
        // console.log($target);
        //console.log($item);
        // console.log(anchorDiv);
        // console.log($divTgt);
        // console.log(anchorDivs);
        anchorDivs.removeClass('step-active');
        //console.log(anchorDivs);
        if (!$item.hasClass('disabled')) {
          console.log('disabled');
          navListItems.removeClass('btn-success').addClass('btn-default');
          $item.addClass('btn-success');
          $divTgt.addClass('step-active');
          allWells.hide();
          console.log($target);
         /* console.log(StepTwo);
          StepTwo.show(); */
          $target.show();
          $target.find('input:eq(0)').focus();
        }
      });
      allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
          curInputs = curStep.find("input[type='text']"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]'),
          isValid = true;
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
      AddExp.click(function () {
        console.log(this);
        var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          curAnchorBtn=$('div.setup-panel div a[href="#' + curStepBtn + '"]')
        curAnchorBtn.removeClass('btn-circle-o').addClass('btn-circle');
      })
      $('div.setup-panel div a.btn-success').trigger('click');
    });
    $(".se-pre-con").fadeOut("slow");
  }
  getCountry(country){
    this.viewAssnService.EditAssociationData['ASCountry']=country;
  }
  setPropertyType(propertyType){
    this.viewAssnService.EditAssociationData['ASPrpType']=propertyType;
  }
  addAmenity(event) {
    //console.log('amenity',event);
    //console.log('AMType'+ event['AMType']);
    //console.log('NoofAmenities'+ event['NoofAmenities']);
    if(event['AMType'] !== "" && event['NoofAmenities'] !== ""){
       //alert('inside if condition null');
       this.newamenities.push(new Amenity(event['AMType'],event['NoofAmenities']));
    }
    //console.log('newamenities',this.newamenities);
  }
  deleteamenity(AMType) {
    //console.log('AMType', AMType);
    this.newamenities = this.newamenities.filter(item =>{return item['AMType'] != AMType});
  }
  _keyPress(event: any) {
    console.log('asd');
    const pattern = /[a-zA-Z _]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      console.log('test');
      event.preventDefault();
    }
  }
  _keyPress2(event: any, Id) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  resetfields(){
    //alert("hai");
    this.viewAssnService.EditAssociationData['ASAsnName']="";
    this.viewAssnService.EditAssociationData['ASCountry']="";
    this.viewAssnService.EditAssociationData['ASState']="";
    this.viewAssnService.EditAssociationData['ASCity']="";
    this.viewAssnService.EditAssociationData['ASPinCode']="";
    this.viewAssnService.EditAssociationData['ASPrpType']="";
    this.viewAssnService.EditAssociationData['ASPrpName']="";
    this.viewAssnService.EditAssociationData['ASAddress']="";
    this.viewAssnService.EditAssociationData['asAsnEmail']="";
    this.viewAssnService.EditAssociationData['asWebURL']="";
  }
  createForm() {
    this.form = this.formBuilder.group({
      'asnname': [null, Validators.required],
      'cntryname':[null],
      'statename':[null],
      'cityname': [null, Validators.required],
      'prprtytype':[null],
      'zipcode': [null, Validators.required],
      'prtyname': [null, Validators.required],
      'locname': [null, Validators.required],
      'assemail': [null, [Validators.required, Validators.email]],
      'urlset': [null]

    });
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  resetStep1(ev){

    console.log(ev)
    this.form.reset();
    // this.thumbnailASAsnLogo='';
   
  }
  ASAsnLogo: any;
  thumbnailASAsnLogo:any;
  processFile() {
    console.log(this.uploadForm.get('profile').value);
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadForm.get('profile').value);
    reader.onload = () => {
      console.log(reader.result);
      this.ASAsnLogo = reader.result;
      this.thumbnailASAsnLogo = reader.result;
      this.ASAsnLogo = this.ASAsnLogo.substring(this.ASAsnLogo.indexOf('64') + 3);
         console.log(this.ASAsnLogo);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  
  }
  keyPress3(event:any){
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(inputChar, e.charCode);
       if (!pattern.test(inputChar)) {
       // invalid character, prevent input
           event.preventDefault();
      }
  }
  UpdateAssociation(){
    console.log(this.viewAssnService.EditAssociationData);
    this.viewAssnService.UpdateAssociation(this.viewAssnService.EditAssociationData).subscribe(res => {
      console.log(res);
      //console.log(JSON.stringify(res));
      //alert("Association Created Successfully")
      Swal.fire({
        title: 'Association Updated Successfuly',
        text: "",
        type: "success",
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK"
      }).then(
        (result) => {
          if (result.value) {
            this.router.navigate(['association']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['association']);
          }
        })
    },
      err => {
        console.log(err);
        Swal.fire({
          title: "Error",
          text: `${err['error']['exceptionMessage']}`,
          type: "error",
          confirmButtonColor: "#f69321"
        }).then(
          (result) => {
            if (result.value) {
              this.router.navigate(['association']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {

            }
          });
      });
  }

}
