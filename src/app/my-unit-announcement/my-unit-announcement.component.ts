import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-unit-announcement',
  templateUrl: './my-unit-announcement.component.html',
  styleUrls: ['./my-unit-announcement.component.css']
})
export class MyUnitAnnouncementComponent implements OnInit {
  bsConfig: { dateInputFormat: string; showWeekNumbers: boolean; isAnimated: boolean; };
  announcementList: any[];

  constructor() {
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MM-YYYY',
      showWeekNumbers: false,
      isAnimated: true
      });
      this.announcementList=['abc'];
   }

  ngOnInit() {
  }
  validateAnnounceDate(event, AnnounceStartDate, AnnounceEndDate) {
    console.log(AnnounceStartDate.value, AnnounceStartDate.value);
    if (event.keyCode == 8) {
      if ((AnnounceStartDate.value == '' || AnnounceStartDate.value == null) && (AnnounceEndDate.value == '' || AnnounceEndDate.value == null)) {
        console.log('test');

      }
    }
  }
  getAnnounceByDateRange(AnnounceEndDate) {
    if(AnnounceEndDate != null){
      console.log(AnnounceEndDate);
      this.announcementList=[];
    }
  }

}
