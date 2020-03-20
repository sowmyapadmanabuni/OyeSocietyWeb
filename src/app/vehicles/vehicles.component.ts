import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalServiceService } from '../global-service.service';
import { AddVehicleService } from '../../services/add-vehicle.service';
import swal from 'sweetalert2';
import { VehicleDataNew } from '../models/vehicle-data-new';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})

export class VehiclesComponent implements OnInit {
  modalRef: BsModalRef;
  CurrentUnitID: any;
  VehicleData: [];
  VehicleCarousel: VehicleDataNew[];
  VehicleCarousel1: VehicleDataNew[];
  vehicledatalength: boolean;
  veMakeMdl: string;
  veRegNo: string;
  veStickNo: string;
  uplNum: string;
  veType: string;
  j: any;
  vehiclename: any;
  vehiclenumber: any;
  vehiclesticker: any;
  parkingslot: any;
  VEID: any;
  makemodel: any;
  VehicleDataNew: VehicleDataNew[];
  getUnitID: Subscription;
  deleteVehicleData:boolean;

  constructor(private modalService: BsModalService,
    private globalserviceservice: GlobalServiceService,
    private bsModalService: BsModalService,
    private addvehicleservice: AddVehicleService) {
    this.veType="TwoWheeler";
      this.deleteVehicleData=false;
    this.vehicledatalength = false;
    this.VehicleData = [];
    this.VehicleDataNew = [];
    this.VehicleCarousel = [];
    this.VehicleCarousel1 = [];
    this.j = 0;
    this.getUnitID = this.globalserviceservice.getCurrentUnitIdSubject()
      .subscribe(data => {
        console.log(data);
        this.VehicleDataNew = [];
        this.VehicleCarousel = [];
        this.VehicleCarousel1 = [];
        this.addvehicleservice.getVehicleDetails(data.UnitID,this.globalserviceservice.getCurrentAssociationId(),this.globalserviceservice.getacAccntID())
          .subscribe(data => {
            console.log(data);
            this.VehicleData = data['data']['vehicleListByUnitID'];
            console.log(this.VehicleData);
            this.VehicleData.forEach(item => {
              if (this.VehicleData.length > 0) {
                this.vehicledatalength = true;
                if (item['veType'] != '' && item['veMakeMdl'] != '' && item['veRegNo'] != '' && item['veStickNo'] != '' && item['uplNum'] != '') {
                  this.VehicleDataNew.push(new VehicleDataNew(item['veType'], item['veMakeMdl'], item['veRegNo'], item['veStickNo'], item['veid'],item['uplNum']));
                  console.log('test', this.VehicleDataNew);
                }
              }
            })
            for (let i = 0; i < this.VehicleDataNew.length; i++) {
              if (i < 4) {
                this.VehicleCarousel[i] = this.VehicleDataNew[i];
              }
              else {
                this.VehicleCarousel1[this.j] = this.VehicleDataNew[i];
                this.j++;
              }
            }
            console.log(this.VehicleCarousel);
            //console.log(this.VehicleCarousel1);
          },
            err => {
              //console.log(err);
            })
      })
  }

  ngOnInit() {
    this.CurrentUnitID = this.globalserviceservice.getCurrentUnitId();
    console.log(this.CurrentUnitID);
    this.getVehicles();
  }

