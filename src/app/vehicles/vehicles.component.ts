import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalServiceService } from '../global-service.service';
import {AddVehicleService} from '../../services/add-vehicle.service';
import swal from 'sweetalert2';
import {VehicleDataNew} from '../models/vehicle-data-new';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  modalRef: BsModalRef;
  CurrentUnitID: any;
  VehicleData: [];
  vehicledatalength: boolean;
  veMakeMdl: string;
  veRegNo: string;
  veStickNo:string;
  uplNum: string;
  veType: string;
  
  vehiclename: any;
  vehiclenumber: any;
  vehiclesticker: any;
  parkingslot: any;
  VEID: any;
  makemodel: any;
  VehicleDataNew: VehicleDataNew[];



  constructor(private modalService: BsModalService, 
    private globalserviceservice: GlobalServiceService, 
    private bsModalService: BsModalService, 
    private addvehicleservice: AddVehicleService) 
    {
      this.vehicledatalength = false;
      this.VehicleData=[];
      this.VehicleDataNew=[];
     }

  ngOnInit() {
    this.CurrentUnitID = this.globalserviceservice.getCurrentUnitId();
    console.log(this.CurrentUnitID);
    this.getVehicles();
  }

  getVehicles(){
    this.VehicleDataNew=[];
    this.addvehicleservice.getVehicleDetails(this.CurrentUnitID)
    .subscribe(data =>{
      console.log(data);
      this.VehicleData=data['data']['vehicleListByUnitID'];
      console.log(this.VehicleData);
      this.VehicleData.forEach(item => {
        if (this.VehicleData.length > 0) {
          this.vehicledatalength = true;
          if (item['veType'] != '' && item['veMakeMdl']  != '' && item['veRegNo']  != '' && item['veStickNo'] != '' ) {
            this.VehicleDataNew.push(new VehicleDataNew(item['veType'], item['veMakeMdl'] , item['veRegNo'] , item['veStickNo'] , item['veid'] ));
            console.log('test',this.VehicleDataNew);
          }
        }
      })
    },
    err=>{
      console.log(err);
    })

  }

  // openModal(requestdemo: TemplateRef<any>) {
  //   this.modalRef = this.bsModalService.show(requestdemo, Object.assign({}, { class: 'gray modal-lg' }));
  // }

  // ADD VEHICLE FUNCTION

  AddVehicle(){
    let vehiclesData = {
      'veMakeMdl': this.veMakeMdl,
      'veRegNo': this.veRegNo,
      'veStickNo': this.veStickNo,
      'uplNum': this.uplNum,
      'veType': this.veType,
      'UNUnitID': this.globalserviceservice.currentUnitId,
      'MEMemID': '',
      'UPID': '',
      'ASAssnID': this.globalserviceservice.currentAssociationId
    }
    console.log(vehiclesData);
    this.addvehicleservice.addVehicle(vehiclesData)
    .subscribe(()=>{
      this.getVehicles();
      swal.fire({
        title: "Vehicle added",
        text: "",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
      }).then(
        (result) => {
        if (result.value) {
        this.getVehicles();
        }
        })
      this.veMakeMdl='';
      this.veRegNo='';
      this.veStickNo='';
      this.uplNum='';
      this.veType='';
     },
     () => {
      swal.fire('Error', 'Something went wrong!', 'error')
     })
     this.modalRef.hide();
  }


   // EDIT VEHICLE FUNCTION
  UpdateVehicle(){
    let updateData = {

      "VEType"    : this.makemodel,
      "VERegNo"   : this.vehiclenumber,
      "VEMakeMdl" : this.vehiclename,
      "VEStickNo" : this.vehiclesticker,
      "UPLNum"    : this.parkingslot,
      "VEID"      : this.VEID,
      "ASAssnID"  : this.globalserviceservice.currentAssociationId
    }
    console.log(updateData);
    this.addvehicleservice.updateVehicle(updateData)
    .subscribe((data)=>{
      console.log(data);
      swal.fire({
        title: "Vehicle data updated",
        text: "",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
      }).then(
        (result) => {
        if (result.value) {
        this.getVehicles();
        }
        })

     },
     () => {
      swal.fire('Error', 'Something went wrong!', 'error')
     })
     this.modalRef.hide();
  }

  openModal(editVehicle: TemplateRef<any>,veType,veRegNo,veMakeMdl,veStickNo,uplNum,veid) {
    console.log(veType);
    console.log(veRegNo);
    console.log(veMakeMdl);
    console.log(veStickNo);
    console.log(uplNum);
    console.log(veid);
    this.vehiclename = veMakeMdl;
    this.vehiclenumber = veRegNo;
    this.makemodel = veType;
    this.vehiclesticker = veStickNo;
    this.parkingslot = uplNum;
    this.VEID = veid;
    //this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.modalRef = this.modalService.show(editVehicle, { class: 'modal-md' });
  }

  // DELETE VEHICLE
  DeleteVehicle(veid){
    console.log(veid);
    let deleteData ={
      "VEIsActive" :false,
      "VEID" :veid
    }
    console.log(deleteData);
    this.addvehicleservice.DeleteVehicle(deleteData)
    .subscribe((data)=>{
      console.log(data);
      swal.fire({
        title: "Vehicle deleted",
        text: "",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#f69321",
        confirmButtonText: "OK",
      }).then(
        (result) => {
          if (result.value) {
            setTimeout(() => {
              this.getVehicles();
            },2000);
          }
        })
    },
    err=>{
      console.log(err);
      swal.fire('Error', 'Something went wrong!', 'error')
      this.modalRef.hide();
    })
  }

}
