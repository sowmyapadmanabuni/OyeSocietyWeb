import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';
import { MapService } from '../map.service';
import * as M from '../../assets/materialize/js/materialize.min.js';
import * as $ from 'jquery';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {
  carouselImages:any[];
  location:object;
  lat: number;
  lng: number;
  options:{};
  imgPath:any;
  appRootName:string;
  @Input() appId:any;
  @Input() appName:any;
  @Output() sendAppName= new EventEmitter();
  // @Output() sendappImgCount= new EventEmitter<any>();

  constructor(){
  this.lat=0;
  this.lng=0;
  this.carouselImages=[];
  this.imgPath='';
  }
  
  ngOnInit()
  {
    
  }
  getCarouselName(img,event){
    this.imgPath=img;
    this.location=event;
  }
}
