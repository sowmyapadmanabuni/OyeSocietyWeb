import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { FlatDetail } from '../flat-detail';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css']
})

export class GooglemapComponent implements OnInit {
  location: object;
  flatDetailList: FlatDetail[];
  lat: any;
  lng: any;
  show: boolean;
  name: any;

  // longitude:any;
  // latitude:any;
  // markers:any;

  constructor(private map: MapService) {
    // this.longitude="";
    // this.latitude="";
  }

  ngOnInit() {
   
  }



}
