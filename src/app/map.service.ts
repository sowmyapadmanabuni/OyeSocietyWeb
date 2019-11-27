import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Location {
  latitude: string;
  longitude: string;
  name:string;
}
@Injectable({
  providedIn: 'root'
})
export class MapService {
  appImgCount: any;
  cords:any[];
  curLocLat:any;
  curLocLng:any;
  zoom:any;
  dir:any;
  destinationLat:any;
  destinationlng:any;
  distance:any;

  constructor(private http: HttpClient) {
    this.appImgCount = 0;

    this.cords=[]
  }

  locations() {
   return this.cords;
  }


}
