import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  selectedCity:String;

  constructor() { }

  ngOnInit() {
    this.selectedCity="bengaluru";
  }
  
  openCity(cityName) {
    this.selectedCity = cityName;
  }

}
