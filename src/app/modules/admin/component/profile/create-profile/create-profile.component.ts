import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/Profile.model';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  constructor(
    private api: ApiProfileService,
    private route: Router,
    private toastsService: ToastService
  ) { }

  ngOnInit(): void {
  }
  isLoading: boolean = false;

  newProfile = new Profile();
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  emailValidate: string = `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`
  onCreate(){
    if(this.newProfile.fistName != "" && this.newProfile.lastName != "" && this.newProfile.phone != ""
        && this.newProfile.email != "" && this.newProfile.dateBirth != null && this.newProfile.gender != ""
        && this.newProfile.address != "" && this.newProfile.role != ""){
          this.isLoading = true;
          this.newProfile.passWord = '123123';
          console.log("Obj create::::::: ", this.newProfile)
          this.api.createProfile(this.newProfile).subscribe(data => {
            if(data.responseCode == '002'){
              this.toastsService.alert('Thông báo !!!', 'Số điện thoại đã được sử dụng !!!','bg-danger');
            } else if(data.responseCode == '001'){
              this.toastsService.alert('Thông báo !!!', 'Email đã được sử dụng !!!','bg-danger');
            } else if(data.responseCode == '200'){
              this.isLoading = false;
              this.toastsService.alert('Thông báo !!!', 'Thêm nhân viên thành công !!! Mật khẩu mặc định là 123123 !!!','bg-success');
              this.route.navigate(['admin/employee-manager'])
            }

            // console.log("data====", data)
          })
    } else {
      // alert("Vui lòng điền đầy đủ các trường thông tin !!!")
      this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đầy đủ các trường thông tin !!!','bg-warning');
    }
  }

}
