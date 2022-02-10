import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/Profile.model';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  constructor(
    private api: ApiProfileService,
    private route: Router,
  ) { }

  ngOnInit(): void {
  }

  newProfile = new Profile();
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  emailValidate: string = `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`
  onCreate(){
    if(this.newProfile.fistName != "" && this.newProfile.lastName != "" && this.newProfile.phone != ""
        && this.newProfile.email != "" && this.newProfile.dateBirth != null && this.newProfile.gender != ""
        && this.newProfile.address != "" && this.newProfile.role != ""){
          this.newProfile.passWord = '123123';
          console.log("Obj create::::::: ", this.newProfile)
          this.api.createProfile(this.newProfile).subscribe(data => {
            this.route.navigate(['admin/employee-manager'])
          })
    } else {
      alert("Vui lòng điền đầy đủ các trường thông tin !!!")
    }
  }

}
