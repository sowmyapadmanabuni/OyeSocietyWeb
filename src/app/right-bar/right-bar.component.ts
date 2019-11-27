import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {

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
}
