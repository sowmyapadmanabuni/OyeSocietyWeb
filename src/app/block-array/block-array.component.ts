import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../global-service.service';

@Component({
  selector: 'app-block-array',
  templateUrl: './block-array.component.html',
  styleUrls: ['./block-array.component.css']
})
export class BlockArrayComponent implements OnInit {
  _blockDetails: any[];

  constructor(private globalservice: GlobalServiceService) { 
    this._blockDetails=[];
  }

  ngOnInit() {
  }

}
