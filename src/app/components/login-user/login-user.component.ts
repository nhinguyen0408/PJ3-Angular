import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  constructor(private auth: AuthService , private router: Router) { }

  ngOnInit(): void {
    if(this.auth.isUserLogedin()){
      this.router.navigate(['user']);
    } else{
      this.router.navigate(['user/login']);
    }
  }
  phoneValidate = "^(84|0[3|5|7|8|9])+([0-9]{8})$"
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required,Validators.pattern(this.phoneValidate)]),
    password: new FormControl('',[Validators.required])
  })
  results: any;
  onSubmit(){
    if(this.loginForm.valid){
      if(this.auth.getToken != null){
        localStorage.removeItem('token')
      }
      this.auth.login(this.loginForm.value).subscribe(
        (result) => {
          if(result.responseMessage ==="SUCCESS" && result.responseData.role == "USER"){
            localStorage.setItem('user-role',result.responseData.role);
            localStorage.setItem('user-token',result.responseData.token);
            localStorage.setItem("username", result.responseData.profile.fistName + result.responseData.profile.lastName );
            localStorage.setItem('user-avatar', result.responseData.profile.imageUrl)
            localStorage.setItem("userId", result.responseData.profile.id)
            this.router.navigate(['user']);
          }
          else{
            alert(`Message : Sai tên đăng nhập hoặc mật khẩu`);           }
        },
        (err:ErrorEvent) => {
          console.log(err)
          let errorMessage = "";
          if(err.error instanceof ErrorEvent){
            errorMessage = err.error.error.message;
          }
          else {
            errorMessage = `Message : Sai tên đăng nhập hoặc mật khẩu`
          }
          alert(errorMessage)
        }
      )
    }
  }
}
