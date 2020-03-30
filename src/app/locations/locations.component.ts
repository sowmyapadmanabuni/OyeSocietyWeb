import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  selectedCity:String;

  constructor() { }

  ngOnInit() {
    this.selectedCity="bengaluru";
  }
  
  openCity(cityName) {
    this.selectedCity = cityName;
  }
}
