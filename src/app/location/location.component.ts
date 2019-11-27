import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  selectedCity:String;

  constructor() { }

  ngOnInit() {
    this.selectedCity="bengaluru";
  }
  
  openCity(cityName) {
    this.selectedCity = cityName;
  }

}
