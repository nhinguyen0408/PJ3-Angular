import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/admin/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService , private router: Router) { }

  ngOnInit(): void {
    if(this.auth.isLogedin() && this.auth.getRole() === "SUPERADMIN"){
      this.router.navigate(['admin/home']);
    } else{
      this.router.navigate(['employee']);
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
          if(result.responseMessage ==="SUCCESS"){
            this.auth.setRole(result.responseData.role);
            this.auth.setToken(result.responseData.token);
            localStorage.setItem("name", result.responseData.profile.fistName + result.responseData.profile.lastName );
            localStorage.setItem('avatar', result.responseData.profile.imageUrl)
            if(result.responseData.role == "EMPLOYEE"){
              localStorage.setItem("employeeId", result.responseData.profile.id)
              this.router.navigate(['employee/product']);
              console.log("employee", result)
            } else if (result.responseData.role == "SUPERADMIN"){
              localStorage.setItem("adminId", result.responseData.profile.id)
              console.log("super admin", result)
              console.log("adminId",localStorage.getItem("adminId"))
              this.router.navigate(['admin/home']);
            } else if (result.responseData.role == "ADMIN"){
              this.router.navigate(['employee']);
              localStorage.setItem("employeeId", result.responseData.profile.id)
              console.log("admin", result)
            }
          }
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
