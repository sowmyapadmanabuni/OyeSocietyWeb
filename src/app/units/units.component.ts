import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  goToAssociation(){
    this.router.navigate(['association']);
  }
  goToUnitsBlocks(){
    this.router.navigate(['unitsblocks']);
  }
  goToBlocks(){
    this.router.navigate(['blocks']);
  }
  goToUnits(){
    this.router.navigate(['units']);
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }
}