  ngAfterViewInit(){
    $(".se-pre-con").fadeOut("slow");
  }
  _keyPress(event: any,Id) {
    //console.log(Id);
    //console.log(managernumberControl);
    //console.log(managernumberControl.touched);
    // console.log(this.blockArray.length);
    // if(this.blockArray.length != null){
    //   for(let i=0;i<this.blockArray.length;i++){
    //     if(this.blockArray[i]['Id'] == Id){
    //       this.blockArray[i]['uniqueID']=Id;
    //     }
    //     else{
    //       this.blockArray[i]['uniqueID']='';
    //     }
    //   }
    // }
    // console.log(this.blockArray);
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  getVehicles() {
    this.VehicleDataNew = [];
    this.j=0;
    this.addvehicleservice.getVehicleDetails(this.CurrentUnitID,this.globalserviceservice.getCurrentAssociationId(),this.globalserviceservice.getacAccntID())
      .subscribe(data => {
        console.log(data);
        this.VehicleData = data['data']['vehicleListByUnitID'];
        console.log(this.VehicleData);
        this.VehicleData.forEach(item => {
          if (this.VehicleData.length > 0) {
            this.vehicledatalength = true;
            if (item['veType'] != '' && item['veMakeMdl'] != '' && item['veRegNo'] != '' && item['veStickNo'] != '' && item['uplNum'] != '') {
              this.VehicleDataNew.push(new VehicleDataNew(item['veType'], item['veMakeMdl'], item['veRegNo'], item['veStickNo'], item['veid'], item['uplNum']));
              //console.log('test',this.VehicleDataNew);
            }
          }
        })

        // this.VehicleCarousel=new Array(4);
        // this.VehicleCarousel1=new Array(this.VehicleDataNew.length-4);
        // console.log(this.VehicleCarousel,this.VehicleCarousel1);

        for (let i = 0; i < this.VehicleDataNew.length; i++) {
          if (i < 4) {
            this.VehicleCarousel[i] = this.VehicleDataNew[i];
          }
          else {
            this.VehicleCarousel1[this.j] = this.VehicleDataNew[i];
            this.j++;
          }
        }
        console.log(this.VehicleCarousel);
        console.log(this.VehicleCarousel1);
      },
        err => {
          //console.log(err);
        })
  }
  // openModal(requestdemo: TemplateRef<any>) {
  //   this.modalRef = this.bsModalService.show(requestdemo, Object.assign({}, { class: 'gray modal-lg' }));
  // }




  // ADD VEHICLE FUNCTION
  AddVehicle() {
    let vehiclesData = {
      'veMakeMdl': this.veMakeMdl,
      'veRegNo': this.veRegNo,
      'veStickNo': this.veStickNo,
      'uplNum': this.uplNum,
      'veType': this.veType,
      'UNUnitID': this.globalserviceservice.currentUnitId,
      'MEMemID': '',
      'UPID': '',
      'ASAssnID': this.globalserviceservice.currentAssociationId,
      "PAccntID": this.globalserviceservice.getacAccntID()
    }
    console.log(vehiclesData);
    this.addvehicleservice.addVehicle(vehiclesData)
      .subscribe(() => {
        //this.getVehicles();
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
        this.veMakeMdl = '';
        this.veRegNo = '';
        this.veStickNo = '';
        this.uplNum = '';
        console.log(this.uplNum);
        this.veType = '';
      },
        (err) => {
          console.log(err);
          swal.fire('Error', err['error']['error']['message'], 'error')
        })
    this.modalRef.hide();
  }
  // EDIT VEHICLE FUNCTION
  UpdateVehicle() {
    let updateData = {
      "VEType": this.makemodel,
      "VERegNo": this.vehiclenumber,
      "VEMakeMdl": this.vehiclename,
      "VEStickNo": this.vehiclesticker,
      "UPLNum": this.parkingslot,
      "VEID": this.VEID,
      "ASAssnID": this.globalserviceservice.currentAssociationId
    }
    console.log(updateData);
    this.addvehicleservice.updateVehicle(updateData)
      .subscribe((data) => {
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
  openModal(editVehicle: TemplateRef<any>, veType, veRegNo, veMakeMdl, veStickNo, uplNum, veid) {
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
  DeleteVehicle(veid) {
    console.log(veid);
    let deleteData = {
      "VEIsActive": this.deleteVehicleData,
      "VEID": veid
    }
    console.log(deleteData);
    this.addvehicleservice.DeleteVehicle(deleteData)
      .subscribe((data) => {
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
                this.VehicleDataNew = [];
                this.VehicleCarousel = [];
                this.VehicleCarousel1 = [];
                this.getVehicles();
              }, 2000);
            }
          })
      },
        err => {
          //console.log(err);
          swal.fire('Error', 'Something went wrong!', 'error')
          this.modalRef.hide();
        })
  }
  ngOnDestroy() {
    this.getUnitID.unsubscribe();
  }
}