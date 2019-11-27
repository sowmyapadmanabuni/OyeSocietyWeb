import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToAssociation(){
    this.router.navigate(['association']);
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
