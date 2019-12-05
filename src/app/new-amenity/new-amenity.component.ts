import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Amenity } from '../models/amenity';

@Component({
  selector: 'app-new-amenity',
  templateUrl: './new-amenity.component.html',
  styleUrls: ['./new-amenity.component.css']
})
export class NewAmenityComponent implements OnInit {

  @Input() newamenities: any[];
  @Input() newamenity:any={};
  //"AMType": "Park",//this.am.newAMTypes,
    //        "NoofAmenities": 1,//this.am.newNoofAmenitie,
  @Output() addAmenities:EventEmitter<any>;
  @Output() deleteamenity = new EventEmitter<any>();
  AmenityId: number;
  AmenityT: string;
  AmenityN: string;


  constructor() {
    this.AmenityId = 0;
    this.addAmenities=new EventEmitter<any>();
    this.newamenity.AMType = '';
    this.newamenity.NoofAmenities = '';
  }

  ngOnInit() {
  }

  ngOnChanges() {

  }

  addAmenity() {
    //this.AmenityId += 1;
    //alert('new-amenity - addamenity');
    this.addAmenities.emit(this.newamenity);
    this.newamenity.AMType = '';
    this.newamenity.NoofAmenities = '';
  }

  deleteAmenity(AMType) {
    this.deleteamenity.emit(AMType);
  }

}
