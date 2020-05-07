import { Component, OnInit } from '@angular/core';
import { AudioRecordingService } from '../audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service';


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styles: [`
    .start-button {
      background-color: #e58739; /* Orange */
      border: none;
      color: white;
      padding: 7px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin-bottom: 10px;
    }

    .stop-button {
      background-color: rgba(118, 146, 254, 0.69); /* Green */
      border: none;
      color: white;
      padding: 7px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin-bottom: 10px;

    }

    .cancel-button {
      background-color: #af7541; /* Green */
      border: none;
      color: white;
      padding: 7px 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 12px;
      margin-bottom: 10px;
    }
  `]
})
export class BroadcastComponent implements OnInit {
  AnnouncementMessage:any;
  AnnouncementImage:any;
  isRecording = false;
  recordedTime;
  blobUrl;

  constructor(private audioRecordingService: AudioRecordingService, 
    private sanitizer: DomSanitizer,
    private http: HttpClient,public globalService: GlobalServiceService) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  ngOnInit() {
  }
  
  sendBroadcast(){
    console.log(this.blobUrl);
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');
    let MessageBody=
    {    "ANImages"  : this.AnnouncementImage,
    "ANCmnts"   : this.AnnouncementMessage,
    // "ACAccntID" : this.globalService.getacAccntID(),
    // "ASAssnID"  : this.globalService.getCurrentAssociationId(),
    "ACAccntID" : 2,
    "ASAssnID"  : 2,
    "ANVoice"   : this.blobUrl,
    "ANRecipient" : "All Owners"
}
    console.log(MessageBody);
  this.http.post('https://devapi.scuarex.com/oyesafe/api/v1/Announcement/Announcementcreate', JSON.stringify(MessageBody), { headers: headers })
    .subscribe(data => {
      console.log(data);
    },
    err=>{
      console.log(err);
    })
  }




}
