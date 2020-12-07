import { Component, OnInit } from '@angular/core';
import { AudioRecordingService } from '../audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServiceService } from '../global-service.service';
import {UtilsService} from '../utils/utils.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import swal from 'sweetalert2';



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
  BroadCastImg:any;
  BroadCastImgList:any[];
  Recipients: string;
  toggleFaCircleO: boolean;
  toggleFaCircle2: boolean;
  toggleFaCircle1: boolean;
  RecipientType: string;
  toggleSendAncmntBtn: boolean;
  ifFileSelected: boolean;
  disabledIfAnnouncementEmpty: boolean;

  constructor(private audioRecordingService: AudioRecordingService, 
    private sanitizer: DomSanitizer,
    private http: HttpClient,public globalService: GlobalServiceService,
    private UtilsService:UtilsService,private router:Router) {
      this.disabledIfAnnouncementEmpty = true;
      this.toggleSendAncmntBtn = true;
      this.RecipientType='';
      this.toggleFaCircle1 = false;
      this.toggleFaCircleO = false;
      this.toggleFaCircle2 = false;
      this.ifFileSelected = false;
      this.AnnouncementMessage='';
      this.Recipients='';
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });

    this.BroadCastImgList=[];
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
      this.toggleFaCircleO = true;
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
  
  sendBroadcast() {
    console.log(this.blobUrl);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-OYE247-APIKey', '7470AD35-D51C-42AC-BC21-F45685805BBE');
    let MessageBody =
    {
      "ANImages": this.BroadCastImgList,
      "ANCmnts": this.AnnouncementMessage,
      // "ACAccntID" : this.globalService.getacAccntID(),
      // "ASAssnID"  : this.globalService.getCurrentAssociationId(),
      "ACAccntID": this.globalService.getacAccntID(), //2
      "ASAssnID": this.globalService.getCurrentAssociationId(),//2
      "ANVoice": '',//`${this.blobUrl}`,
      "ANRecipient": ''//this.Recipients
    }
    console.log(MessageBody);
    let ipAddress = this.UtilsService.getIPaddress();
    this.http.post(ipAddress + 'oyesafe/api/v1/Announcement/Announcementcreate', JSON.stringify(MessageBody), { headers: headers })
      .subscribe(data => {
        console.log(data);
        if(data['success']){
          Swal.fire({
            title: "Announcement sent successfully",
            text: "",
            type:"success",
            confirmButtonColor: "#f69321",
            confirmButtonText: "OK",
            allowOutsideClick:false
          }).then(
            (result) => {
              if (result.value) {
                this.router.navigate(['home']);
              }
            })
        }
      },
        err => {
          console.log(err);
        })
  }
  getRecipients(Recipients) {
    this.Recipients = Recipients;
    this.RecipientType = Recipients;
    if(this.toggleFaCircle1 && this.toggleFaCircle2){
      this.toggleSendAncmntBtn = false;
    }
  }
  onFileSelectForBroadcast(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.BroadCastImg='';
        console.log(event.target.files[i]);
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = () => {
          console.log(reader.result);
          this.BroadCastImg = reader.result;
          this.BroadCastImg = this.BroadCastImg.substring(this.BroadCastImg.indexOf('64') + 3);
          console.log(this.BroadCastImg);
          this.BroadCastImgList.push(this.BroadCastImg);
          console.log(this.BroadCastImgList);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      this.toggleFaCircle2=true;
      this.ifFileSelected = true;
      this.disabledIfAnnouncementEmpty = false;
    }
  }
  validateAnnouncementMessage(){
    if(this.AnnouncementMessage != ''){
      this.toggleFaCircle1 = true;
    }
    else{
      this.toggleFaCircle1 = false;
      this.toggleSendAncmntBtn = true;
    }
    if(this.toggleFaCircle1 && this.toggleFaCircle2){
      this.toggleSendAncmntBtn = false;
    }
  }

  resetAnnouncement(AnnouncementInput:HTMLInputElement){
    swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reset?",
      type: "warning",
      confirmButtonColor: "#f69321",
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "CANCEL"
    }).then(
      (result) => {
        console.log(result)
        if (result.value) {
          this.BroadCastImgList=[];
          this.AnnouncementMessage = '';
          this.disabledIfAnnouncementEmpty = true;
          this.toggleFaCircle1=false;
          this.toggleFaCircle2=false;
          this.ifFileSelected=false;
          this.toggleSendAncmntBtn=true;
          AnnouncementInput.value=null;
        }
      })
  }



}
