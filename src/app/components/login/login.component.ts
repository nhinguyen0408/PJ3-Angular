import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  loginForm = new FormGroup({
    phone: new FormControl(''),
    password: new FormControl('')
  })
  results: any;
  onSubmit(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value).subscribe(
        (result) => {
          this.results = result;
          console.log(result);
          console.log(this.loginForm.value);
          if(result.role == "ADMIN"){
            this.router.navigate(['employee']);
          } else if (result.role == "SUPERADMIN"){
            this.router.navigate(['admin/home']);
          }

        },
        (err:Error) => {
          alert(err.message)
        }
      )
    }
  }

}
