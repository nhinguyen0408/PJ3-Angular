import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/Profile.model';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { ProfileService } from 'src/app/services/user/profile/profile.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(
    private api: ProfileService,
    private route: Router,
    private toastsService: ToastService
  ) { }

  ngOnInit(): void {
  }

  newProfile = new Profile();
  phoneValidate: string = '^(84|0[3|5|7|8|9])+([0-9]{8})$'
  emailValidate: string = `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`
  confirmPassWord: string = ''
  onCreate(){
    if(this.newProfile.fistName != "" && this.newProfile.lastName != "" && this.newProfile.phone != ""
        && this.newProfile.email != "" && this.newProfile.dateBirth != null && this.newProfile.gender != ""
        && this.newProfile.address != "" &&  this.newProfile.passWord != '' &&  this.confirmPassWord){
          if(this.newProfile.passWord === this.confirmPassWord){
            this.api.registerUser(this.newProfile).subscribe((data: any) => {
              if(data.responseCode == '002'){
                this.toastsService.alert('Thông báo !!!', 'Số điện thoại đã được sử dụng !!!','bg-danger');
              } else if(data.responseCode == '001'){
                this.toastsService.alert('Thông báo !!!', 'Email đã được sử dụng !!!','bg-danger');
              } else if(data.responseCode == '200'){
                this.toastsService.alert('Thông báo !!!', 'Đăng ký tài khoản thành công <br> Vui lòng đăng nhập để tiếp tục !!!','bg-success');
                this.route.navigate(['user/login'])
              }
            })
          } else {
            this.toastsService.alert('Thông báo !!!', 'Mật khẩu nhập lại không trùng khớp !!!','bg-danger');
          }

    } else {
      // alert("Vui lòng điền đầy đủ các trường thông tin !!!")
      this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đầy đủ các trường thông tin !!!','bg-warning');
    }
  }
}
