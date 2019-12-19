import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
profile:boolean;
editprofile:boolean;


  constructor() { }

  ngOnInit() {
      this.profile=true;
      this.editprofile=false;
  }
editProfile(){
  this.profile=false;
      this.editprofile=true;
}
resetProfile(){
  this.profile=true;
  this.editprofile=false;
}
ngAfterViewInit(){
  $(document).ready(function() {

    
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    

    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});
}
}
