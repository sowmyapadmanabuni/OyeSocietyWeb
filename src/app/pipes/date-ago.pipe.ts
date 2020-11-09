import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let valueDis;
    if (value) {
      //let inDate = moment().hours()
      let inDate = new Date().getTime();
      // console.log('inDate-', inDate);
      //let enDate = moment(value).hours()
      let enDate = new Date(value).getTime()
      // console.log('enDate-', enDate);
      let duration = Math.abs(inDate - enDate);
      // console.log('duration-', duration);
      //let duration2=Math.ceil(duration / (1000 * 60 * 60 * 24));
      let days = Math.floor(duration / (1000 * 60 * 60 * 24));
      let hours = Math.floor(duration / (1000 * 60 * 60));
      let mins = Math.floor(duration / (1000 * 60));
      // console.log('days-', days);
      // console.log('hours-', hours);
      // console.log('mins-', mins);
      // let valueDis = days > 1 ? moment(item.ntdCreated).format('DD MMM YYYY') : days == 1 ? "Yesterday" : mins >= 120 ? hours + " hours ago" : (mins < 120 && mins >= 60) ? hours + " hour ago"
      // : mins == 0 ? "Just now" : mins + " mins ago";
      valueDis = days > 1 ? moment(value).format('DD MMM YYYY') : days == 1 ? "Yesterday" : mins >= 120 ? hours + " hours ago" : (mins < 120 && mins >= 60) ? hours + " hour ago" : mins == 0 ? "Just now" : mins + " mins ago";
    }
    return valueDis;
   /* if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
      }
    }
    return value; */
  } 

}
