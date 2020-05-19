import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  role: any;

  constructor() { 
    this.role='admin';
  }

  ngOnInit() {
    $(function(){
      $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      })
    });
  }
  AdminsUnitShow(resident)
  {
      this.role=resident;
  }
  AdminsButtonShow(admin){
      this.role=admin;
  }
}
