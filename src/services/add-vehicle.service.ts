import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilsService} from '../app/utils/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddVehicleService {

  constructor(private http:HttpClient, private utilsService: UtilsService) { }


  getVehicleDetails(CurrentUnitID):Observable<any>{
    let scopeIP = this.utilsService.getVehileDetailsByIPaddress();
    let headers=this.getHttpheaders();
    return this.http.get(scopeIP + 'oyeliving/api/v1/Vehicle/GetVehicleListByUnitID/' +CurrentUnitID ,  {headers:headers});
  }

  addVehicle(vehiclesData){
    let scopeIP = this.utilsService.getVehileDetailsByIPaddress();
    console.log('AddVehicleData',vehiclesData);
    let headers = this.getHttpheaders();
    return this.http.post(scopeIP + 'oyeliving/api/v1/Vehicle/Create', JSON.stringify(vehiclesData), { headers: headers });
  }

  updateVehicle(updateData){
    let scopeIP = this.utilsService.getVehileDetailsByIPaddress();
    console.log('UpdateVehicleData',updateData);
    let headers = this.getHttpheaders();
    return this.http.post(scopeIP + 'oyeliving/api/v1/Vehicle/VehicleUpdate', JSON.stringify(updateData), { headers: headers });
  }

  DeleteVehicle(deleteData){
    let scopeIP = this.utilsService.getVehileDetailsByIPaddress();
    console.log('DeleteVehicleData',deleteData);
    let headers = this.getHttpheaders();
    return this.http.post(scopeIP + 'oyeliving/api/v1/Vehicle/VehicleUpdate', JSON.stringify(deleteData), { headers: headers });
  }

  getHttpheaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('X-Champ-APIKey', '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1')
      .set('Content-Type', 'application/json');
    return headers;
  }
}
