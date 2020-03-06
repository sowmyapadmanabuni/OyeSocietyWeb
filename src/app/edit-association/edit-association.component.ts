import { Component, OnInit } from '@angular/core';
import { ViewAssociationService } from '../../services/view-association.service';
import { Amenity } from '../models/amenity';
import Swal from 'sweetalert2';
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

  constructor(public viewAssnService: ViewAssociationService,
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

  ngOnInit() {
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
